import { useMemo } from "react";
import { ethers } from "ethers";

import Image from "next/image";
import { History } from "./History";
import { envVars } from "@/constants/envVars";
import useGetTransactionHistory from "@/hooks/useGetTransactionHistory";
import { getLendbitContract } from "@/config/contracts";
import { readOnlyProvider } from "@/config/provider";
import { TransactionDescription } from "ethers";

type historyDataType = {
  src: string;
  txName: string;
  id: string;
  date: string;
  tokenIcon: string;
  balance: string;
};

let historyData = [
  {
    src: "/arrowD.svg",
    txName: "Collateral Deposit",
    id: "12453",
    date: "3 Jan 2024",
    tokenIcon: "/eth.svg",
    balance: "199,999",
  },
  {
    src: "/arrowUp.svg",
    txName: "Loan Repayment",
    id: "17856",
    date: "15 Jan 2024",
    tokenIcon: "/dai.svg",
    balance: "1,000.15",
  },
];

function CreateHistoryData(tx: TransactionDescription, index: number) {
  const data: historyDataType = {
    src: "",
    txName: "",
    id: "",
    date: "",
    tokenIcon: "",
    balance: "",
  };
  if (tx.name === "depositCollateral") {
    data.src = "/arrowD.svg";
    data.txName = "Collateral Deposit";
    data.id = tx.selector.substring(2, 7) + String(index);
    data.date = "30 Oct 2024";
    data.balance = ethers.formatUnits(tx.args[1].toString(), 18).toString();
  } else if (tx.name === "withdrawCollateral") {
    data.src = "/arrowUp.svg";
    data.txName = "Collateral Withdrawal";
    data.id = tx.selector.substring(2, 7) + String(index);
    data.date = "31 Oct 2024";
    data.balance = ethers.formatUnits(tx.args[1].toString(), 18).toString();
  } else if (tx.name === "createLendingRequest") {
    data.src = "/arrowUp.svg";
    data.txName = "Create Lending Request";
    data.id = tx.selector.substring(2, 7) + String(index);
    data.date = "01 Nov 2024";
    data.balance = ethers.formatUnits(tx.args[0].toString(), 18).toString();
  } else if (tx.name === "serviceRequest") {
    data.src = "/arrowUp.svg";
    data.txName = "Request Serviced";
    data.id = tx.selector.substring(2, 7) + String(index);
    data.date = "02 Nov 2024";
    data.balance = ethers.formatUnits(tx.value.toString(), 18).toString();
  }
  data.tokenIcon = "/eth.svg";

  return data;
}


const TransactionHistory = () => {
  const { isLoading, result } = useGetTransactionHistory();

  const transactions = useMemo(() => {
    const contract_address = envVars.lendbitDiamondAddress;

    if (isLoading || !result) return [];

    const txs = result?.transactions?.filter((tx) => {
      const isVinOwn = tx?.vin?.at(0)?.isOwn ?? false;
      const isVoutOwn = tx?.vout?.at(0)?.isOwn ?? false;
      const vinAddress = tx?.vin?.at(0)?.addresses?.at(0);
      const voutAddress = tx?.vout?.at(0)?.addresses?.at(0);

      if (vinAddress === undefined || voutAddress === undefined) return false;

      if ((isVinOwn && (voutAddress.toLowerCase() === contract_address?.toLowerCase())) ||
        (isVoutOwn && (vinAddress.toLowerCase() === contract_address?.toLowerCase()))) {
        return tx;
      }
      return false;
    });

    const details: TransactionDescription[] = [];

    txs.forEach((tx) => {
      const detail = getLendbitContract(readOnlyProvider).interface.parseTransaction(
        {
          data: tx?.ethereumSpecific?.data || "",
          value: tx?.value || "0",
        }
      )
      if (detail) { details.push(detail) }
    })

    // console.log("TXS", txs);

    return details;
  }, [result]) || [];

  if (!isLoading && transactions.length !== 0) {
    historyData = transactions.map(CreateHistoryData);
    console.log("HISTORY DATA", historyData);
  }

  return (
    <div className="bg-black py-6 w-full px-4 sm:px-6 font-[family-name:var(--font-outfit)] u-class-shadow-2">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-xl text-[#F6F6F6] font-medium">Transaction History</h3>
        <div className="flex gap-2 items-center">
          <h3 className="text-base text-[#D8EE10] font-semibold">Export CSV</h3>
          <Image
            src="/download.svg"
            alt="download"
            width={24}
            height={24}
            priority
            quality={100}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {historyData.map((item, index) => (
          <div
            key={item.id}
            className={`pb-4 sm:pb-6 ${index !== historyData.length - 1 ? 'border-b border-[#3E3E47]' : ''}`}
          >
            <History {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
