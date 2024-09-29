'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  // Cambiamos a next/navigation
import Logo from './logo';
import MenuRadial from './menuRadial'; // Importa el menú radial

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false); // Estado para el menú radial
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Chequear si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token'); // Verificamos si hay un token en localStorage
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile'); // Si está autenticado, ir a la página de perfil
    } else {
      router.push('/auth'); // Si no está autenticado, ir a la página de autenticación
    }
  };

  return (
    <>
      <div className="fixed z-30 bg-[#0a0a0a] w-full top-0 left-0 bg-dark-1 flex justify-between px-4 py-2 items-center border-b border-white/20">
      {/* <div className="fixed z-30 backdrop-blur-md w-full top-0 left-0 bg-dark-1 flex justify-between px-4 py-2 items-center border-b border-white/20"> */}
        {/* Botón para abrir el menú radial */}
        <button onClick={handleMenu}>
          <Image
            src={'/icons/menu.svg'}
            alt="menu"
            width={28}
            height={28}
          />
        </button>

        {/* El logo en el centro */}
        <Logo />

        {/* Botón para perfil o autenticación */}
        <button onClick={handleProfileClick}>
          <Image
            src={'/icons/profile.svg'}
            alt="profile"
            width={28}
            height={28}
          />
        </button>
      </div>

      {/* Componente del menú radial */}
      <MenuRadial open={openMenu} setOpen={setOpenMenu} />
    </>
  );
};

export default Topbar;
