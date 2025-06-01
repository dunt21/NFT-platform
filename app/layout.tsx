import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFT Creator Platform",
  description: "Where creators mint their own nft's",
  generator: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
