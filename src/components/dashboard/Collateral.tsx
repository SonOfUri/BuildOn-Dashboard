"use client"

import Image from "next/image";
import { Btn } from "../shared/Btn";
import { tokenData2 } from "@/constants/utils/tokenData2";
import { useEffect, useState } from "react";
import { getEthBalance } from "@/constants/utils/getEthBalance";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { getLinkBalance } from "@/constants/utils/getLinkBalance";
import { SUPPORTED_CHAIN_ID } from "@/context/web3Modal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Collateral = () => {
    const [updatedTokenData, setUpdatedTokenData] = useState(tokenData2);
    const { address, isConnected, chainId } = useWeb3ModalAccount();
    const router = useRouter();

    useEffect(() => {
        const fetchBalance = async () => {
            if (isConnected && address && (chainId === SUPPORTED_CHAIN_ID)) {
                try {
                    const ethbal = await getEthBalance(address);
                    const linkbal = await getLinkBalance(address);
                    const updatedData = tokenData2.map((item) => {
                        if (item.token === "ETH") {
                            return { ...item, tokenPrice: ethbal };
                        } else if (item.token === "LINK") {
                            return { ...item, tokenPrice: linkbal };
                        } else {
                            return { ...item, tokenPrice: "N/A" };
                        }
                    });

                    setUpdatedTokenData(updatedData);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            } else {
                const resetData = tokenData2.map((item) => {
                    if (item.token === "ETH" || item.token === "LINK") {
                        return { ...item, tokenPrice: "0" };
                    } else {
                        return item;
                    }
                });
                setUpdatedTokenData(resetData);
            }
        };
        fetchBalance();
    }, [isConnected, address, chainId]);

    const handleDepositClick = (token:string) => {
        if (token === "ETH" || token === "LINK") {
            router.push("/transact/deposit");
        } else {
            toast.warning(`${token} support not available on the testnet.`,{ duration: 1000 });
        }
    };

    return (
        <div className="bg-black py-6 w-full rounded-lg u-class-shadow-2">
            <div className="text-xl px-6 mb-3">
                <h3>Deposit Collateral</h3>
            </div>
            <div className="px-6">
                <table className="min-w-full text-center text-[10px] sm:text-[12px]">
                    <thead>
                        <tr className="text-center">
                            <th className="py-2 text-start">Asset</th>
                            <th className="py-2 text-center">Wallet Balance</th>
                            <th className="py-2 text-center">Collateral</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedTokenData.map((item, index) => (
                            <tr key={index} className="text-center text-[10px]">
                                <td className="pt-3 flex gap-1 items-center text-start">
                                    <img src={item.icon} alt={item.icon} className="w-4" />
                                    <span>{item.token}</span>
                                </td>
                                <td className="pt-2">{`${(Number(item.tokenPrice)).toFixed(3)}`}</td>
                                <td className="pt-2">
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={item.token === "ETH" || item.token === "LINK" ? "/mark.svg": "/toggleOff.svg" }
                                            alt="tick"
                                            width={12}
                                            height={10}
                                            priority
                                            quality={100}
                                        />
                                    </div>
                                </td>
                                <td className="pt-2">
                                    <div
                                        onClick={() => handleDepositClick(item.token)}
                                    >
                                        <Btn text='Deposit' />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Collateral;
