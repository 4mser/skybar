"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useDarkMode } from "../context/DarkModeContext";

// Asegúrate de tener tu token de Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Mapa: React.FC = () => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const rotationBearing = useRef(0);
  const isUserInteracting = useRef(false); // Para detectar si el usuario está manipulando el mapa
  const { backgroundMode } = useDarkMode(); // Obtener el modo del tema

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    if (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    // Coordenadas para centrar el mapa: 39°48'41.3"S 73°14'46.7"W
    const centerCoordinates: [number, number] = [-73.246955, -39.811583];

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/standard", // Usar el estilo estándar de Mapbox
      center: centerCoordinates, // Coordenadas del centro
      pitch: 76, // Comienza en vista 3D inclinada
      zoom: 16, // Zoom inicial
      bearing: rotationBearing.current, // Inicialmente sin rotación
    });

    mapboxMap.on('load', () => {
      // Ajustar el lightPreset según el tema
      const lightPreset = backgroundMode === 'neon' ? 'light' : 'dusk';
      mapboxMap.setConfigProperty('basemap', 'lightPreset', lightPreset);
      mapboxMap.setConfigProperty('basemap', 'showPointOfInterestLabels', false);

      // Detectar interacción del usuario
      mapboxMap.on('mousedown', () => (isUserInteracting.current = true));
      mapboxMap.on('mouseup', () => (isUserInteracting.current = false));

      // Rotación continua del mapa
      const rotateMap = () => {
        if (!isUserInteracting.current) {
          rotationBearing.current = (rotationBearing.current + 0.05) % 360;
          mapboxMap.setBearing(rotationBearing.current);
        }
        requestAnimationFrame(rotateMap);
      };

      requestAnimationFrame(rotateMap);
    });

    return () => {
      if (mapboxMap) {
        mapboxMap.remove();
      }
    };
  }, [backgroundMode]); // Dependemos del backgroundMode para que cambie cuando el tema cambie

  return (
    <section className="relative overflow-hidden pb-1">
      <div className="w-full flex justify-between py-2 items-center">
        {/* <h2 className="py-2 font-semibold">Ubicación</h2> */}
      </div>
      <div className="z-4 absolute py-14 px-4">
        <div className="backdrop-blur-custom p-3 rounded-[10px] overflow-hidden border border-white/10">
          <p className="text-xs">Piso 12 del casino Dreams Valdivia.</p>
          <p className="text-xs">Carampangue #190</p>
        </div>
      </div>

      {/* Mapa */}
      <div
        ref={mapNode}
        className="w-full h-screen"
        style={{ overflow: "hidden" }}
      ></div>

      {/* Marcador en el centro */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white"
        ></div>
      </div>
    </section>
  );
};

export default Mapa;
