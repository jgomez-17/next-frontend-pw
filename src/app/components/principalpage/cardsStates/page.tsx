import React, {useState, useEffect} from 'react'
import { IoCarSportSharp } from "react-icons/io5";
import { AiOutlineFrown } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import Drawerform from '../../ui/drawerform/drawer';
import VerificarPlaca from '@/app/components/ui/modal2/butonmodal'

interface Orden {
    id: number;
    cliente: { nombre: string; celular: string };
    vehiculo: {
      tipo: string;
      marca: string;
      color: string;
      placa: string;
      llaves: string;
    };
    servicio: { nombre_servicios: string; costo: string };
    estado: string;
  }

const CardsStates = () => {
    const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
    const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([]);


    const fetchOrdenesEnCurso = () => {
        fetch('http://localhost:4000/api/estados/encurso')
          .then(response => response.json())
          .then(data => {
            setOrdenesEnCurso(data.ordenes);
          })
          .catch(error => console.error('Error fetching data:', error));
      };
    
      useEffect(() => {
        fetchOrdenesEnCurso();  // Fetch initial data
      }, []);


    const numeroOrdenes =
    ordenesEnCurso && ordenesEnCurso.length > 0 ? ordenesEnCurso.length : 0;

    const fetchOrdenesPorPagar = () => {
        fetch('http://localhost:4000/api/estados/porpagar')
        .then(response => response.json())
        .then(data => {
          setOrdenesPorPagar(data.ordenes);
        })
        .catch(error => console.error('Error fetching data:', error));
      };

      useEffect(() => {
        fetchOrdenesPorPagar();
      }, []);

      const numeroOrdenesPorPagar =
      ordenesPorPagar && ordenesPorPagar.length > 0 ? ordenesPorPagar.length : 0;

  return (
    <>
      <nav className=" gap-3 w-11/12 m-auto flex mt-20 mb-6 ">
        <VerificarPlaca />
        <Drawerform onOrderCreated={fetchOrdenesEnCurso} />
      </nav>
      <article className="z-10 w-11/12 mt-2 m-auto mb-8">
        <ul className="flex flex-wrap justify-between items-center gap-2">
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              En curso
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold">
                  {numeroOrdenes}
                </span>
                <IoCarSportSharp className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className=" text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="/dashboard/porPagar" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Por pagar
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold">
                 {numeroOrdenesPorPagar} 
                </span>
                <IoCarSportSharp className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Cancelados
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold"> 7 </span>
                <AiOutlineFrown className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Total hoy
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold"> 400.000 </span>
                <MdAttachMoney className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
        </ul>
      </article>
    </>
  )
}

export default CardsStates