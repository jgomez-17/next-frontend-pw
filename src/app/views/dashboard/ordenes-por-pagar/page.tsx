'use client'

import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { BsCashCoin } from "react-icons/bs";
import { DaviplataIcon, NequiIcon } from '@/app/components/ui/iconos'
import { MdOutlineArrowBackIos } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaRegCreditCard } from "react-icons/fa";
import DetallesOrden from '../detalles-orden/detallesOrden';

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
  
  useEffect(() => {
    fetchOrdenesPorPagar();
  }, []);
  
  const fetchOrdenesPorPagar = () => {
    fetch('http://localhost:4000/api/estados/porpagar')
    .then(response => response.json())
    .then(data => {
      setOrdenesPorPagar(data.ordenes);
      console.log(data.ordenes)
    })
    .catch(error => console.error('Error fetching data:', error));
  };
  
  const handleMetodoPagoChange = (orderId: number, value: string) => {
    setMetodosPago({ ...metodosPago, [orderId]: value });
  };
  
  const actualizarEstadoOrden = (orderId: number) => {
    const metodoPago = metodosPago[orderId];
    if (!metodoPago) {
      message.error('Por favor selecciona un método de pago');
      return;
    }
    
    fetch('http://localhost:4000/api/ordenes/actualizarestado2', {
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
    

  return (
    <section style={{ fontFamily: 'Overpass Variable',}} className='mt-[70px]'>
      <nav className='rounded flex justify-between w-11/12 m-auto'>
        <a
          className='w-8 p-2 rounded-full font-medium transition-all bg-slate-100 hover:bg-slate-200 text-sm items-center gap-2'
          href="/views/dashboard/lista-ordenes">
          <MdOutlineArrowBackIos />
        </a>
        <span className=' font-medium p-1 text-[0.9rem]'> 
          Ordenes por pagar
        </span>
      </nav>
      <Table className='w-11/12 m-auto mt-6'>
        <TableHeader className="font-bold text-[1rem]">
          <TableRow>
            <TableCell className="max-md:hidden w-24 px-1 text-center">#</TableCell>
            <TableCell className="w-36 px-1">Cliente</TableCell>
            <TableCell className="w-52 px-1">Vehículo</TableCell>
            <TableCell className="md:w-72 px-1 max-md:w-80">Servicio</TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesPorPagar && ordenesPorPagar.map((orden: Orden) => (
            <TableRow key={orden.id} className="text-[12px]">
              <TableCell className="max-md:hidden w-16 p-2 font-bold text-center border-b-1">{orden.id}</TableCell>
              <TableCell className="p-1 border-b-1 border-black">
                    <span className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </span>
                    <span>{orden.cliente.celular}</span>
                </TableCell>
                <TableCell className="p-1 border-b-1">
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
                <TableCell className="p-1 border-b-1">
                  <section className=' flex items-center gap-2'>
                    <span className="font-bold  flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </span>
                    <span className="max-md:text-[0.8rem] hidden">{orden.servicio.nombre_servicios}</span>
                    <span className="">
                      <DetallesOrden orden={orden} />
                    </span>
                  </section>
                </TableCell>
                <TableCell className="gap-2 items-start max-md:items-start text-xs border-b-1 border-black">
                    <section className='flex gap-2'>
                        <Radio.Group 
                          value={metodosPago[orden.id] || ''}
                          buttonStyle="solid"
                          className='flex w-max items-center mb-3'
                          onChange={(e) => handleMetodoPagoChange(orden.id, e.target.value)}
                        >
                          <Radio.Button title='Efectivo' className='flex items-center' value="Efectivo">
                            <GiMoneyStack className=' text-[18px]' />
                          </Radio.Button>
                          <Radio.Button title='Transferencia' className='flex items-center' value="Transferencia">
                            <FaRegCreditCard />
                          </Radio.Button>
                        </Radio.Group>
                          <Button
                            className='h-8 text-xs bg-blue-700 hover:bg-blue-500 text-white'
                            onClick={() => actualizarEstadoOrden(orden.id)}
                          >
                          Pagar
                          </Button>
                    </section>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default OrdenesPorPagar;
