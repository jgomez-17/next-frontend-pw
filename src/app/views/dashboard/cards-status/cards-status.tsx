'use client'

import React from 'react';
import { FaArrowTrendUp, FaPlay, FaStop } from "react-icons/fa6";
import { MdOutlinePayment, MdDoneAll } from "react-icons/md";
import { LuDollarSign } from "react-icons/lu";
import { IoTimeOutline } from "react-icons/io5";
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
    <>
     <ul className=" flex w-11/12 m-auto flex-wrap justify-between items-center gap-1" >
          <li className=" shadow hover:shadow-sm inline-block rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
             <Link href="#" className='w-full'>
                <span className='mt-2 font-medium text-xs inline-block'>
                  En espera
                </span>
                  <IoTimeOutline className='text-gray-500 text-xl inline-block float-end mt-2' />
                <p className='text-3xl mt-6 font-bold'> {numeroOrdenesEnEspera} </p>
             </Link>
         </li>
         <li className=" shadow hover:shadow-sm rounded-lg inline-block transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
             <Link href="/views/dashboard/ordenes-por-pagar" className='w-full'>
                <span className='mt-2 font-medium text-xs inline-block'>
                  Por pagar
                </span>
                  <MdOutlinePayment className='text-gray-500 text-xl inline-block float-end mt-2' />
                <p className='text-3xl mt-6 font-bold'> {numeroOrdenesPorPagar} </p>
             </Link>

           </li>
           <li className=" shadow hover:shadow-sm rounded-lg inline-block transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
               <Link href="/views/dashboard/ordenes-terminadas" className='w-full'>
                  <span className='mt-2 font-medium text-xs inline-block'>
                    Terminadas
                  </span>
                   <MdDoneAll className='text-gray-500 text-xl inline-block mt-2 float-end' />
                  <p className='text-3xl mt-6 font-bold'> {numeroOrdenesHoy} </p>
               </Link>
           </li>
           <li className=" shadow hover:shadow-sm inline-block rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
               <Link href="#" className='w-full'>
                  <span className='inline-block mt-2 font-medium text-xs '>
                    Total vendido hoy
                  </span>
                    <LuDollarSign className='inline-block float-end mt-2 text-gray-500 text-xl'  />
                  <p className='text-3xl mt-6 font-bold'> {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(totalRecaudado)} 
                  </p>
               </Link>
           </li>
     </ul>
     </>
  );
};

export default CardsStats;