'use client'

import React, {useState, useEffect} from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { message } from 'antd';
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import { MdOutlineArrowBackIos } from "react-icons/md";
import Link from 'next/link';
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute';
import { ReloadIcon } from '@/app/components/ui/iconos';
import { useRouter } from 'next/navigation';
import { BackIcon } from '@/app/components/ui/iconos';

interface Orden {
  id: number;
  fechaOrden: string; // Asegúrate de que esta propiedad esté incluida
  cliente: { nombre: string; celular: string };
  vehiculo: {
    tipo: string;
    marca: string;
    color: string;
    placa: string;
    llaves: string;
  };
  servicio: { nombre_servicios: string; costo: string };
  estado: string;
  empleado: string
}

  const OrdenesTerminadas = () => {
    const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);


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

  const router = useRouter()
  const handleBackButton = () => {
      router.back();
  };

  return (
    <>
      <ProtectedRoute>
        <section className='bg-white w-full h-full p-2 tracking-tighter'>
        <nav className='flex justify-between w-full m-auto gap-3 p-2'>
          <Button onClick={handleBackButton} variant={'secondary'} className="h-8 rounded-full">
            <BackIcon />
          </Button>
          <Button onClick={reloadPage} variant={'ghost'} className='h-8 mr-auto'>
            <ReloadIcon />
          </Button>
          <h1 className='font-bold'>
            Ordenes de hoy
          </h1>
        </nav>
        <Table className="w-full m-auto mt-4 ">
            <TableHeader className="text-[1rem] bg-slate-50 font-bold max-md:text-[0.89rem] ">
              <TableRow className=" text-sm">
                <TableCell className="max-md:hidden max-md:justify-center  w-24 px-4">#</TableCell>
                <TableCell className="w-36 px-1 max-md:w-24 max-md:text-center">Cliente</TableCell>
                <TableCell className="w-44 px-1 max-md:w-24 max-md:text-center">Vehículo</TableCell>
                <TableCell className="md:w-72 px-1 max-md:text-center">Servicio</TableCell>
                <TableCell className=""> Estado</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenesTerminadas &&
                ordenesTerminadas.map((orden: Orden) => (
                  <TableRow key={orden.id} className="text-[12px]">
                    <TableCell className="max-md:hidden px-4 font-bold border-b">{orden.id}</TableCell>
                    <TableCell className="p-1 max-md:text-center border-b">
                      <section>
                        <span className="font-semibold flex flex-col capitalize">
                          {orden.cliente.nombre}
                        </span>
                        <span className="hidden">{orden.cliente.celular}</span>
                      </section>
                    </TableCell>
                    <TableCell className="p-1 max-md:text-center border-b">
                      <span className="w-full font-semibold">
                        {orden.vehiculo.placa}
                      </span>
                      <section className="gap-4">
                        <span className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </span>
                        <span> {orden.vehiculo.marca} </span>
                        <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                      </section>
                      <span className="max-md:hidden md:hidden">
                        {orden.vehiculo.llaves} <span>dejó llaves</span>
                      </span>
                    </TableCell>
                    <TableCell className="px-1 py-1 max-md:text-center border-b">
                      <section className="flex items-center justify-between max-md:flex-col">
                        <span className="font-bold flex flex-col">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          }).format(Number(orden.servicio.costo))}
                        </span>
                        <span className="md:translate-y-3">
                          <DetallesOrden orden={orden} />
                        </span>
                      </section>
                      <span className="max-md:hidden">{orden.servicio.nombre_servicios}</span>
                    </TableCell>
                    <TableCell className="w-24 border-b">
                      <span className="capitalize text-center text-xs p-1 rounded-md bg-gray-600/5 text-black"> 
                        {orden.estado} 
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
        </section>
      </ProtectedRoute>
    </>
  )
}

export default OrdenesTerminadas