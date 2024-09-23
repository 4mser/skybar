"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Asegúrate de tener tu token de Mapbox
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Mapa: React.FC = () => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const centerCoordinates: [number, number] = [-73.246955, -39.811583]; // Coordenadas de la ubicación
  const isUserInteracting = useRef(false); // Para detectar si el usuario está manipulando el mapa
  const rotationBearing = useRef(0);

  // Función para crear el marcador con una imagen
  const createCustomMarker = () => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = '55px';
    markerElement.style.height = '55px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.transform = '-translateY(20px)'

    // Imagen personalizada del marcador
    const img = document.createElement('img');
    img.src = '/images/neonarrow.png'; // Cambia esta ruta por la de tu imagen
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.padding = '3px';
    img.style.objectFit = 'cover';

    markerElement.appendChild(img);
    return markerElement;
  };

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    if (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/standard", // Usar el estilo estándar de Mapbox
      center: centerCoordinates, // Coordenadas del centro
      pitch: 60, // Vista inclinada
      zoom: 16, // Zoom inicial
      bearing: rotationBearing.current, // Sin rotación inicial
    });

    setMap(mapboxMap); // Guardar la instancia del mapa

    mapboxMap.on('load', () => {
      mapboxMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
      mapboxMap.setConfigProperty('basemap', 'showPointOfInterestLabels', false);

      // Crear y agregar el marcador
      const markerElement = createCustomMarker();
      markerRef.current = new mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat(centerCoordinates)
        .addTo(mapboxMap);

      // Manejar la rotación del mapa
      const rotateMap = () => {
        if (!isUserInteracting.current) {
          rotationBearing.current = (rotationBearing.current + 0.05) % 360;
          mapboxMap.setBearing(rotationBearing.current);
        }
        requestAnimationFrame(rotateMap);
      };

      // Detectar si el usuario está interactuando con el mapa
      mapboxMap.on('mousedown', () => (isUserInteracting.current = true));
      mapboxMap.on('mouseup', () => (isUserInteracting.current = false));

      requestAnimationFrame(rotateMap); // Iniciar la rotación continua
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
      <div
        ref={mapNode}
        style={{ height: "400px", borderRadius: "10px", overflow: "hidden" }}
      />
    </section>
  );
};

export default Mapa;
