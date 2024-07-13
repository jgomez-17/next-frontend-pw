'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale"; 
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DownloadIcon, SearchIcon } from '@/app/components/ui/iconos';
import { generarPDF } from './resumenPDF';
import { FaHistory } from "react-icons/fa";


type Orden = {
  id: number;
  fecha_orden: string;
  estado: string;
  empleado: string;
  metododepago: string;
  cliente: {
    id: number;
    nombre: string;
    celular: string;
    correo: string;
  };
  vehiculo: {
    id: number;
    placa: string;
    marca: string;
    tipo: string;
    color: string;
    llaves: string;
    observaciones: string;
  };
  servicio: {
    id: number;
    nombre: string;
    descuento: number;
    costo: number;
  };
};

const OrdenesPorPlaca: React.FC = () => {
  const [placa, setPlaca] = useState<string>('');
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const obtenerOrdenesPorPlaca = async (placa: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/clientes/placas/${placa}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          setOrdenes(null); // Limpiar órdenes si no se encontraron resultados
          setError('No se encontraron órdenes para la placa ingresada');
        } else {
          throw new Error('Error al obtener las órdenes. Por favor, inténtalo de nuevo.');
        }
      } else {
        const data = await response.json();
        // Ordenar las órdenes por fecha de manera descendente (más recientes primero)
        data.sort((a: Orden, b: Orden) => new Date(b.fecha_orden).getTime() - new Date(a.fecha_orden).getTime());
        setOrdenes(data);
        setError(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    obtenerOrdenesPorPlaca(placa);
  };

  const formatFecha = (fecha: string) => {
    try {
      const formattedDate = format(new Date(fecha), "PPPP 'a las' hh:mm a", { locale: es });
      return formattedDate;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha no disponible';
    }
  };


  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

            <DialogTrigger className='transition text-xs flex items-center gap-2 bg-black text-white hover:bg-slate-900 px-3 h-8 py-1 rounded-md'>
              Ver historial
              <FaHistory className='' />
            </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> </DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          <div className="w-full mx-auto rounded-md">
              <form onSubmit={handleSubmit} className="mb-4 max-md:w-max flex flex-col">
                <p className='text-sm font-medium'> Ingrese la placa del vehiculo</p>
                <label className="flex items-center gap-3 w-max">
                  <Input
                    type="text"
                    className="uppercase w-36 h-8 my-4"
                    value={placa}
                    onChange={(e) => {
                      let inputValue = e.target.value.toUpperCase();
                      inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

                      if (inputValue.length > 3) {
                        inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
                      }

                      inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

                      if (inputValue.includes('-')) {
                        const parts = inputValue.split('-');
                        parts[1] = parts[1].replace(/[^0-9]/g, '');
                        inputValue = parts.join('-');
                      }

                      inputValue = inputValue.slice(0, 7);
                      setPlaca(inputValue);
                    }} 
                    maxLength={7} // Permitir 3 letras, 1 guión y 3 números
                    required 
                  />
                <Button type='submit' variant={'default'}  className=' bg-black text-white h-8 text-xs'>
                  <SearchIcon />
                </Button>
                </label>
              </form>
              {error && <p className=" mb-4">{error}</p>}
              {ordenes && (
                <div className='w-full'>
                  <Accordion type="single" collapsible className="w-full">
                    {ordenes.map((orden) => (
                      <AccordionItem key={orden.id} value={`item-${orden.id}`}>
                        <AccordionTrigger>
                          <div className="flex items-center w-full py-2">
                            <div className="flex items-center justify-between w-full pr-4">
                            <p className="text-xs text-gray-500">{formatFecha(orden.fecha_orden)}</p>

                              <Button 
                                onClick={() => generarPDF(orden)}
                                className="flex gap-2 font-semibold text-xs capitalize p-0 h-4 bg-white text-black hover:bg-white"
                              >
                                Descargar
                                <DownloadIcon /> 
                              </Button>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="">
                            <div className="flex items-start justify-between w-full">
                              <div className="w-[40%]">
                                <p className='capitalize text-xs font-medium'> {orden.cliente.nombre} </p>
                                <p className="text-[11px] md:text-xs text-gray-500">{orden.vehiculo.marca}</p>
                                <p className="text-[11px] md:text-xs text-gray-500">{orden.vehiculo.placa}</p>
                                {/* Mostrar más detalles según sea necesario */}
                              </div>
                              <div className="w-[60%] flex flex-col gap-1">
                                <p className='text-xs font-medium'> {formatNumber(orden.servicio.costo)} </p>
                                <p className="text-[11px] md:text-xs text-gray-500 leading-tight">{orden.servicio.nombre}</p>
                                {/* Mostrar más detalles adicionales aquí */}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdenesPorPlaca;
