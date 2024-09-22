'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Logo from './logo';
import MenuRadial from './menuRadial'; // Importa el menú radial

const Topbar = () => {
  const [openMenu, setOpenMenu] = useState(false); // Estado para el menú radial
  const [openHappy, setOpenHappy] = useState(false);

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleHappy = () => {
    setOpenHappy(!openHappy);
  };

  return (
    <>
      <div className="fixed z-30 bg-[#0a0a0a] w-full top-0 left-0 bg-dark-1 flex justify-between px-4 py-2 items-center border-b border-white/20">
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

        {/* Botón para abrir el Happy Hour */}
        <button onClick={handleHappy}>
          <Image
            src={'/icons/dizzy.svg'}
            alt="dizzy"
            width={28}
            height={28}
          />
        </button>
      </div>

      {/* Componente del menú radial */}
      <MenuRadial open={openMenu} setOpen={setOpenMenu} /> {/* Pasamos el estado para abrir/cerrar el menú radial */}
    </>
  );
};

export default Topbar;
