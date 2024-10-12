'use client';
import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
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
  FaLayerGroup,
} from 'react-icons/fa';
import { ImSpoonKnife } from 'react-icons/im';
import { useDarkMode } from '../context/DarkModeContext';
import { AuthContext } from '../context/AuthContext';

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
  const [showInstruction, setShowInstruction] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);

  const { backgroundMode } = useDarkMode();

  // Usamos el AuthContext para obtener el rol del usuario
  const { user } = useContext(AuthContext);
  const userRole = user?.role || '';

  const menuItems = useMemo(() => {
    const baseMenuItems = [
      { icon: <FaHome />, label: 'Inicio', link: '/' },
      { icon: <FaCocktail />, label: 'Tragos', link: '/menu/Tragos' },
      { icon: <FaMapMarkedAlt />, label: 'Mapa', link: '/mapa' },
      { icon: <FaChartArea />, label: 'Analíticas', link: '/analytics' },
      { icon: <FaUserFriends />, label: 'Personal', link: '/amigos' },
      { icon: <FaComments />, label: 'Reseñas', link: '/comentarios' },
      { icon: <FaHeart />, label: 'Favoritos', link: '/favoritos' },
      { icon: <FaCalendarAlt />, label: 'Reservar', link: '/reservar' },
      { icon: <FaMusic />, label: 'Música', link: '/musica' },
      { icon: <FaConciergeBell />, label: 'Ordenar', link: '/servicios' },
      { icon: <ImSpoonKnife />, label: 'Menú', link: '/menu/Menú' },
    ];

    // Agregamos el icono de Dashboard si el usuario tiene el rol adecuado
    if (userRole === 'superadmin' || userRole === 'admin') {
      baseMenuItems.push({ icon: <FaLayerGroup />, label: 'Dashboard', link: '/dashboard' });
    }

    return baseMenuItems;
  }, [userRole]);

  const totalItems = menuItems.length;

  const calculatePosition = useCallback(
    (index: number) => {
      let angle = (index / totalItems) * 360 + rotationX + rotationY;
      angle = (angle + 360) % 360; // Normalizar ángulo
      const x = Math.cos((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
      const y = Math.sin((angle * Math.PI) / 180) * ((outerRadius + innerRadius + 20) / 2);
      return { x, y, angle };
    },
    [rotationX, rotationY, totalItems]
  );

  const handlePan = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    setRotationX((prev) => prev + info.delta.x * 0.5);
    setRotationY((prev) => prev + info.delta.y * 0.5);
    setIsDragging(true);
    setShowInstruction(false);
    setTutorialComplete(true);
  };

  const isInDisplayRange = useCallback((angle: number) => {
    const normalizedAngle = (angle + 360) % 360;
    return normalizedAngle >= 350 || normalizedAngle <= 20;
  }, []);

  useEffect(() => {
    const activeItem = menuItems.find((_, index) => {
      const { angle } = calculatePosition(index);
      return isInDisplayRange(angle);
    });

    if (activeItem?.label !== activeLabel) {
      setActiveLabel(activeItem?.label || null);
    }
  }, [rotationX, rotationY, menuItems, calculatePosition, isInDisplayRange, activeLabel]);

  useEffect(() => {
    if (activeLabel && tutorialComplete) {
      gsap.fromTo(
        '.active-label',
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to('.active-label', { y: '0%', opacity: 0, duration: 0.4, ease: 'power3.in' });
    }
  }, [activeLabel, tutorialComplete]);

  useEffect(() => {
    if (showInstruction && !isDragging) {
      gsap.to('.breathing-orb', {
        y: -30,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: 'power1.inOut',
      });
    }
  }, [showInstruction, isDragging]);

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

  // Prevenir el desplazamiento en móviles cuando se toca la pantalla
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', handleTouchMove);
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [open]);

  const filterClass = backgroundMode === 'neon' ? '' : '';

  return (
    <>
      <motion.div
        className={`fixed select-none z-50 flex items-center justify-center w-full h-full backdrop-blur-lg top-0 left-0 ${
          backgroundMode === 'neon' && 'bg-black/40'
        }`}
        onClick={() => setOpen(false)}
        onPan={handlePan} // Mover la rueda con el gesto
        initial="closed"
        animate={open ? 'open' : 'closed'}
        variants={{
          open: { opacity: 1, display: 'block', transition: { duration: 0.4, ease: 'easeInOut' } },
          closed: {
            opacity: 0,
            transitionEnd: { display: 'none' },
            transition: { duration: 0.4, ease: 'easeInOut' },
          },
        }}
      >
        <motion.div
          className="relative h-[480px] w-[480px] origin-center border-[1.5px] border-white/20 rounded-full shadow-2xl shadow-black/70"
          onPan={handlePan}
          onClick={(e) => e.stopPropagation()}
          initial="closed"
          animate={open ? 'open' : 'closed'}
          variants={{
            open: {
              rotate: [20, 0],
              y: '20%',
              x: '-60%',
              transition: { duration: 0.4, ease: 'easeInOut' },
            },
            closed: {
              rotate: [0, 20],
              y: '20%',
              x: '-60%',
              transition: { duration: 0.4, ease: 'easeInOut' },
            },
          }}
        >
          {/* Orbe central destacado con animación */}
          <motion.div
            className="absolute w-32 h-32 z-50 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-cyan-300 flex items-center justify-center breathing-orb"
            style={{
              top: '37%',
              left: '50%',
            }}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.2 }}
            onDragStart={() => {
              gsap.killTweensOf('.breathing-orb');
              setIsDragging(true);
            }}
            onDragEnd={() => {
              setTimeout(() => setIsDragging(false), 500);
            }}
          >
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

          <div
            className="absolute inset-0 border-[1.5px] border-white/15 rounded-full"
            style={{ width: '65%', height: '65%', top: '17.5%', left: '17.5%' }}
          />

          {/* Menú Radial */}
          <motion.div
            className="relative h-full w-full"
            style={{ opacity: tutorialComplete ? 1 : 0.3 }}
          >
            {menuItems.map((item, index) => {
              const { x, y } = calculatePosition(index);
              return (
                <motion.a
                  key={index}
                  href={item.link}
                  className={`absolute flex flex-col items-center justify-center text-white ${filterClass}`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
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
          <motion.div
            className={`absolute top-[40%] active-label text-[7vw] font-bold right-10 p-4 text-white ${filterClass}`}
          >
            {activeLabel}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default MenuRadial;
