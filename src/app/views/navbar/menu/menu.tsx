import React, { useState, useEffect } from 'react';
import { Button, Menu } from 'antd';
import './menu.css'; // Archivo CSS para las animaciones
import Link from 'next/link';
import { RiCloseFill } from "react-icons/ri";
import { RiSortDesc } from "react-icons/ri";
import { EstadisticasIcon, SettingsIcon, UsersIcon } from '@/app/components/ui/iconos';
import Cookies from 'js-cookie';
import LogoutButton from '@/app/login/logoutButton';

const DropdownMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rol, setRol] = useState<string | null>(null);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    setRol(Cookies.get('rol') || null);
  }, []);

  const menuItems = [
    {
      key: "1",
      label: (
        <Link href='/views/clientes' className='flex ml-3 font-medium items-center gap-2 rounded'>
          <p>Clientes</p>
          <UsersIcon />
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link href='/views/estadisticas' className='flex ml-3 font-medium items-center gap-2 rounded'>
          <p>Estadisticas</p>
          <EstadisticasIcon />
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link href='/views/ajustes' className='flex ml-3 font-medium items-center gap-2 rounded'>
          <p>Ajustes</p>
          <SettingsIcon />
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <div className='flex items-center justify-between'>
          <p className='capitalize h-7 flex items-center font-bold bg-slate-500/5 text-blue-900 w-max px-4 rounded-lg'>{rol}</p>
          <LogoutButton />
        </div>
      ),
      disabled: true,
    },
  ];

  return (
    <>
      {/* Botón con icono de menú o cerrar */}
      <div className='md:hidden'>

          <Button
            className='bg-transparent text-blue-900 border-none text-[29px]'
            onClick={handleToggleMenu}
            icon={menuOpen ? <RiCloseFill /> : <RiSortDesc />}
          ></Button>


        {/* Menú desplegable con animación */}
        <div className={`menu-dropdown ${menuOpen ? 'open' : 'closed'}`}>
          <Menu className='py-2 gap-3 flex flex-col' items={menuItems} />
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;
