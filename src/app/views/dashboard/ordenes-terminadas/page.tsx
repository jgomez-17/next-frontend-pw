'use client'

import React, {useState, useEffect} from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { message } from 'antd';
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import { MdOutlineArrowBackIos } from "react-icons/md";
import Link from 'next/link';
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
        <section className='bg-white w-full h-full p-2 tracking-tigh'>
        <nav className='flex justify-between w-full m-auto gap-3 p-2'>
          <Button onClick={handleBackButton} variant={'secondary'} className="h-9 rounded-full">
            <BackIcon />
          </Button>
          <Button onClick={reloadPage} variant={'ghost'} className='h-9 mr-auto'>
            <ReloadIcon />
          </Button>
          <h5 className='font-bold text-xl'>
            Ordenes del dia
          </h5>
        </nav>
        <Table className="w-full m-auto mt-4 ">
            <TableHeader className="font-bold cursor-default tracking-wide text-[15px] max-md:text-[0.89rem] bg-slate-50">
              <TableRow>
                <TableCell className="w-1/12 max-md:hidden px-4">#</TableCell>
                <TableCell className="w-1/5 max-md:h-1/4 px-2">Cliente</TableCell>
                <TableCell className="w-1/5 max-md:h-1/4 px-2">Vehículo</TableCell>
                <TableCell className="w-1/5 max-md:h-1/4 px-2">Servicio</TableCell>
                <TableCell className="w-1/5 max-md:h-1/4 px-2 max-md:text-center"> Estado</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenesTerminadas &&
                ordenesTerminadas.map((orden: Orden) => (
                  <TableRow key={orden.id} className="md:text-[13px] text-xs font-bold">
                    <TableCell className="max-md:hidden px-4 font-bold border-b">{orden.id}</TableCell>
                    <TableCell className="p-2 border-b">
                      <section className='flex flex-col gap-1'>
                        <span className="flex flex-col capitalize">
                          {orden.cliente.nombre}
                        </span>
                        <span className="font-normal text-xs text-gray-500">{orden.cliente.celular}</span>
                      </section>
                    </TableCell>
                    <TableCell className="p-2 border-b">
                      <span>{orden.vehiculo.placa}</span>
                      <section className="font-medium text-gray-500 gap-4 my-1">
                        <span> {orden.vehiculo.tipo} </span>
                        <span> {orden.vehiculo.marca} </span>
                        <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                      </section>
                      <span className='font-medium text-gray-500 max-md:hidden'>
                        {orden.vehiculo.llaves} <span>dejó llaves</span>
                      </span>
                    </TableCell>
                    <TableCell className="p-2 border-b">
                      <section className="flex flex-col gap-1">
                        <span className="font-bold flex flex-col">
                          {new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          }).format(Number(orden.servicio.costo))}
                        </span>
                      <span className="font-medium text-gray-500">{orden.servicio.nombre_servicios}</span>
                      </section>
                    </TableCell>
                    <TableCell className="border-b">
                      <section className='flex items-center max-md:flex-col gap-2'>
                        <p className="capitalize text-center text-xs p-1 rounded-md bg-gray-600/5 text-black"> 
                          {orden.estado} 
                        </p>            
                        <DetallesOrden orden={orden} />
                      </section>
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