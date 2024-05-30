'use client'

import React from 'react';
import { FaArrowTrendUp, FaPlay, FaStop } from "react-icons/fa6";
import { MdOutlinePayment, MdDoneAll } from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";


interface CardsStatsProps {
  numeroOrdenesEnEspera: number;
  numeroOrdenesHoy: number;
  numeroOrdenesPorPagar: number;
  totalRecaudado: number;
}

const CardsStats: React.FC<CardsStatsProps> = ({
  numeroOrdenesEnEspera,
  numeroOrdenesHoy,
  numeroOrdenesPorPagar,
  totalRecaudado
}) => {
  return (
     <section style={{ fontFamily: 'Overpass Variable',}} className="z-10 w-11/12 mt-2 m-auto mb-8">
         <ul className="flex flex-wrap justify-between items-center gap-1">
           <li className="text-[0.95rem] shadow-lg hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
               En espera
               <span className="flex items-center justify-between bottom-0">
                 <p className="text-3xl max-md:text-2xl font-bold">
                   {numeroOrdenesEnEspera}
                 </p>
                 <IoCarSportSharp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
               </span>
             </a>
           </li>
           <li className=" text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <a href="/views/dashboard/ordenes-por-pagar" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
               Por pagar
               <span className="flex items-center justify-between bottom-0">
                 <p className="text-3xl max-md:text-2xl font-bold">
                  {numeroOrdenesPorPagar} 
                 </p>
                 <MdOutlinePayment className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
               </span>
             </a>
           </li>
           <li className="text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <a href="/views/dashboard/ordenes-terminadas" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
               Terminadas
               <span className="flex items-center justify-between bottom-0">
                 <p className="text-3xl max-md:text-2xl font-bold">
                    {numeroOrdenesHoy} 
                 </p>
                 <MdDoneAll className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
               </span>
             </a>
           </li>
           <li className="text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
               Total Vendido Hoy
               <span className="flex items-center justify-between bottom-0">
                 <p className="text-3xl max-md:text-2xl font-bold"> 
                 {new Intl.NumberFormat("es-CO", {
                     style: "currency",
                     currency: "COP",
                     minimumFractionDigits: 0,
                   }).format(totalRecaudado)}
                 </p>
                 <FaArrowTrendUp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
               </span>
             </a>
           </li>
         </ul>
       </section>

  );
};

export default CardsStats;