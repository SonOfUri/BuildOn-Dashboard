"use client";

import Image from "next/image";
import { Btn } from "../shared/Btn";
import Link from "next/link";
import useGetValueAndHealth from "@/hooks/useGetValueAndHealth";
import NoAssets from "./NoAssets";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";

const Balance = () => {

  const { address, isConnected} = useWeb3ModalAccount();
  const {etherPrice, linkPrice, data3, data4, collateralVal,availBal} = useGetValueAndHealth();
  // console.log("dt", data3, data4,collateralVal);

  // Initialize the array with dynamic balance and market value calculation
  const balanceData = [
    {
      assetName: "ETH",
      assetImg: "/eth.svg",
      balance: data3 ?? 0,
      marketValue: `$${((data3 ?? 0) * Number(etherPrice))}`, 
      netProfit: "12.30%",
      netProfitColor: "text-green-500",
      collateralImg: "/toggleOff.svg",
      collateralStatus: "Off",
      tokenPrice: 11, 
    },
    {
      assetName: "LINK",
      assetImg: "/link.svg",
      balance: data4 ?? 0, 
      marketValue: `$${((data4 ?? 0) * Number(linkPrice))}`, 
      netProfit: "2.53%",
      netProfitColor: "text-green-500",
      collateralImg: "/toggleOn.svg",
      collateralStatus: "On",
      tokenPrice: 2500, 
    },
  ];

  // Filter out tokens with 0 balance
  const filteredBalanceData = balanceData.filter(item => item.balance > 0);

  // If no tokens have a non-zero balance, return null or an alternative message
  if (filteredBalanceData.length === 0) {
    return (
      <div>
        <NoAssets />
      </div>
     );
  }

  if (!isConnected || !address) {
    return (
      <div>
        <NoAssets />
      </div>
     );
  }

  return (
    <div className="bg-black py-6 w-full custom-corner-header">
      <div className="text-xl px-6 mb-1">
        <h3>Your Balances</h3>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between border-y text-white/50 text-xs p-1 mb-2">
        <h4 className="p-1 sm:p-0">
          Total Bal: <span className="pl-1">{`$${collateralVal? collateralVal: 0}`}</span>
        </h4>
        <h4 className="p-1 sm:p-0 text-right sm:text-left">
          Max Withdrawal: <span className="pl-1">{`$${availBal? Number(ethers.formatEther(String(availBal))) : 0}`}</span>
        </h4>
      </div>

      {/* Scrollable Table for mobile */}
      <div className="px-4 overflow-x-auto">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="text-center">
              <th className="py-2">Asset</th>
              <th className="py-2">Balance</th>
              <th className="py-2">Value</th>
              <th className="py-2">Interest</th>
              {/* <th className="py-2 hidden sm:table-cell">Collateral</th> */}
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBalanceData.map((item, index) => (
              <tr key={index} className="text-center text-[10px] sm:text-[12px]">
                {/* Asset */}
                <td className="flex flex-wrap items-center gap-2 justify-center pt-[13px]">
                  <img src={item.assetImg} alt={item.assetName} className="w-6 h-6" />
                  <span>{item.assetName}</span>
                </td>
                {/* Balance */}
                <td className="pt-2">{item.balance}</td>
                {/* Market Value */}
                <td className="pt-2">{item.marketValue}</td>
                {/* Net Profit */}
                <td className={`pt-2 ${item.netProfitColor}`}>
                  {item.netProfit}
                </td>
                {/* Collateral Toggle (Hidden on mobile) */}
                {/* <td className="pt-2 hidden sm:table-cell">
                  <div className="flex justify-center">
                    <Image
                      src={item.collateralImg}
                      alt={`Collateral ${item.collateralStatus}`}
                      width={20}
                      height={8.5}
                      priority
                      quality={100}
                    />
                  </div>
                </td> */}
                {/* Deposit and Withdraw */}
                <td className="pt-2">
                  <div className="flex justify-center gap-2">
                    <Link href={`/transact/deposit`}>
                      <Btn text="Deposit" />
                    </Link>
                    <Link href="/transact/withdraw">
                      <Btn text="Withdraw" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Balance;
