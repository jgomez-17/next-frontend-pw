'use client'

import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { DaviplataIcon, NequiIcon, BancolombiaIcon, ReloadIcon, Spin } from '@/app/components/ui/iconos'
import { GiMoneyStack } from "react-icons/gi";
import { BsThreeDotsVertical } from "react-icons/bs";
import DetallesOrden from '../detalles-orden/detallesOrden';
import ProtectedRoute from '@/app/components/protectedRoute';
import { BackIcon } from '@/app/components/ui/iconos';
import { useRouter } from 'next/navigation';
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "@/components/ui/select"


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
  empleado: string;
}


const OrdenesPorPagar = () => {
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([]);
  const [metodosPago, setMetodosPago] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const fetchOrdenesPorPagar = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/porpagar`

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      setOrdenesPorPagar(data.ordenes);
    })
    .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchOrdenesPorPagar();
  }, []);
  
  const handleMetodoPagoChange = (orderId: number, value: string) => {
    setMetodosPago({ ...metodosPago, [orderId]: value });
  };
  
  const actualizarEstadoOrden = (orderId: number) => {
    
    const metodoPago = metodosPago[orderId];
    if (!metodoPago) {
      message.error('Por favor selecciona un método de pago');
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ordenes/actualizarestado2`
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: 'terminado',
        metodoPago: metodoPago,
      }),
    })
    .then(response => {
      if (response.ok) {
        message.success('Servicio pagado con exito');
        fetchOrdenesPorPagar();
        } else {
          throw new Error('Error al actualizar el estado de la orden');
        }
      })
      .catch(error => {
        console.error('Error al actualizar el estado de la orden:', error);
        message.error('Error al actualizar el estado de la orden');
      });
  };
    
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };

  const reloadPage = () => {
    const hideMessage = message.loading('Cargando...', 0);

    fetchOrdenesPorPagar();
  
    setTimeout(hideMessage, 1000);
  };
  
  const router = useRouter()
  const handleBackButton = () => {
      router.back();
  };

  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
      <section className='w-full p-2 h-full bg-white tracking-tigh'>
        <nav className='rounded p-2 flex justify-between w-full m-auto gap-2'>
          <Button onClick={handleBackButton} variant={'secondary'} className="h-9 rounded-full">
            <BackIcon />
          </Button>
          <Button onClick={reloadPage} variant={'ghost'} className='h-9 mr-auto'>
            <ReloadIcon />
          </Button>
          <h5 className='font-bold text-xl'> 
            Ordenes por pagar
          </h5>
        </nav>
        <Table className='w-full m-auto mt-4'>
          <TableHeader className="font-bold cursor-default tracking-wide text-[15px] max-md:text-[0.89rem] bg-slate-50">
            <TableRow>
              <TableCell className="w-1/12 max-md:hidden px-3">#</TableCell>
              <TableCell className="w-1/5 max-md:w-1/4 px-2">Cliente</TableCell>
              <TableCell className="w-1/5 max-md:w-1/4 px-2">Vehículo</TableCell>
              <TableCell className="w-2/5 max-md:w-1/4 px-2">Servicio</TableCell>
              <TableCell className='w-2/5 max-md:w-1/4 px-2 max-md:hidden'> Metodo de pago </TableCell>
              <TableCell className='md:hidden max-md:w-1/4 px-4 text-center'> Acciones </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesPorPagar && ordenesPorPagar.map((orden: Orden) => (
              <TableRow key={orden.id} className="md:text-[13px] text-xs font-bold">
                <TableCell className="max-md:hidden text-sm px-3 font-bold w-20 py-1 border-b">{orden.id}</TableCell>
                <TableCell className="p-2 border-b">
                      <section className='flex flex-col gap-1'>
                        <p className="capitalize">
                          {orden.cliente.nombre}
                        </p>
                        <p className='font-medium text-xs text-gray-500'>{orden.cliente.celular}</p>
                      </section>
                </TableCell>
                <TableCell className="p-2 border-b">
                    <span>{orden.vehiculo.placa}</span>
                    <section className='font-medium text-gray-500 my-1'>
                      <span className="max-md:hidden"> {orden.vehiculo.tipo} </span>
                      <span> {orden.vehiculo.marca} </span>
                      <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                    </section>
                    <span className="font-medium text-gray-500 max-md:hidden">
                      {orden.vehiculo.llaves} <span>dejó llaves</span>
                    </span>
                </TableCell>
                <TableCell className="p-2 border-b">
                    <section className='flex flex-col gap-1'>
                      <span className="font-bold  flex flex-col">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(orden.servicio.costo))}
                      </span>
                      <span className="max-md:hidden font-medium text-gray-500">{orden.servicio.nombre_servicios}</span>
                    </section>
                </TableCell>
                <TableCell className="py-1 text-xs border-b max-md:hidden">
                      <section className='flex max-md:flex-col justify-start w-max gap-2 items-center max-md:hidden'>
                      <Select value={metodosPago[orden.id] || ''} onValueChange={(value) => handleMetodoPagoChange(orden.id, value)}>
                        <SelectTrigger className="w-[150px] h-9 font-medium text-xs">
                          <SelectValue placeholder="Metodo de pago" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel> Selecciona </SelectLabel>
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                            <SelectItem value="Bancolombia">Bancolombia</SelectItem>
                            <SelectItem value="Nequi">Nequi</SelectItem>
                            <SelectItem value="Daviplata">Daviplata</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                            <Button
                              className='h-9 text-xs'
                              onClick={() => actualizarEstadoOrden(orden.id)}
                              >
                              {loading ? (
                                  <span className="flex items-center justify-center gap-3">
                                      <Spin />
                                  </span>
                              ) : (
                                  'Pagar'
                              )}
                            </Button>
                            <span onClick={(e) => e.stopPropagation()}>
                                  <DetallesOrden orden={orden} />
                            </span>          
                      </section>
                </TableCell>
                <TableCell className="p-2 text-xs border-b md:hidden">
                    <span onClick={(e) => e.stopPropagation()}>
                        <DetallesOrden orden={orden} />
                    </span> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </ProtectedRoute>
    </>
  );
};

export default OrdenesPorPagar;
