"use client";

import Image from "next/image";
import Balance from "@/components/dashboard/Balance";
import Collateral from "@/components/dashboard/Collateral";
import DashboardCard from "@/components/dashboard/DashboardCard";
import Usage from "@/components/dashboard/Usage";
import useGetValueAndHealth from "@/hooks/useGetValueAndHealth";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { formatAddress } from "@/constants/utils/formatAddress";
import { useEffect, useState } from "react";
import { getBasename } from '@superdevfavour/basename';
import useGetActiveRequest from "@/hooks/useGetActiveRequest";
import { ethers } from "ethers";
import { capitalizeFirstLetter } from "@/constants/utils/capitaliseFirstUser";
import { Request } from "@/constants/types";



export default function DashboardPage() {
  const [user, setUser] = useState("User");
  const [health, setHealth] = useState<number | string>("0");
  const [fig, setFig] = useState<number | string>(0);
  const { address, isConnected } = useWeb3ModalAccount();
  const { data, data2, collateralVal, } = useGetValueAndHealth();
  const activeReq = useGetActiveRequest();

  // console.log("DATAAAAA", data2, activeReq);

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && address) {
        try {
          // Check if all totalRepayments are 0
          const allRepaymentsZero = activeReq?.every((request: Request) => Number(request.totalRepayment) == 0);

          if (allRepaymentsZero && Number(data) > 0) {
            setHealth("∞");
          } else {
            const healthFactor = parseFloat(String(Number(data2) * 1e-18)).toFixed(2);
            setHealth(healthFactor);
          }

          const portFig = data ? Number(ethers.formatEther(String(data))) : 0;
          setFig(portFig);

          // Fetch basename
          const basename = await getBasename(address);
          if (basename) {
            setUser(basename);
          } else {
            setUser(formatAddress(address));
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setUser(formatAddress(address));
          setHealth("N/A");
          setFig(0);
        }
      } else {
        setUser("User");
        setHealth("0");
        setFig(0);
      }
    };

    fetchData();
  }, [isConnected, address, collateralVal, data2, data, activeReq]);

  return (
    <main className="max-w-[1190px] mx-auto p-4">
      <div className="w-full">
        <h3 className="mb-4 text-xl">
          {"Welcome, "}
          <span className="text-[#DD4F00]">{capitalizeFirstLetter(user)}</span>
        </h3>

        {/* Top section: Dashboard Cards */}
        <div className="flex flex-wrap gap-4 mb-14">
          <DashboardCard
            text={"Your Portfolio"}
            figure={`$${fig}`}
            extraCSS="portfolio-card"
            icon={
              <Image
                src="/dollar.png"
                alt="logo"
                width={42}
                height={42}
                priority
                quality={100}
              />
            }
          />

          <DashboardCard
            text={"Net Profit"}
            figure={"0.00%"}
            extraCSS="profit-card"
            icon={
              <Image
                src="/percentage.png"
                alt="logo"
                width={42}
                height={42}
                priority
                quality={100}
              />
            }
          />

          <DashboardCard
            text={"Health Factor"}
            figure={health}
            extraCSS="health-card"
            icon={
              <div className="bg-white/80 shadow shadow-[#C2C2C21A] w-[24.6px] h-11 pt-1 px-[0.6px] flex place-items-end">
                <div className={`${battryCSS(health)} w-full`}></div>
              </div>
            }
          />
        </div>

        {/* Bottom section: Two halves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left half: Balance and Collateral stacked */}
          <div className="flex flex-col gap-5">
            <Balance />
            <Collateral />
          </div>

          {/* Right half: Usage alone */}
          <div className="w-full">
            <Usage activeReq={activeReq}
              collateralVal={collateralVal}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

const battryCSS = (figure: number | string) => {
  const value = typeof figure === "string" ? parseFloat(figure) : figure;

  if (value > 1 || figure === "∞") {
    return "above1 h-full";
  } else if (value === 1) {
    return "btw051_099 h-6";
  } else if (value >= 0.51) {
    return "below03 h-3";
  } else if (value > 0.29) {
    return "below03 h-2";
  } else {
    return "below03 h-1";
  }
};
