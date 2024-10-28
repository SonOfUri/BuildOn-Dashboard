import { Header } from "@/components/shared/Header";

export default function OtherScreensLayout({
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
