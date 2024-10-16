import type { Metadata } from "next";
import "./globals.css";
import Topbar from "./components/topbar"; 
import dynamic from "next/dynamic";
import { DarkModeProvider } from './context/DarkModeContext'; // Importamos el proveedor
import { AuthProvider } from "./context/AuthContext";
import AssistantDrawer from "./components/AssistantDrawer";

const BokehBackground = dynamic(() => import("./components/blackhole"), {
  ssr: false,
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

  const barId = '66f067f56cc6f1ba2d5aee08'; // Reemplaza con tu barId real

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
      >
        {/* Proveedor de DarkMode para toda la app */}
        <AuthProvider>
          <DarkModeProvider>
            <BokehBackground />
            <Topbar />
            <AssistantDrawer barId={barId} />
            {children}
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
