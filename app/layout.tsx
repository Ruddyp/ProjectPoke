import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Navbar from "@/components/navbar";
import { SheetNavbar } from "@/components/sheetNavbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ProjectPoke",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={cn(
          "relative h-full flex flex-col font-sans bg-background antialiased",
          fontSans.variable,
        )}
      >
        <div className="relative flex flex-1 flex-col bg-transparent h-full">
          <header className="sticky top-0 z-50 w-full border-b-2 border-secondary bg-background/85 backdrop-blur shrink-0">
            <div className="hidden sm:block">
              <Navbar />
            </div>
            <div className="flex items-center justify-center">
              <SheetNavbar />
            </div>
          </header>

          <main className="flex-1 h-full overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
