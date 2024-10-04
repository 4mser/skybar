// app/components/Cartas.tsx

'use client';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';

interface SubMenu {
  name: string;
  // Si hay otras propiedades, puedes agregarlas aquí
}

interface Menu {
  subMenus: SubMenu[];
}

export default function Cartas() {
  const menuRefs = useRef<HTMLDivElement[]>([]);
  const [submenus, setSubmenus] = useState<SubMenu[]>([]);

  const barId = '66f067f56cc6f1ba2d5aee08';
  const router = useRouter();

  // Añadir elemento a las referencias
  const addToRefs = useCallback((el: HTMLDivElement) => {
    if (el && !menuRefs.current.includes(el)) {
      menuRefs.current.push(el);
    }
  }, []);

  // Configuración de Swiper memorizada
  const swiperConfig = useMemo(
    () => ({
      spaceBetween: 10,
      slidesPerView: 2.5,
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

    return () => ctx.revert();
  }, [submenus]);

  // Fetch submenus desde la API sin necesidad de token
  useEffect(() => {
    const fetchSubmenus = async () => {
      try {
       
        const response: AxiosResponse<Menu[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`
        );
        const menus = response.data;

        const menu = menus[0];

        if (menu) {
          setSubmenus(menu.subMenus);
        } else {
          console.error('No se encontró un menú para el bar proporcionado');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // **Manejamos errores específicos de la respuesta**
            console.error(`Error ${error.response.status}: ${error.response.data}`);
          } else {
            // **Errores relacionados con la solicitud pero sin respuesta**
            console.error('Error al obtener submenús:', error.message);
          }
        } else {
          console.error('Error inesperado:', error);
        }
      }
    };

    fetchSubmenus();
  }, [barId]);

  

  // Arreglo de imágenes para usar
  const images = ['/images/comida.jpg', '/images/tragos2.png', '/images/room.jpeg'];

  return (
    <main className="w-full px-4">
      <p className="py-2 font-semibold">Menús principales</p>

      <Swiper {...swiperConfig} className="mySwiper">
        {submenus.map((submenu, index) => (
          <SwiperSlide key={index}>
            <Link href={`/menu/${encodeURIComponent(submenu.name)}`}>
              <div ref={addToRefs} className="overflow-hidden rounded-[10px] shadow-lg">
                <Image
                  width={700}
                  height={800}
                  src={images[index % images.length]}
                  alt={submenu.name}
                  className="w-full h-48 object-cover rounded-md transition-transform duration-500 hover:scale-105"
                  priority={index === 0}
                />
              </div>
              <p className="text-xs font-extralight py-1">{submenu.name}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
