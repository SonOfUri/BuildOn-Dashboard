"use client";
import { useCallback } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { toast } from "sonner";
import { isSupportedChain } from "@/config/chain";
import { getProvider } from "@/config/provider";
import { getERC20Contract, getLendbitContract } from "@/config/contracts";
import { useRouter } from "next/navigation";
import { ErrorWithReason } from "@/constants/types";
import { ethers } from "ethers";
import { ADDRESS_1, LINK_ADDRESS } from "@/constants/utils/addresses";
import useCheckAllowance from "./useCheckAllowance";
import { envVars } from "@/constants/envVars";
import { MaxUint256 } from "ethers";

const useCreateLoanListing = () => {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const router = useRouter();
  const val = useCheckAllowance();

  const handleTransactionResult = async (
    transaction: ethers.Contract,
    loadingToastId: string | number | undefined
  ) => {
    const receipt = await transaction.wait();
    if (receipt.status) {
      toast.success("Loan order created!", { id: loadingToastId });
      router.push('/successful');
    } else {
      toast.error("Transaction failed!", { id: loadingToastId });
    }
  };


  return useCallback(
    async (
      _amount: string,
      _min_amount: number,
      _max_amount: number,
      _returnDate: number,
      _interest: number,
      _loanCurrency: string
    ) => {
      if (!isSupportedChain(chainId)) {
        toast.warning("SWITCH TO BASE");
        return; // Early return if chain is not supported
      }

      const currency = _loanCurrency === "ETH" ? ADDRESS_1 : LINK_ADDRESS;

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getLendbitContract(signer);

      const _weiAmount = ethers.parseUnits(_amount, 18);
      const _min_amount_wei = ethers.parseUnits(_min_amount.toString(), 18);
      const _max_amount_wei = ethers.parseUnits(_max_amount.toString(), 18);

      let loadingToastId: string | number | undefined;

      try {
        loadingToastId = toast.loading("Processing order...");

        if (_loanCurrency === "ETH") {
          const transaction = await contract.createLoanListing(
            _weiAmount,
            _min_amount_wei,
            _max_amount_wei,
            _returnDate,
            _interest,
            currency,
            { value: _weiAmount }
          );
          await handleTransactionResult(transaction, loadingToastId);
        } else {

          if (val === 0 || val < Number(_amount)) {
            const erc20contract = getERC20Contract(signer, LINK_ADDRESS);
            const allowance = await erc20contract.approve(envVars.lendbitDiamondAddress, MaxUint256);
            await allowance.wait();
            toast.success("Approval granted!");
          }

          const transaction = await contract.createLoanListing(
            _weiAmount,
            _min_amount_wei,
            _max_amount_wei,
            _returnDate,
            _interest,
            currency
          );
          await handleTransactionResult(transaction, loadingToastId);
        }
      } catch (error: unknown) {
        handleError(error, loadingToastId);
      }
    },
    [chainId, walletProvider, val, router]
  );
};

  
  const handleError = (error: unknown, loadingToastId: string | number | undefined) => {
    const err = error as ErrorWithReason;
    let errorText: string;

    switch (err?.reason) {
      case "Protocol__TokenNotLoanable()":
        errorText = "Token not loanable!";
        break;
      case "Protocol__InsufficientBalance()":
        errorText = "Insufficient balance!";
        break;
      case "Protocol__InsufficientAllowance()":
        errorText = "Insufficient allowance!";
        break;
      case "Protocol__TransferFailed":
        errorText = "Listing action failed!";
        break;
      default:
        errorText = "Trying to resolve error!";
    }

    toast.warning(`Error: ${errorText}`, { id: loadingToastId });
    console.error("ERROR", error);
  };

export default useCreateLoanListing;
