'use client'

import React, { useEffect, useState} from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
 

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
        fetch('https://express-api-pw.onrender.com/api/estados/terminadohoy')
          .then(response => response.json())
          .then(data => {
            setOrdenesTerminadas(data.ordenes);
          })
          .catch(error => console.error('Error fetching data:', error));
          console.log('no hay ordenes en espera')
    };
    
    useEffect(() => {
      fetchOrdenesTerminadas();  // Fetch initial data
    }, []);


  return (
    <Sheet>
    <SheetTrigger className='text-xs max-md:mr-auto border h-8 hover:bg-slate-200 px-5 py-2 rounded-md font-bold'>
        Ordenes
    </SheetTrigger>
    <SheetContent className='overflow-y-auto' style={{ fontFamily: 'Roboto'}}>
        <SheetHeader>
        <SheetTitle>Servicios realizados hoy</SheetTitle>
        <SheetDescription>

        </SheetDescription>
        <Table className=" w-full m-auto mt-5 ">
          <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
            <TableRow className="text-sm">
              <TableCell className="max-md:hidden max-md:justify-center  w-24 px-4">#</TableCell>
              <TableCell className="w-44 px-1 max-md:w-24 max-md:text-center">Placa</TableCell>
              <TableCell className="md:w-72 px-1 max-md:text-center">Servicio</TableCell>
              <TableCell className="md:hidden"> Estado</TableCell>
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