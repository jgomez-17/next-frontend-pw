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
     <ul className="font-sans flex w-11/12 m-auto flex-wrap justify-between items-center gap-1" >
          <li className=" shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
             <Link href="#">
                <span className='flex items-center mt-2 justify-between font-medium text-sm '>
                  En espera
                  <IoTimeOutline className='text-gray-400 text-xl' />
                </span>
                <p className='text-3xl mt-6 font-bold'> {numeroOrdenesEnEspera} </p>
             </Link>
         </li>
         <li className=" shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
             <Link href="/views/dashboard/ordenes-por-pagar" className='h-screen'>
                <span className='flex items-center mt-2 justify-between font-medium text-sm '>
                  Por pagar
                  <MdOutlinePayment className='text-gray-400 text-xl' />
                </span>
                <p className='text-3xl mt-6 font-bold'> {numeroOrdenesPorPagar} </p>
             </Link>

           </li>
           <li className=" shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
               <Link href="/views/dashboard/ordenes-terminadas">
                  <span className='flex items-center mt-2 justify-between font-medium text-sm '>
                    Terminadas
                   <MdDoneAll className='text-gray-400 text-xl' />
                  </span>
                  <p className='text-3xl mt-6 font-bold'> {numeroOrdenesHoy} </p>
               </Link>
           </li>
           <li className=" shadow hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] md:p-4">
               <Link href="#">
                  <span className='flex items-center mt-2 justify-between font-medium text-sm '>
                    Total vendido hoy
                    <LuDollarSign className='text-gray-400 text-xl'  />
                  </span>
                  <p className='text-3xl mt-6 font-bold'> {new Intl.NumberFormat("es-CO", {
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