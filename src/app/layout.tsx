import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AWPClickSound from "@/components/AWPClickSound";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkinTrade - CS2 Skin Marketplace",
  description:
    "CS2 скин худалдааны маркет. Аюулгүй, хурдан, хямд үнээр скин худалдаж аваарай.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className={`${inter.className} bg-cs-bg text-cs-light min-h-screen antialiased`}>
        <AppProvider>
          <AWPClickSound />
          <Navbar />
          <main className="pt-14 min-h-screen relative">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
