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
      <ul className={`flex tracking-tight text-gray-200 font-bold m-auto justify-between items-center gap-1 transition-all duration-200 ${visible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>

              <Link href="/views/dashboard/ordenes-por-pagar" className='w-full hover:scale-105 hover:z-50 rounded-xl text-slate-700 max-md:hidden relative bg-slate-200 shadow-xl hover:shadow-sm inline-block transition-all p-2 py-4'>
                  <span className='mt-2 tracking-tight font-bold text-sm inline-block'>
                    Servicios por pagar
                  </span>

                    <MdOutlinePayment className='text-slate-300/30 bg-slate-300/20 rounded-full p-2 inline-block text-8xl absolute right-1' />
                  <p className='text-3xl mt-10 font-bold'> {numeroOrdenesPorPagar} </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-slate-600'></p>
              </Link>

              <Link href="/views/dashboard/ordenes-terminadas" className='w-full hover:scale-105 hover:z-50 text-slate-700 rounded-xl relative bg-slate-200  shadow-2xl hover:shadow-sm inline-block transition-all p-2 py-4'>
                  <span className='inline-block mt-2 font-bold tracking-tight text-sm'>
                    Servicios Terminados
                  </span>
                   <MdDoneAll className='text-slate-300/30 bg-slate-300/20 rounded-full p-1 text-8xl absolute inline-block float-end right-1' />
                  <p className='text-3xl mt-10 font-bold'> {numeroOrdenesHoy} </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-slate-600'></p>
              </Link>

              <Link href="#" className='w-full text-slate-700 hover:z-50 hover:scale-105 rounded-xl relative bg-slate-200 shadow-xl hover:shadow-sm inline-block transition-all p-2 py-4'>
                  <span className='inline-block mt-2 font-bold tracking-tight text-sm'>
                    Total ventas del dia
                  </span>
                  <LuDollarSign className='text-slate-300/30 bg-slate-300/20 rounded-full p-1 text-8xl absolute inline-block right-1'  />
                  <p className='text-3xl mt-10 font-bold'> {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(totalRecaudado)} 
                  </p>
                  <p className='absolute h-1 bottom-2 right-0 left-0 w-11/12 rounded-full m-auto bg-slate-600'></p>
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