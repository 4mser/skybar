import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "-10vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.2 },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md z-50 flex justify-center items-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose} // Cerrar modal al hacer clic en el fondo
    >
      <motion.div
        className=" bg-white/10 rounded-[20px] p-6 w-11/12 md:w-1/2 lg:w-1/3  relative"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} // Evitar cerrar el modal al hacer clic dentro del modal
      >
        {children} {/* Contenido del modal */}
      </motion.div>
    </motion.div>
  );
};

export default Modal;
