"use client";

import { Btn } from "@/components/shared/Btn";
import useAcceptListedAds from "@/hooks/useAcceptListedAds";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function BorrowAllocationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const listingId = searchParams.get("listingId");
    const maxAmount = parseFloat(searchParams.get("maxAmount") || "0");
    const minAmount = parseFloat(searchParams.get("minAmount") || "0");
    const tokenType = searchParams.get("tokenType")

    const [borrowAmount, setBorrowAmount] = useState("");

    const acceptAds = useAcceptListedAds()


    const handleCancel = () => {
        router.push("/marketplace");
    };

    // Function to handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Regex to check if value has more than 3 decimals
        if (value.includes('.')) {
            const [integerPart, decimalPart] = value.split('.');
            if (decimalPart.length > 3) {
                value = `${integerPart}.${decimalPart.slice(0, 3)}`;
            }
        }

        setBorrowAmount(value);
    };


    const handleAccept = () => {
        if (Number(borrowAmount) < minAmount) return toast.warning(`Can't take less than ${minAmount} ${tokenType}`)
        if (Number(borrowAmount) > maxAmount) return toast.warning(`Can't take more than ${maxAmount} ${tokenType}`)
        
        acceptAds(Number(listingId), borrowAmount)
    }

    return (
        <div className="h-screen flex items-center">
            <div className="bg-black rounded-md py-2 px-4 text-white u-class-shadow">
                <p className="text-base">Borrow</p>

                <div className="w-72 sm:w-96 my-6">
                    <p className="text-[14.6px]">Borrow Allocation</p>
                    <div className="mt-2 w-full bg-white rounded-lg">
                        {/* Input field for borrow amount */}
                        <input
                            type="number"
                            value={borrowAmount}
                            onChange={handleChange}
                            placeholder={`Enter amount from $${minAmount.toFixed(3)} to $${maxAmount.toFixed(3)}`}
                            className="w-full bg-transparent border border-white rounded-lg py-2 px-3 text-black"
                        />
                    </div>

                    <div className="text-base mt-6 flex justify-between items-center">
                        <div className="w-[121px]">
                            <div className="border border-white w-full py-3 rounded-lg">
                                <p className="pl-4">{minAmount.toFixed(3) || 0} {tokenType}</p>
                            </div>
                            <p className="text-[10px] font-medium text-center mt-1">Lower Limit</p>
                        </div>

                        <div className="text-2xl">-</div>

                        <div className="w-[121px]">
                            <div className="border border-white w-full py-3 rounded-lg">
                                <p className="pl-4">{maxAmount.toFixed(3) || 0} {tokenType}</p>
                            </div>
                            <p className="text-[10px] font-medium text-center mt-1">Upper Limit</p>
                        </div>
                    </div>
                </div>

                <div className="my-4 cursor-pointer" onClick={handleAccept}>
                    <Btn
                        text={"Borrow"}
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
    );
}
