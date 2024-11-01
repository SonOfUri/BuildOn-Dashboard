"use client";

import OhNo from "@/components/order/OhNo";
import OrdersDetails from "@/components/order/OrdersDetails";
import PendingRepayments from "@/components/order/PendingRepayments";
import TransactionHistory from "@/components/order/TransactionHistory";
import PleaseConnect from "@/components/shared/PleaseConnect";
import { formatDate } from "@/constants/utils/formatDDMMYY";
import useGetAllListings from "@/hooks/useGetAllListings";
import useGetAllRequests from "@/hooks/useGetAllRequests";
import { Spinner } from "@radix-ui/themes";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useEffect, useState, useMemo } from "react";


export default function OrderPage() {
    const { address, isConnected } = useWeb3ModalAccount();
    const [isClient, setIsClient] = useState(false);

    const { loading3, borrowOrder } = useGetAllRequests();
    const { loadings3, lendOrder } = useGetAllListings();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const mergedOrders = useMemo(() => {
        return [
            ...(borrowOrder?.map((order) => ({ ...order, type: "Borrow" })) || []),
            ...(lendOrder?.map((order) => ({ ...order, type: "Lend" })) || []),
        ];
    }, [borrowOrder, lendOrder]);


    const sortedOrders = useMemo(() => {
        return mergedOrders.sort((a, b) => b.returnDate - a.returnDate);
    }, [mergedOrders]);

    const formattedOrders = useMemo(() => {
        return sortedOrders.map((order) => ({
            ...order,
            returnDateFormatted: formatDate(order.returnDate),
        }));
    }, [sortedOrders]);

    // console.log("SORTED AND FORMATTED ORDERS", formattedOrders);

    if (!isClient) {
        return (
            <div className="text-[#FF4D00] flex justify-center my-64">
                <Spinner size={"3"} />
            </div>
        );
    }

    if (!isConnected && !address) {
        return <PleaseConnect text={"see available orders"} />;
    }

    const isLoading = loading3 || loadings3;

    return (
        <main className="max-w-[1370px] mx-auto mt-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
                {isLoading ? (
                    <div className="text-center flex items-center justify-center h-32 gap-3 col-span-full">
                        <Spinner size={"3"} />
                        <p className="text-gray-500">Fetching my orders...</p>
                    </div>
                ) : (
                    <div>
                        {formattedOrders.length > 0 ? (
                            <div>
                                <div className="mb-6">
                                    <OrdersDetails orderSample={formattedOrders} />
                                </div>


                                <div className="flex flex-col md:flex-row justify-between w-full gap-6">
                                    {/* Pending Repayments Section */}
                                    <div className="w-full md:w-5/12  p-4 rounded-lg">
                                        <PendingRepayments />
                                    </div>

                                    {/* Transaction History Section */}
                                    <div className="w-full md:w-7/12  p-4 rounded-lg">
                                        <TransactionHistory />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <OhNo />
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
