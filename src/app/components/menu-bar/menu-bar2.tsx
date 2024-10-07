"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { Acumulado, Grap, Home, Logout, MenuClose1, MenuOpen1, UserSettings } from "../ui/iconos";
import { ProfileMenu } from '@/app/components/menu-bar/profile-menu';

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
      <nav className="bg-[#0F172A] w-full p-0 text-sm text-gray-300 h-14 flex fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold order-1 max-md:order-2">MiLogo</div>
          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex space-x-1 order-2">
            <Link
                  href="/views"
                  className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                    currentPath === "/views" ? "bg-white/10 rounded-none" : ""
                  }`}
                >
                {/* <Home /> */}
                Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/estadisticas" ? "bg-white/10 rounded-none" : ""
                }`}
              >
              {/* <Grap /> */}
              Estadisticas
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/planillas/acumulados" ? "bg-white/10 rounded-none" : ""
                }`}
              >
              {/* <Acumulado /> */}
              Acumulado
            </Link>
            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white rounded-none" : ""
                }`}
              >
              {/* <Logout /> */}
              Cierre
            </Link>
          </div>
          <div className="order-3 max-md:order-3 flex items-center gap-4">
            <Link
              href="/views/ajustes"
              className={`w-full flex rounded-full px-2 py-0.5 bg-white/5 items-center gap-2 hover:bg-white/10 hover:text-white max-md:hidden ${
                currentPath === "/views/ajustes" ? "bg-white/10 rounded-none" : ""
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
              className="text-white focus:outline-none"
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#0F172A] text-gray-300 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col space-y-1 mt-16 text-center">
            <Link
                href="/views"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                currentPath === "/views" ? "bg-white/10 rounded-none" : ""
                }`}
                >
                <Home />
                Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/estadisticas" ? "bg-white/10 rounded-none" : ""
                }`}
              >
              <Grap />
              Estadisticas
            </Link>
            <Link
                href="/views/ajustes"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/ajustes" ? "bg-white/10 rounded-none" : ""
                }`}
              >
              <UserSettings />
              Ajustes
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/planillas/acumulados" ? "bg-white/10 rounded-none" : ""
                }`}
              >
              <Acumulado />
              Acumulado
            </Link>
            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-white/10 hover:text-white ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white rounded-none" : ""
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
