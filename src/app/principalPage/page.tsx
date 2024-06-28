'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PrincipalPage = () => {
  return (
    <>
        <main className='w-1/2 m-auto max-md:w-11/12 h-screen flex items-center justify-center font-sans text-sm'>
          <h1 className=' font-bold'> Bienvenido a Prontowash</h1>
          <div className='flex flex-col w-1/3 max-md:w-5/12 m-auto gap-2 text-xs'>
              <Link href="/login" className='py-1 text-center bg-blue-950 text-white'>
                  Ingresar como empleado
              </Link>
              <Link href="/views/clientes" className='py-1 text-center bg-blue-950 text-white'>
                  Ingresar como cliente
              </Link>
          </div>
        </main>
    </>
  )
}

export default PrincipalPage