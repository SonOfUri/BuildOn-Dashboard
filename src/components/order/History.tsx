import { HistoryProps } from "@/constants/types";
import Image from "next/image";

export const History = ({ src, txName, id, date, tokenIcon, balance }: HistoryProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <div className="bg-[#1F1E29] rounded-full w-12 h-12 flex items-center justify-center">
          <Image src={src} alt="icon" width={19} height={12} priority quality={100} />
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex gap-1 items-end">
            <h3 className="text-base text-[#F6F6F6] font-medium">{txName}</h3>
            <span className="text-[#F6F6F6]/50 text-[10px]">ID: #{id}</span>
          </div>
          <div className="text-sm font-normal text-[#C5C4C7]">on {date}</div>
        </div>
        <div>
          <Image src={tokenIcon} alt="token" width={24} height={24} priority quality={100} />
        </div>
      </div>
      
      <div>
        <h3 className="text-[18px] text-[#F6F6F6] font-medium">{balance}</h3>
      </div>
    </div>
  );
};
