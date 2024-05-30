'use client'

import React, { useEffect, useState } from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, Input, message } from 'antd';
import { Button } from '@/components/ui/button';
import { IoPersonAdd } from "react-icons/io5";


interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

const Page = () => {
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [numeroLavadores, setNumeroLavadores] = useState<number>(0);
  const [nombreLavador, setNombreLavador] = useState('')

  const fetchLavadores = () => {
    fetch('http://localhost:4000/api/lavadores/')
      .then(response => response.json())
      .then((data: { body: Lavador[] }) => {
        setLavadores(data.body);
        setNumeroLavadores(data.body.length);
      })
      .catch(error => console.error('Error al obtener datos de lavadores:', error));
  };

  useEffect(() => {
    fetchLavadores();
  }, []);

  // Esto se ejecutará solo si no hay lavadores
  if (numeroLavadores === 0) {
    console.log('No hay lavadores disponibles');
  }

  //funcion para eliminar lavador
  const eliminarLavador = async (id: number) => {

    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este lavador?");
    if (!confirmacion) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/lavadores/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Eliminar lavador del estado local si la solicitud fue exitosa
        setLavadores(prevLavadores => prevLavadores.filter(lavador => lavador.id !== id));
        fetchLavadores();
        message.success('Eliminado correctamente')
      } else {
        message.error('Error al eliminar el lavador');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Función para registrar un nuevo lavador
  const registrarLavador = async () => {
    const nuevoLavador = {
      id: 0,
      nombre: nombreLavador,
      activo: '1'
    };

    try {
      const response = await fetch('http://localhost:4000/api/lavadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoLavador),
      });

      if (response.ok) {
        fetchLavadores();
        setNombreLavador('');
        message.success('Lavador registrado correctamente');
      } else {
        message.error('Error al registrar el lavador');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      message.error('Error al registrar el lavador');
    }
  };


  return (    
    <>
      <section style={{ fontFamily: 'Overpass Variable',}} className='mt-20 max-md:p-5 md:ml-10 '>
      <Dialog>
        <nav className='flex max-md:w-full w-[44%] justify-between items-center'>
        <h1 className='w-max flex font-medium'>Lavadores</h1>
          <DialogTrigger className=' bg-black transition hover:bg-gray-600 px-3 py-1.5 rounded text-white'>
            <IoPersonAdd className='text-lg' />
          </DialogTrigger>
        </nav>
      <table className='mt-5 p-3 rounded'>
        <thead>
          <tr className=' bg-slate-50'>
            <th className='w-14 text-left p-1 border-b'>ID</th>
            <th className='w-44 text-left p-1 border-b'>Nombre</th>
            <th className='w-36 text-left p-1 border-b'>Estado</th>
            <th className='w-36 text-left p-1 border-b'></th>
          </tr>
        </thead>
        <tbody>
          {lavadores.map(lavador => (
            <tr className=' rounded-xl text-sm' key={lavador.id}>
              <td className='p-1 border-b'>{lavador.id}</td>
              <td className='p-1 border-b'>{lavador.nombre}</td>
              <td className='p-1 border-b'>{lavador.activo === "1" ? "Activo" : "Inactivo"}</td>
              <td className='p-1 border-b'>
                <Button 
                  onClick={() => eliminarLavador(lavador.id)} 
                  variant={'ghost'}
                  > 
                  <MdOutlineDeleteOutline className='text-lg text-red-600' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar lavador</DialogTitle>
          <DialogDescription>
            <Form className='flex gap-5 mt-4' onFinish={registrarLavador}>
              <label className='flex flex-col gap-1'>
                <Input
                  className='w-44 capitalize max-md:w-40'
                  type="text"
                  value={nombreLavador}
                  onChange={(e) => setNombreLavador(e.target.value)}
                  required
                />
              </label>
              <Button className='flex items-center text-xs h-8' itemType='submit' >
                  Agregar
              </Button>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    </section>

      
    </>
  );
};

export default Page;
