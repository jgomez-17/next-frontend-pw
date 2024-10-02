'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import SeccionClientes from '../clientes/page'
import { FlechaDerecha, User, UsersIcon, UsersIcon2 } from '@/app/components/ui/iconos'
import Login from '../login/page'

const PrincipalPage = () => {
  const router = useRouter();

  return (
    <>
        <main className='w-full relative h-screen m-auto max-md:gap-4 flex flex-col justify-center'>
            <section className='flex flex-col gap-4 m-auto'>
                <Image
                    priority
                    className='m-auto'
                    src="/prontowash-img.png"
                    alt='logo'
                    width={400}
                    height={300}
                    >
                </Image>
                <Login />
                <SeccionClientes />
            </section>
        </main>
    </>
  )
}

export default PrincipalPage