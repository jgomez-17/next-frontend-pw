'use client'

import React from 'react'
import { CgRowFirst } from "react-icons/cg";
import { FcSettings } from "react-icons/fc";
import { FaChartSimple } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import Image from 'next/image';

import Link from 'next/link';

  
const page = () => {

  return (
    <>
        <nav className='text-[1.3rem] z-50 gap-2 flex fixed top-0 w-full p-3 backdrop-blur-sm items-center justify-between max-md:px-5 shadow-sm bg-white-500/30'>
          <article className='flex gap-2'>
            <button  className='sidenav-button max-md:hidden' >
                <CgRowFirst className='text-[2rem]' />
            </button> 
            {/* <Link href='/' className='font-bold'> Admin </Link>  */}
            <Link href="/" className=' text-[13.5px] max-md:text-lg flex gap-2 px-3 py-2 rounded-full items-center hover:bg-slate-200 font-medium'>
              Inicio
              <FaHouse className='text-slate-600 text-lg' />
            </Link>
          </article>
          <article>
          <Image
              className='m-auto'
              src="/prontowash-img.png"
              alt='logo'
              width={120}
              height={200}
            ></Image>
          </article>
            <article className='flex max-md:hidden'>
              <Link href="/views/ajustes/" 
                className='ml-auto flex px-3 gap-2 items-center text-xs font-medium hover:bg-slate-200 transition p-2 rounded-full'>
                Ajustes
                <FcSettings className='text-lg' />
              </Link>
              <Link href="/views/estadisticas/"
                className='hover:bg-slate-200 gap-2 px-3 flex font-medium items-center text-xs transition p-2 rounded-full'
              >
                Estadisticas
                <FaChartSimple className='text-slate-600 text-lg' />
              </Link>
            </article>
          
        </nav>

        {/* <nav className='w-11/12 m-auto flex h-12 mt-20 items-center justify-between '>
            <Modal />
            <button className=' h-7 px-4 py-4 border border-slate-200 flex items-center rounded-md transition text-black hover:bg-white hover:text-blue-700 hover:border-blue-700' onClick={handleRecargarPagina}>
              <GrUpdate />
            </button> 
        </nav> */}
    </>
  )
}

export default page