'use client'

import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, Input, message } from 'antd';
import { Button } from '@/components/ui/button';
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute';
import { UserAdd, BackIcon, DeleteIcon, ReloadIcon } from '@/app/components/ui/iconos';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label";



interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

const Page: React.FC = () => {
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [numeroLavadores, setNumeroLavadores] = useState<number>(0);
  const [nombreLavador, setNombreLavador] = useState('')

  const fetchLavadores = () => {
    fetch('https://express-api-pw.onrender.com/api/lavadores/')
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
      const response = await fetch('https://express-api-pw.onrender.com/api/lavadores/', {
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
      nombre: nombreLavador,
      activo: '1'
    };

    try {
      const response = await fetch('https://express-api-pw.onrender.com/api/lavadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoLavador),
      });

      if (response.ok) {
        fetchLavadores();
        setNombreLavador('');
        setIsDialogOpen(false);
        message.success('Lavador registrado correctamente');
      } else {
        message.error('Error al registrar el lavador');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      message.error('Error al registrar el lavador');
    }
  };

  //Funcion para cambiar el estado del lavador a inactivo
  const cambiarEstadoLavador = (lavadorId: number) => {

    fetch("https://express-api-pw.onrender.com/api/lavadores/cambiarestadolavador", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lavadorId: lavadorId,
        newStatus: "0",
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.info("Lavador inactivo");
          fetchLavadores();
        } else {
          throw new Error("Error al actualizar el estado");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el estado:", error);
        message.error("Error al actualizar el estado");
      });
  };

  //Funcion para cambiar el estado del lavador a activo
  const cambiarEstadoLavador2 = (lavadorId: number) => {

    fetch("https://express-api-pw.onrender.com/api/lavadores/cambiarestadolavador", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lavadorId: lavadorId,
        newStatus: "1",
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.info("Lavador activo");
          fetchLavadores();
        } else {
          throw new Error("Error al actualizar el estado de la orden");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de la orden:", error);
        message.error("Error al actualizar el estado de la orden");
      });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const reloadPage = () => {
    window.location.reload();
  };

  return (    
    <>
      <ProtectedRoute>
        <Navbar />
        <section className='mt-20 w-11/12 m-auto max-md:p-0 md:ml-10 ' style={{ fontFamily: 'Roboto' }}>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <nav className='flex w-full m-auto gap-4 justify-between items-center'>
            <Link
              className=' py-1 px-3 rounded-full flex font-medium transition-all hover:bg-slate-200 text-sm items-center gap-2'
              href="/">
              <BackIcon />
            </Link>
            <Button onClick={reloadPage} className='h-8' variant={'ghost'}>
              <ReloadIcon />
            </Button>
            <DialogTrigger className='transition ml-auto flex items-center gap-2 bg-black text-white hover:bg-slate-900 px-3 h-8 py-1 rounded-md'>
              <UserAdd />
            </DialogTrigger>
            <h1 className='w-max flex font-bold text-md'>Lavadores</h1>
          </nav>
       
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

      <table id='pdf-content' className='mt-10 p-3 rounded m-auto'>
          <thead>
            <tr className='text-sm'>
              <th className='w-14 text-left p-1 border-b hidden'>ID</th>
              <th className='w-44 text-left px-5 p-1 border-b'>Nombre</th>
              <th className='w-36 text-left p-1 border-b'>Activo</th>
              <th className='w-36 text-left p-1 border-b'></th>
            </tr>
          </thead>
          <tbody className='text-xs'>
            {lavadores.map(lavador => (
              <tr className=' rounded-xl text-sm' key={lavador.id}>
                <td className='py-0 border-b hidden'>{lavador.id}</td>
                <td className='py-0 border-b px-5 capitalize'>{lavador.nombre}</td>
                <td className='py-0 border-b'>{lavador.activo === "1" ? "Si" : "No"}</td>
                <td className='py-0 border-b flex items-center gap-6'>
                  <Switch
                    className="w-10 h-4"
                    checked={lavador.activo === "1"}
                    onCheckedChange={(checked) =>
                      checked
                        ? cambiarEstadoLavador2(lavador.id)
                        : cambiarEstadoLavador(lavador.id)
                    }
                    
                  />
                      <button 
                        onClick={() => eliminarLavador(lavador.id)} 
                        className='p-1'
                      >
                        <DeleteIcon />
                      </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </section>
      </ProtectedRoute>
    </>
  );
};

export default Page;
