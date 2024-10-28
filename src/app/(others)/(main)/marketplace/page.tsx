"use client"

import { useState, useEffect } from 'react';
import MktHeader from "@/components/market/MktHeader";
import CardLayout from "@/components/market/CardLayout";
import PleaseConnect from "@/components/shared/PleaseConnect";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Spinner } from '@radix-ui/themes';

export default function MarketPlacePage() {
    const { address, isConnected } = useWeb3ModalAccount();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    if (!isClient) {
        return (
            <div className='text-[#FF4D00] flex justify-center my-64'>
                <Spinner size={"3"} />
            </div>
        )    
    }

    if (!isConnected && !address) {
        return <PleaseConnect text={"see available orders"} />;
    }

    return (
        <main className="max-w-[1370px] mx-auto mt-10">
            <div className="w-full px-1">
                <div className="mb-8">
                    <MktHeader />
                </div>

                <div>
                    <CardLayout />
                </div>
            </div>
        </main>
    );
}
