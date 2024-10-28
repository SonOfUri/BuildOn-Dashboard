import { readOnlyProvider } from "@/config/provider";
import { tokenData } from "./tokenData";
import { ethers } from "ethers";

 // Function to get LINK token balance
export const getLinkBalance = async (address: string) => {
    const linkContract = new ethers.Contract(
        tokenData[1].address,
        [
            "function balanceOf(address owner) view returns (uint256)"
        ],
        readOnlyProvider
    );
    const balance = await linkContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
};