"use client";

import Image from "next/image";
import { Btn } from "../shared/Btn";
import Link from "next/link";

const NoAssets = () => {
  return (
    <div className="bg-black py-6 w-full custom-corner-header">
      <div className="text-xl px-6 mb-1">
        <h3>Your Balances</h3>
      </div>

      {/* Summary Section */}
      <div className="flex justify-between border-y text-white/50 text-xs p-1 mb-2">
        <h4 className="p-1 sm:p-0">
          Total Bal: <span className="pl-1">{`N/A`}</span>
        </h4>
        <h4 className="p-1 sm:p-0 text-right sm:text-left">
          {"Please Connect Wallet"}
        </h4>
      </div>

      {/* Scrollable Table for mobile */}
      <div className="px-4 overflow-x-auto text-white">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="text-center">
              <th className="py-2">Asset</th>
              <th className="py-2">Balance</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-[10px] sm:text-[12px]">
                
                <td className="pt-2">No assets available</td>
                <td className="pt-2 table-cell">
                  <div className="flex justify-center">
                    <Image
                      src={'/toggleOff.svg'}
                      alt={`Collateral`}
                      width={20}
                      height={8.5}
                      priority
                      quality={100}
                    />
                  </div>
                </td>
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
      
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoAssets;
