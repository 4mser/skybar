'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../context/DarkModeContext';
import AssistantDrawer from '../../components/AssistantDrawer'; 
import Modal from '../../components/modal'; 
import { FaHeart, FaRegHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa'; 
import { addFavorite, removeFavorite, getFavoriteProducts } from '../../services/api'; 
import axios from 'axios';
import { RiSearch2Line, RiCloseFill } from "react-icons/ri";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string;
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
  const { backgroundMode } = useDarkMode();
  const barId = '66f067f56cc6f1ba2d5aee08';

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]); 

  const [searchInputVisible, setSearchInputVisible] = useState<boolean>(false); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 

  // Estado para controlar las secciones abiertas (para acordeón)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

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
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`
        );
        const menus: Menu[] = response.data;
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

                // Ordenar productos para que los que tienen imagen aparezcan primero
                availableProducts.sort((a, b) => {
                  if (a.imageUrl && !b.imageUrl) return -1;
                  if (!a.imageUrl && b.imageUrl) return 1;
                  return 0;
                });

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
      } catch (error) {
        console.error('Error al obtener datos del submenú:', error);
      }
    };

    fetchSubmenuData();

    const fetchFavorites = async () => {
      try {
        const favoriteProductIds = await getFavoriteProducts();
        setFavoriteProducts(favoriteProductIds.map((product: Product) => product._id || ''));
      } catch (error) {
        console.error('Error al obtener productos favoritos:', error);
      }
    };

    fetchFavorites();
  }, [submenuName]);

  // Inicializar las secciones abiertas cuando cambian las secciones
  useEffect(() => {
    const initialOpenSections: { [key: string]: boolean } = {};
    sections.forEach((section) => {
      initialOpenSections[section.name] = true; // O false, dependiendo si quieres que estén abiertas por defecto
    });
    setOpenSections(initialOpenSections);
  }, [sections]);

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

  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const backgroundClass = backgroundMode === 'dark'
    ? 'bg-[#0a0a0a]'
    : backgroundMode === 'light'
    ? ''
    : 'bg-slate-100';

  const textAndBorderClass = backgroundMode === 'neon' ? 'text-black/80 border-black/30' : 'text-white border-white/20';

  // Función para agregar/eliminar favoritos
  const toggleFavorite = async (productId: string) => {
    const isFavorite = favoriteProducts.includes(productId);

    if (!localStorage.getItem('token')) {
      alert('Debes iniciar sesión para guardar productos en favoritos');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(productId);
        setFavoriteProducts(favoriteProducts.filter((id) => id !== productId));
      } else {
        await addFavorite(productId);
        setFavoriteProducts([...favoriteProducts, productId]);
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  // Filtrado de productos basado en el término de búsqueda y ordenamiento
  const filteredSections = sections
    .map((section: MenuSection) => {
      const filteredProducts = section.products.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Ordenar productos para que los que tienen imagen aparezcan primero
      filteredProducts.sort((a, b) => {
        if (a.imageUrl && !b.imageUrl) return -1;
        if (!a.imageUrl && b.imageUrl) return 1;
        return 0;
      });

      return {
        ...section,
        products: filteredProducts,
      };
    })
    .filter((section: MenuSection) => section.products.length > 0); 

  return (
    <>
      <div
        className={`fixed filtros top-12 border-b backdrop-blur-md left-0 w-full z-10 overflow-x-auto flex py-4 px-4 gap-3 ${backgroundClass} ${textAndBorderClass}`}
      >
        {/* Icono de búsqueda y input */}
        <div className="relative flex items-center">
          <button
            onClick={() => setSearchInputVisible(!searchInputVisible)}
            className="mr-4"
          >
            {searchInputVisible ? (
              <RiCloseFill className={`${textAndBorderClass} text-xl`} />
            ) : (
              <RiSearch2Line className={`${textAndBorderClass} text-xl`} />
            )}
          </button>
          {searchInputVisible && (
            <input
              type="text"
              className={`border px-2 py-1 rounded-full bg-white/10 ${textAndBorderClass}`}
              placeholder="Buscar productos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>

        {sections.map((section: MenuSection, index: number) => (
          <button
            key={index}
            className={`text-[12px] py-3 px-4 border whitespace-nowrap rounded-[10px] ${textAndBorderClass}`}
            onClick={() => navigateToSection(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      <div className="pt-[109px]">
        {filteredSections.map((section: MenuSection, index: number) => (
          <motion.div
            key={index}
            id={sanitizeTitle(section.name)}
            className="mt-4"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            variants={variants}
          >
            <div
              className={`flex justify-between items-center px-4 py-3 bg-gradient-to-br ${backgroundMode === 'neon' ? 'from-cyan-500 to-teal-400 text-slate-100' : 'from-cyan-500/80 to-teal-500/10'} cursor-pointer`}
              onClick={() => toggleSection(section.name)}
            >
              <h2 className="text-lg font-semibold">{section.name}</h2>
              {openSections[section.name] ? (
                <FaChevronUp />
              ) : (
                <FaChevronDown />
              )}
            </div>
            {openSections[section.name] && (
              <ul className="text-xs flex flex-col mb-3">
                {section.products.map((item: Product, itemIndex: number) => (
                  <li
                    key={itemIndex}
                    className={`flex justify-between items-center px-4 py-1 mt-3 gap-8 modal-item cursor-pointer ${textAndBorderClass}`}
                    onClick={() => openModal(item)}
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
                    <div className="flex items-center">
                      <div className={`min-w-20 border px-2 rounded-[8px] ${textAndBorderClass}`}>
                        <p className={`w-full text-sm text-center font-medium ${textAndBorderClass}`}>
                          ${item.price}
                        </p>
                      </div>
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(item._id || '');
                        }}
                        className="ml-4"
                      >
                        {favoriteProducts.includes(item._id || '') ? (
                          <FaHeart className="text-red-500 cursor-pointer text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 cursor-pointer text-lg" />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

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
            <p className="font-semibold">Precio: ${selectedProduct.price.toLocaleString('es-CL')}</p>

            <div
              onClick={() => toggleFavorite(selectedProduct._id || '')}
              className="mt-4"
            >
              {favoriteProducts.includes(selectedProduct._id || '') ? (
                <FaHeart className="text-red-500 cursor-pointer text-2xl" />
              ) : (
                <FaRegHeart className="text-gray-400 cursor-pointer text-2xl" />
              )}
            </div>
          </div>
        </Modal>
      )}

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
