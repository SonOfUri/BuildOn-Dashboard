import { Header } from "@/components/shared/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lendbit | P2P Lending",
    description: "Lendbit, Your gateway to seamless peer-to-peer crypto lending & borrowing. Secure, transparent, and flexible. Unlock the full potential of your digital assets.",
    icons: "./favicon.ico",
    openGraph: {
        title: "Lendbit | P2P Lending",
        description: "Lendbit, Your gateway to seamless peer-to-peer crypto lending & borrowing. Secure, transparent, and flexible. Unlock the full potential of your digital assets.",
        images: `/public/lendbit-oranglogo-horizontal.png`, 
    },
    other: {},
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
     return (
        <section className="relative top-8 sm:top-15 mx-auto w-[91%] text-white">
            <Header />
            <main className="mt-6 pb-4">
                {children}
            </main>
        </section>
    );
}
