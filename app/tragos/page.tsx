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
        title: "Coctelería de Autor",
        filter: "Coctelería de Autor",
        items: [
          {
            name: "El Mariachi",
            description: "Tequila Olmeca, jugo de naranja, pulpa de mango, ají merquén, jugo de limón, jarabe de goma.",
            price: "7.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
          
        ],
        gradientFrom: "from-red-700",
        gradientTo: "to-red-950",
        priceColor: "text-red-500",
        borderColor: "border-red-500"
      },
      {
        title: "Sugerencias del Barman",
        filter: "Sugerencias del Barman",
        items: [
          {
            name: "Caipirinha",
            description: "Cachaza, limón de pica y jarabe de goma.",
            price: "7.200"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-green-700",
        gradientTo: "to-yellow-500",
        priceColor: "text-lime-300",
        borderColor: "border-lime-300"
      },
      {
        title: "Cócteles sin Alcohol",
        filter: "Cócteles sin Alcohol",
        items: [
          {
            name: "Mojito", 
            description: "", 
            price: "5.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-red-950",
        gradientTo: "to-amber-500",
        priceColor: "text-yellow-500",
        borderColor: "border-yellow-500"
      },
      {
        title: "Mocktails",
        filter: "Mocktails",
        items: [
          {
            name: "Social cucumber (Nuevo)",
            description: "Pepino, esencia de coco, pulpa de piña, jugo de limón, syrup simple.",
            price: "5.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-red-400",
        gradientTo: "to-orange-400",
        priceColor: "text-orange-300",
        borderColor: "border-orange-300"
      },
      {
        title: "Selección de Sour",
        filter: "Selección de Sour",
        items: [
          {
            name: "Pisco Sour",
            description: "",
            price: "5.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-teal-500",
        gradientTo: "to-cyan-600",
        priceColor: "text-teal-300",
        borderColor: "border-teal-300"
      },
      {
        title: "Cordiales",
        filter: "Cordiales",
        items: [
          {
            name: "Ramazzotti Rosato Spritz",
            description: "",
            price: "7.200"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-400",
        gradientTo: "to-gray-300",
        priceColor: "text-gray-300",
        borderColor: "border-gray-300"
      },
      {
        title: "Especial",
        filter: "Especial",
        items: [
          {
            name: "Branca Cola",
            description: "",
            price: "6.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-red-400",
        gradientTo: "to-lime-400",
        priceColor: "text-lime-300",
        borderColor: "border-lime-300"
      },
      {
        title: "Vodka",
        filter: "Vodka",
        items: [
          {
            name: "Absolut Blue Original",
            description: "",
            price: "6.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-gray-700",
        gradientTo: "to-gray-900",
        priceColor: "text-gray-400",
        borderColor: "border-gray-400"
      },
      {
        title: "Ron",
        filter: "Ron",
        items: [
          {
            name: "Havana Club Añejo Reserva",
            description: "",
            price: "7.200"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-emerald-400",
        gradientTo: "to-lime-800",
        priceColor: "text-emerald-500",
        borderColor: "border-emerald-500"
      },
      {
        title: "Cognac",
        filter: "Cognac",
        items: [
          {
            name: "Charles Gabriel",
            description: "",
            price: "7.200"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-blue-400",
        gradientTo: "to-indigo-950",
        priceColor: "text-indigo-300",
        borderColor: "border-indigo-300"
      },
      {
        title: "Scotch",
        filter: "Scotch",
        items: [
          {
            name: "Ballantines Finest",
            description: "",
            price: "6.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Bourbon",
        filter: "Bourbon",
        items: [
          {
            name: "Jack Daniel's",
            description: "",
            price: "7.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Irish Whiskey",
        filter: "Irish Whiskey",
        items: [
          {
            name: "Jameson",
            description: "",
            price: "8.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Malts",
        filter: "Malts",
        items: [
          {
            name: "The Glenlivet Founder's Reserve",
            description: "",
            price: "8.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Pisco",
        filter: "Pisco",
        items: [
          {
            name: "Mistral 35",
            description: "",
            price: "6.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Pisco Premium",
        filter: "Pisco Premium",
        items: [
          {
            name: "Pisco El Gobernador",
            description: "",
            price: "8.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Gin",
        filter: "Gin",
        items: [
          {
            name: "Beefeater",
            description: "",
            price: "6.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Tequila",
        filter: "Tequila",
        items: [
          {
            name: "Olmeca Blanco",
            description: "",
            price: "6.500"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Espumosos",
        filter: "Espumosos",
        items: [
          {
            name: "Copa Espumante",
            description: "",
            price: "4.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Vino",
        filter: "Vino",
        items: [
          {
            name: "Pionero Reserva CS",
            description: "",
            price: "12.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Gaseosas y Jugos",
        filter: "Gaseosas y Jugos",
        items: [
          {
            name: "Agua Mineral Vital",
            description: "",
            price: "2.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Gaseosas Premium",
        filter: "Gaseosas Premium",
        items: [
          {
            name: "Ginger Britvic",
            description: "",
            price: "3.500"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Bebidas Energéticas",
        filter: "Bebidas Energéticas",
        items: [
          {
            name: "Red Bull",
            description: "",
            price: "3.900"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "Cervezas sin Alcohol",
        filter: "Cervezas sin Alcohol",
        items: [
          {
            name: "Royal 0.0",
            description: "",
            price: "4.500"
          },
          {
            name: "",
            description: "",
            price: ""
          },
        ],
        gradientFrom: "from-zinc-800",
        gradientTo: "to-zinc-200",
        priceColor: "text-zinc-300",
        borderColor: "border-zinc-300"
      },
      {
        title: "De Especialidad",
        filter: "De Especialidad",
        items: [
          {
            name: "Cerveza Austral (botella 330)",
            description: "",
            price: "4.200"
          },
          {
            name: "",
            description: "",
            price: ""
          },
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
