import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { LiveGamlishBanner } from "@/components/LiveGamlishBanner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Gamlish · The Game of English",
  description: "Play a mission. Learn English. Save your score.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <LiveGamlishBanner />
        {children}
      </body>
    </html>
  );
}
