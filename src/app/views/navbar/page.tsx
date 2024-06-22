'use client'

import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import { message } from 'antd';
import Link from 'next/link';
import { SettingsIcon, EstadisticasIcon, UsersIcon } from '@/app/components/ui/iconos';
import { NavigationMenuDemo } from './logout/logout-seccion';

  
const page = () => {


  return (
    <>
        <ul 
          className='text-[1.3rem] z-50 gap-6 flex fixed top-0 w-full p-3 backdrop-blur-sm items-center justify-between max-md:px-5 shadow-sm bg-white-500/30'
          style={{ fontFamily: 'Roboto', }}
        >
          <article className='flex gap-4'>

            <Link href="/">
              <Image
                className=' md:ml-8 flex pb-1'
                src="/prontowash-img.png"
                alt='logo'
                width={130}
                height={200}
              ></Image>
            </Link>

          </article>

          <article className='flex ml-auto max-md:hidden gap-2'>
            <Link href="/views/clientes"
                  className='flex px-3 rounded-full items-center text-sm gap-2 text-gray-700 hover:text-gray-500'
            > 
              <UsersIcon />              
            </Link>
            <Link href="/views/estadisticas/"
                  className='text-gray-700 hover:text-gray-500 max-md:hidden gap-2 px-3 flex font-medium items-center text-sm transition p-1 rounded-full'
            >
                <EstadisticasIcon />
            </Link>
            <Link href="/views/ajustes/" 
                  className='ml-auto max-md:hidden text-gray-700 hover:text-gray-500 flex px-3 gap-2 items-center text-sm font-medium transition rounded-full'>
                <SettingsIcon />
            </Link>
          </article>
          <NavigationMenuDemo />


        </ul>

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