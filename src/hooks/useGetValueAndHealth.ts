import { getLendbitContract } from "@/config/contracts";
import { readOnlyProvider } from "@/config/provider";
import { ADDRESS_1, DAI_ADDRESS, LINK_ADDRESS, USDC_ADDRESS, USDT_ADDRESS } from "@/constants/utils/addresses";
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
  const [usdcPrice, setUsdcPrice] = useState<any>(null);
  const [usdtPrice, setUsdtPrice] = useState<any>(null);
  const [daiPrice, setDaiPrice] = useState<any>(null);
  const [availBal, setAvailBal] = useState<any>(null);
  const [AVA, setAVA] = useState<any>(null);
  const [AVA2, setAVA2] = useState<any>(null);
  const [AVA3, setAVA3] = useState<any>(null);
  const [AVA4, setAVA4] = useState<any>(null);
  const [AVA5, setAVA5] = useState<any>(null);


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

        const usdc = await contract.getUsdValue(USDC_ADDRESS, 1, 0);
        // console.log("USDC USD price:", res7);

        const usdt = await contract.getUsdValue(USDT_ADDRESS, 1, 0);
        // console.log("USDT USD price:", res7);

        const dai = await contract.getUsdValue(DAI_ADDRESS, 1, 0);
        // console.log("DAI USD price:", res7);

        const ava = await contract.gets_addressToAvailableBalance(address, ADDRESS_1);
        // console.log("Available balance (ADDRESS_1):", ava);

        const ava2 = await contract.gets_addressToAvailableBalance(address, LINK_ADDRESS);
        // console.log("Available balance (LINK_ADDRESS):", ava2);

        const ava3 = await contract.gets_addressToAvailableBalance(address, USDC_ADDRESS);
        // console.log("Available balance (USDC_ADDRESS):", ava3);

        const ava4 = await contract.gets_addressToAvailableBalance(address, USDT_ADDRESS);
        // console.log("Available balance (USDT_ADDRESS):", ava4);

        const ava5 = await contract.gets_addressToAvailableBalance(address, DAI_ADDRESS);
        // console.log("Available balance (DAI_ADDRESS):", ava5);

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
        setUsdcPrice(ethers.formatEther(usdc));
        setUsdtPrice(ethers.formatEther(usdt));
        setDaiPrice(ethers.formatEther(dai));

        setAvailBal(availBalance);
        setAVA(ethers.formatEther(ava));
        setAVA2(ethers.formatEther(ava2));
        setAVA3(ethers.formatEther(ava3));
        setAVA4(ethers.formatEther(ava4));
        setAVA5(ethers.formatEther(ava5));


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
    usdcPrice,
    usdtPrice,
    daiPrice,
    AVA,
    AVA2,
    AVA3,
    AVA4,
    AVA5,
    availBal,
  };
};

export default useGetValueAndHealth;
