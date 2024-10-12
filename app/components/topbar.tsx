'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  
import Logo from './logo';
import MenuRadial from './menuRadial'; 
import ClientBackground from './background';
import { useDarkMode } from '../context/DarkModeContext';
import axios from 'axios';

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const router = useRouter();

  const { backgroundMode, toggleBackground } = useDarkMode();

  // Función para obtener datos del usuario
  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get('https://aria-backend-production.up.railway.app/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPhoto(response.data.photo);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Chequear si el usuario está autenticado al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    } else {
      setIsAuthenticated(false);
      setUserPhoto(null);
    }

    // Escuchar eventos personalizados de inicio y cierre de sesión
    const handleLogin = () => {
      const newToken = localStorage.getItem('token');
      if (newToken) {
        setIsAuthenticated(true);
        fetchUserData(newToken);
      }
    };

    const handleLogout = () => {
      setIsAuthenticated(false);
      setUserPhoto(null);
    };

    window.addEventListener('login', handleLogin);
    window.addEventListener('logout', handleLogout);

    // Limpieza del evento al desmontar el componente
    return () => {
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

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
            src={userPhoto ? userPhoto : '/icons/profile3.svg'}
            alt="profile"
            width={28}
            height={28}
            className={`rounded-full ${backgroundMode === 'neon' && !userPhoto ? 'invert opacity-80' : ''}`}
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
