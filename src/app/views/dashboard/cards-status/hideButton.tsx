import React from 'react';
import { Button } from '@/components/ui/button';
import { Ocultar, Mostrar } from '@/app/components/ui/iconos';

interface HideButtonProps {
  visible: boolean; 
  toggleVisibility: () => void; 
}

const HideButton: React.FC<HideButtonProps> = ({ visible, toggleVisibility }) => {
  return (
    <Button 
      onClick={toggleVisibility} 
      className="h-9 order-2 max-md:order-3 rounded-none"
      variant={"secondary"}
    >
      {visible ? <Ocultar /> :  <Mostrar />}
    </Button>
  );
};

export default HideButton;
