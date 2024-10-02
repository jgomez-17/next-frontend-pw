"use client"

import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-[#0F172A] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">MiLogo</div>
          {/* Menú para pantallas grandes */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300">
              Inicio
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Servicios
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Contacto
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              Sobre Nosotros
            </a>
          </div>
          {/* Botón de menú hamburguesa para pantallas pequeñas */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay para pantallas pequeñas */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Menú lateral para pantallas pequeñas */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-600 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col space-y-4 mt-16 text-center">
          <a href="#" className="text-white hover:text-gray-300">
            Inicio
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Servicios
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Contacto
          </a>
          <a href="#" className="text-white hover:text-gray-300">
            Sobre Nosotros
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
