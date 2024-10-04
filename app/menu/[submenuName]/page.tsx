// app/menu/[submenuName]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../context/DarkModeContext';
import AssistantDrawer from '../../components/AssistantDrawer'; // Asegúrate de que la ruta es correcta

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface MenuSection {
  name: string;
  products: Product[];
}

interface SubMenu {
  name: string;
  sections: MenuSection[];
}

interface Menu {
  subMenus: SubMenu[];
}

const Page: React.FC = () => {
  const { submenuName } = useParams();
  const [sections, setSections] = useState<MenuSection[]>([]);
  const { isDarkBackground } = useDarkMode();
  const barId = '66f067f56cc6f1ba2d5aee08'; // ID del bar

  useEffect(() => {
    const fetchSubmenuData = async () => {
      try {

        const response: AxiosResponse<Menu[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`,
        );

        const menus = response.data;
        const menu = menus[0];

        if (menu) {
          // Aseguramos que submenuNameParam es un string
          const submenuNameParam = Array.isArray(submenuName)
            ? submenuName[0]
            : submenuName;

          const submenu = menu.subMenus.find(
            (sub: SubMenu) =>
              sub.name.toLowerCase() === decodeURIComponent(submenuNameParam).toLowerCase()
          );

          if (submenu) {
            // Filtrar productos disponibles y excluir secciones sin productos
            const sectionsWithAvailableProducts = submenu.sections
              .map((section: MenuSection) => {
                const availableProducts = section.products.filter(
                  (product: Product) => product.available
                );
                // Retornar la sección solo si tiene productos disponibles
                if (availableProducts.length > 0) {
                  return {
                    ...section,
                    products: availableProducts,
                  };
                } else {
                  // Retornar null si no hay productos disponibles en esta sección
                  return null;
                }
              })
              .filter((section): section is MenuSection => section !== null);

            setSections(sectionsWithAvailableProducts);
          } else {
            console.error('Submenú no encontrado');
          }
        } else {
          console.error('No se encontró un menú para el bar proporcionado');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error al obtener datos del submenú:', error.message);
        } else {
          console.error('Error inesperado:', error);
        }
      }
    };

    fetchSubmenuData();
  }, [submenuName]);

  // Función para limpiar el título y usarlo como id
  const sanitizeTitle = (title: string): string =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Función para navegar a una sección
  const navigateToSection = (title: string) => {
    const sectionId = sanitizeTitle(title);
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      window.scrollTo({
        top: sectionElement.offsetTop - 134,
        behavior: 'smooth',
      });
    }
  };

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Barra de navegación deslizable en la parte superior */}
      <div
        className={`fixed top-12 border-b border-white/20 backdrop-blur-md left-0 w-full z-10 overflow-x-auto flex py-4 px-4 gap-3 ${
          isDarkBackground ? 'bg-[#0a0a0a]' : 'bg-transparent'
        }`}
      >
        {sections.map((section, index) => (
          <button
            key={index}
            className="text-[12px] py-3 px-4 border whitespace-nowrap border-white/20 rounded-[10px]"
            onClick={() => navigateToSection(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Mostrar mensaje si no hay secciones disponibles */}
      {sections.length === 0 && (
        <div className="pt-56 text-center">
          <p>No hay productos disponibles en este momento.</p>
        </div>
      )}

      {/* Contenido principal del menú */}
      <div className="pt-[109px]">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            id={sanitizeTitle(section.name)}
            className="mt-4"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            variants={variants}
          >
            <h2
              className={`text-lg font-semibold flex items-center px-4 py-3 bg-gradient-to-br from-cyan-500/80 to-teal-500/10`}
            >
              {section.name}
            </h2>
            <ul className="text-xs flex flex-col mb-3">
              {section.products.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex justify-between items-center px-4 py-1 mt-3 gap-8"
                >
                  <div>
                    <h1 className="font-semibold">{item.name}</h1>
                    <p className="font-normal opacity-70">{item.description}</p>
                  </div>
                  <div className={`min-w-20 border px-2 rounded-[8px]`}>
                    <p className="w-full text-sm text-center font-medium">
                      ${item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Assistant Drawer */}
      <AssistantDrawer
        barId={barId}
        submenuName={decodeURIComponent(
          Array.isArray(submenuName) ? submenuName[0] : submenuName
        )}
      />
    </>
  );
};

export default Page;
