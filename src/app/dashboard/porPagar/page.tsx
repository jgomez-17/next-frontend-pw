'use client'

import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FaCircle } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";
import { DaviplataIcon, NequiIcon } from '@/app/components/ui/iconos'

interface Orden {
  id: number;
  cliente: { nombre: string; celular: string };
  vehiculo: { tipo: string; marca: string; color: string; placa: string; llaves: string };
  servicio: { nombre_servicios: string; costo: string };
  estado: string;
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
    <section className='mt-[10%]'>
      <h1 className='w-11/12 bg-slate-600/5 py-2 rounded text-red-600 pl-3 m-auto text-sm font-semibold items-center flex gap-2'>
        Ordenes por pagar
        <FaCircle className='text-red-600 top-0 text-xs' />
      </h1>
      <Table className='w-11/12 m-auto mt-6'>
        <TableHeader className="bg-slate-100/30 rounded-xl font-medium">
          <TableRow>
          <TableCell className="hidden md:block w-24 px-1">Nro Orden</TableCell>
            <TableCell className="w-36 px-1">Cliente</TableCell>
            <TableCell className="w-52 px-1">Vehículo</TableCell>
            <TableCell className="md:w-72 px-1 max-md:w-80">Servicio</TableCell>
            <TableCell className=""></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesPorPagar && ordenesPorPagar.map((orden: Orden) => (
            <TableRow key={orden.id} className="text-[13px]">
              <TableCell className="max-md:hidden w-20 p-2">{orden.id}</TableCell>
              <TableCell className="p-1">
                  <section>
                    <span className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </span>
                    <span>{orden.cliente.celular}</span>
                  </section>
                </TableCell>
                <TableCell className="p-1">
                  <span className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </span>
                  <section className="gap-4">
                    <span className="max-md:hidden"> {orden.vehiculo.tipo} </span>
                    <span> {orden.vehiculo.marca} </span>
                    <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                  </section>
                  <span className="max-md:hidden">
                    {orden.vehiculo.llaves} <span>dejó llaves</span>
                  </span>
                </TableCell>
                <TableCell className="p-1">
                  <section>
                    <span className="font-semibold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </span>
                    <span className="max-md:text-[0.8rem]">{orden.servicio.nombre_servicios}</span>
                  </section>
                </TableCell>
                <TableCell className="p-2 gap-y-1 items-start flex flex-col max-md:items-start text-xs">
                <Radio.Group 
                  value={metodosPago[orden.id] || ''}
                  buttonStyle="solid"
                  className='flex items-center mb-3'
                  onChange={(e) => handleMetodoPagoChange(orden.id, e.target.value)}
                >
                  <Radio.Button title='Efectivo' className='flex items-center' value="Efectivo">
                    <BsCashCoin className=' text-[18px]' />
                  </Radio.Button>
                  <Radio.Button title='Nequi' className='' value="Nequi">
                    <NequiIcon />
                  </Radio.Button>
                  <Radio.Button title='Daviplata' value="Daviplata">
                    <DaviplataIcon />
                  </Radio.Button>
                  <Radio.Button title='Otro' value="Otro">
                    Otro
                  </Radio.Button>
                </Radio.Group>
                <Button
                  variant={'secondary'}
                  className='h-8 text-xs bg-slate-500/15 text-slate-800'
                  onClick={() => actualizarEstadoOrden(orden.id)}
                >
                  Pagar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default OrdenesPorPagar;
