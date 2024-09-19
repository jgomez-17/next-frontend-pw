'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import SeccionClientes from '../clientes/page'
import { User, UsersIcon, UsersIcon2 } from '@/app/components/ui/iconos'

const PrincipalPage = () => {
  const router = useRouter();

  return (
    <>
        <main className='w-full h-screen m-auto max-md:gap-4 flex max-md:flex-col justify-center'>
          <section className='w-full flex gap-4 flex-col items-baseline p-2 md:bg-slate-50 rounded-e-3xl'>
            <Button onClick={() => router.push('/login')} className='bg-blue-950 gap-2 h-8 text-xs'>
                  Ingresar
                  <UsersIcon2 />
            </Button>
            <Image
                priority
                className='w-44 md:w-60 m-auto'
                src="/prontowash-img.png"
                alt='logo'
                width={700}
                height={300}
                >
            </Image> 
          </section>
          <section className='w-full h-screen md:p-2'>
            <SeccionClientes />
          </section>
        </main>
    </>
  )
}

export default PrincipalPage