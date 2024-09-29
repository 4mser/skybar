'use client'
import Banner from "./components/banner";
import Anuncios from "./components/anuncios";
import Cartas from "./components/cartas";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const BokehBackground = dynamic(() => import('./components/blackhole'), {
  ssr: false,
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Solo se monta en el cliente
  }, []);

  if (!isMounted) return null; // No renderizar nada en SSR

  return (
    <main>
      {/* <Topbar /> */}
      <Banner />
      <Anuncios />
      <Cartas />
      <BokehBackground />
      <br />
      {/* <Mapa /> */}
      {/* <Contacto /> */}
    </main>
  );
}
