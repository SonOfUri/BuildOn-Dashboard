"use client";
import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getLendbitContract, getERC20Contract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import { ethers, MaxUint256 } from "ethers";
import { LINK_ADDRESS } from "@/constants/utils/addresses";
import useCheckAllowance from "./useCheckAllowance";
import { envVars } from "@/constants/envVars";

const useDepositCollateral = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const val = useCheckAllowance();

  return useCallback(
    async (_amountOfCollateral: string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE");

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const erc20contract = getERC20Contract(signer, LINK_ADDRESS);
      const contract = getLendbitContract(signer);
      const _weiAmount = ethers.parseUnits(_amountOfCollateral, 18);
      let toastId: string | number | undefined;

      try {
        toastId = toast.loading(`Processing deposit transaction...`);
        // Check allowance before proceeding
        if (val == 0 || val < Number(_amountOfCollateral)) {
          const allowance = await erc20contract.approve(envVars.lendbitDiamondAddress, MaxUint256);
          const allReceipt = await allowance.wait();

          if (!allReceipt.status) {
            return toast.error("Approval failed!", { id: toastId });
          }
        }



        const transaction = await contract.depositCollateral(LINK_ADDRESS, _weiAmount);
        const receipt = await transaction.wait();

        if (receipt.status) {
          toast.success(`${_amountOfCollateral} LINK successfully deposited as collateral!`, { id: toastId });
          return router.push('/');
        } else {
          toast.error(`Failed to deposit ${_amountOfCollateral} LINK as collateral.`, { id: toastId });
        }

      } catch (error: unknown) {
        console.error(error);

        const err = error as ErrorWithReason;
        let errorText: string = err?.reason === "Protocol__TransferFailed()"
          ? "Deposit action failed!"
          : "Action canceled or failed!";

        if (toastId) {
          toast.error(`Error: ${errorText}`, { id: toastId });
        } else {
          toast.warning(`Error: ${errorText}`);
        }
      }
    },
    [chainId, walletProvider, router, val]
  );
};

export default useDepositCollateral;
