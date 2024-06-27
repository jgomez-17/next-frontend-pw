'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PrincipalPage = () => {
  return (
    <>
        <main className='  w-1/2 m-auto h-screen flex items-center justify-center font-sans text-sm'>
          <h1 className=' '> Bienvenido a Prontowash</h1>
          <div className='flex flex-col w-1/3 m-auto gap-2'>
              <Link href="/login" className='py-1 rounded-sm text-center outline outline-gray-500/30'>
                  Ingresar como empleado
              </Link>
              <Link href="/views/clientes" className='py-1 rounded-sm text-center outline outline-gray-500/30'>
                  Ingresar como cliente
              </Link>
          </div>
        </main>
    </>
  )
}

export default PrincipalPage