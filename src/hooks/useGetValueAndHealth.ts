import { getLendbitContract } from "@/config/contracts";
import { readOnlyProvider } from "@/config/provider";
import { ADDRESS_1, LINK_ADDRESS } from "@/constants/utils/addresses";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useGetValueAndHealth = () => {
  const [data, setData] = useState<bigint | null>(null);
  const [data2, setData2] = useState<bigint | null>(null);
  const [data3, setData3] = useState<number | null>(null);
  const [data4, setData4] = useState<number | null>(null);
  const [collateralVal, setCollateralVal] = useState<number | string | null>(null);
  const [data5, setData5] = useState<any>(null);
  const [etherPrice, setEtherPrice] = useState<any>(null);
  const [linkPrice, setLinkPrice] = useState<any>(null);
  const [availBal, setAvailBal] = useState<any>(null);
  const [AVA, setAVA] = useState<any>(null);
  const [AVA2, setAVA2] = useState<any>(null);

  const { address, isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!address) return;

      try {
        const contract = getLendbitContract(readOnlyProvider);
        
        const res = await contract.getAccountCollateralValue(address);
        // console.log("Collateral value fetched:", res);

        const res2 = await contract.getHealthFactor(address);
        // console.log("Health factor fetched:", res2);

        const res3 = await contract.gets_addressToCollateralDeposited(address, ADDRESS_1);
        // console.log("Collateral deposited (ADDRESS_1):", res3);

        const res4 = await contract.gets_addressToCollateralDeposited(address, LINK_ADDRESS);
        // console.log("Collateral deposited (LINK_ADDRESS):", res4);

        const res5 = await contract.getUserCollateralTokens(address);
        // console.log("Collateral tokens fetched:", res5);

        const res6 = await contract.getUsdValue(ADDRESS_1, 1, 0);
        // console.log("ETH USD price:", res6);

        const res7 = await contract.getUsdValue(LINK_ADDRESS, 1, 0);
        // console.log("LINK USD price:", res7);

        const ava = await contract.gets_addressToAvailableBalance(address, ADDRESS_1);
        console.log("Available balance (ADDRESS_1):", ava);

        const ava2 = await contract.gets_addressToAvailableBalance(address, LINK_ADDRESS);
        console.log("Available balance (LINK_ADDRESS):", ava2);

        const availBalance = await contract.getAccountAvailableValue(address);
        // console.log("Available account balance:", availBalance);

        // Update state with fetched data
        setData(res);
        setData2(res2);
        setData3(Number(ethers.formatEther(res3)));
        setData4(Number(ethers.formatEther(res4)));
        setCollateralVal(
          ((Number(ethers.formatEther(res3)) * Number(ethers.formatEther(res6))) + 
           (Number(ethers.formatEther(res4)) * Number(ethers.formatEther(res7))))
        );
        setLinkPrice(ethers.formatEther(res7));
        setEtherPrice(ethers.formatEther(res6));
        setAvailBal(availBalance);
        setAVA(ethers.formatEther(ava));
        setAVA2(ethers.formatEther(ava2));

      } catch (err) {
        console.error("Error fetching user data:", err);

        // Reset states on error
        setData(null);
        setData2(null);
        setData3(null);
        setData4(null);
        setCollateralVal(null);
      }
    };

    if (isConnected && address) {
      fetchUserStatus();
    }
  }, [address, isConnected]); // Fetch data when address changes

  return {
    data,
    data2,
    data3,
    data4,
    collateralVal,
    data5,
    etherPrice,
    linkPrice,
    AVA,
    AVA2,
    availBal,
  };
};

export default useGetValueAndHealth;
