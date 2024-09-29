'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  
import Logo from './logo';
import MenuRadial from './menuRadial'; 
import ClientBackground from './background';
import { useDarkMode } from '../context/DarkModeContext'; // Usamos el contexto

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const { isDarkBackground, toggleBackground } = useDarkMode(); // Usamos el estado desde el contexto

  // Chequear si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    setIsAuthenticated(!!token);
  }, []);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleProfileClick = () => {
    router.push(isAuthenticated ? '/profile' : '/auth');
  };

  return (
    <>
      <div className={`fixed z-30 backdrop-blur-md w-full top-0 left-0 ${isDarkBackground ? "bg-[#0a0a0a]" : "bg-transparent"} flex justify-between px-4 py-2 items-center border-b border-white/20`}>
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

      {/* Pasar props a ClientBackground */}
      <ClientBackground
        isDarkBackground={isDarkBackground}
        toggleBackground={toggleBackground}
      />
    </>
  );
};

export default Topbar;
