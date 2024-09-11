'use client'

import { useState } from "react";
import Link from 'next/link';
import { Ajustes, Grap, MultipleUsers, P } from '@/app/components/ui/iconos';
import Navbar from '@/app/views/navbar/page'
import { usePathname } from 'next/navigation'


export default function Home () {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
   <>
    <main className="flex max-md:hidden">
      <div
          className={`h-screen transition-all duration-200 bg-white ${
            isOpen ? 'w-48' : 'w-12'
          }`}
        >
          <button
            onClick={toggleSidebar}
            className="m-2 flex items-center p-1 rounded-lg focus:outline-none"
          >
            <P />
            {isOpen && <span className="mt-1 ml-2 font-medium"> Prontowash</span>}
          </button>
          <nav className="pl-2 mt-8">
            <Link
              href="/views/clientes"
              className="flex items-center px-2 py-1 my-1 transition-all hover:bg-blue-600/5 rounded-xl hover:text-blue-600"
            >
              <MultipleUsers />
              {isOpen && <span className="ml-2 text-[13px]">Usuarios</span>}
            </Link>
            <Link
              href="/views/estadisticas"
              className="flex items-center px-2 py-1 my-1 transition-all hover:bg-blue-600/5 rounded-xl hover:text-blue-600"
            >
              <Grap />
              {isOpen && <span className="ml-2 text-[13px]">Estadisticas</span>}
            </Link>
            <Link
              href="/views/ajustes"
              className="flex items-center px-2 py-1 my-1 transition-all hover:bg-blue-600/5 rounded-xl hover:text-blue-600"
            >
              <Ajustes />
              {isOpen && <span className="ml-2 text-[13px]">Ajustes</span>}
            </Link>
          </nav>
        </div>
      </main>
   </>
  );
}
