'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../context/DarkModeContext';
import AssistantDrawer from '../../components/AssistantDrawer'; // Asegúrate de que la ruta es correcta
import Modal from '../../components/modal'; // Importa el componente Modal

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string; // Añadir el campo de la imagen
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
  const { backgroundMode } = useDarkMode(); // Cambiamos a backgroundMode para reflejar los tres estados
  const barId = '66f067f56cc6f1ba2d5aee08'; // ID del bar

  // Estado para controlar el modal y el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchSubmenuData = async () => {
      try {
        const response: AxiosResponse<Menu[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`
        );

        const menus = response.data;
        const menu = menus[0];

        if (menu) {
          const submenuNameParam = Array.isArray(submenuName)
            ? submenuName[0]
            : submenuName;

          const submenu = menu.subMenus.find(
            (sub: SubMenu) =>
              sub.name.toLowerCase() === decodeURIComponent(submenuNameParam).toLowerCase()
          );

          if (submenu) {
            const sectionsWithAvailableProducts = submenu.sections
              .map((section: MenuSection) => {
                const availableProducts = section.products.filter(
                  (product: Product) => product.available
                );
                return availableProducts.length > 0
                  ? { ...section, products: availableProducts }
                  : null;
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

  const sanitizeTitle = (title: string): string =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  // Establecer la clase del fondo según el modo actual
  const backgroundClass = backgroundMode === 'dark'
    ? 'bg-[#0a0a0a]'
    : backgroundMode === 'light'
    ? ''
    : 'bg-slate-100';

  // Establecer las clases de texto y bordes según el tema
  const textAndBorderClass = backgroundMode === 'neon' ? 'text-black/80 border-black/30' : 'text-white border-white/20';

  return (
    <>
      {/* Barra de navegación deslizable en la parte superior */}
      <div
        className={`fixed top-12 border-b backdrop-blur-md left-0 w-full z-10 overflow-x-auto flex py-4 px-4 gap-3 ${backgroundClass} ${textAndBorderClass}`}
      >
        {sections.map((section, index) => (
          <button
            key={index}
            className={`text-[12px] py-3 px-4 border whitespace-nowrap rounded-[10px] ${textAndBorderClass}`}
            onClick={() => navigateToSection(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Mostrar mensaje si no hay secciones disponibles */}
      {/* {sections.length === 0 && (
        <div className="pt-56 text-center">
          <p className={`${textAndBorderClass}`}>
          </p>
        </div>
      )} */}

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
              className={`text-lg font-semibold flex items-center px-4 py-3 bg-gradient-to-br  ${backgroundMode === 'neon' ? 'from-cyan-500 to-teal-400 text-slate-100' : 'from-cyan-500/80 to-teal-500/10'}`} 
            >
              {section.name}
            </h2>
            <ul className="text-xs flex flex-col mb-3">
              {section.products.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`flex justify-between items-center px-4 py-1 mt-3 gap-8 modal-item cursor-pointer ${textAndBorderClass}`}
                  onClick={() => openModal(item)} // Abrir el modal con la info del producto
                >
                  <div className="flex items-center">
                    {item.imageUrl && (
                      <img
                      src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${item.imageUrl}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-[10px] mr-4"
                      />
                    )}
                    <div>
                      <h1 className={`font-semibold ${textAndBorderClass}`}>{item.name}</h1>
                      <p className={`font-normal opacity-70 ${textAndBorderClass}`}>{item.description}</p>
                    </div>
                  </div>
                  <div className={`min-w-20 border px-2 rounded-[8px] ${textAndBorderClass}`}>
                    <p className={`w-full text-sm text-center font-medium ${textAndBorderClass}`}>
                      ${item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Modal para mostrar el producto seleccionado */}
      {isModalOpen && selectedProduct && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            {selectedProduct.imageUrl && (
              <img
                src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${selectedProduct.imageUrl}`}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-[10px] mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="mb-4">{selectedProduct.description}</p>
            <p className="font-semibold">Precio: ${selectedProduct.price}</p>
          </div>
        </Modal>
      )}

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
