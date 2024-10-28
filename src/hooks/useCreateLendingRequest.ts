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
import { ADDRESS_1, LINK_ADDRESS } from "@/constants/utils/addresses";

const useCreateLendingRequest = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();

  return useCallback(
    async (_amount: string, _interest: number, _returnDate: number, _loanCurrency: string) => {
      if (!isSupportedChain(chainId)) return toast.warning("SWITCH TO BASE", { duration: 1000 });
     

      let currency;
      if (_loanCurrency === "ETH") {
        currency = ADDRESS_1;
        // return toast.warning("PLEASE USE LINK, ETH NOT AVAILABLE AT THE MOMENT")
      } else {
        currency = LINK_ADDRESS;
      }

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getLendbitContract(signer);

      let loadingToastId;
      
      try {
        loadingToastId = toast.loading("Processing borrowing request...");

        const _weiAmount = ethers.parseEther(_amount);
        const _basisPointInterest = _interest;

        //  console.log("_loanCurrency", currency, _returnDate, _weiAmount, _basisPointInterest);

        const transaction = await contract.createLendingRequest(_weiAmount, _basisPointInterest, _returnDate, currency);
        const receipt = await transaction.wait();

        if (receipt.status) {
          toast.success("Loan Pool created!", {
            id: loadingToastId,
          });
          return router.push('/successful');
        } else {
          toast.error("Pool creation failed!", {
            id: loadingToastId,
          });
        }

      } catch (error: unknown) {
        const err = error as ErrorWithReason;
        let errorText: string;

        switch (err?.reason) {
          case "Protocol__TokenNotLoanable()":
            errorText = "Token not loanable!";
            break;
          case "Protocol__InvalidAmount()":
            errorText = "Please input a valid amount!";
            break;
          case "Protocol__InsufficientCollateral()":
            errorText = "Insufficient collateral!";
            break;
          default:
            errorText = "Canceled | Can't borrow more than your available balance!";
        }

        toast.warning(`Error: ${errorText}`, {
          id: loadingToastId,
        });
        console.log("error", error);
      }
    },
    [chainId, walletProvider]
  );
};

export default useCreateLendingRequest;
