'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../context/DarkModeContext';
import { getFavoriteProducts } from '../services/api'; // Importa la función de la API
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Product {
  _id: string;
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

const FavoritesPage: React.FC = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]); // Estado para los productos favoritos
  const { backgroundMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    // Fetch favoritos al cargar la página
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteProducts();
        setFavoriteProducts(favorites); // Guardar los productos favoritos obtenidos
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener productos favoritos:', error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const sanitizeTitle = (title: string): string =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const backgroundClass =
    backgroundMode === 'dark'
      ? 'bg-[#0a0a0a]'
      : backgroundMode === 'light'
      ? ''
      : 'bg-slate-100';

  const textAndBorderClass =
    backgroundMode === 'neon' ? 'text-black/80 border-black/30' : 'text-white border-white/20';

  const toggleFavorite = async (productId: string) => {
    try {
      // Aquí puedes implementar la funcionalidad de eliminar de favoritos
      console.log(`Producto con id ${productId} fue clickeado`);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return <p className="text-center">Cargando favoritos...</p>;
  }

  return (
    <div className="pt-[109px]">
      <h1 className="text-3xl font-bold text-center mb-6">Tus productos favoritos</h1>

      {favoriteProducts.length === 0 ? (
        <p className="text-center">No tienes productos favoritos</p>
      ) : (
        <motion.div
          className="mt-4"
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          variants={variants}
        >
          <ul className="text-xs flex flex-col mb-3">
            {favoriteProducts.map((item) => (
              <li
                key={item._id}
                className={`flex justify-between items-center px-4 py-1 mt-3 gap-8 modal-item cursor-pointer ${textAndBorderClass}`}
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
                  {/* Ícono de corazón para favoritos */}
                  <div onClick={() => toggleFavorite(item._id)} className="ml-4">
                    <FaHeart className="text-red-500 cursor-pointer" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
