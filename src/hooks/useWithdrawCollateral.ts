"use client";
import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getLendbitContract, getERC20Contract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import { ethers } from "ethers";

const useWithdrawCollateral = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  return useCallback(
    async (_tokenCollateralAddress: string, _amountOfCollateral: string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE");

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const erc20contract = getERC20Contract(signer, _tokenCollateralAddress);
      const contract = getLendbitContract(signer);

      let toastId: string |number | undefined;

      try {
        const _weiAmount = ethers.parseUnits(_amountOfCollateral, 18);
        
        // Show loading toast when the withdraw transaction is initiated
        toastId = toast.loading(`Signing tx... Withdrawing collateral...`);
        
        const transaction = await contract.withdrawCollateral(_tokenCollateralAddress, _weiAmount);
        const receipt = await transaction.wait();

        if (receipt.status) {
          toast.success(`${_amountOfCollateral} successfully withdrawn!`, {
            id: toastId,
          });
          return router.push('/');
        } else {
          toast.error("Failed to withdraw collateral.", {
            id: toastId,
          });
        }
      } catch (error: unknown) {
        console.error(error);
        const err = error as ErrorWithReason;
        let errorText: string;

        if (err?.reason === "Protocol__InsufficientCollateralDeposited()") {
          errorText = "Insufficient collateral!";
        } else if (err?.reason === "Protocol__TransferFailed") {
          errorText = "Transaction failed!";
        } else {
          errorText = "Action canceled or failed!";
        }

        if (toastId) {
          toast.error(`Error: ${errorText}`, { id: toastId });
        } else {
          // Fallback toast if no loading toast was created
          toast.warning(`Error: ${errorText}`);
        }
      }
    },
    [chainId, walletProvider, router]
  );
};

export default useWithdrawCollateral;
