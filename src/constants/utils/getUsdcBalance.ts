import { readOnlyProvider } from "@/config/provider";
import { tokenData } from "./tokenData";
import { ethers } from "ethers";

 // Function to get USDC token balance
export const getUsdcBalance = async (address: string) => {
    const usdcContract = new ethers.Contract(
        tokenData[2].address,
        [
            "function balanceOf(address owner) view returns (uint256)"
        ],
        readOnlyProvider
    );
    const balance = await usdcContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
};