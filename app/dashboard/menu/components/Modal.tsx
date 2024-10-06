// Modal.tsx
import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="relative p-6 rounded-[10px] max-w-md w-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20 text-white">
        <button
          className="absolute top-3 right-3 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
