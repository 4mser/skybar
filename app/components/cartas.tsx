'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export default function Cartas() {
  const menuRefs = useRef<HTMLDivElement[]>([]);

  // Añadir elemento a las referencias, uso de useCallback para memorizar la función
  const addToRefs = useCallback((el: HTMLDivElement) => {
    if (el && !menuRefs.current.includes(el)) {
      menuRefs.current.push(el);
    }
  }, []);

  // Animación con GSAP, uso de gsap.context para manejo seguro de animaciones
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRefs.current,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
        }
      );
    });

    return () => ctx.revert(); // Limpiar animaciones al desmontar
  }, []);

  return (
    <main className="w-full absolute">
      <p className="px-4 py-2 font-semibold">Menús principales</p>

      <div className="overflow-x-auto flex space-x-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-4">
        {/* Menú */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href="/menu">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                width={700}
                height={800}
                src="/images/comida.jpg"
                alt="Comida"
                className="w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105"
                priority // Optimización de carga
              />
            </div>
            <p className="text-xs font-extralight py-1">Menú</p>
          </Link>
        </div>

        {/* Tragos */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href="/tragos">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                width={700}
                height={800}
                src="/images/tragos2.png"
                alt="Tragos"
                className="w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            <p className="text-xs font-extralight py-1">Tragos</p>
          </Link>
        </div>

        {/* Room Service */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href="/room">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <Image
                width={700}
                height={800}
                src="/images/room.jpeg"
                alt="Room Service"
                className="w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            <p className="text-xs font-extralight py-1">Room Service</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
