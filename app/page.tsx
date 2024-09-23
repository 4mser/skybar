import Banner from "./components/banner";
import Anuncios from "./components/anuncios";
import Cartas from "./components/cartas";
import Mapa from "./components/mapa";

export default function Home() {
  return (
    <main>
      {/* <Topbar /> */}
      <Banner />
      <Anuncios />
      <Cartas />
      <br />
      <div>
        Reservar
      </div>
      <Mapa />
      {/* <Contacto /> */}
    </main>
  );
}
