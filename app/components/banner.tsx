'use client'
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export default function Banner() {
  const slides = [
    { href: '/tragos', text: 'Conoce los tragos de autor', icon: '/icons/cocktail-glass.svg', gradient: 'from-teal-500 to-cyan-500' },
    { href: '/sushi', text: 'Explora la nueva barra de sushi', icon: '/icons/sushi.svg', gradient: 'from-cyan-500 to-indigo-500' },
    { href: '/carta', text: 'Descubre nuevos sabores', icon: '/icons/spaghetti.svg', gradient: 'from-indigo-500 to-fuchsia-500' },
    { href: '/carta', text: 'Date un gusto con nuestros postres', icon: '/icons/pie.svg', gradient: 'from-fuchsia-500 to-red-800' },
    { href: '/carta', text: 'Conoce nuestro menú vegano', icon: '/icons/vegan.svg', gradient: 'from-lime-600 to-green-900' },
  ];

  return (
    <main className="pt-[52px] w-full overflow-hidden">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.href}>
              <div className={`h-12 w-full bg-gradient-to-r ${slide.gradient} flex justify-center gap-2 px-4 py-2 items-center`}>
                <p>{slide.text}</p>
                <Image width={30} height={30} src={slide.icon} alt={slide.text} className="w-6" priority />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
