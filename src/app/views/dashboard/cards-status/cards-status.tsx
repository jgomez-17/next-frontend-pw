'use client'

import React from 'react';
import { FaArrowTrendUp, FaPlay, FaStop } from "react-icons/fa6";
import { MdOutlinePayment, MdDoneAll } from "react-icons/md";
import { IoCarSportSharp } from "react-icons/io5";
import Link from 'next/link';


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
     <ul className="flex w-11/12 m-auto flex-wrap justify-between items-center gap-1" style={{ fontFamily: 'Roboto'}} >
         <li className="text-[0.95rem] flex flex-col shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <Link href="#" className='h-screen'>
                <span className='max-md:text-[13px] text-sm'>
                  En espera
                </span>
                <IoCarSportSharp className="text-gray-800/60 max-md:text-5xl text-6xl max-md:translate-x-32 translate-y-5 translate-x-44 opacity-30" />
                <p className='text-4xl font-semibold'> {numeroOrdenesEnEspera} </p>
             </Link>
         </li>
         <li className="text-[0.95rem] shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
             <Link href="/views/dashboard/ordenes-por-pagar" className='h-screen'>
                <span className='max-md:text-[13px] text-sm'>
                  Por pagar
                </span>
                <MdOutlinePayment className="text-gray-800/60 max-md:text-5xl text-6xl max-md:translate-x-32 translate-y-5 translate-x-44 opacity-30" />
                <p className='text-4xl mt-3 font-semibold'> {numeroOrdenesPorPagar} </p>
             </Link>

           </li>
           <li className="text-[0.95rem] shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
               <Link href="/views/dashboard/ordenes-terminadas" className='h-screen'>
                  <span className='max-md:text-[13px] text-sm'>
                    Terminadas
                  </span>
                  <MdDoneAll className="text-gray-800/60 max-md:text-5xl text-6xl max-md:translate-x-32 translate-y-5 translate-x-44 opacity-30" />
                  <p className='text-4xl mt-3 font-semibold'> {numeroOrdenesHoy} </p>
               </Link>
           </li>
           <li className="text-[0.95rem] shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
               <Link href="#" className='h-screen'>
                  <span className=' max-md:text-[13px] text-sm'>
                    Total vendido hoy
                  </span>
                  <FaArrowTrendUp className="text-gray-800/60 max-md:text-5xl text-6xl max-md:translate-x-32 translate-y-2 translate-x-44 opacity-30" />
                  <p className='text-2xl mt-3 font-bold'> {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(totalRecaudado)} 
                  </p>
               </Link>
           </li>
     </ul>
  );
};

export default CardsStats;