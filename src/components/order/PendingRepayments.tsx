import { useState, useEffect } from "react";
import Image from "next/image";
import { Btn } from "../shared/Btn";
import useGetActiveRequest from "@/hooks/useGetActiveRequest";
import { tokenImageMap } from "@/constants/utils/tokenImageMap";
import { ethers } from "ethers";
import useRepayLoan from "@/hooks/useRepayLoan";

const PendingRepayments = () => {
  const activeReq = useGetActiveRequest();
  const repay = useRepayLoan();
  const [countdowns, setCountdowns] = useState<string[]>([]);
  const [totalPending, setTotalPending] = useState<number>(0); // State to track total pending payments

  const calculateCountdown = (timestamp: number) => {
    const now = new Date().getTime(); // Current time in milliseconds
    const returnDate = new Date(timestamp).getTime(); // Convert return date to milliseconds
    const timeLeft = returnDate - now; // Difference in milliseconds

    // If the time has already passed
    if (timeLeft <= 0) return "Expired";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    if (!activeReq) return;

    // Update countdowns for all active requests
    const updateCountdowns = () => {
      const updatedCountdowns = activeReq.map((item) => calculateCountdown(item.returnDate));
      setCountdowns(updatedCountdowns);
    };

    updateCountdowns();

    const interval = setInterval(() => {
      updateCountdowns();
    }, 60000); // Update every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [activeReq]);

  useEffect(() => {
    // Calculate the total pending repayments
    if (activeReq) {
      const total = activeReq.reduce((acc, item) => acc + Number(ethers.formatEther(item.totalRepayment)), 0);
      setTotalPending(total); // Update the total pending state
    }
  }, [activeReq]);

  if (!activeReq?.length || totalPending === 0) {
    return (
      <div className="bg-black py-6 w-full px-4 sm:px-6 font-[family-name:var(--font-outfit)] u-class-shadow">
        <h3 className="text-xl text-[#F6F6F6] font-medium">No Pending Repayments</h3>
      </div>
    );
  }

  return (
    <div className="bg-black py-6 w-full px-4 sm:px-6 font-[family-name:var(--font-outfit)] u-class-shadow">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-xl text-[#F6F6F6] font-medium">Pending Repayments</h3>
        <Image
          src={"/Hhourglass.svg"}
          alt="Hourglass"
          width={24}
          height={24}
          priority
          quality={100}
        />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {activeReq.map((item, index) => {
          const tokenData = tokenImageMap[item.tokenAddress] || { image: "/defaultToken.svg", label: "Unknown" };
          const countdown = countdowns[index] || "Calculating...";

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-[#1f1f1f] rounded-lg"
            >
              {/* Asset Name with Token Image */}
              <div className="flex items-center gap-2 text-[#C5C4C7] text-base font-normal w-full sm:w-2/5">
                <Image src={tokenData.image} alt={tokenData.label} width={24} height={24} />
                <span>{tokenData.label}</span>
              </div>

              {/* Repay Button */}
              <div
                onClick={() => repay(item.requestId, item.tokenAddress, item.totalRepayment)}
                className="w-full sm:w-1/5 font-normal">
                <Btn
                  text="Repay"
                  css="text-black bg-[#D8EE10] text-sm px-3 py-1"
                />
              </div>

              {/* Days Remaining */}
              <div className="text-sm font-medium text-[#F6F6F6] w-full sm:w-1/5 text-center">
                {countdown}
              </div>

              {/* Balance */}
              <div className="text-sm font-medium text-[#F6F6F6] w-full sm:w-1/5 text-right">
                {`${Number(ethers.formatEther(item.totalRepayment)).toLocaleString()} ${tokenData.label}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PendingRepayments;
