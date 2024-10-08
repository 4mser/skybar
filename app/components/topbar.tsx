'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  
import Logo from './logo';
import MenuRadial from './menuRadial'; 
import ClientBackground from './background';
import { useDarkMode } from '../context/DarkModeContext'; // Usamos el contexto
import axios from 'axios';

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null); // Para almacenar la foto del usuario
  const router = useRouter();
  const { backgroundMode, toggleBackground } = useDarkMode(); // Usamos el nuevo estado desde el contexto

  // Función para obtener la foto de perfil
  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get('https://aria-backend-production.up.railway.app/users/me', {
        headers: {
          Authorization: `Bearer ${token}`, // Enviamos el token en el header
        },
      });
      setUserPhoto(response.data.photo); // Guardamos la foto del usuario
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Chequear si el usuario está autenticado al cargar la página o cuando el token cambie
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);  // Obtener la foto si ya hay un token
    }
  }, []);

  // Observamos los cambios en localStorage para actualizar la foto de perfil si el usuario inicia sesión
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        fetchUserData(token);  // Volvemos a obtener la foto si hay un token nuevo
      } else {
        setIsAuthenticated(false);
        setUserPhoto(null);  // Reiniciamos la imagen si el usuario se desloguea
      }
    };

    // Añadir un listener para detectar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
            src={userPhoto ? userPhoto : '/icons/profile3.svg'}  // Mostrar la foto del usuario o el icono por defecto
            alt="profile"
            width={28}
            height={28}
            className={`rounded-full ${backgroundMode === 'neon' && !userPhoto ? 'invert opacity-80' : ''}`}  // Asegurarnos que la imagen de perfil sea redonda
          />
        </button>
      </div>

      {/* Componente del menú radial */}
      <MenuRadial open={openMenu} setOpen={setOpenMenu} />

      {/* Pasar props a ClientBackground */}
      <ClientBackground
        backgroundMode={backgroundMode}  // Pasamos el nuevo estado en lugar de isDarkBackground
        toggleBackground={toggleBackground}
      />
    </>
  );
};

export default Topbar;
