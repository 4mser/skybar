import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Topbar from "./components/topbar"; 
import dynamic from "next/dynamic";
import { DarkModeProvider } from './context/DarkModeContext'; // Importamos el proveedor

const BokehBackground = dynamic(() => import("./components/blackhole"), {
  ssr: false,
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Skybar Valdivia",
  description: "El bar más alto del sur de Chile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta property="og:title" content="Skybar" />
          <meta property="og:description" content="El bar mas alto del sur de Chile." />
          <meta property="og:image" content="/images/skybar2.jpg" />
          <meta property="og:url" content="https://skybar-ten.vercel.app" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Skybar" />
          <meta name="twitter:description" content="El bar mas alto del sur de Chile." />
          <meta name="twitter:image" content="/images/skybar2.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Proveedor de DarkMode para toda la app */}
        <DarkModeProvider>
          <BokehBackground />
          <Topbar />
          {children}
        </DarkModeProvider>
      </body>
    </html>
  );
}
