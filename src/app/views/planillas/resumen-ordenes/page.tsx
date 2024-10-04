'use client'

import React, { useEffect, useState} from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { message } from 'antd';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@/app/components/ui/iconos';

interface Orden {
    id: number;
    fechaOrden: string;
    estado: string;
    empleado: string;
    metodoDePago: string;
    cliente: { nombre: string; celular: string };
    vehiculo: {
        tipo: string;
        marca: string;
        color: string;
        placa: string;
        llaves: string;
    };
    servicio: {nombre_servicios: string; costo: number };
}

const ResumenOrdenes = () => {
    const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);

    //Fetch de ordenes en terminadas
    const fetchOrdenesTerminadas = () => {
        const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/terminadohoy`

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            setOrdenesTerminadas(data.ordenes);
          })
          .catch(error => console.error('Error fetching data:', error));
    };
    
    useEffect(() => {
      fetchOrdenesTerminadas();  // Fetch initial data
    }, []);

    const reloadPage = () => {
      const hideMessage = message.loading('Cargando...', 0);
  
      fetchOrdenesTerminadas();

    
      setTimeout(hideMessage, 1000);
  };


  return (
    <Sheet>
    <SheetTrigger asChild>
        <Button className='h-9' variant={'secondary'}>
          Ordenes
        </Button>
    </SheetTrigger>
    <SheetContent style={{  maxWidth: '100vw'}} 
      className='max-md:w-svw overflow-y-auto tracking-tigh' >
        <SheetHeader>
        <SheetTitle className='flex items-center gap-2'>
          <Button variant={'ghost'} onClick={reloadPage}>
            <ReloadIcon />
          </Button>
          Servicios realizados hoy
        </SheetTitle>
        <SheetDescription>

        </SheetDescription>
        <Table className=" w-full m-auto mt-5 ">
          <TableHeader className="text-[1rem] font-bold max-md:text-[0.9rem] bg-slate-50">
            <TableRow >
              <TableCell className="w-1/12 max-md:h-1/4 px-2 border-b border-black/30">#</TableCell>
              <TableCell className="w-1/5 max-md:h-1/4 px-2 border-b border-black/30">Placa</TableCell>
              <TableCell className="w-2/5 max-md:h-1/4 px-2 border-b border-black/30">Servicio</TableCell>
              <TableCell className="w-2/5 max-md:h-1/4 px-2 border-b border-black/30">Lavador/es</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesTerminadas &&
              ordenesTerminadas.map((orden: Orden) => (
                <TableRow key={orden.id} className="text-[14px] font-bold">
                  <TableCell className="p-2 text-sm border-b border-black/30">{orden.id}</TableCell>
                  <TableCell className="p-2 border-b border-black/30">
                      <section className='flex flex-col gap-1'>
                        <span>
                          {orden.vehiculo.placa}
                        </span>
                        <span className='text-gray-500 font-semibold'> {orden.vehiculo.marca} </span>
                      <span className="max-md:hidden md:hidden">
                        {orden.vehiculo.llaves} <span>dejó llaves</span>
                      </span>
                      </section>
                  </TableCell>
                  <TableCell className="p-2 border-b border-black/30">
                    <section className="flex flex-col gap-2">
                      <span className="flex flex-col">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(orden.servicio.costo))}
                      </span>
                    <span className="max-md:hidden font-semibold text-gray-600">{orden.servicio.nombre_servicios}</span>
                    </section>
                  </TableCell>
                  <TableCell className="p-2 border-b border-black/30">
                    <span className="capitalize"> 
                      {orden.empleado} 
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        </SheetHeader>
    </SheetContent>
    </Sheet>
  )
}

export default ResumenOrdenes