import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import "./globals.css";
import Navbar from "@/components/navbar";
import { SheetNavbar } from "@/components/sheetNavbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "ProjectPoke",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <header className="sticky top-0 z-50 w-full border-b-2 border-secondary bg-background/85 backdrop-blur">
            <div className="hidden sm:block">
              <Navbar />
            </div>
            <div className="flex items-center justify-center">
              <SheetNavbar />
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
