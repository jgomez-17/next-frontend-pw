'use client'

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { SettingsIcon, EstadisticasIcon, UsersIcon, ChartIcon, ChartIcon2, UsersIcon2, UsersIcon3, UsersIcon4, UsersIcon5, SettingsIcon2, SettingsIcon3, ChartIcon3, SettingsIcon4, MenuIcon, ChartIcon4, SettingsIcon5 } from '@/app/components/ui/iconos';
import {MenuApps} from '@/app/views/navbar/menu/menu-apps'
import LogoutMenu from '@/app/components/menu copy/menu'
import { ProfileMenu } from '@/app/views/navbar/profile-menu';
import './navbar.css'

  
const page = () => {

  return (
    <>
        <ul 
          className='text-[1.3rem] md:max-h-12 z-50 gap-6 max-md:gap-1 flex fixed top-0 w-full backdrop-blur-sm items-center justify-between shadow-sm bg-white-500/30 max-md:h-14'
        >
          <article className='md:hidden'>
            <MenuApps />
          </article>
          <article className='flex max-h-12 max-md:m-auto md:ml-10'>
            <Link href="/" className=''>
              <Image
                priority
                className='flex w-[120px]'
                src="/prontowash-img.png"
                alt='logo'
                width={500}
                height={300}
              ></Image>
            </Link>
          </article>

          <article className='flex text-gray-600 ml-auto h-12 max-md:gap-0 w-max max-md:hidden'>
            <Link href="/views/clientes" title='Clientes' className='menu-link flex px-4 items-center font-medium text-sm gap-2 hover:text-black hover:bg-gray-100 max-md:hidden'> 
              <span className='name-link'>Clientes</span>
              <UsersIcon4 />              
            </Link>
            <Link href="/views/estadisticas" title='Estadisticas' className='menu-link gap-2 px-3 flex font-medium items-center text-sm transition p-1 hover:text-black hover:bg-gray-100'>
                <span className='name-link'>Estadisticas</span>
                <ChartIcon4 />
            </Link>
            <Link href="/views/ajustes" title='Ajustes' className='menu-link ml-auto flex px-3 gap-2 items-center text-sm font-medium transition hover:text-black hover:bg-gray-100'>
                <span className='name-link'>Ajustes</span>
                <SettingsIcon5 />
            </Link>
          </article>
          {/* <NavigationMenuDemo /> */}
          <ProfileMenu />
        </ul>
    </>
  )
}

export default page