// components/topbar.tsx
'use client';
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  
import Logo from './logo';
import MenuRadial from './menuRadial'; 
import ClientBackground from './background';
import { useDarkMode } from '../context/DarkModeContext';
import { AuthContext } from '../context/AuthContext';

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  const { backgroundMode, toggleBackground } = useDarkMode();
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleProfileClick = () => {
    router.push(isAuthenticated ? '/profile' : '/auth');
  };

  // Determinar la clase de fondo basada en el estado del fondo
  const backgroundClass = backgroundMode === 'dark'
    ? 'bg-[#0a0a0a] border-b border-white/20'
    : backgroundMode === 'light'
    ? 'border-b border-white/20'
    : 'bg-slate-100 border-b border-black/20';

  return (
    <>
      <div className={`fixed z-30 backdrop-blur-md w-full top-0 left-0 ${backgroundClass} flex justify-between px-4 py-2 items-center `}>
        {/* Botón para abrir el menú radial */}
        <button onClick={handleMenu}>
          <Image
            src={'/icons/menu.svg'}
            alt="menu"
            width={28}
            height={28}
            priority
            className={`${backgroundMode === 'neon' ? 'filter invert opacity-80' : ''}`}
          />
        </button>

        {/* El logo en el centro */}
        <Logo />

        {/* Botón para perfil o autenticación */}
        <button onClick={handleProfileClick} className='backdrop-blur-md p-1 rounded-full'>
          <Image
            src={user?.photo ? user.photo : '/icons/profile3.svg'}
            alt="profile"
            width={28}
            height={28}
            className={`rounded-full ${backgroundMode === 'neon' && !user?.photo ? 'invert opacity-80' : ''}`}
          />
        </button>
      </div>

      {/* Componente del menú radial */}
      <MenuRadial open={openMenu} setOpen={setOpenMenu} />

      {/* Pasar props a ClientBackground */}
      <ClientBackground
        backgroundMode={backgroundMode}
        toggleBackground={toggleBackground}
      />
    </>
  );
};

export default Topbar;
