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
        title: "Cocina de Autor",
        filter: "Cocina de Autor",
        items: [
          {
            name: "Ceviche",
            description: "Carne de pescado, camarón, aderezados con leche de tigre, cebolla morada, choclo, rocotto y cilantro.",
            price: "$13.900"
          },
          {
            name: "Acevichate",
            description: "Camarones crocantes apanados en tierra de nori acompañados de cremoso ceviche de salmón.",
            price: "$13.900"
          },{
            name: "Are not Tacos",
            description: "Salsa quemada, salsa verde y cebolla, sobre tortilla frita con carne deshilachada y salsa de carne.",
            price: "$14.900"
          },{
            name: "Malaya",
            description: "Malaya de cerdo a la plancha aderezada con chimichurri de pimientos quemados, tostadas de la casa.",
            price: "$16.900"
          },{
            name: "Pinchos de Res",
            description: "Cubos de carne cubiertos de salsa de alcaparra y perejil, terminados con cebolla crocante.",
            price: "$16.900"
          },{
            name: "Asado de Tira al Estilo Sky (2 - 3 Personas)",
            description: "Asado de tira 700g braceado con salsa de carne acompañado de papas nativas y cebolla cocinada en salsa de limón.",
            price: "$39.900"
          },{
            name: "Asado de Tira al Estilo Sky",
            description: "Asado de tira 350g braceado con salsa de carne acompañado de papas nativas y cebolla cocinada en salsa de limón.",
            price: "$22.900"
          },{
            name: "Spicy Pulpo",
            description: "Pulpo rebozado por tempura y condimentos de la casa, con hojuelas crocantes de maíz, terminado con una spicy mayo y limón grillado.",
            price: "$16.900"
          },{
            name: "Oro Verde",
            description: "Cama de vegetales fritos condimentados, croqueta de palta con cebolla, avellana, cilantro y ajo, sobre ellas una salsa de betarraga.",
            price: "$9.900"
          },{
            name: "Frescor al Paladar",
            description: "Croqueta de champiñón, ensaladilla de Lechuga y menta, chutney de kiwi, champiñón frito, avellana europea, queso azul y ají encurtido.",
            price: "$11.900"
          },{
            name: "Vieras Agridulces (15 und)",
            description: "Ostiones apanados en salsa de oriental, acompañados de mermelada de pimiento piquillo, ají encurtido y morrones estofados.",
            price: "$13.900"
          },{
            name: "Costa brava (Nuevo)",
            description: "Choritos confitados y fogoneados, sobre una salsa a base de camarón tomate y mantequilla. Terminado con aji amarillo encurtido y crocante de arroz.",
            price: "$9.900"
          },{
            name: "Sabor andino (Nuevo)",
            description: "Cordero cocinado con hierbas a baja temperatura, sellado en mantequilla con coliflor asada, salsa de murta y almendras crocantes.",
            price: "$23.900"
          }
        ],
        gradientFrom: "from-green-700",
        gradientTo: "to-yellow-500",
        priceColor: "text-lime-300",
        borderColor: "border-lime-300"
        
      },
      {
        title: "Tapas Calientes",
        filter: "Tapas Calientes",
        items: [
          {
            name: "Jardín en las alturas (Nuevo)",
            description: "Papas en cubo con salsa de queso azul, sobre ellas una fresca salsa verde y terminado con camarones salteados en aceite de trufa.",
            price: "$14.900"
          },
          {
            name: "Pastelera y Pincho (Producto Vegano)",
            description: "Pastelera de choclo con albahaca, pincho de verduras salteadas, tomate cherry confitado.",
            price: "$8.900"
          },
          {
            name: "Fuego y Pulpo",
            description: "Salsa atomatada, pulpo grillado en cama de chips de papas y emulsión de limón.",
            price: "$8.900"
          },
          {
            name: "Alitas BBQ",
            description: "Alitas de Pollos rebozadas en BBQ picante.",
            price: "$9.900"
          },
          {
            name: "Costillas Baby Ribs",
            description: "Tiernas costillas de cerdo bañadas en salsa de miel picante de cacho de cabra.",
            price: "$8.900"
          },
          {
            name: "Pulled Pork",
            description: "Cerdo cocinado a baja temperatura, terminado con bbq de cerveza negra y tres salsas de la casa, servido en tortilla crocante de harina de trigo.",
            price: "$9.900"
          },
          {
            name: "Chupe de Jaiba",
            description: "Mini chupe de jaiba en masa philo y frosting de alcaparras.",
            price: "$9.900"
          }
        ],
        gradientFrom: "from-red-700",
        gradientTo: "to-red-950",
        priceColor: "text-red-500",
        borderColor: "border-red-500"
      },
      {
        title: "Tapas Frias",
        filter: "Tapas Frias",
        items: [
          {
            name: "Citrico Atardecer (Nuevo)", 
            description: "Slice de salmón fogoneado en una galleta de ajo con queso de cabra ahumado terminado con un gajo de mandarina y salsa de arándano.", 
            price: "$9.900"
          },
          {
            name: "Tentación Ahumada (Nuevo)", 
            description: "Crocante tortilla de papa sobre ella lonchas de carne ahumadas terminado con una salsa cítrica de mostaza en grano.", 
            price: "$8.900"
          },
          {
            name: "Deleite Valdiviano", 
            description: "Sierra Ahumada, fondo de alcachofa ,mostaza en grano, cilantro y crema de limón sobre crocante pan brioche.", 
            price: "$8.900"
          },
          {
            name: "Atún en Piedra", 
            description: "Tierno Atún marinado en crema de limón, cebolla y ají encurtido terminado con mostaza en grano y cilantro, acompañado de crocancias de la casa.", 
            price: "$9.900"
          },
          {
            name: "Roast Beef", 
            description: "Lonchas de carne de res aderezadas con salsa tártara, tomates semi secos y crocante de perejil.", 
            price: "$10.900"
          },
          {
            name: "Steak (Tártaro)", 
            description: "Fresca carne cruda cortada a cuchillo, emulsionada con salsa de la casa, pepinillos, alcaparra, cebolla, perejil y mayonesa al ajo negro, acompañada de tostadas.", 
            price: "$11.900"
          },
          {
            name: "Locos por el Sur", 
            description: "Locos en salsa de lechuga y cilantro acompañados de gel de perejil, terminado con alioli de ajo asado.", 
            price: "$16.900"
          }
        ],
        gradientFrom: "from-teal-500",
        gradientTo: "to-cyan-600",
        priceColor: "text-teal-300",
        borderColor: "border-teal-300"
        
      },
      {
        title: "Sandwiches",
        filter: "Sandwiches",
        items: [
          {
            name: "Burger",
            description: "Pan brioche, hamburguesa hecha en casa, tomate, lechuga, queso cheddar gratinado, cebolla morada, pepinillos y salsa de casa.",
            price: "$10.900"
          },
          {
            name: "Cloud",
            description: "Pan brioche, carne de Res deshilachada, tocino, champiñón, morrón quemado en crema, cebolla frita y salsa de la casa.",
            price: "$9.900"
          }
        ],
        gradientFrom: "from-red-950",
        gradientTo: "to-amber-500",
        priceColor: "text-yellow-500",
        borderColor: "border-yellow-500"
      },
      {
        title: "Tapas Dulces",
        filter: "Tapas Dulces",
        items: [
          {
            name: "Dulce misterio",
            description: "6 macarrón con su respectivo maridaje.",
            price: "$9.900"
          },
          {
            name: "Cremoso con altura",
            description: "Cremoso de chocolate, con centro de ganache de café y maní con crocancia de cacao amargo.",
            price: "$5.900"
          }
        ],
        gradientFrom: "from-fuchsia-500 ",
        gradientTo: "to-red-800",
        priceColor: "text-fuchsia-200",
        borderColor: "border-fuchsia-200"
        
      }
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
