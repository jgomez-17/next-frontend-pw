'use client'

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { SettingsIcon, EstadisticasIcon, UsersIcon } from '@/app/components/ui/iconos';
import { NavigationMenuDemo } from './logout/logout-seccion';

  
const page = () => {

  return (
    <>
        <ul 
          className='text-[1.3rem] max-h-18 z-50 gap-6 max-md:gap-1 p-1 flex fixed top-0 w-full max-md:px-2 backdrop-blur-sm items-center justify-between shadow-sm bg-white-500/30 font-sans'
        >
          <article className='flex gap-4'>

            <Link href="/" className=''>
              <Image
                priority
                className=' md:ml-8 flex pb-1 w-36'
                src="/prontowash-img.png"
                alt='logo'
                width={500}
                height={300}
              ></Image>
            </Link>

          </article>

          <article className='flex ml-auto gap-2 max-md:gap-0'>
            <Link href="/views/clientes"
                  className='flex max-md:hidden px-3 rounded-md items-center text-sm gap-2 hover:bg-gray-100'
            > 
              <UsersIcon />              
            </Link>
            <Link href="/views/estadisticas/"
                  className='gap-2 px-3 flex font-medium items-center text-sm transition p-1 rounded-md hover:bg-gray-100'
            >
                <EstadisticasIcon />
            </Link>
            <Link href="/views/ajustes/" 
                  className='ml-auto flex px-3 gap-2 items-center text-sm font-medium transition rounded-md hover:bg-gray-100'>
                <SettingsIcon />
            </Link>
          </article>
          <NavigationMenuDemo />
        </ul>
    </>
  )
}

export default page