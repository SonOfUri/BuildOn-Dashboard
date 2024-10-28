import { ethers } from "ethers";
import lendbitAbi from "@/abi/ProtocolFacet.json";
import multicallAbi from "@/abi/multicallAbi.json";
import erc20Abi from "@/abi/ERC20Abi.json";
import { envVars } from "@/constants/envVars";



export const getLendbitContract = (providerOrSigner: ethers.Provider | ethers.Signer) =>
    new ethers.Contract(
        envVars.lendbitDiamondAddress || "",
        lendbitAbi,
        providerOrSigner
    );


export const getMulticallContract = (providerOrSigner: ethers.Provider | ethers.Signer) =>
new ethers.Contract(
    envVars.multicallContract || "",
    multicallAbi,
    providerOrSigner
);

export const getERC20Contract = (providerOrSigner: ethers.Provider | ethers.Signer, tokenAddress: string) =>
    new ethers.Contract(
        tokenAddress,
        erc20Abi,
        providerOrSigner
    );