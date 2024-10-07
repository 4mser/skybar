'use client';
import Link from 'next/link';
import { useRef, useCallback } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow'; // Importar CSS para el efecto de coverflow
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules'; // Importar el módulo de coverflow
import Image from 'next/image';

export default function Anuncios() {
  const slideRefs = useRef<HTMLDivElement[]>([]);

  // Añadir elementos al array de referencias de forma controlada
  const addToRefs = useCallback((el: HTMLDivElement) => {
    if (el && !slideRefs.current.includes(el)) {
      slideRefs.current.push(el);
    }
  }, []);

  // Configuración de Swiper memorizada para evitar recreaciones innecesarias
  const swiperConfig = {
    effect: 'coverflow',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    modules: [EffectCoverflow, Autoplay],
    autoplay: { delay: 6000 },
  };

  return (
    <main className="w-full overflow-hidden p-4">
      <Swiper {...swiperConfig} className="mySwiper">
        {[
          { href: '/carta', src: '/images/skybar.jpg', alt: 'Skybar' },
          { href: '/tragos', src: '/images/skybar2.jpg', alt: 'Tragos' },
          { href: '/sushi', src: '/images/skybar3.jpg', alt: 'Sushi' },
        ].map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.href}>
              <div
                ref={addToRefs}
                className="h-52 overflow-hidden rounded-[10px] shadow-md bg-gradient-to-br from-zinc-800 to-transparent flex items-center"
              >
                <Image
                  width={1200}
                  height={800}
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  priority={index === 0} // Solo la primera imagen tiene prioridad
                  loading={index === 0 ? 'eager' : 'lazy'} // Cargar perezosamente las imágenes no prioritarias
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
