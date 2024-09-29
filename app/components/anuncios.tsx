'use client';
import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';
import 'swiper/css';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

export default function Anuncios() {
  const slideRefs = useRef<HTMLDivElement[]>([]);

  // Añadir elementos al array de referencias, memorizado con useCallback
  const addToRefs = useCallback((el: HTMLDivElement) => {
    if (el && !slideRefs.current.includes(el)) {
      slideRefs.current.push(el);
    }
  }, []);

  // Animación GSAP, uso de gsap.context para manejar el ciclo de vida de la animación
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        slideRefs.current,
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

    return () => ctx.revert(); // Limpiar animación al desmontar el componente
  }, []);

  return (
    <main className="w-full overflow-hidden p-4">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link href="/carta">
            <div
              ref={addToRefs}
              className="h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-zinc-800 to-transparent flex items-center"
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar.jpg"
                alt="Skybar"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href="/tragos">
            <div
              ref={addToRefs}
              className="h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-zinc-800 to-transparent flex items-center"
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar2.jpg"
                alt="Tragos"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href="/sushi">
            <div
              ref={addToRefs}
              className="h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-zinc-800 to-transparent flex items-center"
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar3.jpg"
                alt="Sushi"
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </main>
  );
}
