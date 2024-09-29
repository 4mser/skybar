'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// Definir el tipo de un ítem del menú
interface MenuItem {
  name: string;
  description: string;
  price: string;
}

// Definir el tipo de una sección del menú
interface MenuSection {
  title: string;
  filter: string;
  items: MenuItem[];
}


// Definir el tipo de las secciones del menú
const menuSections: MenuSection[] = [
    {
      title: "Desayuno Sky (07:00 a 10:30)",
      filter: "Desayuno Sky",
      items: [
        {
          name: "Ceviche",
          description: "* Té o café / jugo de naranja / leche. * Jamón / queso. * Mantequilla / mermelada o miel. * Pocillo de huevos. * Pocillo de palta. * 1 Croissant / mini baguette y pan de molde. * 1 Plato de frutas. * 1 Yogurt y cereales. * Variedad de repostería (3 uni)",
          price: "$17.900"
        },
      ]
    },
    {
      title: "Entradas",
      filter: "Entradas",
      items: [
        {
          name: "Ensalada César pollo o salmón ahumado",
          description: "Lechuga de la estación, pollo o salmon ahumado, crutones, queso parmesano y Dressing César.",
          price: "$9.900"
        },
        {
          name: "Ensalada Sky",
          description: "Lechuga de la estación, camarones apanados en nori, palta, palmito, semilla de sesamo y dressing de la casa.",
          price: "$10.900"
        },
      ],
    },
    {
      title: "Sopas y Cremas",
      filter: "Sopas y Cremas",
      items: [
        {
          name: "Sugerencia del Chef", 
          description: "Slice de salmón fogoneado en una galleta de ajo con queso de cabra ahumado terminado con un gajo de mandarina y salsa de arándano.", 
          price: "$6.900"
        },
        {
          name: "Consomé de Ave", 
          description: "", 
          price: "$5.900"
        },
        {
          name: "Consomé de Vacuno", 
          description: "", 
          price: "$5.900"
        },
      ],
    },
    {
      title: "Pescados y Carnes",
      filter: "Pescados y Carnes",
      items: [
        {
          name: "Filete de Salmón a la plancha",
          description: "Salsa de alcaparras.",
          price: "$13.900"
        },
        {
          name: "Pechuga de Pollo grillada",
          description: "Salsa de setas.",
          price: "$10.900"
        },
        {
          name: "Lomo Liso",
          description: "Con chimichurri tibio.",
          price: "$13.900"
        }
      ],
    },
    {
      title: "Pastas",
      filter: "Pastas",
      items: [
        {
          name: "Fetuccini",
          description: "Fetuccini con Boloñesa o Salsa Alfredo.",
          price: "$10.900"
        }
      ],
    },
    {
      title: "Acompañamientos",
      filter: "Acompañamientos",
      items: [
        {
          name: "Arroz Blanco con Champiñón",
          description: "",
          price: "$4.900"
        },
        {
          name: "Panache de Verduras",
          description: "",
          price: "$4.900"
        },
        {
          name: "Papas Fritas",
          description: "",
          price: "$4.900"
        },
      ],
    },
    {
      title: "Cocina de Autor",
      filter: "Cocina de Autor",
      items: [
        {
          name: "Ceviche",
          description: "Carne de pescado, camarón, aderezados con leche de tigre, cebolla morada, choclo, rocotto y cilantro.",
          price: "$13.900"
        },
        {
          name: "Oro Verde (Producto Vegetariano)",
          description: "Cama de vegetales fritos condimentados, croqueta de palta con cebolla, avellana, cilantro y ajo, sobre ellas una salsa de betarraga.",
          price: "$9.900"
        },
        {
          name: "Pastelera y Pincho (Producto Vegano)",
          description: "Pastelera de choclo con albahaca, pincho de verduras salteadas, tomate cherry confitado.",
          price: "$8.900"
        },
      ],
    },
    {
      title: "Sandwiches",
      filter: "Sandwiches",
      items: [
        {
          name: "Barros Luco",
          description: "Carne deshilachada y queso fundido.",
          price: "$9.900"
        },
        {
          name: "Burger",
          description: "Pan brioche, hamburguesa hecha en casa. lechuga, queso cheddar gratinado, cebolla morada, pepinillos y salsa de casa.",
          price: "$10.900"
        },
        {
          name: "Italiano",
          description: "Churrasco, palta, tomate y salsa de la casa.",
          price: "$9.900"
        },
      ],
    },
    {
      title: "Postres",
      filter: "Postres",
      items: [
        {
          name: "Crème brûlée",
          description: "",
          price: "$4.200"
        },
        {
          name: "Variedad de Helados",
          description: "",
          price: "$4.500"
        },
      ],
    },
    {
      title: "Menu de niños",
      filter: "Menu de niños",
      items: [
        {
          name: "Nuggets de Pollo con papas fritas",
          description: "",
          price: "$7.900"
        },
      ],
    },
  ];
  

// Función para limpiar el título y usarlo como id
const sanitizeTitle = (title: string): string =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// Tipado para la función `navigateToSection`
const navigateToSection = (title: string) => {
  const sectionId = sanitizeTitle(title);
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    window.scrollTo({
      top: sectionElement.offsetTop - 134, // Ajusta este valor según sea necesario
      behavior: 'smooth',
    });
  }
};

const Page: React.FC = () => {
  // Ref para el contenedor de la barra de navegación
  const navRef = useRef<HTMLDivElement | null>(null);

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Barra de navegación deslizable en la parte superior */}
      <div
        ref={navRef}
        className='fixed top-12 border-b border-white/20 bg-[#0a0a0a] left-0 w-full z-10 overflow-x-auto flex py-4 px-4 gap-3'
      >
        {menuSections.map((section, index) => (
          <button
            key={index}
            className='text-[12px] py-3 px-4 border whitespace-nowrap border-white/20 rounded-lg'
            onClick={() => navigateToSection(section.title)}
          >
            {section.filter}
          </button>
        ))}
      </div>

      {/* Contenido principal del menú */}
      <div className='pt-[109px]'>
        {menuSections.map((section, index) => (
          <motion.div
            key={index}
            id={sanitizeTitle(section.title)}
            className='mt-4'
            initial='hidden'
            animate='visible'
            transition={{ duration: 0.3 }}
            variants={variants}
          >
            <h2
              className={`text-lg font-semibold flex items-center px-4 py-3 bg-gradient-to-br from-cyan-400 to-sky-800`}
            >
              {section.title}
            </h2>
            <ul className='text-xs flex flex-col mb-3'>
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className='flex justify-between items-center px-4 py-1 mt-3 gap-8 '
                >
                  <div>
                    <h1 className='font-semibold'>{item.name}</h1>
                    <p className='font-normal opacity-70 '>{item.description}</p>
                  </div>
                  <div
                    className={`min-w-20 border  px-2 rounded-lg`}
                  >
                    <p className='w-full text-sm text-center font-medium'>
                      {item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Page;
