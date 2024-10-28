import Image from "next/image";

export default function Background() {
    return (
        <section className="w-full min-h-screen bg-cover relative z-0 overflow-hidden bg-black">
            <Image
                className="object-center" 
                src="/bg.png"
                alt="background"
                layout="fill"
                priority
                quality={100}
            />
        </section>
    );
}

