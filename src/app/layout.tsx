import type { Metadata } from "next";
import { Share_Tech_Mono, Zen_Dots, Outfit} from 'next/font/google';
import "./globals.css";
import { RadixTheme } from "@/context/radix";
import Background from "@/components/shared/background/background";
import { Web3Modal } from "@/context/web3Modal";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lendbit | P2P Lending",
  description: "Lendbit, Your gateway to seamless peer-to-peer crypto lending & borrowing. Secure, transparent, and flexible. Unlock the full potential of your digital assets.",
  icons: "./favicon.ico"
};
const shareTechMono = Share_Tech_Mono({
  weight: '400',  
  subsets: ['latin'], 
});

const zenDots = Zen_Dots({
  weight: '400', 
  subsets: ['latin'],
  variable: "--font-zenDots",

})

const outfit = Outfit({
  weight: ["400","500", "600"],  
  subsets: ['latin'],
  variable: "--font-outfit",
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`overflow-hidden w-full`}
      >
       
        <RadixTheme>
          <Web3Modal>
            <section className={`${shareTechMono.className} ${zenDots.variable} ${outfit.variable} antialiased w-full relative px-4 py-2 bg-black`}
            >
              <Background /> 
                <main className="w-full h-screen overflow-y-auto absolute left-0 top-0 z-10 mb-6 sm:mb-0">
                  {children}
                </main>
            </section>
            <Toaster richColors position="top-right" />
          </Web3Modal> 
        </RadixTheme>
           
      </body>
    </html>
  );
}
