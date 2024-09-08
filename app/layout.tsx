import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./components/providers/ReactQueryProvider";
import NextAuthProvider from "./components/providers/NextAuthProvider";
import { SocketProvider } from "./components/providers/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alochoona",
  description: "Let's communicate with each other :)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-slate-900`}
      >
        <NextAuthProvider>
          <SocketProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </SocketProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
