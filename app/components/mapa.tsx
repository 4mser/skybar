"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// Asegúrate de tener tu token de Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Mapa: React.FC = () => {
  const mapNode = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    if (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    // Coordenadas para centrar el mapa: 39°48'41.3"S 73°14'46.7"W
    const centerCoordinates: [number, number] = [-73.2463, -39.8115];

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/standard", // Estilo Mapbox Standard
      center: centerCoordinates, // Coordenadas del centro
      zoom: 10, // Nivel de zoom inicial
      pitch: 0, // Empieza sin inclinación (vista superior)
      bearing: 0, // Sin rotación inicial
    });

    // Espera a que el estilo del mapa se cargue
    mapboxMap.on('load', () => {
      // Cambiar el preset al 'dusk'
      mapboxMap.setConfigProperty('basemap', 'lightPreset', 'dusk');

      // Después de 2 segundos, animamos la inclinación y el giro
      setTimeout(() => {
        mapboxMap.flyTo({
          pitch: 60, // Inclinación del mapa (60 grados para vista 3D)
          zoom: 16, // Zoom
          speed: 0.8, // Velocidad de la animación
          curve: 1, // Curvatura para suavizar la animación
          easing: (t) => t, // Función de easing (linear)
        });
      }, 0); // La animación comienza después de 2 segundos
    });

    return () => {
      mapboxMap.remove();
    };
  }, []);

  return (
    <section className="px-4 overflow-hidden pb-1">
      <div className="w-full flex justify-between py-2 items-center">
        <h2 className="font-medium text-lg text-black/70 xl:text-[2vw]">
          Puntos de venta
        </h2>
      </div>
      <div
        ref={mapNode}
        style={{ height: "400px", borderRadius: "10px", overflow: "hidden" }}
      />
    </section>
  );
};

export default Mapa;
