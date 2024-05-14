import Formulario from "./formulario/page";
import Dashboard from "./dashboard/page";
import Consultar from "./prueba/page";
import Navbar from "./components/navbar/navbar";

export default function Home() {
  return (
   <>
    <main>
      <Dashboard />
        {/* <Formulario /> */}
        {/* <Consultar /> */}
    </main>
   </>
  );
}
