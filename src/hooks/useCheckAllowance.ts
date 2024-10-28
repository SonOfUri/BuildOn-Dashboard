"use client"
import { useState, useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { readOnlyProvider } from "@/config/provider";
import { getERC20Contract } from "@/config/contracts";
import { LINK_ADDRESS } from "@/constants/utils/addresses";
import { envVars } from "@/constants/envVars";

const useCheckAllowance = () => {
    const [val, setVal] = useState(0);
    const { address } = useWeb3ModalAccount()



    useEffect(() => {
        const contract = getERC20Contract(readOnlyProvider, LINK_ADDRESS);

        contract
            .allowance(address, envVars.lendbitDiamondAddress)
            .then((res) => {
                // console.log("RESPONSESSSS", res);
                setVal(Number(res))
            })
            .catch((err) => {
                console.error("error allowance status: ", err);
                setVal(0);
            });
    }, [address]);

    return val;
}

export default useCheckAllowance;
