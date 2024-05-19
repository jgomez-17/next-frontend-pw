'use client'
import React, { useState } from 'react';
import { Button, Modal, Input, Collapse } from 'antd';
import Drawerform from '@/app/components/ui/drawerform/drawer'

const { Panel } = Collapse;

interface Orden {
  id: number;
  fecha_orden: string;
  cliente: {
    nombre: string;
    celular: string;
    correo: string;
  };
  vehiculo: {
    marca: string;
    tipo: string;
    color: string;
    llaves: boolean;
  };
  servicio: {
    nombre_servicios: string;
    costo: number;
  };
}

const Modalbutton: React.FC = () => {

  // Consultar Placa
    const [placa, setPlaca] = useState('');
    // const [orden, setOrden] = useState<any>(null);
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [error, setError] = useState('');
  
    const consultarOrden = async () => {
      if (!placa) {
        setError('Por favor, ingresa una placa.');
        setOrdenes([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/vehiculos/placa/${placa}`);
        if (!response.ok) {
          throw new Error('¡No se pudo encontrar la orden para la placa especificada !');
        }
        const data = await response.json();
        setOrdenes(data.ordenes);
        setError('');
      } catch (error: any) {
        setError(error.message);
        setOrdenes([]);
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

  const handleRefresh = () => {
    setPlaca('');
    setOrdenes([]);
    setError('');
  };

  const handleOrderCreated = () => {
    setIsModalOpen(false); // Cierra el modal
  };


  return (
    <>
        <Button className='my-5 border-none p-5 rounded-xs flex items-center bg-sky-600/15 font-medium text-sky-700 z-10' 
          onClick={showModal}>
          Crear orden
        </Button>

      <Modal className='modal flex' 
             title="Verificar placa" 
             open={isModalOpen} 
             onOk={handleRefresh} 
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
              <Drawerform onOrderCreated={handleOrderCreated}/>
          </section>
          {error && <p className='my-3 mx-1'>{error}</p>}
          {ordenes.length > 0 && (
            <section className='rounded-md'>
                <p className='ml-1 my-2 text-green-700'> ¡Orden encontrada! </p>
              <Collapse accordion>
                {ordenes.map((orden) => (
                  <Panel header={`Orden #${orden.id}`} key={orden.id}>
                    
                          <article className='ml-1 text-xs'>
                              <p>Fecha: {orden.fecha_orden}</p>
                              {/* Mostrar otros detalles del vehículo */}
                          </article>
                    {/* Mostrar otros detalles de la orden, cliente, vehículo y servicio */}
                    {orden.vehiculo && (
                          <article className='ml-1 text-xs'>
                              <p>Marca: {orden.vehiculo.marca}</p>
                              <p>Tipo: {orden.vehiculo.tipo}</p>
                              <p>Color: {orden.vehiculo.color}</p>
                              <p>Dejó llaves? {orden.vehiculo.llaves}</p>

                              {/* Mostrar otros detalles del vehículo */}
                          </article>
                      )}
                      {orden.cliente && (
                          <article className='ml-1 text-xs'>
                              <p>Propietario/a: {orden.cliente.nombre}</p>
                              <p>Celular: {orden.cliente.celular}</p>
                              <p>Correo: {orden.cliente.correo}</p>

                              {/* Mostrar otros detalles del cliente */}
                          </article>
                      )}
                      {orden.servicio && (
                          <article className='ml-1 text-xs'>
                              <p>Servicios: {orden.servicio.nombre_servicios}</p>
                              <p>Costo: {orden.servicio.costo}</p>
                              {/* Mostrar otros detalles del servicio */}
                          </article>
                      )}
                  </Panel>
                ))}
              </Collapse>
            </section>
        )}
      </Modal>
    </>
  );
};

export default Modalbutton;