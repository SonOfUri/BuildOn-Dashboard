"use client";

import { formatAddress } from "@/constants/utils/formatAddress";
import { getEthBalance } from "@/constants/utils/getEthBalance";
import { SUPPORTED_CHAIN_ID } from "@/context/web3Modal";
import { Spinner } from "@radix-ui/themes";
import { useSwitchNetwork, useWalletInfo, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export const Header = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { open } = useWeb3Modal();
    const { address, isConnected, chainId } = useWeb3ModalAccount();
    const { walletInfo } = useWalletInfo();
    const { switchNetwork } = useSwitchNetwork();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            if (isConnected && address) {
                try {
                    const bal = await getEthBalance(address); 
                    setBalance(bal);
                } catch (error) {
                    console.error("Error fetching balance:", error);
                }
            }
        };
        fetchBalance();
    }, [isConnected, address]);


    const isActive = (path: string) => {
        return pathname === path ? "active-link active" : "active-link";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignout = () => {
        setIsOpen(!isOpen);
        open();
    };

    const walletConnect = () => {
        if (!isConnected) {
            open();
        } else if (isConnected && chainId !== SUPPORTED_CHAIN_ID) {
            switchNetwork(SUPPORTED_CHAIN_ID);
        } else {
            setIsOpen(!isOpen);
        }
    };
// font-[family-name:var(--font-outfit)]
    return (
        <header className="bg-black md:p-6 p-4 w-full top-0 left-0 relative custom-corner-header">
            <div className="flex justify-between items-center w-full">
                <Link href={"https://buildon.lendbit.finance/"} className="flex items-center gap-[6px]">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={50}
                        height={42}
                        priority
                        quality={100}
                        className="w-10 md:w-[50px] md:h-[42px]"
                        // layout="responsive"
                    />
                    <Image
                        src="/white-word.png"
                        alt="brand text"
                        width={92}
                        height={20}
                        priority
                        quality={100}
                        className="hidden md:block"
                    />
                </Link>

                {/* Hamburger icon for mobile */}
                <button
                    className="text-white block lg:hidden focus:outline-none"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    )}
                </button>

                {/* Navigation Links - Only show on large screens */}
                <nav className={`hidden lg:flex space-x-6 font-medium text-sm font-[family-name:var(--font-zenDots)]`}>
                    <Link href="/" className={isActive("/dashboard")}>
                        Dashboard
                    </Link>
                    <Link href="/order" className={isActive("/order")}>
                        Orders
                    </Link>
                    <Link href="/marketplace" className={isActive("/marketplace")}>
                        Marketplace
                    </Link>
                    <Link href="/supportedassets" className={isActive("/supportedassets")}>
                        Assets
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Image
                        src="/notifications.svg"
                        alt="notifications"
                        width={20}
                        height={20}
                        priority
                        quality={100}
                    />

                    {/* Wallet Connect Section */}
                    <div>
                        {!mounted ? (
                            <div className="text-sm text-[#ff4d00] rounded-md bg-[#2a2a2a] py-2 px-5 ml-2">
                                <Spinner />
                            </div>
                        ) : (
                            <div onClick={walletConnect} className="flex items-center gap-2 cursor-pointer">
                                <Image
                                    src="/User.svg"
                                    alt="User icon"
                                    width={20}
                                    height={20}
                                    priority
                                    quality={100}
                                />
                                <div className="text-xs md:text-sm text-[#ff4d00] flex items-center gap-3 rounded-md bg-[#2a2a2a] md:p-3 px-3 py-2">
                                    {!isConnected ? (
                                        <p className="uppercase">Connect Wallet</p>
                                    ) : (
                                        <>
                                            {chainId !== SUPPORTED_CHAIN_ID ? (
                                                <p className="text-red-500 uppercase leading-tight">Switch to Base</p>
                                            ) : (
                                                <p className="">{address ? formatAddress(address) : "Address"}</p>)
                                            }

                                            <Image
                                                src="/chevronOrange.svg"
                                                alt="chevron icon"
                                                width={8}
                                                height={5}
                                                priority
                                                quality={100}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <nav className="lg:hidden mt-4 font-[family-name:var(--font-zenDots)] text-[10px]">
                    <Link href="/" className={`block py-2 ${isActive("/dashboard")}`}>
                        Dashboard
                    </Link>
                    <Link href="/order" className={`block py-2 ${isActive("/order")}`}>
                        Orders
                    </Link>
                    <Link href="/marketplace" className={`block py-2 ${isActive("/marketplace")}`}>
                        Marketplace
                    </Link>
                    <Link href="/supportedassets" className={`block py-2 ${isActive("/supportedassets")}`}>
                        Assets
                    </Link>
                </nav>
            )}

            {/* Wallet Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md text-black rounded-lg z-50">
                    <div className="p-4 flex flex-col items-center gap-2">
                        <img
                            src={walletInfo?.icon || "/"}
                            alt="Wallet Icon"
                            className="w-6 h-6 object-cover"
                        />
                        <span className="text-black text-xs md:text-sm">{address ? formatAddress(address) : "Address"}</span>
                        <span className="text-black text-xs md:text-sm">{balance ? `${balance} ETH` : "wallet balance..."}</span> 
                        <button
                            className="w-full bg-[#FF4D00]/70 text-white py-2 rounded-md hover:bg-[#FF4D00] transition-colors text-xs md:text-sm"
                            onClick={handleSignout}
                        >
                            Wallet Actions
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};
