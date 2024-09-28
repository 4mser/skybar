'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { gsap } from 'gsap';
import {
  FaHome,
  FaCocktail,
  FaConciergeBell,
  FaComments,
  FaChartArea,
  FaCalendarAlt,
  FaMusic,
  FaHeart,
  FaMapMarkedAlt,
  FaUserFriends,
} from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';

interface MenuRadialProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MenuRadial: React.FC<MenuRadialProps> = ({ open, setOpen }) => {
  const outerRadius = 225;
  const innerRadius = 150;
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState(true); // Controla si mostrar el tutorial
  const [isDragging, setIsDragging] = useState(false); // Detecta si el orbe está siendo arrastrado
  const [tutorialComplete, setTutorialComplete] = useState(false); // Verifica si el tutorial ya fue completado

  // Memorizar el array de menú para evitar recrearlo en cada render
  const menuItems = useMemo(() => [
    { icon: <FaHome />, label: 'Inicio', link: '/' },
    { icon: <FaCocktail />, label: 'Tragos', link: '/cocktails' },
    { icon: <FaMapMarkedAlt />, label: 'Mapa', link: '/mapa' },
    { icon: <FaChartArea />, label: 'Analíticas', link: '/analytics' },
    { icon: <FaUserFriends />, label: 'Personal', link: '/amigos' },
    { icon: <FaComments />, label: 'Reseñas', link: '/comentarios' },
    { icon: <FaHeart />, label: 'Favoritos', link: '/favoritos' },
    { icon: <FaCalendarAlt />, label: 'Reservar', link: '/reservar' },
    { icon: <FaMusic />, label: 'Música', link: '/musica' },
    { icon: <FaConciergeBell />, label: 'Ordenar', link: '/servicios' },
    { icon: <ImSpoonKnife />, label: 'Menú', link: '/tragos' },
  ], []);

  const totalItems = menuItems.length;

  // Calcular la posición de cada ítem del menú, asegurando que totalItems esté en las dependencias
  const calculatePosition = useCallback((index: number) => {
    const angle = (index / totalItems) * 360 + rotationX + rotationY;
    const x = Math.cos((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
    const y = Math.sin((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
    return { x, y, angle };
  }, [rotationX, rotationY, totalItems]);

  // Manejar el movimiento del orbe
  const handlePan = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    setRotationX((prev) => prev + info.delta.x * 0.5);
    setRotationY((prev) => prev + info.delta.y * 0.5);
    setIsDragging(true); // Detecta que el orbe está siendo arrastrado
    setShowInstruction(false); // Desaparece el texto al arrastrar
    setTutorialComplete(true); // Marca el tutorial como completo
  };

  // Verificar si un ítem está en el ángulo visible
  const isInDisplayRange = useCallback((angle: number) => {
    const normalizedAngle = (angle + 360) % 360;
    return normalizedAngle >= 350 || normalizedAngle <= 20;
  }, []);

  // Animación para mostrar el label activo
  useEffect(() => {
    if (activeLabel && tutorialComplete) {  // Mostrar activeLabel solo si el tutorial se completó
      gsap.fromTo(
        ".active-label",
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(".active-label", { y: '0%', opacity: 0, duration: 0.4, ease: 'power3.in' });
    }
  }, [activeLabel, tutorialComplete]);

  // Detectar el label activo y actualizar el estado
  useEffect(() => {
    const activeItem = menuItems.find((_, index) => {
      const { angle } = calculatePosition(index);
      return isInDisplayRange(angle);
    });
    
    if (activeItem?.label !== activeLabel) {
      setActiveLabel(activeItem?.label || null);
    }
  }, [rotationX, rotationY, menuItems, calculatePosition, isInDisplayRange, activeLabel]);

  // Animación de movimiento constante del orbe (hacia arriba y hacia abajo)
  useEffect(() => {
    if (showInstruction && !isDragging) {
      gsap.to('.breathing-orb', {
        y: -30, // Movimiento hacia arriba
        repeat: -1,
        yoyo: true, // Volverá al centro y luego irá hacia abajo
        duration: 1, // Controla la duración del movimiento
        ease: 'power1.inOut',
      });
    }
  }, [showInstruction, isDragging]);

  // Aplicar el box-shadow suavemente al arrastrar o soltar el orbe
  useEffect(() => {
    if (isDragging || showInstruction) {
      gsap.to('.breathing-orb', {
        boxShadow: '0px 0px 30px rgba(35, 177, 203, 0.9)',
        duration: 0.3,
        ease: 'power1.inOut',
      });
    } else {
      gsap.to('.breathing-orb', {
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
        duration: 0.3,
        ease: 'power1.inOut',
      });
    }
  }, [isDragging, showInstruction]);

  return (
    <>
      <motion.div
        className="fixed z-50 flex items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0"
        onClick={() => setOpen(false)}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, display: 'block', transition: { duration: 0.4, ease: 'easeInOut' }},
          closed: { opacity: 0, transitionEnd: { display: 'none' }, transition: { duration: 0.4, ease: 'easeInOut' }},
        }}
      >
        <motion.div
          className="relative  h-[480px] w-[480px] origin-center border-[1.5px] border-white/20 rounded-full shadow-2xl shadow-black/70"
          onPan={handlePan}
          onClick={(e) => e.stopPropagation()}
          initial="closed"
          animate={open ? 'open' : 'closed'}
          variants={{
            open: { rotate: [20, 0], y: '20%', x: '-60%', transition: { duration: 0.4, ease: 'easeInOut' }},
            closed: { rotate: [0, 20], y: '20%', x: '-60%', transition: { duration: 0.4, ease: 'easeInOut' }},
          }}
        >
          {/* Orbe central destacado con animación de movimiento constante */}
          <motion.div
            className={`absolute w-32 h-32 z-50 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-cyan-300 flex items-center justify-center breathing-orb`}
            style={{ 
              top: '37%', left: '50%', 
            }}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.2 }} // Aplicamos el scale solo durante el drag
            onDragStart={() => {
              gsap.killTweensOf('.breathing-orb'); // Detener la animación de movimiento al arrastrar
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setTimeout(() => setIsDragging(false), 500); // Vuelve a su estado original
            }}
          >
            {/* Mostrar el mensaje solo si está en el tutorial */}
            {showInstruction && !isDragging && (
              <motion.span
                className="text-white text-xs font-bold"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.5 }}
              >
                Muéveme
              </motion.span>
            )}
          </motion.div>

          {/* Borde interno de la rueda */}
          <div
            className="absolute inset-0 border-[1.5px] border-white/15 rounded-full"
            style={{ width: '65%', height: '65%', top: '17.5%', left: '17.5%' }}
          />

          {/* Menú Radial */}
          <motion.div
            className="relative h-full w-full"
            style={{ opacity: tutorialComplete ? 1 : 0.3 }} // Atenúa la rueda hasta que el tutorial esté completo
          >
            {menuItems.map((item, index) => {
              const { x, y } = calculatePosition(index);
              return (
                <motion.a
                  key={index}
                  href={item.link}
                  className="absolute flex flex-col items-center justify-center text-white"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="text-2xl">{item.icon}</div>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Label del icono activo */}
        {tutorialComplete && activeLabel && (
          <motion.div className="absolute top-[40%] active-label text-[7vw] font-bold right-10 p-4 text-white">
            {activeLabel}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default MenuRadial;
