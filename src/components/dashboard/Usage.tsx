"use client";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useRouter } from "next/navigation";
import { Request } from '@/constants/types';
import { tokenImageMap } from '@/constants/utils/tokenImageMap';
import { ethers } from 'ethers';
import useRepayLoan from '@/hooks/useRepayLoan';
import { Btn2 } from '../shared/Btn2';
import { getLendbitContract } from '@/config/contracts';
import { readOnlyProvider } from '@/config/provider';
import { useState, useEffect } from 'react';

interface UsageProps {
  activeReq: Request[] | null;
  collateralVal: any;
}

const Usage = ({ activeReq, collateralVal }: UsageProps) => {
  const router = useRouter();
  const repay = useRepayLoan();
  const contract = getLendbitContract(readOnlyProvider);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  console.log("ACTIVE",activeReq);
  
  // Asynchronous function to calculate total borrowed
  const calculateTotalBorrowed = async () => {
    if (activeReq) {
      const values = await Promise.all(
         activeReq.map(async (req) => {
          // Fetch the value in USD using contract.getUsdValue
          const usdValue = await contract.getUsdValue(req.tokenAddress, 1, 0);
          
          // Convert the repayment amount from wei to ether and back to number for summing
          const formattedRepayment = parseFloat(ethers.formatEther(req.totalRepayment));

          // Return the calculated value (formatted repayment amount here)
          return (Number(usdValue)) * formattedRepayment;
        })
      );
      const total = values.reduce((acc, value) => Number(acc) + Number(value), 0);
      setTotalBorrowed(total/ 1e18);
    }
  };

  // useEffect to trigger the calculation when activeReq changes
  useEffect(() => {
    calculateTotalBorrowed();
  }, [activeReq]);

   useEffect(() => {
    console.log(totalBorrowed, "Total Borrowed Value");
  }, [totalBorrowed]);


  // Calculate power left based on total borrowed and collateral value
  const powerLeft = collateralVal ? (100 - ((totalBorrowed * 100)) / (collateralVal * 0.8)) : 0;
  const actualPower = isNaN(powerLeft) ? 0 : powerLeft;

  return (
    <div className="bg-black py-6 w-full border border-[#ff4d00] rounded-lg">
      <div className="text-xl px-6 mb-1">
        <h3>Your Usage</h3>
      </div>
      <div className="flex justify-between items-center border-y text-white/50 text-xs p-1 mb-6">
        <h4 className="p-1">
          Total Collateral: <span className="pl-1">{`$${collateralVal ? (collateralVal * 0.8) : 0}`}</span>
        </h4>
        <h4 className="p-1">
          Total Borrowed: <span className="pl-1">{`$${(totalBorrowed)}`}</span>
        </h4>
      </div>

      <div className="flex flex-col items-center mb-4 relative">
        <div style={{ width: 250, height: 250 }}>
          <CircularProgressbar
            value={actualPower}
            circleRatio={4.7 / 5}
            counterClockwise
            styles={buildStyles({
              pathColor: `rgba(255, 0, 0,1)`,
              trailColor: "#EFEFEF",
            })}
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center gap-3">
          <div className="text-[#FB3B52] text-lg border border-[#FB3B52] bg-[#efefef] py-2 px-2 rounded-xl flex items-center">
            <span className="font-extrabold pr-[2px] m-auto"></span>
            {actualPower.toFixed(2)}%
          </div>
          <p className="text-[10.5px]">Borrow Power Left</p>
        </div>
      </div>

      {totalBorrowed > 0 && (
        <div className="px-4 mb-2">
          <table className="min-w-full text-[10px] text-center">
            <thead></thead>
            <tbody>
              {activeReq?.map((item, index) => {
                const tokenData = tokenImageMap[item.tokenAddress] || { image: "/Eye.svg", label: "None" };

                return (
                  <tr key={index} className="text-white/50">
                    <td className="pt-3 flex gap-1 items-center text-start text-white">
                      <img src={tokenData.image} alt={tokenData.label} className="w-4" />
                      <span>{tokenData.label}</span>
                    </td>
                    <td className="pt-2">{ethers.formatEther(item.amount)}</td>
                    <td className="pt-2">{ethers.formatEther(item.totalRepayment)}</td>
                    <td className="pt-2">{item.interest}%</td>
                    <td className="pt-2 flex justify-center">
                      <Btn2 text="Repay" css="text-white/90 text-center"
                        onClick={() => repay(item.requestId, item.tokenAddress, item.totalRepayment)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div onClick={() => router.push("/create-order")} className="px-6 w-4/6 m-auto mt-5">
        <button className="bg-[#FF4D00] text-xs rounded-xl font-normal w-full py-3 hover:scale-105">
          Create Order
        </button>
      </div>
    </div>
  );
};

export default Usage;
