"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Btn } from "../shared/Btn";
import useGetAllListings from "@/hooks/useGetAllListings";
import { formatAddress } from "@/constants/utils/formatAddress";
import useGetAllRequests from "@/hooks/useGetAllRequests";
import { Spinner } from "@radix-ui/themes";
import useServiceRequest from "@/hooks/useServiceRequest";
import { useRouter } from "next/navigation";
import useGetValueAndHealth from "@/hooks/useGetValueAndHealth";

const tokenImageMap: { [key: string]: { image: string; label: string } } = {
    "0xE4aB69C077896252FAFBD49EFD26B5D171A32410": { image: "/link.svg", label: "LINK" },
    "0x0000000000000000000000000000000000000001": { image: "/eth.svg", label: "ETH" },
};

const Table = () => {
    const [activeTable, setActiveTable] = useState<"borrow" | "lend">("borrow");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<string>("All Tokens");
    const [borrowTableData, setBorrowTableData] = useState<any[]>([]);
    const [lendTableData, setLendTableData] = useState<any[]>([]);
    const [filteredBorrowData, setFilteredBorrowData] = useState<any[]>([]);
    const [filteredLendData, setFilteredLendData] = useState<any[]>([]);
    const [loadingBorrow, setLoadingBorrow] = useState(true);
    const [loadingLend, setLoadingLend] = useState(true);
    const router = useRouter();

    const { collateralVal, etherPrice, linkPrice } = useGetValueAndHealth();

    // Fetch all listings and requests
    const { loadings: borrowLoading, listingData } = useGetAllListings();
    const { loading: lendLoading, requestData } = useGetAllRequests();
    const service = useServiceRequest();

    useEffect(() => {
        if (listingData) {
            setBorrowTableData(listingData);
            setLoadingBorrow(borrowLoading);
        }
    }, [listingData]);

    useEffect(() => {
        if (requestData) {
            setLendTableData(requestData);
            setLoadingLend(lendLoading);
        }
    }, [requestData]);

    // Filter borrow data based on selected token
    useEffect(() => {
        setFilteredBorrowData(
            selectedToken === "All Tokens"
                ? borrowTableData
                : borrowTableData.filter(data => data.tokenAddress === selectedToken)
        );
    }, [selectedToken, borrowTableData]);

    // Filter lend data based on selected token
    useEffect(() => {
        setFilteredLendData(
            selectedToken === "All Tokens"
                ? lendTableData
                : lendTableData.filter(data => data.loanRequestAddr === selectedToken)
        );
    }, [selectedToken, lendTableData]);

    const handleTableChange = (table: "borrow" | "lend") => {
        setActiveTable(table);
    };

    const handleToggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleTokenSelect = (token: string) => {
        setSelectedToken(token);
        setIsDropdownOpen(false);
    };

    const handleBorrowAllocation = (data: any) => {
        const queryString = `?listingId=${data.listingId}&maxAmount=${data.max_amount}&minAmount=${data.min_amount}`;
        router.push(`/borrow-allocation${queryString}`);
    };

    return (
        <div className="w-full">
            {/* Toggle Borrow/Lend */}
            <div className="px-4 sm:px-12 flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="text-xl space-x-4 sm:space-x-6">
                    <button
                        className={`py-2 px-4 sm:px-8 rounded-lg bg-black ${activeTable === "borrow" ? "border border-[#FF4D00]" : ""}`}
                        onClick={() => handleTableChange("borrow")}
                    >
                        Borrow
                    </button>
                    <button
                        className={`py-2 px-4 sm:px-12 rounded-lg bg-black ${activeTable === "lend" ? "border border-[#FF4D00]" : ""}`}
                        onClick={() => handleTableChange("lend")}
                    >
                        Lend
                    </button>
                </div>

                {/* Token Dropdown and Filter */}
                <div className="relative flex justify-end gap-4 mt-4 sm:mt-0">
                    <div
                        className="py-2 px-4 bg-black rounded-lg flex items-center text-lg cursor-pointer"
                        onClick={handleToggleDropdown}
                    >
                        {selectedToken !== "All Tokens" && (
                            <Image
                                src={tokenImageMap[selectedToken]?.image}
                                alt={selectedToken}
                                width={30}
                                height={30}
                            />
                        )}
                        <div className="pl-2">{tokenImageMap[selectedToken]?.label || "All Tokens"}</div>
                        <div className="pl-4">
                            <Image
                                src={"/chevronDown.svg"}
                                alt="dropdown indicator"
                                width={15}
                                height={15}
                                priority
                                quality={100}
                            />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 w-48 bg-black rounded-lg p-4 z-10">
                            <div
                                className="cursor-pointer hover:bg-gray-800 p-2"
                                onClick={() => handleTokenSelect("All Tokens")}
                            >
                                All Tokens
                            </div>
                            {Object.keys(tokenImageMap).map((tokenAddress, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer hover:bg-gray-800 p-2 flex items-center gap-4"
                                    onClick={() => handleTokenSelect(tokenAddress)}
                                >
                                    <Image src={tokenImageMap[tokenAddress].image} alt={tokenAddress} width={30} height={30} />
                                    <p>{tokenImageMap[tokenAddress].label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="px-4 sm:px-12">
                {activeTable === "borrow" ? (
                    <>
                        {/* Borrow Table Headers */}
                        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-2">
                            <p>Asset</p>
                            <p>Origin</p>
                            <p>Volume</p>
                            <p>Rate</p>
                            <p>Min</p>
                            <p>Max</p>
                            <p>Duration</p>
                            <p>Action</p>
                        </div>
                        {loadingBorrow ? (
                            <div className="flex items-center justify-center h-32 gap-3">
                                <Spinner size={"3"} />
                                <p className="text-white mt-2 text-2xl">Fetching Borrow Data...</p>
                            </div>
                        ) : (
                            filteredBorrowData.slice().reverse().map((data, index) => (
                                <div key={index} className="w-full bg-black rounded-lg p-4 sm:p-6 mb-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-2 items-center">
                                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                        <Image src={tokenImageMap[data.tokenAddress]?.image} alt={data.loanRequestAddr} width={37} height={36} priority quality={100} />
                                        <p>{tokenImageMap[data.tokenAddress]?.label}</p>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                        <Image src={"/avatar.svg"} alt="avatar" width={17} height={16} priority quality={100} />
                                        <p>{formatAddress(data.author)}</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Number(data.amount)} {tokenImageMap[data.tokenAddress]?.label} (~$
                                        {(
                                            Number(data.amount) *
                                            (tokenImageMap[data.tokenAddress]?.label === "ETH" ? Number(etherPrice) : Number(linkPrice))
                                        ).toFixed(2)})
                                    </div>

                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">{data.interest}%</div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Number(data.min_amount).toFixed(3)} {tokenImageMap[data.tokenAddress]?.label} (~$
                                        {(
                                            Number(data.min_amount) *
                                            (tokenImageMap[data.tokenAddress]?.label === "ETH" ? Number(etherPrice) : Number(linkPrice))
                                        ).toFixed(2)})
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Number(data.max_amount).toFixed(3)} {tokenImageMap[data.tokenAddress]?.label} (~$
                                        {(
                                            Number(data.max_amount) *
                                            (tokenImageMap[data.tokenAddress]?.label === "ETH" ? Number(etherPrice) : Number(linkPrice))
                                        ).toFixed(2)})
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Math.floor((data.returnDate - Date.now()) / (1000 * 60 * 60 * 24))} days
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right"
                                        onClick={() => handleBorrowAllocation(data)}>
                                        <Btn text={"Borrow"} css="text-black bg-[#FF4D00] text-sm sm:text-base px-3 py-1 rounded-md" />
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {/* Lend Table Headers */}
                        <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-2">
                            <p>Asset</p>
                            <p>Origin</p>
                            <p>Loan Amount</p>
                            <p>Rate</p>
                            <p>Repayment Amount</p>
                            <p>Duration</p>
                            <p>Action</p>
                        </div>
                        {loadingLend ? (
                            <div className="flex items-center justify-center h-32 gap-3">
                                <Spinner size={"3"} />
                                <p className="text-white mt-2 text-2xl">Fetching Lend Data...</p>
                            </div>
                        ) : (
                            filteredLendData.slice().reverse().map((data, index) => (
                                <div key={index} className="w-full bg-black rounded-lg p-4 sm:p-6 mb-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-2 items-center">
                                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                        <Image src={tokenImageMap[data.loanRequestAddr]?.image} alt={data.loanRequestAddr} width={37} height={36} priority quality={100} />
                                        <p>{tokenImageMap[data.loanRequestAddr]?.label}</p>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                        <Image src={"/avatar.svg"} alt="avatar" width={17} height={16} priority quality={100} />
                                        <p>{formatAddress(data.author)}</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Number(data.amount)} {tokenImageMap[data.loanRequestAddr]?.label} (~$
                                        {(
                                            Number(data.amount) *
                                            (tokenImageMap[data.loanRequestAddr]?.label === "ETH" ? Number(etherPrice) : Number(linkPrice))
                                        ).toFixed(2)})
                                    </div>

                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">{data.interest}%</div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Number(data.totalRepayment).toFixed(3)} {tokenImageMap[data.loanRequestAddr]?.label} (~$
                                        {(
                                            Number(data.totalRepayment) *
                                            (tokenImageMap[data.loanRequestAddr]?.label === "ETH" ? Number(etherPrice) : Number(linkPrice))
                                        ).toFixed(2)})
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right sm:text-center">
                                        {Math.floor((data.returnDate - Date.now()) / (1000 * 60 * 60 * 24))} days
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 text-right"
                                        onClick={() => service(data.requestId, data.loanRequestAddr, data.amount)}>
                                        <Btn text={"Lend"} css="text-black bg-[#FF4D00] text-sm sm:text-base px-3 py-1 rounded-md" />
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Table;