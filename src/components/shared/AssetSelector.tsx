import { useEffect, useState } from "react";
import Image from "next/image";
import { AssetSelectorProps } from "@/constants/types";
import { getEthBalance } from "@/constants/utils/getEthBalance";
import { getLinkBalance } from "@/constants/utils/getLinkBalance";
import useGetValueAndHealth from "@/hooks/useGetValueAndHealth";
import { tokenData as defaultTokenData } from "@/constants/utils/tokenData"; 

const AssetSelector: React.FC<AssetSelectorProps> = ({
  onTokenSelect,
  onAssetValueChange,
  assetValue,
  userAddress,
  actionType
}) => {
  const { etherPrice, linkPrice, AVA, AVA2 } = useGetValueAndHealth(); 
  const [selectedToken, setSelectedToken] = useState(defaultTokenData[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [walletBalance, setWalletBalance] = useState("0");
  const [availableBal, setAvailableBalance] = useState("0")
  
  
useEffect(() => {
  if (etherPrice || linkPrice ) {
    defaultTokenData.forEach((token) => {
      if (token.token === "ETH") {
        token.tokenPrice = Number(etherPrice) || 2500;
      } else if (token.token === "LINK") {
        token.tokenPrice = Number(linkPrice) || 11;
      } 
    });
    const updatedSelectedToken = defaultTokenData.find((token) => token.token === selectedToken.token);
    if (updatedSelectedToken) {
      setSelectedToken({ ...updatedSelectedToken });
    }
  }
}, [etherPrice, linkPrice]);
  

  // Fetch wallet balance based on the selected token
  useEffect(() => {
    const fetchBalance = async () => {
      if (userAddress) {
        let balance;
        if (selectedToken.token === "ETH") {
          setAvailableBalance(AVA)
          balance = await getEthBalance(userAddress);
        } else if (selectedToken.token === "LINK") {
          setAvailableBalance(AVA2)
          balance = await getLinkBalance(userAddress);
        }
        setWalletBalance(Number(balance).toFixed(3) || "0");
      }
    };
    fetchBalance();
  }, [selectedToken, userAddress]);

  // Handle token selection from dropdown
  const handleTokenSelect = (token: string) => {
    const selected = defaultTokenData.find((item) => item.token === token);
    if (selected) {
      setSelectedToken(selected);
      onTokenSelect(selected.token, selected.tokenPrice); // Notify parent component
    }
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle asset value input change and notify parent component
  const handleAssetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,5}$/; // Allow up to 3 decimal places
    if (regex.test(value)) {
      onAssetValueChange(value); // Update in parent
    }
  };

  // Handle clicking the "Max" button
   const handleMaxClick = () => {
    onAssetValueChange(actionType === "withdraw" || actionType === "borrow" ? availableBal : walletBalance || "0");
  };


  // Calculate fiat equivalent (Amount in USD)
  const fiatEquivalent = (parseFloat(assetValue) * selectedToken.tokenPrice).toFixed(2);

  return (
    <div className="bg-white rounded-lg p-3">
      <div className="text-black flex justify-between mb-3 items-center">
        <div
          className="relative bg-black rounded-md p-2 gap-3 flex items-center cursor-pointer"
          onClick={toggleDropdown}
        >
          {/* Token icon */}
          <div className="rounded-full px-1 py-[0.5px] flex items-center justify-center">
            <Image
              src={selectedToken.icon}
              alt={selectedToken.token}
              width={18}
              height={18}
              priority
              quality={100}
            />
          </div>

          {/* Token name */}
          <div className="text-white text-xs">
            <p>{selectedToken.token}</p>
          </div>

          {/* Chevron for dropdown */}
          <div>
            <Image
              src={"/chevronDown.svg"}
              alt="dropdown indicator"
              width={10}
              height={5}
              priority
              quality={100}
              className="text-[#A2A8B4]"
            />
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-[100px] bg-black rounded-md z-20">
              {defaultTokenData.map((token) => (
                <div
                  key={token.token}
                  onClick={() => handleTokenSelect(token.token)}
                  className="flex gap-2 items-center p-2 cursor-pointer hover:bg-gray-800"
                >
                  <Image
                    src={token.icon}
                    alt={token.token}
                    width={14}
                    height={14}
                    priority
                    quality={100}
                  />
                  <p className="text-white text-xs">{token.token}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Asset value input with Max button */}
        <div className="flex items-center">
          <label htmlFor="assetValue" className="sr-only">
            Enter Amount
          </label>
          <input
            id="assetValue"
            type="text"
            value={assetValue} // Use parent's state as controlled input
            onChange={handleAssetValueChange}
            className="text-end bg-transparent w-28 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            placeholder="Enter amount"
            inputMode="decimal"
          />
          {/* Max Button */}
          <button
            onClick={handleMaxClick}
            className="ml-2 bg-gray-200 hover:bg-gray-300 text-black px-2 py-1 rounded text-sm"
          >
            Max
          </button>
        </div>
      </div>

      {/* Wallet balance display */}
      <p className="text-xs text-gray-500 mb-2">
        {actionType === "withdraw" || actionType === "borrow" ? "Available Balance: " : "Wallet Balance: "}
        {actionType === "withdraw" || actionType === "borrow" ? (Number(availableBal) * 0.79) : walletBalance} {selectedToken.token}
      </p>

      {/* Price and Fiat Equivalent */}
      <div className="text-black text-xs flex justify-between">
        <p>{`1 ${selectedToken.token} = $${selectedToken.tokenPrice}`}</p>
        <p className="font-bold">≈ ${fiatEquivalent}</p>
      </div>
    </div>
  );
};

export default AssetSelector;
