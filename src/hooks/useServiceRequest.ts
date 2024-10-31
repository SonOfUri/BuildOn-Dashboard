"use client";

import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getERC20Contract, getLendbitContract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import useCheckAllowance from "./useCheckAllowance";
import { LINK_ADDRESS, ADDRESS_1 } from "@/constants/utils/addresses";
import { ethers, MaxUint256 } from "ethers";
import { envVars } from "@/constants/envVars";

const useServiceRequest = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const val = useCheckAllowance();

  return useCallback(
    async (_requestId: number, _tokenAddress: string, _amount: string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE");
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getLendbitContract(signer);

      let loadingToastId: string | number | undefined;

      try {
        console.log("AMOUNT", ethers.parseEther(_amount));
        
        loadingToastId = toast.loading("Processing service request...");
        // If the token address is ADDRESS_1, directly call serviceRequest
        if (_tokenAddress === ADDRESS_1) {
          const transaction = await contract.serviceRequest(_requestId, _tokenAddress, {
            value: ethers.parseEther(_amount),
          });
          const receipt = await transaction.wait();

          if (receipt.status) {
            toast.success("Request serviced!",
            {
              id: loadingToastId,
              });
            return router.push('/order');
          
          }

          return toast.error("Request servicing failed!");
        }

        // If the token address is LINK_ADDRESS, check allowance
        if (_tokenAddress === LINK_ADDRESS) {
          const erc20contract = getERC20Contract(signer, LINK_ADDRESS);

          // Check if allowance is sufficient
          if (val === 0 || val < Number(_amount)) {
            const allowanceTx = await erc20contract.approve(envVars.lendbitDiamondAddress, MaxUint256);
            const allowanceReceipt = await allowanceTx.wait();

            if (!allowanceReceipt.status) {
              return toast.error("Approval failed!",
                {
                id: loadingToastId,
              });
            }
          }

          // Proceed with servicing the request after approval check
          const transaction = await contract.serviceRequest(_requestId, _tokenAddress);
          const receipt = await transaction.wait();

          if (receipt.status) {
            return toast.success("Request serviced!",
              {
                id: loadingToastId,
              });
          }

          return toast.error("request servicing failed!",
            {
              id: loadingToastId,
            }
          );
        }
      } catch (error: unknown) {
        const err = error as ErrorWithReason;
        let errorText: string;

        // Handle protocol-specific error reasons
        switch (err?.reason) {
          case "Protocol__RequestNotOpen()":
            errorText = "Deposit action failed!";
            break;
          case "Protocol__InvalidToken()":
          case "Protocol__InsufficientBalance()":
            errorText = "Insufficient balance!";
            break;
          case "Protocol__InsufficientCollateral()":
            errorText = "Insufficient collateral!";
            break;
          case "Protocol__InsufficientAllowance()":
            errorText = "Insufficient allowance!";
            break;
          default:
            errorText = "Trying to resolve error!";
        }

        toast.warning(`Error: ${errorText}`, {
              id: loadingToastId,
            });
      }
    },
    [chainId, walletProvider, val]
  );
};

export default useServiceRequest;
