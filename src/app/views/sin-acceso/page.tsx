'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Asegúrate de importar tu componente de botón según la estructura de tu proyecto
import { BackIcon } from '@/app/components/ui/iconos';
import { BsEmojiGrimace } from "react-icons/bs";


const AccesoDenegadoPage = () => {
  const router = useRouter();

  const volverInicio = () => {
    router.push('/views');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <div className="max-w-md p-6 rounded-lg text-center">

        <p className="text-gray-700 mb-4">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <Button onClick={volverInicio} className=" gap-2" variant={'destructive'}>
          <BackIcon />
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};

export default AccesoDenegadoPage;
