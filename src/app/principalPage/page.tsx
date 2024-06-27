'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const PrincipalPage = () => {
  return (
    <>
        <h1> Bienvenido a Prontowash</h1>

        <main>
            <Link href="/login">
                Ingresar como empleado
            </Link>
            <Link href="/PrincipalPage">
                Ingresar como cliente
            </Link>
        </main>
    </>
  )
}

export default PrincipalPage