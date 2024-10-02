import React from 'react';
import { Button } from '@/components/ui/button';
import { Ocultar, Mostrar } from '@/app/components/ui/iconos';

interface HideButtonProps {
  visible: boolean; // Prop para saber si está visible o no
  toggleVisibility: () => void; // Función para alternar la visibilidad
}

const HideButton: React.FC<HideButtonProps> = ({ visible, toggleVisibility }) => {
  return (
    <Button 
      onClick={toggleVisibility} 
      className="h-9 order-2 max-md:order-3"
      variant={"ghost"}
    >
      {visible ? <Ocultar /> :  <Mostrar />}
    </Button>
  );
};

export default HideButton;
