'use client'

import React, { useState } from 'react';
import { MdOutlinePayment, MdDoneAll } from "react-icons/md";
import { LuDollarSign } from "react-icons/lu";
import Link from 'next/link';


interface CardsStatsProps {
  visible: boolean;
  numeroOrdenesEnEspera: number;
  numeroOrdenesHoy: number;
  numeroOrdenesPorPagar: number;
  totalRecaudado: number;
}

const CardsStats: React.FC<CardsStatsProps> = ({
  visible,  
  numeroOrdenesEnEspera,
  numeroOrdenesHoy,
  numeroOrdenesPorPagar,
  totalRecaudado
}) => {


  return (
      <ul className={`flex tracking-tigh font-bold m-auto justify-between items-center gap-1 transition-all duration-200 ${visible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>

              <Link href="/views/dashboard/ordenes-por-pagar" className='w-full max-md:hidden relative bg-slate-500/10 shadow hover:shadow-sm rounded-xl inline-block transition-all p-2 py-4'>
                  <span className='mt-2 tracking-tigh font-semibold text-[14px] inline-block'>
                    Por pagar
                  </span>

                    <MdOutlinePayment className='text-gray-300 bg-[#0F172A] rounded-full p-1 text-2xl inline-block float-end' />
                  <p className='text-3xl mt-10 font-bold'> {numeroOrdenesPorPagar} </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-[#0F172A]'></p>
              </Link>

              <Link href="/views/dashboard/ordenes-terminadas" className='w-full relative bg-sky-500/5 shadow hover:shadow-sm rounded-xl inline-block transition-all p-2 py-4'>
                  <span className='inline-block mt-2 font-semibold tracking-tigh text-[14px]'>
                    Terminadas
                  </span>
                   <MdDoneAll className='text-gray-300 bg-[#0F172A] rounded-full p-1 text-2xl inline-block float-end' />
                  <p className='text-3xl mt-10 font-bold'> {numeroOrdenesHoy} </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-[#0F172A]'></p>
              </Link>

              <Link href="#" className='w-full relative bg-teal-500/5 shadow hover:shadow-sm rounded-xl inline-block transition-all p-2 py-4'>
                  <span className='inline-block mt-2 font-medium text-[14px]'>
                    Total vendido hoy
                  </span>
                  <LuDollarSign className='text-gray-300 bg-[#0F172A] rounded-full p-1 text-2xl inline-block float-end'  />
                  <p className='text-3xl mt-10 font-bold'> {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(totalRecaudado)} 
                  </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-[#0F172A]'></p>
              </Link>
      </ul>
  );
};

export default CardsStats;

          {/* <li className=" shadow hover:shadow-sm inline-block rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[130px] h-[110px] p-2 md:p-4">
             <Link href="#" className='w-full'>
                <span className='mt-2 font-medium text-xs inline-block'>
                  En espera
                </span>
                  <IoTimeOutline className='text-gray-500 text-xl inline-block float-end mt-2' />
                <p className='text-3xl mt-6 font-bold'> {numeroOrdenesEnEspera} </p>
             </Link>
         </li> */}