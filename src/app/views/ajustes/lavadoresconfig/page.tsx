'use client'

import React, { useEffect, useState } from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, Input, message } from 'antd';
import { Button } from '@/components/ui/button';
import { IoPersonAdd } from "react-icons/io5";
import { TbArrowsExchange } from "react-icons/tb";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    fetch("http://localhost:4000/api/lavadores/cambiarestadolavador", {
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
          message.success("Lavador inactivo");
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

    fetch("http://localhost:4000/api/lavadores/cambiarestadolavador", {
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
          message.success("Lavador activo");
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

  const generatePDF = () => {
    const input = document.getElementById('pdf-content');
    if (input) {
      html2canvas(input, { scale: 4 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('planilla.pdf');
      });
    }
  };

  return (    
    <>
      <section className='mt-20 max-md:p-5 md:ml-10 '>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <nav className='flex max-md:w-full m-auto w-11/12 justify-between items-center'>
          <DialogTrigger className=' bg-black transition hover:bg-gray-600 px-3 py-1.5 rounded text-white'>
            <IoPersonAdd className='text-lg' />
          </DialogTrigger>
        <h1 className='w-max flex font-bold text-lg'>Lavadores</h1>
        </nav>
      <table id='pdf-content' className='mt-10 p-3 rounded m-auto'>
        <thead>
          <tr>
            <th className='w-14 text-left p-1 border-b hidden'>ID</th>
            <th className='w-44 text-left px-5 p-1 border-b'>Nombre</th>
            <th className='w-36 text-left p-1 border-b'>Activo</th>
            <th className='w-36 text-left p-1 border-b'></th>
          </tr>
        </thead>
        <tbody className=''>
          {lavadores.map(lavador => (
            <tr className=' rounded-xl text-sm' key={lavador.id}>
              <td className='p-1 border-b hidden'>{lavador.id}</td>
              <td className='p-1 border-b px-5 capitalize'>{lavador.nombre}</td>
              <td className='p-1 border-b'>{lavador.activo === "1" ? "Si" : "No"}</td>
              <td className='p-1 border-b'>
                <Button 
                  onClick={() => eliminarLavador(lavador.id)} 
                  variant={'ghost'}
                  > 
                  <MdOutlineDeleteOutline className='text-lg text-red-600' />
                </Button>
                {lavador.activo === "1" ? (
                    <Button 
                      variant={'ghost'}
                      onClick={() => cambiarEstadoLavador(lavador.id)}  
                    >
                      <TbArrowsExchange className='text-[20px]' />
                    </Button>
                  ) : (
                    <Button 
                      variant={'ghost'}
                      onClick={() => cambiarEstadoLavador2(lavador.id)}
                    >
                      <TbArrowsExchange className='text-green-500 text-[20px]' />
                    </Button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={generatePDF}>
        pdf
      </Button>

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
