'use client';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import axios, { AxiosResponse } from 'axios';
import { useDarkMode } from '../context/DarkModeContext';

interface SubMenu {
  name: string;
}

interface Menu {
  subMenus: SubMenu[];
}

export default function Cartas() {
  const [submenus, setSubmenus] = useState<SubMenu[]>([]);

  const barId = '66f067f56cc6f1ba2d5aee08';

  // Configuración de Swiper memorizada
  const swiperConfig = useMemo(
    () => ({
      spaceBetween: 0,
      slidesPerView: 2.5,
      loop: false,
    }),
    []
  );

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
            console.error(`Error ${error.response.status}: ${error.response.data}`);
          } else {
            console.error('Error al obtener submenús:', error.message);
          }
        } else {
          console.error('Error inesperado:', error);
        }
      }
    };

    fetchSubmenus();
  }, [barId]);

  const { backgroundMode } = useDarkMode(); // Obtener el modo del tema

  // Arreglo de imágenes para usar
  const images = ['/images/tragos2.png', '/images/comida.jpg', '/images/room.jpeg'];

  return (
    <main className={`w-full px-2 ${backgroundMode === 'neon' && 'text-black/80'}`}>
      <p className="py-2 px-2 font-semibold">Menús principales</p>

      <Swiper {...swiperConfig} className="mySwiper">
        {submenus.map((submenu, index) => (
          <SwiperSlide key={index} className='p-2'>
            <Link href={`/menu/${encodeURIComponent(submenu.name)}`}>
              <div className="overflow-hidden rounded-[10px] shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Image
                  width={700}
                  height={800}
                  src={images[index % images.length]}
                  alt={submenu.name}
                  className="w-full h-48 object-cover rounded-md"
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
