'use client'

import React from 'react'
import './dashboard.css'
import Sidenav from '../components/ui/sidenav/sidenav'
import { useState } from 'react'
import { MdAttachMoney } from "react-icons/md"; //icon
import { FaCarSide } from "react-icons/fa6"; //icon
import { AiOutlineFrown } from "react-icons/ai"; //icon
import { FaList } from "react-icons/fa6";  //menu 1
import { GrUpdate } from "react-icons/gr";
import { TiThMenu } from "react-icons/ti"; //menu 2
import { HiMenuAlt2 } from "react-icons/hi"; //menu 3
import { CgRowFirst } from "react-icons/cg";
import Modal from "../components/ui/modal2/butonmodal"
import Table from "@/app/components/ui/table/table"
import NewTable from '@/app/views/tableroDeOrdenes/enCurso'
import Porpagar from '@/app/views/tableroDeOrdenes/porPagar'


const Dashboard = () => {

  // SIDENAV
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleRecargarPagina = () => {
    window.location.reload();
  };


  return (
    <>
    <section className='' style={{ marginLeft: isOpen ? '200px' : '0', transition: 'margin 0.3s ease' }}>
      <Sidenav isOpen={isOpen} toggle={toggleSidebar} />

          <nav className='nav-header z-50 flex fixed top-0 w-full p-3 items-center shadow-sm bg-slate-500/5'>
            <button onClick={toggleSidebar} className='sidenav-button'>
              <CgRowFirst className='text-[2rem]' />
            </button> 
            <h1> Admin </h1>           
          </nav>

          <nav className=' w-11/12 m-auto flex mt-16 items-center justify-between '>
            <Modal />
            <button className=' h-7 px-4 py-5 border border-slate-200 flex items-center rounded-md transition text-black hover:bg-white hover:text-blue-700 hover:border-blue-700' onClick={handleRecargarPagina}>
              <GrUpdate />
            </button> 
          </nav>

        

        {/* Contenido de tu página */}
        <article className='mt-8'>
          {/* <Table /> */}
          <NewTable />
          
        </article>   

    </section>

    </>
  )
}

export default Dashboard