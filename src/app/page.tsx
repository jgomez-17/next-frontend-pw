import Formulario from "./temp/formulario/page";
import Consultar from "./temp/prueba/page";
import Navbar from '@/app/views/navbar/page'
import OrdenesDashboard from '@/app/views/dashboard/lista-ordenes/page'
import PorPagar from '@/app/views/dashboard/ordenes-por-pagar/page'
import Login from "./views/login/page";

export default function Home() {
  return (
   <>
    <Navbar />
    <main>
        {/* <Login /> */}
        {/* <Navbar /> */}
        <OrdenesDashboard />
        {/* <PorPagar /> */}
        {/* <Formulario /> */}
        {/* <Consultar /> */}

    </main>
   </>
  );
}
