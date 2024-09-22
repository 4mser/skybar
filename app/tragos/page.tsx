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
  gradientFrom: string;
  gradientTo: string;
  priceColor: string;
  borderColor: string;
}


// Definir el tipo de las secciones del menú
const menuSections: MenuSection[] = [
    {
        title: "SUSHI ROLL SPECIAL (9 PIEZAS)",
        filter: "SUSHI ROLL SPECIAL",
        items: [
          {
            name: "ROLLS ACEVICHADO (70)",
            description: "Camarón Apanado, Queso Crema, Bañado en Salsa Acevichada y Coronado con Maní Crocante.",
            price: "6.900"
          },
          {
            name: "PREMIUM YAGAN (72)",
            description: "Salmón Apanado, Palta, Envuelto en Queso Crema Flameado Coronado En Salsa Teriyaki y Papas Hilo.",
            price: "7.900"
          },{
            name: "ROLLS CEVICHE (76)",
            description: "Salmón, Queso Crema, Cebollín envuelto en Palta Bañado en Ceviche de la Casa.",
            price: "8.500"
          },{
            name: "RES ROLLS (78)",
            description: "Filete de Res, Queso Mantecoso, apanado en panko bañado con salsa acevichada y tiritas de wantan.",
            price: "7.800"
          },{
            name: "EBI ACEVICHADO (79)",
            description: "Salmón Apanado, Queso Crema envuelto en Palta y Camarón Acevichado.",
            price: "7.900"
          },{
            name: "MEXICAN ROLLS (80)",
            description: "Pollo Apanado, ciboullete, queso crema envuelto en sesamo coronado con Guacamole.",
            price: "7.900"
          }
        ],
        gradientFrom: "from-red-700",
        gradientTo: "to-red-950",
        priceColor: "text-red-500",
        borderColor: "border-red-500"
      },
      {
        title: "ENVUELTOS EN PALTA (9 PIEZAS)",
        filter: "ENVUELTOS EN PALTA",
        items: [
          {
            name: "EBI TERIYAKI (1)",
            description: "Camarón, Cebollín, Queso Crema envuelto en Palta Bañado en Pollo Teriyaky y Sésamo",
            price: "7.200"
          },
          {
            name: "PREMIUM (3)",
            description: "Salmón, Ciboullete, Queso Crema envuelto en Palta.",
            price: "6.900"
          },
          {
            name: "EBI CHEESE (4)",
            description: "Camarón, Cebollín, Queso Crema envuelto en Palta.",
            price: "6.900"
          },
          {
            name: "CHICKEN LIGHT (5)",
            description: "Pollo, Cebollín, Queso Crema envuelto en Palta.",
            price: "6.800"
          },
          {
            name: "EBI TEMPURA (6)",
            description: "Camarón Tempura, Queso Crema envuelto en Palta.",
            price: "6.900"
          },
          {
            name: "OKAMA ROLLS (10)",
            description: "Pollo, Queso Crema, Nuez envuelto en Palta Bañado en Salsa Acevichada.",
            price: "6.900"
          }
        ],
        gradientFrom: "from-green-700",
        gradientTo: "to-yellow-500",
        priceColor: "text-lime-300",
        borderColor: "border-lime-300"
      },
      {
        title: "ENVUELTOS EN PANKO (FRITOS) (9 PIEZAS)",
        filter: "FRITOS EN PANKO",
        items: [
          {
            name: "PANKO ESPECIAL (13)", 
            description: "Pollo, Queso Crema, Nuez Envuelto en Panko, Bañado en Salsa Teriyaki.", 
            price: "6.800"
          },
          {
            name: "SAKE PANKO (14)", 
            description: "Salmón, Palta, Queso Crema Envuelto en Panko.", 
            price: "6.900"
          },
          {
            name: "EBI PANKO (15)", 
            description: "Camarón, Ciboullete, Queso Crema envuelto en Panko.", 
            price: "6.900"
          },
          {
            name: "PANKO CHICKEN (16)", 
            description: "Pollo, Palta, Queso Crema Envuelto en Panko.", 
            price: "6.900"
          },
          {
            name: "TEMPURA SHRIMPS (17)", 
            description: "Camarón Apanado, Queso Mantecoso, Envuelto en Panko Bañado en Salsa Acevichada.", 
            price: "6.900"
          },
          {
            name: "CHICKEN MIX ROLLS", 
            description: "Pollo Furay, Queso Crema, Cebollín envuelto en Panko Coronado con Guacamole y Salsa Acevichada.", 
            price: "6.900"
          },
          {
            name: "YAGÁN TEMPURA", 
            description: "Camarón, Queso Crema, Cebollín Apanado en Panko, Bañado en Pollo Teriyaki y Sésamo.", 
            price: "7.900"
          },
          {
            name: "CHICKEN TEMPURA (23)", 
            description: "Pollo Apanado, Queso Crema Envuelto en Panko Bañado en Salsa de acevichada.", 
            price: "6.700"
          },
        ],
        gradientFrom: "from-red-950",
        gradientTo: "to-amber-500",
        priceColor: "text-yellow-500",
        borderColor: "border-yellow-500"
      },
      {
        title: "ENVUELTOS EN SALMÓN (9 PIEZAS)",
        filter: "ENVUELTOS EN SALMÓN",
        items: [
          {
            name: "SAKEDU (24)",
            description: "Camarón, Salmón, Queso Crema envuelto en Salmón Bañado en Salsa Acevichada.",
            price: "7.900"
          },
          {
            name: "TOKIO (26)",
            description: "Camarón, Cebollin, Queso Crema envuelto en Salmón.",
            price: "7.300"
          },
          {
            name: "KINTARO (27)",
            description: "Camarón Apanado, Queso Crema envuelto en Salmón. Bañado en Salsa Acevichada.",
            price: "7.490"
          },
          {
            name: "OKINAWA (30)",
            description: "Pulpo, Palta, Queso Crema envuelto en Salmón",
            price: "7.900"
          }
        ],
        gradientFrom: "from-red-400",
        gradientTo: "to-orange-400",
        priceColor: "text-orange-300",
        borderColor: "border-orange-300"
      },
      {
        title: "CALIFORNIA ROLLS (9 PIEZAS)",
        filter: "CALIFORNIA ROLLS",
        items: [
          {
            name: "KANI (36)",
            description: "Kanikama, Palta, Queso Crema.",
            price: "5.490"
          },
          {
            name: "EBI (37)",
            description: "Camarón, Cebollin, Nuez, Queso Crema Bañado en Salsa Acida y Sésamo.",
            price: "6.200"
          },
          {
            name: "SAKE (38)",
            description: "Salmón, Palta, Queso Crema.",
            price: "6.900"
          },
          {
            name: "EBI FURAY (39)",
            description: "Camarón Apanado, Palta, Envuelto en Sésamo Bañado en Tibia Salsa de Parmesano.",
            price: "6.100"
          },
          {
            name: "CHICKEN PARMESANO (40)",
            description: "Pollo, Queso Crema Envuelto en Sésamo Bañado en tibia Salsa de Parmesano.",
            price: "6.100"
          },
          {
            name: "TAKO (42)",
            description: "Pulpo, Palta, Queso Crema.",
            price: "8.600"
          },
          {
            name: "NATURA (43)",
            description: "Choclo, Palta, Queso Crema Bañado en Salsa Acevichada.",
            price: "6.400"
          }
        ],
        gradientFrom: "from-teal-500",
        gradientTo: "to-cyan-600",
        priceColor: "text-teal-300",
        borderColor: "border-teal-300"
      },
      {
        title: "ENVUELTOS EN QUESO CREMA (9 PIEZAS)",
        filter: "ENVUELTOS EN QUESO CREMA",
        items: [
          {
            name: "SNOW EBI (44)",
            description: "Camarón, Palta, Ciboullete envuelto en Queso Crema Bañado en Salsa de acida.",
            price: "7.300"
          },
          {
            name: "SNOW CHICKEN (45)",
            description: "Pollo, Palta, Ciboullete envuelto en Queso Crema.",
            price: "7.200"
          },
          {
            name: "SNOW FUNGI (46)",
            description: "Champiñon apanado, Palta, Choclo envuelto en Queso Crema.",
            price: "6.900"
          },
          {
            name: "SNOW APANADO (48)",
            description: "Camarón Apanado, Palta, envuelto en Queso Crema Bañado en Salsa Teriyaki y Sesamo.",
            price: "7.400"
          },
        ],
        gradientFrom: "from-zinc-400",
        gradientTo: "to-gray-300",
        priceColor: "text-gray-300",
        borderColor: "border-gray-300"
      },
      {
        title: "ENVUELTOS MIX SALMÓN Y PALTA (9 PIEZAS)",
        filter: "ENVUELTOS MIX SALMÓN Y PALTA",
        items: [
          {
            name: "EDU JAI (49)",
            description: "Camarón Apanado, Queso Crema Envuelto en Salmón-Palta Bañado en Salsa Acevichada.",
            price: "7.900"
          },
          {
            name: "EBI MIX ROLLS (50)",
            description: "Camarón, Palta, Queso Crema Envuelto en Salmón-Palta.",
            price: "7.900"
          },
          {
            name: "SAKE MIX (51)",
            description: "Salmón, Palta, Queso Crema Envuelto en Salmón-Palta.",
            price: "7.900"
          },
          {
            name: "TAKO MIX (57)",
            description: "Pulpo, Palta, Queso Crema Envuelto en Salmón-Palta.",
            price: "7.900"
          },
          {
            name: "OMURA (55)",
            description: "Camarón Tempura, Queso Crema Envuelto en Salmón-Palta bañado en ceviche del día.",
            price: "8.500"
          },
        ],
        gradientFrom: "from-red-400",
        gradientTo: "to-lime-400",
        priceColor: "text-lime-300",
        borderColor: "border-lime-300"
      },
      {
        title: "ENVUELTOS EN NORI (9 PIEZAS)",
        filter: "ENVUELTOS EN NORI",
        items: [
          {
            name: "SAE MAKI (57)",
            description: "Salmón, Palta, Queso Crema.",
            price: "5.000"
          },
          {
            name: "TERI MAKI (58)",
            description: "Pollo, Queso Crema Envuelto en Nori Tempura Bañado en Salsa Thai",
            price: "5.100"
          },
          {
            name: "HOSO MAKI (59)",
            description: "Camarón, Cebollín, Queso Crema",
            price: "5.000"
          },
          {
            name: "SAKE MAKI (60)",
            description: "Salmon , Cebollin , Queso crema.",
            price: "5.490"
          },
        ],
        gradientFrom: "from-gray-700",
        gradientTo: "to-gray-900",
        priceColor: "text-gray-400",
        borderColor: "border-gray-400"
      },
      {
        title: "ROLLS SIN ARROZ",
        filter: "ROLLS SIN ARROZ",
        items: [
          {
            name: "SAKE AVOCADO",
            description: "Salmón, Camaron Apanado, Queso Crema, Cebollín Envuelto en Mixto de Palta y Salmon y salsa acevichada.",
            price: "9.490"
          }
        ],
        gradientFrom: "from-emerald-400",
        gradientTo: "to-lime-800",
        priceColor: "text-emerald-500",
        borderColor: "border-emerald-500"
      },
      {
        title: "PROMOCIONES SUSHI",
        filter: "PROMOS",
        items: [
          {
            name: "PRINCIPIANTE A",
            description: "9 Pollo Frito- 9 Kanikama en Sésamo - 9 Camarón en Palta.",
            price: "16.990"
          },
          {
            name: "EXPERTO A",
            description: "9 Camarón en Palta - 9 Pollo Frito - 9 Kanikama Frito - 9 Kanikama Sesamo",
            price: "22.000"
          },
          {
            name: "EXPERTO B",
            description: "-",
            price: "26.000"
          },
          {
            name: "27 FRITOS",
            description: "9 Pollo - 9 Camarón - 9 Kanikama",
            price: "18.000"
          },
          {
            name: "36 FRITOS",
            description: "18 Pollo - 9 Camarón - 9 Kanikama",
            price: "22.000"
          },
          {
            name: "MENU SUSHI DEL DÍA",
            description: "",
            price: "7.500"
          }
        ],
        gradientFrom: "from-blue-400",
        gradientTo: "to-indigo-950",
        priceColor: "text-indigo-300",
        borderColor: "border-indigo-300"
      },
      {
        title: "GOHAN",
        filter: "GOHAN",
        items: [
          {
            name: "GOHAN SHIRASHI EBI",
            description: "Arroz de sushi, cebollín, palta, queso crema, sésamo y camarón.",
            price: "9.990"
          },
          {
            name: "SHIRASHI EBI TERI",
            description: "Arroz de sushi, palta, queso crema, cebollín, sésamo, pollo teriyaki y camarón.",
            price: "10.990"
          },
          {
            name: "SHIRASHI PULPO",
            description: "Arroz de sushi, pulpo, queso crema, palmito, palta y cebollín.",
            price: "12.990"
          },
          {
            name: "SHIRASHI SAKE",
            description: "Arroz de sushi, palta, queso crema, cebollín, sésamo y salmón.",
            price: "9.990"
          },
          {
            name: "SHIRASHI SUPER EXPERTO",
            description: "Arroz de sushi, Atún, masago, palta, salmón, camarón, wasabi y jengibre.",
            price: "14.990"
          },
          {
            name: "SHIRASHI TERI",
            description: "Arroz de sushi, cebollín, palta, sésamo, queso crema y pollo teriyaki.",
            price: "8.990"
          }
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
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
              className={`text-lg font-semibold bg-gradient-to-tr ${section.gradientFrom} ${section.gradientTo} flex items-center px-4 py-3`}
            >
              {section.title}
            </h2>
            <ul className='text-xs flex flex-col mb-3'>
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className='flex justify-between items-center px-4 py-1 mt-3 gap-8'
                >
                  <div>
                    <h1 className='font-semibold'>{item.name}</h1>
                    <p className='font-normal opacity-70'>{item.description}</p>
                  </div>
                  <div
                    className={`min-w-20 border ${section.priceColor} ${section.borderColor} px-2 rounded-lg`}
                  >
                    <p className='w-full text-sm text-center font-medium'>
                      ${item.price}
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
