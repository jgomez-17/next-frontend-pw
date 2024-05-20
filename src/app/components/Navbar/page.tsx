'use client'

import React from 'react'
import { CgRowFirst } from "react-icons/cg";
import { GrUpdate } from "react-icons/gr";
import Modal from "@/app/components/ui/modal2/butonmodal"

const handleRecargarPagina = () => {
    window.location.reload();
  };

  
const page = () => {
  return (
    <>
        <nav className='text-[1.3rem] font-bold z-50 gap-2 flex fixed top-0 w-full p-3 backdrop-blur-sm items-center shadow-sm bg-white-500/30'>
            <button  className='sidenav-button'>
                <CgRowFirst className='text-[2rem]' />
            </button> 
            <a href='/'> Admin </a>           
        </nav>

        <nav className='w-11/12 m-auto flex h-12 mt-20 items-center justify-between '>
            <Modal />
            <button className=' h-7 px-4 py-4 border border-slate-200 flex items-center rounded-md transition text-black hover:bg-white hover:text-blue-700 hover:border-blue-700' onClick={handleRecargarPagina}>
              <GrUpdate />
            </button> 
        </nav>
    </>
  )
}

export default page