'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../context/DarkModeContext';

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
      title: "Coctelería de Autor",
      filter: "Coctelería de Autor",
      items: [
        {
          name: "El Mariachi",
          description: "Tequila Olmeca, jugo de naranja, pulpa de mango, ají merquén, jugo de limón, jarabe de goma.",
          price: "7.900"
        },
        {
          name: "Stout Grapefrut",
          description: "Whisky de miel, jugo de limón, esencia de vainilla, jarabe de goma de cerveza negra y jugo de naranja",
          price: "7.900"
        },
        {
          name: "Apple Fresh",
          description: "Jugo de Limón, whisky manzana, jarabe de goma y ginger ale",
          price: "7.900"
        },
        {
          name: "Bosque Encantado",
          description: "Gin Beefeater , jarabe de goma, limón, syrup de murta y soda",
          price: "7.900"
        },
        {
          name: "Alexander Estilo Sky",
          description: "Tequila Olmeca de chocolate, crema, jarabe de goma y frangelico",
          price: "7.900"
        },
        {
          name: "Apple Fashioned",
          description: "Pisco Mistral Nobel Apple, bourbon, jarabe de goma y angostura",
          price: "7.900"
        },
        {
          name: "Tommys Margarita",
          description: "Tequila Olmeca, syrup de miel y jugo de limón",
          price: "7.900"
        },
        {
          name: "Espíritu Sky",
          description: "Pisco Espíritu de los Andes, syrup de canela, jugo de manzana y limón",
          price: "7.900"
        },
        {
          name: "Gin de la Casa",
          description: "Gin Beefeater infusionado en té de mariposa, tónica",
          price: "7.900"
        },
        {
          name: "Paloma del Sur",
          description: "Tequila Olmeca reposado, jugo de pomelo, jugo de limón y syrup de miel",
          price: "7.900"
        },
        {
          name: "Limón y Mariposa",
          description: "Gin Beefeater, syrup de limón infusionado en té de flor de mariposa y ginger ale",
          price: "7.900"
        },
        {
          name: "Tostado Rosso",
          description: "Mistral barrica tostada, pulpa de piña, pulpa de frutilla, jugo de limón, jarabe de goma y aperol",
          price: "7.900"
        },
        {
          name: "Moscow Mule Sky",
          description: "Vodka wyborowa, syrup simple, jengibre, pulpa de piña, ST germain y soda",
          price: "7.900"
        },
        {
          name: "Piña colada Sky (Producto Vegano)",
          description: "Ron Havana Blanco, Ron Malibu, crema de coco y pulpa de piña",
          price: "7.900"
        },
        {
          name: "Ramazzotti sour",
          description: "Ramazzotti, jugo de limón, syrup simple y albúmina",
          price: "7.900"
        },
        {
          name: "Sangría de la Casa",
          description: "Vino tinto, syrup de canela, jugo de durazno, soda y trozos de naranja y manzana",
          price: "7.900"
        },
        {
          name: "Negroni Julet",
          description: "Ron Havana Reserva, campari, jugo de limón, jugo de piña y syrup simple",
          price: "7.900"
        },
        {
          name: "Mai tai Sky",
          description: "Ron havana reserva, jugo de limón, ron especiado (falernum), pulpa de naranja, pulpa de mango y syrup simple",
          price: "8.900"
        },
        {
          name: "New york sour",
          description: "Whisky ballantines 7 años, jugo de limón, syrup simple, vino tinto, con espuma de pulpa de naranja",
          price: "8.900"
        },
        {
          name: "New Espresso",
          description: "Vodka wyborowa, Vermouth rosso, licor de café borghetti, frangelico y café espresso lucaffe",
          price: "8.900"
        },
        {
          name: "Pink princess",
          description: "Gin beefeater, chambord, jugo de limón y syrup simple",
          price: "8.900"
        },
        {
          name: "Pasión Sky",
          description: "Cognac Hennesy, vodka absolut, pulpa de maracuyá, jugo de limón, syrup simple y espumante",
          price: "9.900"
        },
        {
          name: "Cloud Nine",
          description: "Vodka absolut Raspberry, Cassis, goma limón y mariposa, limón",
          price: "7.200"
        },
        {
          name: "Sour naranja (Nuevo)",
          description: "Pisco Barsol, albumina, jugo de naranja, syrup simple, jugo de limón y soda",
          price: "6.900"
        },
        {
          name: "Sweet Winnie (Nuevo)",
          description: "Cynar (licor de alcachofa), Gin beefeater, jengibre, syrup de miel, syrup de murta, limón",
          price: "9.900"
        },
        {
          name: "Burning Passion (Nuevo)",
          description: "Jack Fire, Jugo Maracuyá, Jugo piña, syrup miel, dash de angostura",
          price: "9.900"
        },
        {
          name: "101 (Nuevo)",
          description: "Ramazzotti Violetto, Gin The Botanist, Vermouth bianco",
          price: "9.900"
        },
        {
          name: "Apple Mule (Nuevo)",
          description: "Pisco Mistral Nobel Apple, syrup de canela, jengibre, limón, ginger ale",
          price: "7.900"
        },
        
      ],
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
          name: "Cosmopolitan",
          description: "Vodka Wyborowa, jugo de limón, jarabe de goma, cranberries",
          price: "7.200"
        },
        {
          name: "Daiquiris Sabores",
          description: "Ron Habana blanco, jarabe de goma, jugo de limón, triple sec, fruta a elección",
          price: "7.200"
        },
        {
          name: "Freshpirinha",
          description: "Licor de Melón, esencia de manzana, limón pica, jarabe de goma",
          price: "7.200"
        },
        {
          name: "Mojito",
          description: "Ron havana club, limón de pica, jarabe de goma, jugo de limón, menta",
          price: "7.200"
        },
        {
          name: "Clavo Oxidado",
          description: "Whisky ballantines 7 años, Drambuie, clavos de Olor",
          price: "7.200"
        },
        {
          name: "Beefeater Pink & Tonic",
          description: "Beefeater Pink, tónica y frutillas",
          price: "7.200"
        },
        {
          name: "Tom Collins",
          description: "Gin Beefeater, jugo de limón, jarabe de goma, soda",
          price: "7.200"
        },
        {
          name: "Ruso Blanco",
          description: "Vodka Wyvorowa, licor de café, crema de leche y jarabe de goma",
          price: "7.200"
        },
        {
          name: "Orgasmo",
          description: "Amaretto, Baileys, licor de café",
          price: "7.200"
        },
        {
          name: "Pink Paradise",
          description: "Licor Amaretto, jugo de limón, ron de coco, jugo de piña, licor cassis",
          price: "7.200"
        },
        {
          name: "Ruso Negro",
          description: "Vodka Wyborowa, licor de café",
          price: "7.200"
        },
        {
          name: "Piscolón Espíritu de Los Andes",
          description: "Pisco Espíritu de Los Andes, vermut bianco y jugo de limón",
          price: "7.200"
        },
        {
          name: "Smoked negroni",
          description: "Vermouth rosso, Campari, Gin, terminación ahumado en canela",
          price: "7.200"
        },
        {
          name: "Moscow Mule",
          description: "Vodka wyborowa, jarabe de goma, jengibre y jugo de limón",
          price: "7.500"
        },
        {
          name: "Mojito Sabores",
          description: "",
          price: "7.500"
        },
        {
          name: "Mojito Jager",
          description: "",
          price: "7.500"
        },
      ],
      
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
          name: "Caipirinha",
          description: "",
          price: "5.900"
        },
        {
          name: "Stout grapefrut",
          description: "",
          price: "5.900"
        },
        {
          name: "Primavera",
          description: "",
          price: "5.900"
        },
        {
          name: "Bebida de cramberries Calle Calle",
          description: "",
          price: "5.900"
        },
        {
          name: "Hop Tonic Calle Calle",
          description: "",
          price: "5.900"
        },
        
      ],
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
          name: "Murttet (Nuevo)",
          description: "Infusión de murta con menta y espuma de manzana",
          price: "5.900"
        },
        {
          name: "Ramazzotti ice tea (Nuevo)",
          description: "Té, jugo de limón, syrup de Ramazzotti, tónica",
          price: "5.900"
        },
      ],
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
          name: "Sour Peruano",
          description: "",
          price: "6.500"
        },
        {
          name: "Whisky Sour",
          description: "",
          price: "5.900"
        },
        {
          name: "Sour Sabores",
          description: "",
          price: "6.200"
        },

      ],
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
          name: "Ramazzotti Rosato Tonic",
          description: "",
          price: "7.200"
        },
        {
          name: "Ramazzotti Violetto Spritz",
          description: "",
          price: "7.200"
        },
        {
          name: "Ramazzotti Violetto Tonic",
          description: "",
          price: "7.200"
        },
        {
          name: "Baileys",
          description: "",
          price: "7.200"
        },
        {
          name: "Fernet Branca",
          description: "",
          price: "7.200"
        },
        {
          name: "St. Germain",
          description: "",
          price: "8.900"
        },
        {
          name: "Jagermaister",
          description: "",
          price: "7.200"
        },
        {
          name: "Aperol",
          description: "",
          price: "7.200"
        },
        {
          name: "Amarula",
          description: "",
          price: "7.200"
        },
        {
          name: "Chambord",
          description: "",
          price: "7.200"
        },
        {
          name: "Kir Royal",
          description: "",
          price: "6.500"
        },
        {
          name: "Dry Martini",
          description: "",
          price: "7.200"
        },
        {
          name: "Jagermeister Manifest",
          description: "",
          price: "14.900"
        },

      ],
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
          name: "Tropical Gin",
          description: "",
          price: "7.500"
        },
        {
          name: "Gin de Verano",
          description: "",
          price: "7.500"
        },
        {
          name: "Carpano Rosso",
          description: "",
          price: "7.500"
        },
        {
          name: "Carpano Bianco",
          description: "",
          price: "7.500"
        },
      ],
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
          name: "Absolut variedades (Peach, Citron, Mandrin, Mango, Pears, Rapsberri).",
          description: "",
          price: "6.900"
        },
        {
          name: "Stolichnaya",
          description: "",
          price: "6.900"
        },
        {
          name: "Ciervo Austral (premium 100% local)",
          description: "",
          price: "10.900"
        },
        {
          name: "Grey Goose",
          description: "",
          price: "11.900"
        },
        {
          name: "Ketel One",
          description: "",
          price: "9.900"
        },
        {
          name: "Stolichnaya Elite",
          description: "",
          price: "11.500"
        },
        {
          name: "Ciroc Original",
          description: "",
          price: "11.900"
        },
        {
          name: "Mamont",
          description: "",
          price: "20.900"
        },

      ],
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
          name: "Havana Club Añejo 7 años",
          description: "",
          price: "8.900"
        },
        {
          name: "Havana Club Selección de Maestros",
          description: "",
          price: "10.900"
        },
        
      ],
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
          name: "Hennesy",
          description: "",
          price: "15.900"
        },
      ],
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
          name: "Johnnie Walker Red Label",
          description: "",
          price: "7.200"
        },
        {
          name: "Ballantines Hard Fire",
          description: "",
          price: "7.900"
        },
        {
          name: "Jhonnie Walker Blonde",
          description: "",
          price: "8.200"
        },
        {
          name: "Chivas Regal 12 años",
          description: "",
          price: "9.900"
        },
        {
          name: "Chivas Regal 18 años",
          description: "",
          price: "21.900"
        },
        {
          name: "Johnnie Walker 18 años",
          description: "",
          price: "24.900"
        },
        {
          name: "Johnnie Walker Blue Label",
          description: "",
          price: "80.000"
        },

      ],
      
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
          name: "Jack Daniel's Honey",
          description: "",
          price: "9.900"
        },
        {
          name: "Jack Daniel's Fire",
          description: "",
          price: "9.900"
        },
        {
          name: "Jack Daniel's Apple",
          description: "",
          price: "9.900"
        },
        {
          name: "Jack Daniel's Gentleman",
          description: "",
          price: "12.900"
        },
        {
          name: "Jack Daniel's Single Barrel",
          description: "",
          price: "15.900"
        },
        {
          name: "Jack Daniel's Sinatra",
          description: "",
          price: "64.900"
        },

      ],
      
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
        
      ],
      
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
          name: "The Glenlivet Single Malts 12 años",
          description: "",
          price: "9.900"
        },
        {
          name: "Glenfiddich Single Malts 12 años",
          description: "",
          price: "10.500"
        },
        {
          name: "The Glenlivet Single Malts 15 años",
          description: "",
          price: "22.900"
        },
      ],
      
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
          name: "Mistral 40",
          description: "",
          price: "7.200"
        },
        {
          name: "Alto del Carmen 40",
          description: "",
          price: "7.200"
        },
        {
          name: "Mistral Nobel Extra Añejado",
          description: "",
          price: "8.900"
        },
        {
          name: "Mistral Barrica Tostada",
          description: "",
          price: "9.900"
        },
        {
          name: "Mistral Nobel Apple",
          description: "",
          price: "9.900"
        },
        {
          name: "Mistral Gran Nobel",
          description: "",
          price: "11.900"
        },
      ],
      
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
          name: "Horcon Quemado",
          description: "",
          price: "9.200"
        },
        {
          name: "Horcon Quemado 2 años",
          description: "",
          price: "9.500"
        },
        {
          name: "Espíritu de Los Andes",
          description: "",
          price: "9.200"
        },
      ],
      
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
          name: "Beefeater Pink",
          description: "",
          price: "6.900"
        },
        {
          name: "Beefeater Orange",
          description: "",
          price: "6.900"
        },
        {
          name: "Malfy",
          description: "",
          price: "12.900"
        },
        {
          name: "London",
          description: "",
          price: "9.900"
        },
        {
          name: "Bulldog",
          description: "",
          price: "8.200"
        },
        {
          name: "Puerto de Indias Strawberry",
          description: "",
          price: "8.200"
        },
        {
          name: "Tanqueray Sevilla",
          description: "",
          price: "8.900"
        },
        {
          name: "The Botanist",
          description: "",
          price: "9.900"
        },
        {
          name: "Hendricks",
          description: "",
          price: "11.900"
        },
        {
          name: "Kantal",
          description: "",
          price: "6.500"
        },
        {
          name: "Drumshando Gunpowder",
          description: "",
          price: "11.900"
        },
        {
          name: "Whitley Neill",
          description: "",
          price: "12.900"
        },
        {
          name: "Hendrick Lunar",
          description: "",
          price: "12.900"
        },
      ],
      
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
          name: "Olmeca Reposado",
          description: "",
          price: "6.500"
        },
      ],
      
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
          name: "Viña Mar Brut 750",
          description: "",
          price: "15.900"
        },
        {
          name: "Riccadonna Asti",
          description: "",
          price: "30.900"
        },
        {
          name: "Riccadonna Prosecco",
          description: "",
          price: "30.900"
        },
        {
          name: "Martini Asti",
          description: "",
          price: "30.900"
        },
        {
          name: "Viñamar Extra Brut",
          description: "",
          price: "21.900"
        },
        {
          name: "Mumm",
          description: "",
          price: "19.900"
        },
      ],
      
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
          name: "Pionero Reserva SB",
          description: "",
          price: "12.900"
        },
        {
          name: "Pionero Reserva Chardonnay",
          description: "",
          price: "12.900"
        },
        {
          name: "Morande Gran Reserva Chardonnay",
          description: "",
          price: "15.900"
        },
        {
          name: "Morande Gran Reserva Merlot",
          description: "",
          price: "15.900"
        },
        {
          name: "Casa Patronales Reserva",
          description: "",
          price: "16.900"
        },
        {
          name: "Terroir Wines Semillon",
          description: "",
          price: "16.900"
        },
        {
          name: "Veramonte Carmenere",
          description: "",
          price: "24.900"
        },
        {
          name: "Perez Cruz Gran Reserva",
          description: "",
          price: "25.900"
        },
        {
          name: "Casa del Bosque Gran Reserva Carmenere",
          description: "",
          price: "28.900"
        },
        {
          name: "Perez Cruz Limited Edition Carmenere",
          description: "",
          price: "39.900"
        },
        {
          name: "Monte Alpha C.S",
          description: "",
          price: "42.900"
        },

      ],
      
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
          name: "Agua Perrier con gas",
          description: "",
          price: "3.500"
        },
        {
          name: "Coca Cola",
          description: "",
          price: "2.900"
        },
        {
          name: "Coca Cola Zero",
          description: "",
          price: "2.900"
        },
        {
          name: "Sprite",
          description: "",
          price: "2.900"
        },
        {
          name: "Sprite Zero",
          description: "",
          price: "2.900"
        },
        {
          name: "Canada Dry ginger ale",
          description: "",
          price: "2.900"
        },
        {
          name: "Canada Dry tónica",
          description: "",
          price: "2.900"
        },
        {
          name: "Ginger",
          description: "",
          price: "2.900"
        },
        {
          name: "Jugo natural",
          description: "",
          price: "4.200"
        },

      ],
      
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
          name: "Tónica Fentimans",
          description: "",
          price: "3.500"
        },
      ],
      
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
          name: "Red Bull Yellow",
          description: "",
          price: "3.900"
        },
        {
          name: "Red Bull Sugar Free",
          description: "",
          price: "3.900"
        },
      ],
      
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
          name: "Kunstmann 0.0",
          description: "",
          price: "4.500"
        },
      ],
      
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
          name: "Kunstmann Lager, Lager S/ filtrar, Torobayo, Bock, Arándano",
          description: "",
          price: "4.200"
        },
        {
          name: "Cerveza Austral Calafate de barril 500cc",
          description: "",
          price: "4.900"
        },
        {
          name: "Cerveza Austral Calafate de barril 330cc",
          description: "",
          price: "4.200"
        },
        {
          name: "Cerveza Mad Charlie's West Coast IPA de barril 500cc",
          description: "",
          price: "5.200"
        },
        {
          name: "Cerveza Mad Charlie's Organic RED ALE de barril 500cc",
          description: "",
          price: "4.900"
        },
        {
          name: "Cerveza Calle Calle Stout Ale de barril 500cc",
          description: "",
          price: "4.900"
        },
        {
          name: "Cerveza Calle Calle Llancahue lager de barril 500cc",
          description: "",
          price: "4.900"
        },
        {
          name: "Cerveza Bundor NINFA de barril 500cc",
          description: "",
          price: "4.900"
        },
        {
          name: "Cerveza Bundor ELFA de barril 500cc",
          description: "",
          price: "4.900"
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
  const { isDarkBackground } = useDarkMode(); // Obtenemos el estado desde el contexto
  
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
        className={`fixed top-12 border-b border-white/20 backdrop-blur-md left-0 w-full z-10 overflow-x-auto flex py-4 px-4 gap-3 ${
          isDarkBackground ? "bg-[#0a0a0a]" : "bg-transparent"
        }`}
      >
        {menuSections.map((section, index) => (
          <button
            key={index}
            className='text-[12px] py-3 px-4 border whitespace-nowrap border-white/20 rounded-[10px]'
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
            <h2 className={`text-lg font-semibold  flex items-center px-4 py-3 bg-gradient-to-br from-teal-500 to-cyan-500`}
            >
              {section.title}
            </h2>
            <ul className=' text-xs flex flex-col mb-3'>
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
                    className={`min-w-20 border  px-2 rounded-[10px]`}
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
