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
        <Button className='h-8 text-xs' variant={'secondary'}>
          Ordenes
        </Button>
    </SheetTrigger>
    <SheetContent style={{  maxWidth: '50vw'}} 
      className='overflow-y tracking-tighter'>
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
          <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
            <TableRow className="text-sm">
              <TableCell className="w-1/6 bg-red-400">#</TableCell>
              <TableCell className="w-1/6 bg-red-500">Placa</TableCell>
              <TableCell className="w-1/4 bg-red-700">Servicio</TableCell>
              <TableCell className="w-1/6 bg-red-600">Lavador</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesTerminadas &&
              ordenesTerminadas.map((orden: Orden) => (
                <TableRow key={orden.id} className="text-[12px]">
                  <TableCell className="max-md:hidden px-4 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                  <TableCell className="p-1 max-md:text-center border-b">
                      <section className='flex flex-col'>
                        <span className="w-full font-semibold">
                        {orden.vehiculo.placa}
                      </span>
                      <span> {orden.vehiculo.marca} </span>
                      <span className="max-md:hidden md:hidden">
                        {orden.vehiculo.llaves} <span>dejó llaves</span>
                      </span>
                      </section>
                  </TableCell>
                  <TableCell className="px-1 py-3 max-md:text-center border-b">
                    <section className="flex items-center justify-between max-md:flex-col">
                      <span className="font-bold flex flex-col">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(orden.servicio.costo))}
                      </span>
                      <span className="translate-y-3">

                      </span>
                    </section>
                    <span className="max-md:hidden">{orden.servicio.nombre_servicios}</span>
                  </TableCell>
                  <TableCell className="w-24 border-b">
                    <span className="capitalize text-center text-xs p-1 rounded-md text-black"> 
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