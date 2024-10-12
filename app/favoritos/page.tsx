'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { removeFavorite, getFavoriteProducts } from '../services/api';
import Image from 'next/image';
import { useDarkMode } from '../context/DarkModeContext'; // Importamos useDarkMode

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string;
}

const FavoritesPage: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Obtenemos el modo de fondo desde el contexto
  const { backgroundMode } = useDarkMode();

  // Definimos las clases de fondo y texto según el modo de fondo
  const backgroundClass =
    backgroundMode === 'dark'
      ? 'bg-[#0a0a0a]'
      : backgroundMode === 'light'
      ? ''
      : 'bg-slate-100';

  const textAndBorderClass =
    backgroundMode === 'neon'
      ? 'text-black/80 border-black/30'
      : 'text-white border-white/20';

  // Cargar los productos favoritos al montar el componente
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteProductsData = await getFavoriteProducts();

        // Ordenar los productos para que los que tienen imagen aparezcan primero
        favoriteProductsData.sort((a: Product, b: Product) => {
          if (a.imageUrl && !b.imageUrl) return -1;
          if (!a.imageUrl && b.imageUrl) return 1;
          return 0;
        });

        setFavoriteProducts(favoriteProductsData);
      } catch (error) {
        console.error('Error al obtener productos favoritos:', error);
      }
    };

    fetchFavorites();
  }, []);

  // Función para eliminar un producto de los favoritos
  const toggleFavorite = async (productId: string) => {
    try {
      await removeFavorite(productId);
      setFavoriteProducts(favoriteProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error al eliminar producto de favoritos:', error);
    }
  };

  // Animaciones con Framer Motion
  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className={`pt-12 ${backgroundClass}`}>
        {favoriteProducts.length === 0 ? (
          <p className={`text-center ${textAndBorderClass}`}>
            
          </p>
        ) : (
          <motion.div
            className="mt-4"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            variants={variants}
          >
            <h2 className={`text-2xl pt-3 font-semibold text-center ${textAndBorderClass}`}>
              Tus Productos Favoritos
            </h2>
            <ul className="text-xs flex flex-col mb-3">
              {favoriteProducts.map((product: Product, productIndex: number) => (
                <li
                  key={productIndex}
                  className={`flex justify-between items-center px-4 py-1 mt-3 gap-8 modal-item cursor-pointer ${textAndBorderClass}`}
                >
                  <div className="flex items-center">
                    {product.imageUrl && (
                      <Image
                        width={200}
                        height={200}
                        src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="min-w-16 max-w-16 shadow h-16 object-cover rounded-[10px] mr-4"
                      />
                    )}
                    <div>
                      <h1 className={`font-semibold ${textAndBorderClass}`}>
                        {product.name}
                      </h1>
                      <p className={`font-normal opacity-70 ${textAndBorderClass}`}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`min-w-20 border px-2 rounded-[8px] ${textAndBorderClass}`}>
                      <p
                        className={`w-full text-sm text-center font-medium ${textAndBorderClass}`}
                      >
                        ${product.price.toLocaleString('es-CL')}
                      </p>
                    </div>
                    <div
                      onClick={() => toggleFavorite(product._id || '')}
                      className="ml-4 cursor-pointer"
                    >
                      <FaHeart className="text-red-500 text-base" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;
