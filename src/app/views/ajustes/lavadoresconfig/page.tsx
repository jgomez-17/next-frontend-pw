'use client'

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, message } from 'antd';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/app/components/protectedRoute';
import { BackIcon, ReloadIcon, AddUsers2, DeleteIcon2, Spin } from '@/app/components/ui/iconos';
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation';


interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

const Page: React.FC = () => {
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [numeroLavadores, setNumeroLavadores] = useState<number>(0);
  const [nombreLavador, setNombreLavador] = useState('')
  const [loading, setLoading] = useState(false);

  const fetchLavadores = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores`

    fetch(apiUrl)
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

  const eliminarLavador = async (id: number) => {

     const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este lavador?");
     if (!confirmacion) {
       return;
     }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores`
      const response = await fetch(apiUrl, {
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

  const registrarLavador = async () => {
    setLoading(true);

    const nuevoLavador = {
      nombre: nombreLavador,
      activo: '1'
    };

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores`
      const response = await fetch(apiUrl, {
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
        setLoading(false);
      } else {
        message.error('Error al registrar el lavador');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      message.error('Error al registrar el lavador');
      setLoading(false);
    }
  };

  //Funcion para cambiar el estado del lavador a inactivo
  const cambiarEstadoLavador = (lavadorId: number) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores/cambiarestadolavador`

    fetch(apiUrl, {
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
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores/cambiarestadolavador`

    fetch(apiUrl, {
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

    const hideMessage = message.loading('Cargando...', 0);
  
    fetchLavadores()
    setTimeout(hideMessage, 1000);
  };

  const router = useRouter()
  const handleBackButton = () => {
      router.back();
  };

  return (    
    <>
      <ProtectedRoute>
        <section className='w-full tracking-tighter h-full m-auto rounded-md p-2 bg-white'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <nav className='flex w-full m-auto p-2 gap-3 justify-between items-center'>
              <Button onClick={handleBackButton} variant={'secondary'} className="h-8 rounded-full">
                <BackIcon />
              </Button>
              <Button onClick={reloadPage} className='h-8 mr-auto' variant={'ghost'}>
                <ReloadIcon />
              </Button>
              <DialogTrigger asChild>
                <Button className='gap-2 h-9'> 
                  <span className='max-md:hidden'> Añadir </span>
                <AddUsers2 /> 
                </Button>
              </DialogTrigger>
              <h1 className='font-bold text-2xl'>Empleados</h1>
            </nav>
        
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar lavador</DialogTitle>
              <DialogDescription>
                <Form className='flex gap-5 mt-4' onFinish={registrarLavador}>
                  <label className='flex flex-col gap-1'>
                    <Input
                      className='w-44 capitalize h-8 max-md:w-40'
                      type="text"
                      value={nombreLavador}
                      onChange={(e) => setNombreLavador(e.target.value)}
                      required
                    />
                  </label>
                  <Button className='flex items-center text-xs h-8' itemType='submit' >
                  {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <Spin />
                        </span>
                    ) : (
                        'Agregar'
                    )}
                  </Button>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
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
                          <DeleteIcon2 />
                        </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </Dialog>
        </section>
      </ProtectedRoute>
    </>
  );
};

export default Page;
