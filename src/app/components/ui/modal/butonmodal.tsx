'use client'
import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import Drawerform from '@/app/components/ui/drawerform/drawer'



const Modalbutton: React.FC = () => {

  // Consultar Placa
    const [placa, setPlaca] = useState('');
    const [orden, setOrden] = useState<any>(null);
    // const [ordenes, setOrdenes] = useState();
    const [error, setError] = useState('');
  
    const consultarOrden = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/vehiculos/placa/${placa}`);
        if (!response.ok) {
          throw new Error('¡No se pudo encontrar la orden para la placa especificada !');
        }
        const data = await response.json();
        setOrden(data.orden);
        setError('');
      } catch (error: any) {
        setError(error.message);
        setOrden(null);
      }
    }; 


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  return (
    <>
        <Button className='hover:bg-sky-600 my-5 p-5 rounded-lg flex items-center bg-slate-600 text-slate-200 z-10' 
          onClick={showModal}>
          Crear orden
        </Button>

      <Modal className='modal flex' 
             title="Verificar placa" 
             open={isModalOpen} 
             onOk={handleOk} 
             onCancel={handleCancel}
             >
          <section className='flex align-middle items-center'>
              <Input 
                className='uppercase' 
                type="text" 
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
              <Button className='bg-slate-600 text-white mx-4 my-2 hover:bg-transparent'
                onClick={consultarOrden}
                type='default'>
                Verificar placa
              </Button>
              <Drawerform />
          </section>
          {error && <p className='my-3 mx-1'>{error}</p>}
          {orden && (
                    <section className='p-2'>
                      <p className='font-semibold'> ¡Orden encontrada!</p>
                      <article className='ml-1'>
                          <p>Nro de orden: {orden.id}</p>
                          <p>Fecha: {orden.fecha_orden}</p>
                      </article>

                    {/* Mostrar otros detalles de la orden, cliente, vehículo y servicio */}
                    {orden.vehiculo && (
                        <article className='ml-1'>
                            <p>Marca: {orden.vehiculo.marca}</p>
                            <p>Tipo: {orden.vehiculo.tipo}</p>
                            <p>Color: {orden.vehiculo.color}</p>
                            <p>Dejó llaves? {orden.vehiculo.llaves}</p>

                            {/* Mostrar otros detalles del vehículo */}
                        </article>
                    )}
                    {orden.cliente && (
                        <article className='ml-1'>
                            <p>Propietario/a: {orden.cliente.nombre}</p>
                            <p>Celular: {orden.cliente.celular}</p>
                            <p>Correo: {orden.cliente.correo}</p>

                            {/* Mostrar otros detalles del cliente */}
                        </article>
                    )}
                    {orden.servicio && (
                        <article className='ml-1'>
                            <p>Servicios: {orden.servicio.nombre_servicios}</p>
                            <p>Costo: {orden.servicio.costo}</p>
                            {/* Mostrar otros detalles del servicio */}
                        </article>
                    )}
                </section>
            )}
      </Modal>
    </>
  );
};

export default Modalbutton;