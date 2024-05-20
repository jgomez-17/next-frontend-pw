import Formulario from "./formulario/page";
import Dashboard from "./dashboard/page";
import Consultar from "./prueba/page";
import Navbar from '@/app/components/Navbar/page'
import EnCurso from '@/app/dashboard/enCurso/page'
import PorPagar from '@/app/dashboard/porPagar/page'

export default function Home() {
  return (
   <>
    <main>
      {/* <Navbar /> */}
      <EnCurso />
      {/* <PorPagar /> */}
      {/* <Dashboard /> */}
        {/* <Formulario /> */}
        {/* <Consultar /> */}
    </main>
   </>
  );
}
