'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { removeFavorite, getFavoriteProducts } from '../services/api';
import Image from 'next/image';

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

  // Cargar los productos favoritos al montar el componente
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteProductsData = await getFavoriteProducts();
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
      setFavoriteProducts(favoriteProducts.filter(product => product._id !== productId));
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
      <div className="pt-12">
        {favoriteProducts.length === 0 ? (
          <p className="text-center text-white">No tienes productos favoritos</p>
        ) : (
          <motion.div
            className="mt-4"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            variants={variants}
          >
            <h2 className="text-2xl font-semibold text-center ">
              Tus Productos Favoritos
            </h2>
            <ul className="text-xs flex flex-col mb-3">
              {favoriteProducts.map((product: Product, productIndex: number) => (
                <li
                  key={productIndex}
                  className="flex justify-between items-center px-4 py-1 mt-3 gap-8 modal-item cursor-pointer text-white border-white/20"
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
                      <h1 className="font-semibold">{product.name}</h1>
                      <p className="font-normal opacity-70">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="min-w-20 border px-2 rounded-[8px]">
                      <p className="w-full text-sm text-center font-medium">
                        ${product.price}
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
