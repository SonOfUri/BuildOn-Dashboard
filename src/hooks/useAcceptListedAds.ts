"use client";
import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getLendbitContract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import { ethers } from "ethers";

const useAcceptListedAds = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  return useCallback(
    async (_orderId: number,_amount:string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE");
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getLendbitContract(signer);
      const _weiAmount = ethers.parseUnits(_amount, 18);

      // console.log((_weiAmount));
      

      let loadingToastId;
      try {
        loadingToastId = toast.loading("Processing loan request...");

        const transaction = await contract.requestLoanFromListing(_orderId,_weiAmount);
        const receipt = await transaction.wait();

        if (receipt.status) {
          toast.success("You accepted listed ads successfully!",{ id: loadingToastId });
          return router.push('/');
        }

        toast.error("failed!",{ id: loadingToastId });
      } catch (error: unknown) {
        const err = error as ErrorWithReason;
        let errorText: string;
        
        if (err?.reason === "Protocol__ListingNotOpen()") {
          errorText = "this order is not available!";
        }
        if (err?.reason === "Protocol__OwnerCreatedListing()") {
          errorText = "can't accept your ad!";
        }
        if (err?.reason === "Protocol__InsufficientCollateral()") {
          errorText = "insufficient collateral!";
        }
        if (err?.reason === "Protocol__InvalidAmount()") {
          errorText = "please enter a valid amount!";
        }
         if (err?.reason === "Protocol__TransferFailed") {
          errorText = "action failed!";
        }
        else {
          errorText = "Failed to accept bid!";
        }

        toast.warning(`Error: ${errorText}`,{ id: loadingToastId });;
      }
    },
    [chainId, walletProvider]
  );
};

export default useAcceptListedAds;
