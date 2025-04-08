import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",})

export const metadata: Metadata = {
  title: "Figma Clone",
  description: "A minimalistic Figma clone built with Next.js and Liveblocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} bg-primary-grey-200`}
      >
        <Room>
        {children}
        </Room>
      </body>
    </html>
  );
}
