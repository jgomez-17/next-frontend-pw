'use client'

import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { BsCashCoin } from "react-icons/bs";
import { DaviplataIcon, NequiIcon, BancolombiaIcon, ReloadIcon } from '@/app/components/ui/iconos'
import { MdOutlineArrowBackIos } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa";
import DetallesOrden from '../detalles-orden/detallesOrden';
import Link from 'next/link';
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute';
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
  empleado: string;
}


const OrdenesPorPagar = () => {
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([]);
  const [metodosPago, setMetodosPago] = useState<{ [key: number]: string }>({});
  
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

  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
      <Navbar />
      <section className='mt-20'>
        <nav className='rounded flex justify-between w-11/12 m-auto gap-4'>
          <Link
            className=' py-1 px-3 rounded-full flex font-medium transition-all hover:bg-slate-200 text-sm items-center gap-2'
            href="/">
            <BackIcon />
          </Link>
          <Button onClick={reloadPage} className='h-8 bg-transparent text-black mr-auto hover:bg-transparent hover:text-blue-600'>
            <ReloadIcon />
          </Button>
          <span className='font-bold p-1 text-[0.9rem]'> 
            Ordenes por pagar
          </span>
        </nav>
        <Table className='w-11/12 m-auto mt-6'>
          <TableHeader className="font-bold text-sm">
            <TableRow>
              <TableCell className="max-md:hidden w-24 px-1 text-center">#</TableCell>
              <TableCell className="w-36 px-1">Cliente</TableCell>
              <TableCell className="w-52 px-1">Vehículo</TableCell>
              <TableCell className="md:w-72 px-1 max-md:text-center max-md:w-80">Servicio</TableCell>
              <TableCell className=' max-md:hidden'> </TableCell>
              <TableCell className='w-36'> </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesPorPagar && ordenesPorPagar.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px]">
                <TableCell className="max-md:hidden w-16 p-2 font-bold text-center border-b">{orden.id}</TableCell>
                <TableCell className="p-1 border-b">
                      <span className="font-semibold flex flex-col capitalize">
                        {orden.cliente.nombre}
                      </span>
                      <span>{orden.cliente.celular}</span>
                </TableCell>
                <TableCell className="p-1 border-b">
                    <span className="w-full font-semibold">
                      {orden.vehiculo.placa}
                    </span>
                    <section className="gap-4">
                      <span className="max-md:hidden"> {orden.vehiculo.tipo} </span>
                      <span> {orden.vehiculo.marca} </span>
                      <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                    </section>
                    <span className="hidden">
                      {orden.vehiculo.llaves} <span>dejó llaves</span>
                    </span>
                </TableCell>
                <TableCell className="p-1 border-b">
                    <section className='flex flex-col max-md:items-center'>
                      <span className="font-bold  flex flex-col">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(orden.servicio.costo))}
                      </span>
                      <span className="max-md:text-[0.8rem] max-md:hidden">{orden.servicio.nombre_servicios}</span>
                    </section>
                </TableCell>
                <TableCell className="py-1 text-xs border-b max-md:hidden">
                      <section className='flex max-md:flex-col justify-start w-max gap-2 items-center max-md:hidden'>
                          <Radio.Group 
                            value={metodosPago[orden.id] || ''}
                            buttonStyle="solid"
                            className='flex w-max my-auto items-center'
                            onChange={(e) => handleMetodoPagoChange(orden.id, e.target.value)}
                            >
                            <Radio.Button title='Efectivo' className='flex items-center px-3' value="Efectivo">
                              <GiMoneyStack className=' text-[18px]' />
                            </Radio.Button>
                            <Radio.Button title='Bancolombia' className='flex items-center px-1' value="Bancolombia">
                              <BancolombiaIcon />
                            </Radio.Button>
                            <Radio.Button title='Nequi' className='flex items-center px-1' value="Nequi">
                              <NequiIcon />
                            </Radio.Button>
                            {/* <Radio.Button title='Transferencia' className='flex items-center' value="Transferencia">
                              <FaRegCreditCard />
                            </Radio.Button> */}
                          </Radio.Group>
                            <Button
                              className='flex items-center h-7 text-xs bg-black text-white'
                              onClick={() => actualizarEstadoOrden(orden.id)}
                              >
                              Pagar
                            </Button>
                      </section>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger className="max-md:m-auto hidden">
                          <BsThreeDotsVertical className=" text-2xl" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem>
                          <span onClick={(e) => e.stopPropagation()}>
                            <DetallesOrden orden={orden} />
                          </span>
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </TableCell>
                <TableCell className='border-b'>
                  <DetallesOrden orden={orden} />
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
