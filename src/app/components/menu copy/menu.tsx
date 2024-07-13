import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Button } from '@/components/ui/button';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'; // Importa los iconos necesarios
import './menu2.css'; // Archivo CSS para las animaciones
import Cookies from 'js-cookie'
import LogoutButton from '@/app/login/logoutButton'


const DropdownMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const [rol, setRol] = useState<string | null>(null)

  useEffect(() => {
    setRol(Cookies.get('rol') || null)
  }, [])

  return (
    <>
      {/* Botón con icono de menú o cerrar */}
      <Button onClick={handleToggleMenu} >
        {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        {rol && <p className="text-sm font-semibold">{rol}</p>}
      </Button>

      {/* Menú desplegable con animación */}
      <div className={`menu-dropdown ${menuOpen ? 'open' : 'closed'}`}>
        <Menu>
          <Menu.Item key="1" className='hover:bg-transparent'>
            <LogoutButton />
          </Menu.Item>

        </Menu>
      </div>
    </>
  );
};

export default DropdownMenu;
