import { readOnlyProvider } from "@/config/provider";
import { tokenData } from "./tokenData";
import { ethers } from "ethers";

 // Function to get USDC token balance
export const getUsdtBalance = async (address: string) => {
    const usdtContract = new ethers.Contract(
        tokenData[3].address,
        [
            "function balanceOf(address owner) view returns (uint256)"
        ],
        readOnlyProvider
    );
    const balance = await usdtContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
};