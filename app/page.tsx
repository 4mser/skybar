import Image from "next/image";
import Topbar from "./components/topbar";
import Banner from "./components/banner";
import Contacto from "./components/contacto";
import Anuncios from "./components/anuncios";
import Cartas from "./components/cartas";

export default function Home() {
  return (
    <main>
      {/* <Topbar /> */}
      <Banner />
      <Anuncios />
      <Cartas />
      {/* <Contacto /> */}
    </main>
  );
}
