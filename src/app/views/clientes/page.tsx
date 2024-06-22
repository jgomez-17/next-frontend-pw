import React from 'react'
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute'
import Link from 'next/link'
import { BackIcon } from '@/app/components/ui/iconos'

const page = () => {
  return (
      <>
      <ProtectedRoute allowedRoles={['admin', 'subadmin', 'espectador']}>
        <Navbar />
        <nav className='mt-20 flex w-11/12 m-auto items-center justify-between' style={{ fontFamily: 'Roboto', }}>
            <Link href="/"
                  className='hover:bg-slate-200 px-3 py-0.5 rounded-full'  
            >
                <BackIcon />
            </Link>
            <h1 className='ml-auto font-bold'>Clientes</h1>
        </nav>
      </ProtectedRoute>
      </>
 )
}

export default page