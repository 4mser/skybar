'use client'
import Banner from "./components/banner";
import Anuncios from "./components/anuncios";
import Cartas from "./components/cartas";
import AssistantDrawer from "./components/AssistantDrawer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface MenuSection {
  name: string;
  products: Product[];
}

interface SubMenu {
  name: string;
  sections: MenuSection[];
}

interface Menu {
  subMenus: SubMenu[];
}

export default function Home() {
  const { submenuName } = useParams();
  const [sections, setSections] = useState<MenuSection[]>([]);
  const barId = '66f067f56cc6f1ba2d5aee08'; // ID del bar

  useEffect(() => {
    const fetchSubmenuData = async () => {
      try {
        const response: AxiosResponse<Menu[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`
        );

        const menus = response.data;
        const menu = menus[0];

        if (menu) {
          const submenuNameParam = Array.isArray(submenuName)
            ? submenuName[0]
            : submenuName;

          const submenu = menu.subMenus.find(
            (sub: SubMenu) =>
              sub.name.toLowerCase() === decodeURIComponent(submenuNameParam).toLowerCase()
          );

          if (submenu) {
            const sectionsWithAvailableProducts = submenu.sections
              .map((section: MenuSection) => {
                const availableProducts = section.products.filter(
                  (product: Product) => product.available
                );
                return availableProducts.length > 0
                  ? { ...section, products: availableProducts }
                  : null;
              })
              .filter((section): section is MenuSection => section !== null);

            setSections(sectionsWithAvailableProducts);
          } else {
            console.error('Submenú no encontrado');
          }
        } else {
          console.error('No se encontró un menú para el bar proporcionado');
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error al obtener datos del submenú:', error.message);
        } else {
          console.error('Error inesperado:', error);
        }
      }
    };

    fetchSubmenuData();
  }, [submenuName]);
  return (
    <main>
      {/* <Topbar /> */}
      <Banner />
      <Anuncios />
      <Cartas />
      
      <br />
      {/* <Mapa /> */}
      {/* <Contacto /> */}
    </main>
  );
}
