'use client'

import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FaCircle } from "react-icons/fa";
import { BsCashCoin } from "react-icons/bs";

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
          message.success('Estado de la orden actualizado correctamente');
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
    <section className='mt-20'>
      <h1 className='w-11/12 pl-3 m-auto text-sm font-semibold items-center flex gap-2'>
        Órdenes por pagar
        <FaCircle className='text-red-600 top-0 text-xs' />
      </h1>
      <Table className='w-11/12 m-auto mt-6'>
        <TableHeader>
          <TableRow>
            <TableCell># Orden</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Vehículo</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesPorPagar && ordenesPorPagar.map((orden: Orden) => (
            <TableRow key={orden.id}>
              <TableCell>{orden.id}</TableCell>
              <TableCell>
                <section>
                  <span className='font-semibold flex flex-col capitalize'>{orden.cliente.nombre}</span>
                  <span>{orden.cliente.celular}</span>
                </section>
              </TableCell>
              <TableCell>
                <span className='w-full font-semibold'>{orden.vehiculo.placa}</span>
                <section className='gap-4'>
                  <span>{orden.vehiculo.tipo}</span>
                  <span>{orden.vehiculo.marca}</span>
                  <span>{orden.vehiculo.color}</span>
                </section>
                <span>{orden.vehiculo.llaves} <span>dejó llaves</span></span>
              </TableCell>
              <TableCell>
                <section>
                  <span className='font-semibold flex flex-col'>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(orden.servicio.costo))}</span>
                  <span>{orden.servicio.nombre_servicios}</span>
                </section>
              </TableCell>
              <TableCell className='p-0 gap-y-3'>
                <Radio.Group 
                  value={metodosPago[orden.id] || ''}
                  buttonStyle="solid"
                  className='flex items-center mb-3'
                  onChange={(e) => handleMetodoPagoChange(orden.id, e.target.value)}
                >
                  <Radio.Button className='flex items-center' value="Efectivo"><BsCashCoin /></Radio.Button>
                  <Radio.Button value="Nequi">Nequi</Radio.Button>
                  <Radio.Button value="Daviplata">Daviplata</Radio.Button>
                </Radio.Group>
                <Button
                  className='w-full bg-[#F2F2F2] text-[#B1B1B1]'
                  onClick={() => actualizarEstadoOrden(orden.id)}
                >
                  Actualizar Estado
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
