import Image from "next/image";

const MktIcons = () => {
  return (
    <div className="relative w-[200px] h-[174px]">
      {/* Ethereum at the center */}
      <Image
        src={"/Coin/Ethereum.png"}
        alt="Ethereum"
        width={91}
        height={91}
        className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        priority
        quality={100}
      />

      {/* Binance to the left */}
      <Image
        src={"/Coin/Binance.svg"}
        alt="Binance"
        width={97}
        height={97}
        className="absolute top-[58%] -left-5 transform -translate-y-1/2"
        priority
        quality={100}
      />

      {/* Cardano to the right */}
      <Image
        src={"/Coin/Cardano.svg"}
        alt="Cardano"
        width={80}
        height={80}
        className="absolute top-1/2 -right-5 transform -translate-y-1/2"
        priority
        quality={100}
      />

      {/* Bitcoin to the top left */}
      <Image
        src={"/Coin/BitCoin.svg"}
        alt="BitCoin"
        width={82}
        height={82}
        className="absolute top-0 left-0"
        priority
        quality={100}
      />

      {/* Stellar to the bottom left */}
      <Image
        src={"/Coin/Stellar.png"}
        alt="Stellar"
        width={65}
        height={65}
        className="absolute bottom-0 right-12"
        priority
        quality={100}
      />

       {/* Bitcoin2 to the top right */}
      <Image
        src={"/Coin/Cam2.png"}
        alt="bitcoin"
        width={65}
        height={65}
        className="absolute top-0 right-0"
        priority
        quality={100}
      />
    </div>
  );
};

export default MktIcons;
