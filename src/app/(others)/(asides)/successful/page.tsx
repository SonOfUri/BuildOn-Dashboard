import { Btn } from "@/components/shared/Btn";
import Image from "next/image";
import Link from "next/link";

export default function SuccessfulPage() {
    return (
        <div className="h-screen flex items-center">
            <div className="relative font-semibold w-96 overflow-hidden rounded-3xl u-class-shadow">
            {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tl from-[#1F1F1F] to-[#FF4D00] opacity-90 z-0"></div>
                
                {/* Radial Gradient Circle */}
                <div className="absolute inset-0 flex justify-center items-center z-10">
                    <div className="w-[300px] h-[300px] bg-gradient-radial from-[#FFCFB4] to-[#1F1F1F]/10 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="relative z-20 px-6 py-3 rounded-3xl bg-[#1F1F1F]/30 backdrop-blur-lg">
                    {/* Logo */}
                    <div className="py-4">
                        <div className="mt-4">
                            <Image
                                src={"/logoW.png"}
                                alt="logo"
                                width={61}
                                height={50}
                                priority
                                quality={100}
                                className=""
                            />
                        </div>

                        {/* Circular Icon with Arrows */}
                        <div className="justify-center w-full flex my-10 relative">
                            {/* Left Arrow */}
                            <div className="flex items-start z-30">
                                <Image
                                    src={"/arrow.png"}
                                    alt="logo"
                                    width={61}
                                    height={50}
                                    priority
                                    quality={100}
                                    className="absolute -top-2 left-[25%] opacity-80"
                                />
                            </div>

                            {/* Central Circle */}
                            <div className="relative rounded-full p-3 bg-white/10 bg-gradient-to-r from-[#FF99E71A] to-[#5DF4CE1A] z-20">
                                <div className="rounded-full p-11 bg-gradient-to-r from-white/80 to-white/0"></div>
                            </div>

                            {/* Right Arrow */}
                            <div className="flex items-end z-30">
                                <Image
                                    src={"/arrow.svg"}
                                    alt="logo"
                                    width={61}
                                    height={50}
                                    priority
                                    quality={100}
                                    className="absolute -bottom-1 right-[25%] opacity-80"
                                />
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-4xl text-white mt-6">
                            <p>Order Created Successfully</p>
                        </div>

                        <div className="text-sm font-normal text-[#aaa] my-6">
                            <p>Borrow, Lend and Provide Liquidity <br />to others on Lendbit</p>
                        </div>
                    </div>
                    
                    {/* Marketplace Button */}
                    <div className="mt-2">
                        <Link href={"/marketplace"} className="cursor-pointer">
                            <Btn
                                text={"Marketplace"}
                                css="text-black bg-[#FF4D00CC] text-xl w-full py-6 rounded-[75px] flex items-center justify-center"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
