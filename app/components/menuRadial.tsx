'use client';
import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import {
  FaHome,
  FaCocktail,
  FaRegClock,
  FaRegChartBar,
  FaConciergeBell,
  FaComments,
  FaBookmark,
  FaMusic,
  FaMapMarkedAlt,
  FaUserFriends,
} from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';

interface MenuRadialProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuRadial: React.FC<MenuRadialProps> = ({ open, setOpen }) => {
  const outerRadius = 225; // Aumentamos el radio externo
  const innerRadius = 150; // Aumentamos el radio interno para mayor separación
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);

  const menuItems = [
    { icon: <FaHome />, label: 'Inicio', link: '/' },
    { icon: <FaCocktail />, label: 'Cocktails', link: '/cocktails' },
    { icon: <FaMapMarkedAlt />, label: 'Mapa', link: '/mapa' },
    { icon: <FaRegChartBar />, label: 'Analytics', link: '/analytics' },
    { icon: <FaUserFriends />, label: 'Amigos', link: '/amigos' },
    { icon: <FaComments />, label: 'Comentarios', link: '/comentarios' },
    { icon: <FaBookmark />, label: 'Favoritos', link: '/favoritos' },
    { icon: <FaRegClock />, label: 'Horario', link: '/horario' },
    { icon: <FaMusic />, label: 'Música', link: '/musica' },
    { icon: <FaConciergeBell />, label: 'Servicios', link: '/servicios' },
    { icon: <ImSpoonKnife />, label: 'Menu', link: '/menu' },
  ];

  const totalItems = menuItems.length;

  const calculatePosition = (index: number) => {
    const angle = (index / totalItems) * 360 + rotationX + rotationY;
    const x = Math.cos((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
    const y = Math.sin((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
    return { x, y };
  };

  const handlePan = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    setRotationX((prev) => prev + info.delta.x * 0.5);
    setRotationY((prev) => prev + info.delta.y * 0.5);
  };

  // Animación para la rueda
  const wheelVariants = {
    open: {
      rotate: [20, 0], // Animación desde 20 grados hasta 0 grados
      y: '20%',
      x: '-60%',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    closed: {
      rotate: [0, 20], // Animación de cierre
      y: '20%',
      x: '-60%',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      display: 'block',
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    closed: {
      opacity: 0,
      transitionEnd: { display: 'none' },
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  return (
    <>
      <motion.div
        className="fixed z-50 flex items-center justify-center w-full h-full backdrop-blur-lg"
        onClick={() => setOpen(false)}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={menuVariants}
      >
        <motion.div
          className="relative h-[480px] w-[480px] origin-center border-[1.5px] border-white/20 rounded-full shadow-2xl shadow-black/70"
          // Hacemos que la rueda sea más grande
          onPan={handlePan}
          onClick={(e) => e.stopPropagation()}
          initial="closed"
          animate={open ? 'open' : 'closed'}
          variants={wheelVariants}
        >
          {/* Orbe central con flecha de doble punta */}
          <motion.div
            className="absolute w-32 h-32 z-50 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-cyan-300 flex items-center justify-center"
            style={{
              top: '37%', // Asegura que el orbe esté en el centro
              left: '50%',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)', // Sombra inicial
            }}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
            whileDrag={{
              scale: 1.2,
              boxShadow: '0px 0px 30px rgba(35, 177, 203, 0.6)', // Iluminación aumentada
            }}
          >
            {/* Flecha de doble punta (↔) */}
            {/* <div className="text-white  text-xl font-normal rotate-90 translate-x-4">↔</div> */}
          </motion.div>

          {/* Borde interno */}
          <div
            className="absolute inset-0 border-[1.5px] border-white/15 rounded-full"
            style={{
              width: '65%',
              height: '65%',
              top: '17.5%',
              left: '17.5%',
            }}
          />

          {/* Menú radial */}
          <motion.div className="relative h-full w-full">
            {menuItems.map((item, index) => {
              const { x, y } = calculatePosition(index);

              return (
                <motion.a
                  key={index}
                  href={item.link}
                  className="absolute flex flex-col items-center justify-center text-white"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="text-2xl">{item.icon}</div>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default MenuRadial;
