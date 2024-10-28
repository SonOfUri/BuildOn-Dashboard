"use client";

import { DateInputField } from "@/components/createOrder/DateInputField";
import { Btn } from "@/components/shared/Btn";
import AssetSelector from "@/components/shared/AssetSelector";
import { Slider } from "@radix-ui/themes";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import useCreateLoanListing from "@/hooks/useCreateLoanListing";
import useCreateLendingRequest from "@/hooks/useCreateLendingRequest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateOrderPage() {
    const [percentage, setPercentage] = useState(0);
    const [selectedToken, setSelectedToken] = useState("ETH");
    const [fiatAmount, setFiatAmount] = useState(0); // Fiat amount based on token price
    const [tokenPrice, setTokenPrice] = useState(2500); // Initial price of the selected token
    const [assetValue, setAssetValue] = useState("0.00"); // Asset value
    const [range, setRange] = useState([0, 0]); // Volume slider range
    const [rangeInTokenVal, setRangeInTokenVal] = useState([0, 0]);
    const [userAddress, setUserAddress] = useState<string | null>(null); // User's wallet address
    const [activeOrderType, setActiveOrderType] = useState<"lend" | "borrow">("lend");
    const router = useRouter();

    
    const [showLendTooltip, setShowLendTooltip] = useState(false);
    const [showBorrowTooltip, setShowBorrowTooltip] = useState(false);
    const [dateValue, setDateValue] = useState<string>("");

    const { address, isConnected } = useWeb3ModalAccount();

    const createLoanOrder = useCreateLoanListing() 
    const createBorrowOrder = useCreateLendingRequest() 
    
   useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        } else {
            setUserAddress(null);
        }
    }, [address, isConnected]);

    // Increment and decrement functions for percentage
    const handleIncrement = () => {
        if (percentage < 100) setPercentage(percentage + 1);
    };

    const handleDecrement = () => {
        if (percentage > 0) setPercentage(percentage - 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        const regex = /^\d*\.?\d{0,3}$/;

        if (regex.test(value)) {
            const numericValue = parseFloat(value);
            if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
                setPercentage(numericValue);
            }
        }
    };

    // Handle token selection and update fiat amount based on token price
    const handleTokenSelect = (token: string, price: number) => {
        setSelectedToken(token);
        setTokenPrice(price);
        const updatedFiatAmount = parseFloat(assetValue) * price;
        setFiatAmount(updatedFiatAmount); // Update fiat amount when a token is selected
        const updatedTokenAmount = parseFloat(assetValue);
        setRangeInTokenVal([0, updatedTokenAmount]); // Set range in token values
        setRange([0, updatedFiatAmount]); // Set range in fiat
    };

    // Handle asset value change from AssetSelector
    const handleAssetValueChange = (value: string) => {
        setAssetValue(value);
        const updatedFiatAmount = parseFloat(value) * tokenPrice;
        setFiatAmount(updatedFiatAmount); // Recalculate fiat amount based on new asset value
        const updatedTokenAmount = parseFloat(value);
        setRangeInTokenVal([0, updatedTokenAmount]); // Set range in token values
        
        setRange([0, updatedFiatAmount]); // Set range in fiat
    };


    // Handle slider change
     const handleSliderChange = (value: number[]) => {
        setRange(value); // Range in fiat
        const rangeToken = value.map(v => v / tokenPrice); // Convert fiat to token value
        setRangeInTokenVal(rangeToken); // Update range in tokens
        
        
    };

    const handleCancel = () => {
    router.push("/order");
   };

    return (
        <div className="my-12">
            <div className="bg-black rounded-md p-2 u-class-shadow mt-4">
                <p className="text-base text-white pl-2">Order</p>

                {/* Buttons section with 50/50 split */}
                <div className="my-4 px-4 sm:px-8">
                    <div className="flex gap-4 w-full">
                        {/* Lend Button with Tooltip */}
                        <div
                            className="relative w-1/2"
                            onMouseEnter={() => setShowLendTooltip(true)}
                            onMouseLeave={() => setShowLendTooltip(false)}
                            onClick={() => setActiveOrderType("lend")}
                        >
                            <Btn
                                text={"Lend"}
                                css={`text-black/80 ${
                                activeOrderType === "lend"
                                    ? "bg-[#FF4D00CC]/80"
                                    : "bg-[#D7D7D7CC]/80"
                                } text-xl py-2 px-4 w-full rounded flex items-center justify-center`}
                            />
                            {/* Tooltip for Lend Button */}
                            {showLendTooltip && (
                                <div className="absolute bottom-full mb-2 bg-[#dd4f00] text-white text-xs rounded-lg p-2 w-64">
                                    Lenders create lending pools that borrowers can borrow from.
                                </div>
                            )}
                        </div>

                        {/* Borrow Button with Tooltip */}
                        <div
                            className="relative w-1/2"
                            onMouseEnter={() => setShowBorrowTooltip(true)}
                            onMouseLeave={() => setShowBorrowTooltip(false)}
                            onClick={() => setActiveOrderType("borrow")}
                        >
                            <Btn
                                 text={"Borrow"}
                                css={`text-black ${
                                activeOrderType === "borrow"
                                    ? "bg-[#FF4D00CC]/80"
                                    : "bg-[#D7D7D7CC]/80"
                                } text-xl py-2 px-4 w-full rounded flex items-center justify-center`}
                            />
                            {/* Tooltip for Borrow Button */}
                            {showBorrowTooltip && (
                                <div className="absolute bottom-full mb-2 bg-[#dd4f00] text-white text-xs rounded-lg p-2 w-64">
                                    Borrowers create borrow orders that lenders can service.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Use AssetSelector component */}
                <AssetSelector
                    onTokenSelect={handleTokenSelect}
                    onAssetValueChange={handleAssetValueChange}
                    assetValue={assetValue}
                    userAddress={userAddress} // Pass userAddress to AssetSelector
                    actionType={activeOrderType}
                />

                <div className="px-4 sm:px-8">
                    <div className="bg-white mt-3 rounded-[40px] px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="text-[14.6px] font-medium">
                                <p className="text-[#636363]">
                                    Order Value
                                    <span className="text-black/30 ml-3">
                                        .<span className="ml-2">Interest Value</span>
                                    </span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <p className="text-black text-[14.6px]">{selectedToken}</p>
                                <Image
                                    src={"/chevron.svg"}
                                    alt="token"
                                    width={6}
                                    height={11}
                                    priority
                                    quality={100}
                                    className=""
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            {/* Fiat amount calculation */}
                            <p className="font-bold text-black text-[40px] sm:text-[51.12px]">
                                ${fiatAmount.toFixed(2)} {/* Calculated fiat amount */}
                                <span className="text-[14.6px] ml-2 font-medium text-black/30">
                                    +${(fiatAmount * (percentage / 100)).toFixed(2)} {/* Calculated interest */}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center w-full gap-2 justify-center mt-2">
                            <button
                                onClick={handleDecrement}
                                className="bg-[#A2A8B4] rounded-full py-2 sm:py-4 px-4 sm:px-[25px] flex items-center justify-center"
                            >
                                <p className="text-3xl sm:text-4xl">-</p>
                            </button>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={percentage}
                                    onChange={handleInputChange}
                                    className="bg-[#FF4D00CC]/80 rounded-2xl p-2 sm:p-4 text-[20px] sm:text-[27.5px] font-medium text-black w-[120px] sm:w-[150px] text-center"
                                    min={0}
                                    max={100}
                                    step={0.001}
                                    placeholder="0.00"
                                />
                                <span className="absolute right-2 top-3 sm:right-3.5 sm:top-4 text-[20px] sm:text-[27.5px] font-medium text-black">%</span>
                            </div>

                            <button
                                onClick={handleIncrement}
                                className="bg-[#A2A8B4] rounded-full py-2 sm:py-4 px-4 sm:px-[25px] flex items-center justify-center"
                            >
                                <p className="text-3xl sm:text-4xl">+</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar / DateInputField */}
                <div className="px-4 sm:px-8">
                    <DateInputField dateValue={dateValue} setDateValue={setDateValue} />
                </div>

                {/* Volume Slider Section - Below the Calendar */}
                {activeOrderType === "lend" &&
                    (<div className="px-4 sm:px-8">
                        <div className="mt-3 rounded-[40px] px-4 py-6">
                            <p className="text-lg sm:text-xl text-white mb-2">Customize Order Volume per User</p>

                            <div className="mt-5">
                                <p className="text-[14.6px] text-white">Borrow Allocation</p>

                                <div className="mt-2 w-full bg-[#FFCFB4] rounded-lg">
                                    <Slider
                                        value={range}
                                        onValueChange={handleSliderChange}
                                        className="w-full"
                                        size="3"
                                        color="orange"
                                        radius="large"
                                        min={0}
                                        max={fiatAmount}
                                        step={1}
                                    />
                                </div>

                                <div className="text-base mt-6 flex justify-between items-center">
                                    <div className="w-full sm:w-[121px]">
                                        <div className="border border-white w-full py-2 sm:py-3 rounded-lg">
                                            <p className="pl-4 text-white">${range[0].toFixed(2)}</p> {/* Lower Limit */}
                                        </div>
                                        <p className="text-[10px] font-medium text-center mt-1 text-white">Lower Limit</p>
                                    </div>

                                    <div className="text-2xl text-white mt-[-25px]">-</div>

                                    <div className="w-full sm:w-[121px]">
                                        <div className="border border-white w-full py-2 sm:py-3 rounded-lg">
                                            <p className="pl-4 text-white">${range[1]?.toFixed(2)}</p> {/* Upper Limit */}
                                        </div>
                                        <p className="text-[10px] font-medium text-center mt-1 text-white">Upper Limit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                }    

               <div className="mb-3 mt-8 px-4 cursor-pointer">
                    <div
                        onClick={() => {
                            if (!dateValue) {
                            toast.warning("Please pick a valid return date for the order!", { duration: 1000 });
                            return;
                            }
                            if (activeOrderType === "lend") {
                                createLoanOrder(
                                    assetValue,         
                                    rangeInTokenVal[0],                      
                                    rangeInTokenVal[1],                     
                                    (new Date(dateValue).getTime()),
                                    percentage, 
                                    selectedToken
                                );
                            } else if (activeOrderType === "borrow") {
                                createBorrowOrder(
                                    assetValue,         
                                    percentage, 
                                    (new Date(dateValue).getTime()),
                                    selectedToken                         
                                );
                            }
                        }}
                    >
                        <Btn
                            text={"Create Order"}
                            css="text-black bg-[#FF4D00CC]/80 text-base w-full py-2 rounded flex items-center justify-center"
                        />
                    </div>      
                </div>

                <div onClick={handleCancel} className="px-4 mb-4 cursor-pointer">
                    <Btn
                        text={"Cancel"}
                        css="text-black bg-[#a2a8b4]/80 text-base w-full py-2 rounded flex items-center justify-center"
                    />
                </div>
            </div>
        </div>
    );
}

