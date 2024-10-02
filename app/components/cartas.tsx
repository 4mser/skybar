'use client';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Cartas() {
  const menuRefs = useRef<HTMLDivElement[]>([]);

  // Añadir elemento a las referencias, uso de useCallback para memorizar la función
  const addToRefs = useCallback((el: HTMLDivElement) => {
    if (el && !menuRefs.current.includes(el)) {
      menuRefs.current.push(el);
    }
  }, []);

  // Configuración de Swiper memorizada
  const swiperConfig = useMemo(
    () => ({
      spaceBetween: 10,
      slidesPerView: 2.5, // Mostrar 3 cartas a la vez
      modules: [Autoplay],
      autoplay: { delay: 3000, disableOnInteraction: false },
      loop: false,
    }),
    []
  );

  // Animación con GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRefs.current,
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
        }
      );
    });

    return () => ctx.revert(); // Limpiar animaciones al desmontar
  }, []);

  return (
    <main className="w-full px-4">
      <p className="py-2 font-semibold">Menús principales</p>

      <Swiper {...swiperConfig} className="mySwiper">
        {[
          { href: '/menu', src: '/images/comida.jpg', alt: 'Comida', text: 'Menú' },
          { href: '/tragos', src: '/images/tragos2.png', alt: 'Tragos', text: 'Tragos' },
          { href: '/room', src: '/images/room.jpeg', alt: 'Room Service', text: 'Room Service' },
        ].map((item, index) => (
          <SwiperSlide key={index}>
            <Link href={item.href}>
              <div ref={addToRefs} className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  width={700}
                  height={800}
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105"
                  priority={index === 0} // Solo la primera imagen tiene prioridad
                />
              </div>
              <p className="text-xs font-extralight py-1">{item.text}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
