import React from 'react';
import styles from './sidenav.module.css';
import { IoClose } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { FaChartSimple } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";


const Sidenav = ({ isOpen, toggle }) => {

  const handleOverlayClick = () => {
    if (isOpen) {
      toggle();
    }
  };

  return (
    <>
      {isOpen && <section className={styles.overlay} onClick={handleOverlayClick} />}
      <section className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={toggle}>
          <IoClose />
        </button>
        <ul className={styles.lista}>
          <li className='flex py-1 px-4 transition-all'> 
            <a href="#" className='w-full p-2 text-[40px] rounded-lg flex items-center gap-3 transition-all text-slate-600 hover:bg-sky-500/15 hover:text-sky-700'> 
              <IoLogOut />
              <span className='text-lg'> Cierre </span>
            </a>
          </li>
          <li className='flex py-1 px-4 transition-all'> 
            <a href="#" className='w-full p-2 text-2xl rounded-lg flex items-center gap-4 transition-all text-slate-600 hover:bg-sky-500/15 hover:text-sky-700'> 
              <FaHistory />
              <span className='text-lg'> Historial mensual </span>
            </a>
          </li>
          <li className='flex py-1 px-4 transition-all'> 
            <a href="#" className='w-full p-2 text-2xl rounded-lg flex items-center gap-4 transition-all text-slate-600 hover:bg-sky-500/15 hover:text-sky-700'> 
               <FaUsers />
               <span className='text-lg'> Clientes </span>
            </a>
          </li>
          <li className='flex py-1 px-4 transition-all'> 
            <a href="#" className='w-full p-2 text-2xl rounded-lg flex items-center gap-4 transition-all text-slate-600 hover:bg-sky-500/15 hover:text-sky-700'> 
               <FaChartSimple />
               <span className='text-lg'> Estadisticas </span>
            </a>
          </li>
        </ul>
      </section>
    </>
  );
};
export default Sidenav;
