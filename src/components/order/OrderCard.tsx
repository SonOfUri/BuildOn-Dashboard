import Image from "next/image";
import { Gradients } from "../shared/Gradients";
import { OrderCardProps } from "@/constants/types";



export const OrderCard = ({ id, type, amount, token, date, icon1, icon2, isSelected, style, cardGradient }: OrderCardProps) => {
  return (
    <div className="w-full font-[family-name:var(--font-outfit)] bg-[#E5E5E5] h-full rounded-2xl overflow-hidden border-black border"
    style={style}
    >
      <div className="flex flex-col h-full">
        <div className="h-2/6 relative">
          <div className="">
            <Gradients cardGradient={cardGradient} />
          </div>
          <div className="top-2 left-4 absolute">
            <Image src={"/Union.svg"} alt="icon" width={17} height={17} priority quality={100} />
          </div>
        </div>

        <div className="bg-white text-[#111111] h-4/6 rounded-b-2xl">
          <div className="flex flex-col justify-between pt-4 pl-4 h-5/6">
            <div className="font-medium space-y-1">
              <p className="text-[10px] text-[#111111]/60">ID: {id}</p>
              <h4 className="text-lg font-medium">{type} Order</h4>
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h4 className="text-lg font-medium">{amount}</h4>
                <Image src={token} alt="token" width={15} height={15} priority quality={100} />
              </div>
              <p className="font-light text-sm">
                Exp <span className="font-medium pl-1">{date}</span>
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-[-8px] relative pr-4 h-1/6 items-start">
            <div className="bg-[#1F1E29] rounded-full w-6 h-6 flex items-center justify-center">
              <Image src={icon1} alt="icon" width={12} height={12} priority quality={100} />
            </div>
            <div className="bg-[#1F1E29] rounded-full w-6 h-6 flex items-center justify-center">
              <Image src={icon2} alt="icon" width={12} height={12} priority quality={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
