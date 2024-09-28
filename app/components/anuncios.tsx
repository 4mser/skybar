'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { gsap } from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

export default function Anuncios() {
  const slideRefs = useRef<HTMLDivElement[]>([]);

  // Añadir elementos al array de referencias
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !slideRefs.current.includes(el)) {
      slideRefs.current.push(el);
    }
  };

  // Animación GSAP para los elementos del slider
  useEffect(() => {
    gsap.fromTo(
      slideRefs.current,
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

  return (
    <main className='pt-[120px] left-0 w-full overflow-hidden px-4'>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={false}
        pagination={{ clickable: true }}
        autoplay={false}
        navigation={false}
        modules={[Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link href={'/carta'}>
            <div
              ref={addToRefs}
              className='h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br flex items-center from-zinc-800 to-transparent'
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar.jpg"
                alt="Skybar"
                className='w-full h-full object-cover'
              />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={'/tragos'}>
            <div
              ref={addToRefs}
              className='h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br flex items-center from-zinc-800 to-transparent'
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar2.jpg"
                alt="Tragos"
                className='w-full h-full object-cover'
              />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={'/sushi'}>
            <div
              ref={addToRefs}
              className='h-52 overflow-hidden rounded-lg shadow-md bg-gradient-to-br flex items-center from-zinc-800 to-transparent'
            >
              <Image
                width={1200}
                height={800}
                src="/images/skybar3.jpg"
                alt="Sushi"
                className='w-full h-full object-cover'
              />
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </main>
  );
}
