import React from 'react'
import Link from 'next/link'
import Navbar from '@/app/views/navbar/page'


const page = () => {
  return (
    <>
    <Navbar />
    <div className='flex flex-col gap-5 mt-20 mx-3 w-max'>
      Ajustes page
      <Link href="/views/ajustes/lavadoresconfig"
         className='text-white p-1 flex items-center justify-center bg-slate-500 rounded-md' 
         >
        Lavadores
      </Link>
    </div>
    </>
  )
}

export default page