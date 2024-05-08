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
import Modal from "../components/ui/modal2/butonmodal"
import Table from "@/app/components/ui/table/table"


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

        <article>
          <nav className='nav-header z-50 flex fixed top-0 w-full p-3 items-center shadow-sm bg-slate-500/5'>
            <button onClick={toggleSidebar} className='sidenav-button'>
              <FaList />
            </button> 
            <h1> Admin </h1>           
          </nav>
        </article>
        

        {/* Contenido de tu página */}
        <article className='body mt-20 z-10'>
          <ul className='flex items-center gap-2 justify-between'>
            <Modal />
            <button className=' h-7 px-4 py-5 border border-slate-200 flex items-center rounded-md transition text-black hover:bg-white hover:text-blue-700 hover:border-blue-700' onClick={handleRecargarPagina}>
              <GrUpdate />
            </button> 
          </ul>
          <ul className='cards'>
            <li className='card-item transition-all'> 
              <a href="" className=''>
                En curso
                <aside className='card-content'>
                  <span> 3 </span>
                  <FaCarSide className='card-icon text-gray-800/60' />
                </aside>
              </a>
            </li>
            <li className='card-item transition-all'> 
              <a href="" className=''>
                Pendientes
                <aside className='card-content'>
                  <span className=' float-right'> 2 </span>
                  <FaCarSide className='card-icon text-gray-800/60' />
                </aside>
              </a>
            </li>
            <li className='card-item transition-all'>  
              <a href="" className=''>
                Nose
                <aside className='card-content'>
                  <span> 7 </span>
                  <AiOutlineFrown className='card-icon' />
                </aside>
              </a>
            </li>
            <li className='card-item hover:bg-white transition-all'> 
              <a href=""> 
                Total hoy
                <aside className='card-content'>
                  <span> 400.000 </span>
                  <MdAttachMoney className='card-icon' />
                </aside>
              </a>
            </li>
          </ul>
        </article>

        <article className='mt-8'>
          <Table />
        </article>
          
        {/* <section className=' w-11/12 m-auto'>
          <Tabledata />
        </section> */}

    </section>

    </>
  )
}

export default Dashboard