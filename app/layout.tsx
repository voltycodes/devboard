import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });
const vt323 = VT323({ subsets: ["latin"], weight: '400', variable: "--font-vt323" });
const spacemono = Space_Mono({ subsets: ["latin"], weight: '400', variable: "--font-spacemono" });


export const metadata: Metadata = {
  title: "Devboard - Your Developer Profile",
  description: "Check out your developer profile stats on Devboard. It's a fun way to track your progress and share your achievements with the world.",
  metadataBase: new URL('https://vc-devboard.vercel.app/'),
  openGraph: {
    type: "website",
    url: "https://vc-devboard.vercel.app",
    title: "Devboard - Your Developer Profile",
    description: "Check out your developer profile stats on Devboard. It's a fun way to track your progress and share your achievements with the world.",
    images: "/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@voltycodes",
    title: "Devboard - Your Developer Profile",
    description: "Check out your developer profile stats on Devboard. It's a fun way to track your progress and share your achievements with the world.",
    images: "/og-image.png",
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, vt323.variable, spacemono.variable, "dark")}>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
