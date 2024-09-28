'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cartas() {
  const menuRefs = useRef<HTMLDivElement[]>([]);

  // Animación con GSAP cuando los elementos entran en la vista
  useEffect(() => {
    gsap.fromTo(
      menuRefs.current,
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2, // Animar los elementos uno tras otro
      }
    );
  }, []);

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !menuRefs.current.includes(el)) {
      menuRefs.current.push(el);
    }
  };

  return (
    <main className='pt-3 left-0 w-full'>
      <p className='px-4 py-2 font-semibold'>Menús principales</p>

      {/* Contenedor con overflow-x y desplazamiento suave */}
      <div className="overflow-x-auto flex space-x-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-4">
        {/* Menú */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href={'/menu'}>
            <div className='overflow-hidden rounded-lg shadow-lg'>
              <Image width={700} height={800} src="/images/comida.jpg" alt="Comida" className='w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105' />
            </div>
            <p className='text-xs font-extralight py-1'>Menú</p>
          </Link>
        </div>

        {/* Tragos */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href={'/tragos'}>
            <div className='overflow-hidden rounded-lg shadow-lg'>
              <Image width={700} height={800} src="/images/tragos2.png" alt="Tragos" className='w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105' />
            </div>
            <p className='text-xs font-extralight py-1'>Tragos</p>
          </Link>
        </div>

        {/* Room Service */}
        <div className="w-[38%] snap-center shrink-0" ref={addToRefs}>
          <Link href={'/room'}>
            <div className='overflow-hidden rounded-lg shadow-lg'>
              <Image width={700} height={800} src="/images/room.jpeg" alt="Room Service" className='w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105' />
            </div>
            <p className='text-xs font-extralight py-1'>Room Service</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
