'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale"; 
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type Orden = {
  id: number;
  fecha_orden: string;
  estado: string;
  empleado: string;
  metododepago: string;
  cliente: {
    id: number;
    nombre: string;
    celular: string;
    correo: string;
  };
  vehiculo: {
    id: number;
    placa: string;
    marca: string;
    tipo: string;
    color: string;
    llaves: string;
    observaciones: string;
  };
  servicio: {
    id: number;
    nombre: string;
    descuento: number;
    costo: number;
  };
};

const OrdenesPorPlaca: React.FC = () => {
  const [placa, setPlaca] = useState<string>('');
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const obtenerOrdenesPorPlaca = async (placa: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/clientes/placas/${placa}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          setOrdenes(null); // Limpiar órdenes si no se encontraron resultados
          setError('No se encontraron órdenes para la placa ingresada');
        } else {
          throw new Error('Error al obtener las órdenes. Por favor, inténtalo de nuevo.');
        }
      } else {
        const data = await response.json();
        // Ordenar las órdenes por fecha de manera descendente (más recientes primero)
        data.sort((a: Orden, b: Orden) => new Date(b.fecha_orden).getTime() - new Date(a.fecha_orden).getTime());
        setOrdenes(data);
        setError(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    obtenerOrdenesPorPlaca(placa);
  };

  const formatFecha = (fecha: string) => {
    try {
      const formattedDate = format(new Date(fecha), "PPPP 'a las' hh:mm a", { locale: es });
      return formattedDate;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha no disponible';
    }
  };




  return (
    <>
    <div className="max-w-xl font-sans mt-16 mx-auto p-4 rounded-md">
      <h2 className="text-ms font-semibold max-md:text-center mb-6">Buscar ordenes</h2>
      <form onSubmit={handleSubmit} className="mb-4 max-md:w-max flex flex-col m-auto max-md:text-center">
        <p className=' text-sm font-medium'> Ingrese la placa del vehiculo</p>
        <label className="flex items-center gap-3 w-max">
          <Input
            type="text"
            className="uppercase w-36 h-8 my-2"
            value={placa}
            onChange={(e) => {
              let inputValue = e.target.value.toUpperCase();
              inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

              if (inputValue.length > 3) {
                inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
              }

              inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

              if (inputValue.includes('-')) {
                const parts = inputValue.split('-');
                parts[1] = parts[1].replace(/[^0-9]/g, '');
                inputValue = parts.join('-');
              }

              inputValue = inputValue.slice(0, 7);
              setPlaca(inputValue);
            }} 
            maxLength={7} // Permitir 3 letras, 1 guión y 3 números
            required 
          />
        <Button htmlType='submit' type='default' className=' bg-black text-white'>
          Buscar
        </Button>
        </label>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {ordenes && (
        <div>
          <h3 className="text-sm max-md:text-center font-medium mb-2 text-gray-600">Historial</h3>
          <ul className="divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <li key={orden.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block text-sm">{orden.vehiculo.marca}</strong>
                    <p className="text-xs text-gray-500">{orden.vehiculo.placa}</p>
                    <p className="text-xs text-gray-500">{orden.servicio.nombre}</p>
                    {/* Mostrar más detalles según sea necesario */}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{formatFecha(orden.fecha_orden)}</p>
                    <p className="text-xs text-gray-500 capitalize">{orden.cliente.nombre}</p>

                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
};

export default OrdenesPorPlaca;
