'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '../context/DarkModeContext'; // Importar el contexto de tema

const Logo = () => {
  const { backgroundMode } = useDarkMode(); // Acceder al backgroundMode desde el contexto

  // Seleccionar el logo según el backgroundMode
  const logoSrc =
    backgroundMode === 'neon'
      ? '/images/skybar2.png'
      : '/images/skybar.png'; 

  return (
    <Link href={'/'}>
      <Image
        src={logoSrc} // Logo dinámico
        alt="logo"
        width={160}
        height={40}
        className="-translate-y-[2px]"
      />
    </Link>
  );
};

export default Logo;
