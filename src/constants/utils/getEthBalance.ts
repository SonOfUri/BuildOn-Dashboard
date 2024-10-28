import { readOnlyProvider } from "@/config/provider";
import { ethers } from "ethers";

export const getEthBalance = async (address: string) => {
    const balance = await readOnlyProvider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance); 
    return parseFloat(balanceInEth).toFixed(3);
};