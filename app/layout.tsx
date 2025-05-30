import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorVerse NFT Platform",
  description: "A Token-Powered NFT Platform with Creator Rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
