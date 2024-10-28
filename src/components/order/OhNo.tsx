import Image from "next/image"
import Link from "next/link"

const OhNo = () => {
    return (
        <div>
            <div className="flex flex-col items-center gap-1 text-white/50">
                <div>
                    <Image
                        src={"/Eye.svg"}
                        alt="nothig"
                        width={80}
                        height={80}
                        priority
                        quality={100}
                    />
                </div>

                <div className="text-center text-[70px]">
                    <h3>uh-oh!</h3>
                </div>

                <div className="text-center text-3xl">
                    <p>There&apos;s nothing here.</p>
                </div>

                <div className="text-center text-3xl mt-4">
                    <p>Let's get things rolling—create your <br />
                        first order now and start your<br />
                        lending adventure!
                    </p>
                </div>

                <div className="flex gap-4 items-center text-white mt-6">
                    <Link href={"/create-order"} className="w-fit p-2 rounded-lg cursor-pointer bg-[#FF4D00] text-xs flex items-center gap-3">
                        Create Borrow Order
                        <Image
                            src={"/plusBtn.svg"}
                            alt="btn"
                            width={16}
                            height={16}
                            priority
                            quality={100}
                        />
                    </Link>

                    <Link href={"/create-order"} className="w-fit p-2 rounded-lg cursor-pointer bg-[#FF4D00] text-xs flex items-center gap-3">
                        Create Lend Order
                        <Image
                            src={"/plusBtn.svg"}
                            alt="btn"
                            width={16}
                            height={16}
                            priority
                            quality={100}
                        />
                    </Link>
                </div>

                <div className="mt-6">
                    <Image
                        src={"/white-logo-horizontal.svg"}
                        alt="logo"
                        width={320}
                        height={62}
                        // className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        priority
                        quality={100}
                    />
                </div>
            </div>         
        </div>
    )
}

export default OhNo