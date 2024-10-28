"use client";
import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getLendbitContract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import { ADDRESS_1 } from "@/constants/utils/addresses";
import { ethers } from "ethers";

const useDepositNativeCollateral = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  return useCallback(
    async (_amountOfCollateral: string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE");
      
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const amount = ethers.parseEther(_amountOfCollateral);
      const contract = getLendbitContract(signer);

      let toastId: string | number | undefined;

      try {
        // Show loading toast when starting the transaction
        toastId = toast.loading(`Signing deposit transaction...`);

        // Start the transaction
        const transaction = await contract.depositCollateral(ADDRESS_1, amount, {
          value: amount,
        });

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();

        // Update the loading toast based on the transaction receipt
        if (receipt.status) {
          toast.success(`${_amountOfCollateral} ETH successfully deposited as collateral!`, {
            id: toastId,
          });
          router.push('/');
        } else {
          toast.error("Transaction failed!", {
            id: toastId,
          });
        }
      } catch (error: unknown) {
        // Handle error, update the loading toast to show an error message
        const err = error as ErrorWithReason;
        let errorText: string;

        if (err?.reason === "Protocol__TransferFailed()") {
          errorText = "Deposit action failed!";
        } else {
          errorText = "Transaction canceled or failed!";
        }

        console.error(error);

        // If a toast was shown, update it with the error message
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

export default useDepositNativeCollateral;
