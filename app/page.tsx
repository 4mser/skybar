import Banner from "./components/banner";
import Anuncios from "./components/anuncios";
import Cartas from "./components/cartas";
import BackgroundAnimation from "./components/blackhole";

export default function Home() {
  return (
    <main>
      {/* <Topbar /> */}
      <Banner />
      <Anuncios />
      <Cartas />
      {/* <BackgroundAnimation /> */}
      <br />
      {/* <Mapa /> */}
      {/* <Contacto /> */}
    </main>
  );
}
