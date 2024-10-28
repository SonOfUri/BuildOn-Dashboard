import Image from 'next/image';
import React from 'react';
import { Btn } from './Btn';
import { useWeb3Modal } from '@web3modal/ethers/react';

// Define props type for TypeScript
interface PleaseConnectProps {
  text: string;
}

const PleaseConnect: React.FC<PleaseConnectProps> = ({ text }) => {
  const { open } = useWeb3Modal();

  return (
    <div className="h-screen flex items-center justify-center -mt-32">
      <div className="relative lg:w-1/2 w-full overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-tl from-[#1F1F1F] to-[#FF4D00] opacity-90 z-0"></div>

        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="w-[300px] h-[300px] bg-gradient-radial from-[#FFCFB4] to-[#1F1F1F]/10 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-20 px-6 py-6 rounded-3xl bg-[#1F1F1F]/30 backdrop-blur-lg text-center flex flex-col items-center justify-center space-y-6">
          <div>
            <Image
              src={"/wallet.svg"}
              alt="wallet icon"
              width={61}
              height={50}
              priority
              quality={100}
            />
          </div>

          {/* Text Prompt */}
          <div className="text-center mb-6">
            <p className="text-lg font-bold mb-2">Please, connect your wallet</p>
            <p className="text-white/80 font-thin">
              Please connect your wallet to {text}.
            </p>
          </div>

          {/* Connect Wallet Button */}
          <div onClick={() => open()} className="cursor-pointer">
            <Btn
              text={"Connect Wallet"}
              css="text-black bg-[#FF4D00CC] text-xl py-2 px-10 rounded-[75px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PleaseConnect;
