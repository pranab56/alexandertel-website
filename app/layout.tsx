import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orienco Rapid Delivery",
  description: "Orienco Rapid Delivery - Fast and reliable delivery services",
};

import SmoothScroll from "@/components/shared/SmoothScroll";
import Cursor from "@/components/shared/Cursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black selection:bg-primary selection:text-white">
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
