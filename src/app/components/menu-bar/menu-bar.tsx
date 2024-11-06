"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Acumulado, Grap, Home, Logout, MenuClose1, MenuOpen1, UserSettings } from "../ui/iconos";
import { ProfileMenu } from '@/app/components/menu-bar/profile-menu';
import Image from "next/image";

const Navbar = () => {
  const currentPath = usePathname()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className=" w-full bg-white shadow px-2 text-sm font-medium h-14 min-h-14 flex z-50">
        <div className="container flex justify-between items-center p-0">
          <div className="text-2xl font-bold order-1 max-md:order-2 text-black">Dashboard</div>
          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex gap-1 order-2">
            <Link
                  href="/views"
                  className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-gray-100 hover:text-black ${
                    currentPath === "/views" ? "bg-gray-200 text-black" : ""
                  }`}
                >
                {/* <Home /> */}
                Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-gray-100 hover:text-black ${
                  currentPath === "/views/estadisticas" ? "bg-gray-200 text-black" : ""
                }`}
              >
              {/* <Grap /> */}
              Estadisticas
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-gray-100 hover:text-black ${
                  currentPath === "/views/planillas/acumulados" ? "bg-gray-200 text-black" : ""
                }`}
              >
              {/* <Acumulado /> */}
              Acumulado
            </Link>
            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-gray-100 hover:text-black ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-gray-200 text-black" : ""
                }`}
              >
              {/* <Logout /> */}
              Cierre
            </Link>
          </div>
          <div className="order-3 max-md:order-3 flex items-center gap-4">
            <Link
              href="/views/ajustes"
              className={`w-full flex px-3 py-1 items-center gap-2 hover:bg-gray-100 hover:text-black max-md:hidden ${
                currentPath === "/views/ajustes" ? "bg-gray-200 text-black" : ""
              }`}
            >
              <UserSettings />
            </Link>
            <ProfileMenu />
          </div>
          {/* Botón de menú para pantallas pequeñas */}
          <div className="md:hidden order-2 max-md:order-1">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none flex px-2"
            >
              {isOpen ? <MenuClose1 /> : <MenuOpen1 /> }
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay para pantallas pequeñas */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-100 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Menú lateral para pantallas pequeñas */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col space-y-1 mt-14 text-center">
            <Link
                href="/views"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-black/10 hover:text-black ${
                currentPath === "/views" ? "bg-gray-200 rounded-none" : ""
                }`}
                >
                <Home />
                Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-black/10 hover:text-black ${
                  currentPath === "/views/estadisticas" ? "bg-gray-200 rounded-none" : ""
                }`}
              >
              <Grap />
              Estadisticas
            </Link>
            <Link
                href="/views/ajustes"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-black/10 hover:text-black ${
                  currentPath === "/views/ajustes" ? "bg-gray-200 rounded-none" : ""
                }`}
              >
              <UserSettings />
              Ajustes
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-black/10 hover:text-black ${
                  currentPath === "/views/planillas/acumulados" ? "bg-gray-200 rounded-none" : ""
                }`}
              >
              <Acumulado />
              Acumulado
            </Link>
            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-black/10 hover:text-black ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-gray-200 text-white rounded-none" : ""
                }`}
              >
              <Logout />
              Cierre
            </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
