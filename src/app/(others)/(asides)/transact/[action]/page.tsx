"use client";

import AssetSelector from "@/components/shared/AssetSelector";
import { Btn } from "@/components/shared/Btn";
import PleaseConnect from "@/components/shared/PleaseConnect";
import { ADDRESS_1, LINK_ADDRESS } from "@/constants/utils/addresses";
import useDepositCollateral from "@/hooks/useDepositCollateral";
import useDepositNativeColateral from "@/hooks/useDepositNativeColateral";
import useWithdrawCollateral from "@/hooks/useWithdrawCollateral";
import { Spinner } from "@radix-ui/themes";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TransactPage({ params }: { params: { action: string } }) {
  const actionText = params.action === "deposit" ? "Deposit" : "Withdraw";
  const [assetValue, setAssetValue] = useState("0.00");
  const [selectedToken, setSelectedToken] = useState<string | null>("ETH"); // To track selected token
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const { address, isConnected } = useWeb3ModalAccount();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const depositFx = useDepositCollateral(); // For LINK and other tokens
  const depositNative = useDepositNativeColateral(); // For ETH
  const withdrawTx = useWithdrawCollateral(); // Withdraw function

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    } else {
      setUserAddress(null);
    }
  }, [address, isConnected]);

  const handleTokenSelect = (token: string, price: number) => {
    setSelectedToken(token);
  };

  const handleAssetValueChange = (value: string) => {
    setAssetValue(value);
  };

  const handleAction = async () => {
    if (!selectedToken) {
      toast.error("Please select a token.");
      return;
    }

    if (parseFloat(assetValue) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      if (params.action === "deposit") {

        if (selectedToken === "ETH" && userAddress) {

          await depositNative(assetValue);

        } else if (selectedToken === "LINK" && userAddress) {
          await depositFx(assetValue);

        } else {
          toast.error("Token not supported for deposit.");
        }
      } else if (params.action === "withdraw") {
        if (selectedToken === "ETH" && userAddress) {

          await withdrawTx(ADDRESS_1,  assetValue);

        }
        if (selectedToken === "LINK" && userAddress) {
          await withdrawTx(LINK_ADDRESS,  assetValue);
        } else {
          // toast.error("Token not supported for withdrawal.");
        }
      }
    } catch (error) {
      console.error(`${actionText} error:`, error);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (!isClient) {
    return (
      <div className="text-[#FF4D00] flex justify-center my-64">
        <Spinner size={"3"} />
      </div>
    );
  }

  if (!isConnected || !address) {
    return <PleaseConnect text={"continue transaction"} />;
  }

  return (
    <div className="h-screen flex items-center">
      <div className="bg-black rounded-lg p-4 max-w-[427px] sm:min-w-[427px] u-class-shadow">
        <p className="text-base text-white pl-2 pb-2">{actionText}</p>

        <AssetSelector
          onTokenSelect={handleTokenSelect}
          onAssetValueChange={handleAssetValueChange}
          assetValue={assetValue}
          userAddress={userAddress}
          actionType={params.action}
        />

        <div>
          <div className="my-4 cursor-pointer" onClick={handleAction}>
            <Btn
              text={actionText}
              css="text-black bg-[#FF4D00CC]/80 text-base w-full py-2 rounded flex items-center justify-center"
            />
          </div>
          <div className="cursor-pointer mb-4" onClick={handleCancel}>
            <Btn
              text={"Cancel"}
              css="text-black bg-[#a2a8b4]/80 text-base w-full py-2 rounded flex items-center justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
