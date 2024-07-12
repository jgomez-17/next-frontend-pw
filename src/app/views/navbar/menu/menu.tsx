import React, { useState, useEffect } from 'react';
import { Button, Menu } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'; // Importa los iconos necesarios
import './menu.css'; // Archivo CSS para las animaciones
import Link from 'next/link';
import { RiCloseFill } from "react-icons/ri";
import { RiSortDesc } from "react-icons/ri";
import { EstadisticasIcon, SettingsIcon, UsersIcon } from '@/app/components/ui/iconos';
import Cookies from 'js-cookie'
import LogoutButton from '@/app/login/logoutButton'


const DropdownMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rol, setRol] = useState<string | null>(null)

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  useEffect(() => {
    setRol(Cookies.get('rol') || null)
  }, [])

  return (
    <>
      {/* Botón con icono de menú o cerrar */}
      <div className='md:hidden'>

      <Button
        className='bg-transparent text-blue-900 border-none text-[25px]' 
        onClick={handleToggleMenu} icon={menuOpen ? <RiCloseFill /> : <RiSortDesc />}>
      </Button>

      {/* Menú desplegable con animación */}
      <div className={`menu-dropdown ${menuOpen ? 'open' : 'closed'}`}>
        <Menu>
        <Menu.Item key="1">
            <Link href='/views/clientes'
              className='flex ml-3 font-medium items-center gap-2 rounded'
            >
              <p>Clientes</p>
              <UsersIcon />
            </Link>
        </Menu.Item>
        <Menu.Item key="1">
            <Link href='/views/estadisticas'
              className='flex ml-3 font-medium items-center gap-2 rounded'
            >
              <p>Estadisticas</p>
              <EstadisticasIcon />
            </Link>
        </Menu.Item>
        <Menu.Item key="2" title="Ajustes">
            <Link href='/views/ajustes'
              className='flex ml-3 font-medium items-center gap-2 rounded'
            >
              <p>Ajustes</p>
              <SettingsIcon />
            </Link>
        </Menu.Item>

        <Menu.Item key="3" disabled>
          <div className='flex items-center justify-between'>
            <p className='capitalize h-7 flex items-center font-bold bg-slate-500/5 text-blue-900 w-max px-4 rounded-lg'> {rol} </p>
            <LogoutButton />
          </div>
        </Menu.Item>



        </Menu>
      </div>
      </div>
    </>
  );
};

export default DropdownMenu;
