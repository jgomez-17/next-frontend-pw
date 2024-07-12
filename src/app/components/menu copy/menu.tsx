// DropdownMenu.js

import React, { useState } from 'react';
import { Button, Menu } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'; // Importa los iconos necesarios
import './menu.css'; // Archivo CSS para las animaciones

const DropdownMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Botón con icono de menú o cerrar */}
      <Button onClick={handleToggleMenu} icon={menuOpen ? <CloseOutlined /> : <MenuOutlined />}>
        {menuOpen ? 'Cerrar Menú' : 'Abrir Menú'}
      </Button>

      {/* Menú desplegable con animación */}
      <div className={`menu-dropdown ${menuOpen ? 'open' : 'closed'}`}>
        <Menu>
          <Menu.Item key="1">Opción 1</Menu.Item>
          <Menu.Item key="2">Opción 2</Menu.Item>
          <Menu.Item key="3">Opción 3</Menu.Item>
        </Menu>
      </div>
    </>
  );
};

export default DropdownMenu;
