import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreProvider from "@/components/StoreProvider";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Veloura Luxury | Premium Jewellery",
  description: "Exquisite women's jewellery for the modern era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-body antialiased bg-ivory text-primary min-h-screen selection:bg-blush selection:text-primary flex flex-col`}>
        <StoreProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}

