'use client'
import React, {useState} from 'react'

function consultarPlaca() {
    const [placa, setPlaca] = useState('');
    const [orden, setOrden] = useState<any>(null);
    const [error, setError] = useState('');
  
    const consultarOrden = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/vehiculos/placa/${placa}`);
        if (!response.ok) {
          throw new Error('No se pudo encontrar la orden para la placa especificada.');
        }
        const data = await response.json();
        setOrden(data.orden);
        setError('');
      } catch (error: any) {
        setError(error.message);
        setOrden(null);
      }
    };
  
    return (
      <div className='w-1/3 mt-8'>
        <input className=' border border-slate-700 rounded p-2 mr-3' type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} />
        <button className='bg-slate-600 hover:bg-sky-600 rounded p-2 text-white' 
            onClick={consultarOrden}>
            Consultar Placa
        </button>
        {error && <p>{error}</p>}
        {orden && (
            <div>
                    <p>DETALLES DE LA ORDEN</p>
                    <p>Id: {orden.id}</p>
                    <p>Fecha: {orden.fecha_orden}</p>

                    {/* Mostrar otros detalles de la orden, cliente, vehículo y servicio */}
                    {orden.cliente && (
                        <div>
                            <p>Cliente</p>
                            <p>Nombre: {orden.cliente.nombre}</p>
                            {/* Mostrar otros detalles del cliente */}
                        </div>
                    )}
                    {orden.vehiculo && (
                        <div>
                            <p>Vehículo</p>
                            <p>Placa: {orden.vehiculo.placa}</p>
                            <p>Marca: {orden.vehiculo.marca}</p>
                            <p>Tipo: {orden.vehiculo.tipo}</p>
                            <p>Color: {orden.vehiculo.color}</p>
                            <p>Observaciones: {orden.vehiculo.observaciones}</p>
                            {/* Mostrar otros detalles del vehículo */}
                        </div>
                    )}
                    {orden.servicio && (
                        <div>
                            <p>Servicio</p>
                            <p>Nombre: {orden.servicio.nombre_servicios}</p>
                            <p>Costo: {orden.servicio.costo}</p>
                            {/* Mostrar otros detalles del servicio */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  }
  
export default consultarPlaca;