import { readOnlyProvider } from "@/config/provider";
import { tokenData } from "./tokenData";
import { ethers } from "ethers";

 // Function to get USDC token balance
export const getDaiBalance = async (address: string) => {
    const daiContract = new ethers.Contract(
        tokenData[4].address,
        [
            "function balanceOf(address owner) view returns (uint256)"
        ],
        readOnlyProvider
    );
    const balance = await daiContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
};