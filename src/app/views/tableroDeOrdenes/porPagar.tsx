import React, { useEffect, useState } from 'react';
import { message, Checkbox } from 'antd';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FaCircle } from "react-icons/fa";

interface Orden {
  id: number;
  cliente: { nombre: string; celular: string };
  vehiculo: { tipo: string; marca: string; color: string; placa: string; llaves: string };
  servicio: { nombre_servicios: string; costo: string };
  estado: string;
}

const OrdenesPorPagar = () => {
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([]);
  const [metodosPago, setMetodosPago] = useState<string[]>([]);

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

  const handleMetodoPagoChange = (value: string) => {
    const isSelected = metodosPago.includes(value);
    if (isSelected) {
      setMetodosPago(metodosPago.filter(item => item !== value));
    } else {
      setMetodosPago([...metodosPago, value]);
    }
  };

  const actualizarEstadoOrden = (orderId: number) => {
    if (metodosPago.length === 0) {
      message.error('Por favor selecciona al menos un método de pago');
      return;
    }

    fetch('http://localhost:4000/api/ordenes/actualizarestado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: 'terminado',
        metodosPago: metodosPago,
      }),
    })
      .then(response => {
        if (response.ok) {
          message.success('Estado de la orden actualizado correctamente');
          fetchOrdenesPorPagar(); // Actualiza las órdenes después de actualizar el estado
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
    <section className=' mt-20'>
      <h1 className='w-11/12 pl-3 m-auto text-sm font-semibold items-center flex gap-2'>
        Ordenes por pagar
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
                  <span> {orden.vehiculo.tipo} </span>
                  <span> {orden.vehiculo.marca} </span>
                  <span> {orden.vehiculo.color} </span>
                </section>
                <span>{orden.vehiculo.llaves} <span>dejó llaves</span></span>
              </TableCell>
              <TableCell>
                <section>
                  <span className='font-semibold flex flex-col'>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(orden.servicio.costo))}</span>
                  <span>{orden.servicio.nombre_servicios}</span>
                </section>
              </TableCell>
              <TableCell>
                <Checkbox onChange={() => handleMetodoPagoChange('efectivo')} checked={metodosPago.includes('efectivo')}>Efectivo</Checkbox>
                <Checkbox onChange={() => handleMetodoPagoChange('tarjeta')} checked={metodosPago.includes('tarjeta')}>Tarjeta</Checkbox>
                {orden.estado === 'por pagar' && (
                  <Button variant={'outline'} className='bg-slate-500 p-1 rounded-lg text-xs text-red-700 bg-red-700/10' onClick={() => actualizarEstadoOrden(orden.id)}>
                    Terminar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default OrdenesPorPagar;
