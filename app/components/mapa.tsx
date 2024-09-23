"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl, { Marker } from "mapbox-gl";

// Asegúrate de tener tu token de Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Mapa: React.FC = () => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const rotationBearing = useRef(0);
  const isUserInteracting = useRef(false); // Para detectar si el usuario está manipulando el mapa
  const markerRef = useRef<Marker | null>(null); // Referencia para el marcador

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
      pitch: 60, // Comienza en vista 3D inclinada
      zoom: 16, // Zoom inicial
      bearing: rotationBearing.current, // Inicialmente sin rotación
    });

    // Asegurarse de que se mantenga en el estilo 'dusk'
    mapboxMap.on('load', () => {
      mapboxMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
      mapboxMap.setConfigProperty('basemap', 'showPointOfInterestLabels', false);

      // Crear un elemento personalizado para el marcador
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.width = '55px';
      markerElement.style.height = '55px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.overflow = 'hidden';
      markerElement.style.border = '3px solid rgb(234, 179, 8)';
      markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';

      // Imagen personalizada para el marcador
      const img = document.createElement('img');
      img.src = '/path-to-your-image.jpg'; // Cambia esta ruta a la de tu imagen
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.borderRadius = '50%';
      img.style.padding = '3px';
      img.style.objectFit = 'cover';

      markerElement.appendChild(img);

      // Crear el marcador y añadirlo al mapa
      markerRef.current = new mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat(centerCoordinates)
        .addTo(mapboxMap);

      // Función para detectar interacción del usuario
      mapboxMap.on('mousedown', () => (isUserInteracting.current = true));
      mapboxMap.on('mouseup', () => (isUserInteracting.current = false));

      // Función para hacer que el mapa gire continuamente sobre su eje
      const rotateMap = () => {
        if (!isUserInteracting.current) {
          rotationBearing.current = (rotationBearing.current + 0.05) % 360; // Ajustar el incremento de bearing para suavidad
          mapboxMap.setBearing(rotationBearing.current); // Cambiar el bearing directamente
        }
        requestAnimationFrame(rotateMap); // Llamar la animación de nuevo para continuidad
      };

      // Iniciar la rotación continua
      requestAnimationFrame(rotateMap);
    });

    return () => {
      if (mapboxMap) {
        mapboxMap.remove();
      }
    };
  }, []);

  return (
    <section className="px-4 overflow-hidden pb-1">
      <div className="w-full flex justify-between py-2 items-center">
        <h2 className="py-2 font-semibold">Ubicación</h2>
      </div>
      <div className="z-4 absolute  p-2">
        <div className="backdrop-blur-custom p-3 rounded-lg overflow-hidden border border-white/10">
           <p className="text-xs">Piso 12 del casino Dreams Valdivia</p>
           <p className="text-xs">Carampangue #190</p>
        </div>
      </div>
      <div
        ref={mapNode}
        style={{ height: "400px", borderRadius: "10px", overflow: "hidden" }}
      >
      </div>
    </section>
  );
};

export default Mapa;
