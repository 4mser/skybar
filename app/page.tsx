import Banner from "./components/banner";
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
