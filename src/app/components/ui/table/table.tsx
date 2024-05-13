import React, { useState, useEffect } from 'react';
import { Tag, Space, Table, message, Button } from 'antd';
import { FaCircle } from "react-icons/fa";
import Modal from "../modal2/butonmodal";
import { FaCarSide } from "react-icons/fa6"; //icon
import { GrUpdate } from "react-icons/gr";
import { AiOutlineFrown } from "react-icons/ai"; //icon
import { MdAttachMoney } from "react-icons/md"; //icon


interface Orden {
  id: number;
  estado: string;
  // Otras propiedades de la orden
}


const OrdenesEnCurso = () => {
  const [ordenesEnCurso, setOrdenesEnCurso] = useState([]);

  useEffect(() => {
    // Realizar solicitud HTTP GET al endpoint '/api/enCurso' en tu backend
    fetch('http://localhost:4000/api/estados/encurso')
      .then(response => response.json())
      .then(data => {
        // Actualizar el estado con los datos recibidos
        setOrdenesEnCurso(data.ordenes);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Función para actualizar el estado de la orden
  const actualizarEstadoOrden = (orderId: number) => {
    fetch('http://localhost:4000/api/ordenes/actualizarestado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: 'por pagar',
      }),
    })
      .then(response => {
        if (response.ok) {
          message.success('Estado de la orden actualizado correctamente');

          fetch('http://localhost:4000/api/estados/encurso')
            .then(response => response.json())
            .then(data => {
              setOrdenesEnCurso(data.ordenes);
            })
            .catch(error => console.error('Error fetching data:', error));
        } else {
          throw new Error('Error al actualizar el estado de la orden');
        }
      })
      .catch(error => {
        console.error('Error al actualizar el estado de la orden:', error);
        message.error('Error al actualizar el estado de la orden');
      });
  };

  const handleRecargarPagina = () => {
    window.location.reload();
  };

  const numeroOrdenes = ordenesEnCurso && ordenesEnCurso.length > 0 ? ordenesEnCurso.length : 0;


  // Columnas para la tabla
  const columns = [
    {
      title: '# Orden',
      dataIndex: 'id',
      key: 'id',
      width: 90,
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      render: (cliente: { nombre: string, celular: string }) => (
        <>
          <article className='flex flex-col capitalize'>
            <span className='font-semibold'>{cliente.nombre} </span>
            <span> {cliente.celular } </span>
          </article>
        </>
      ),
      width: 200,
    },
    {
      title: 'Vehículo',
      dataIndex: 'vehiculo',
      key: 'vehiculo',
      render: (vehiculo: {tipo: string, marca: string, color: string, placa: string, llaves: string  }) => (
        <>
          <article className='flex flex-col'>
            <span className='w-full font-semibold'> {vehiculo.placa} </span>
            <section>
              <span> {vehiculo.tipo} </span>
              <span> {vehiculo.marca} </span>
              <span> {vehiculo.color} </span>
            </section>
            <span> {vehiculo.llaves} <span> dejó llaves</span> </span>
          </article>
        </>
      ),
      width: 250,
    },
    {
      title: 'Servicio',
      dataIndex: 'servicio',
      key: 'servicio',
      render: (servicio: { nombre_servicios: string, costo: string }) => (
        <>
          <article className='flex flex-col gap-1'>
            <span className='font-semibold text-md'> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(servicio.costo))}</span>
            <span>{servicio.nombre_servicios}</span>
          </article>
        </>
      ),
      width: 350,
    },
    // {
    //   title: '',
    //   dataIndex: 'estado',
    //   key: 'estado',
    //   render: (estado: string) => (
    //     <Tag color={estado === 'enCurso' ? 'geekblue' : estado === 'pendiente' ? 'volcano' : 'green'}>
    //       {estado ? estado.toUpperCase() : ''}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (text: any, record: Orden) => (
        <article>
          {record.estado === 'en curso' && (
            <Button className=' bg-slate-500 p-1 rounded-lg text-xs text-red-700 bg-red-700/10' onClick={() => actualizarEstadoOrden(record.id)}>
              Marcar como terminado
            </Button>
          )}
        </article>
      ),
    },
  ];

  return (
      <>
      <article className='body mt-20 z-10'>
          <ul className='flex items-center gap-2 justify-between'>
            <Modal />
            {/* <VerificarPlaca /> */}
            <button className=' h-7 px-4 py-5 border border-slate-200 flex items-center rounded-md transition text-black hover:bg-white hover:text-blue-700 hover:border-blue-700' onClick={handleRecargarPagina}>
              <GrUpdate />
            </button> 
          </ul>
          <ul className='cards'>
            <li className='card-item transition-all'> 
              <a href="" className=''>
                En curso
                <aside className='card-content'>
                  <span> {numeroOrdenes} </span>
                  <FaCarSide className='card-icon text-gray-800/60' />
                </aside>
              </a>
            </li>
            <li className='card-item transition-all'> 
              <a href="" className=''>
                Pendientes
                <aside className='card-content'>
                  <span className=' float-right'> 2 </span>
                  <FaCarSide className='card-icon text-gray-800/60' />
                </aside>
              </a>
            </li>
            <li className='card-item transition-all'>  
              <a href="" className=''>
                Nose
                <aside className='card-content'>
                  <span> 7 </span>
                  <AiOutlineFrown className='card-icon' />
                </aside>
              </a>
            </li>
            <li className='card-item hover:bg-white transition-all'> 
              <a href=""> 
                Total hoy
                <aside className='card-content'>
                  <span> 400.000 </span>
                  <MdAttachMoney className='card-icon' />
                </aside>
              </a>
            </li>
          </ul>
        </article>
        <h1 className='w-11/12 pl-3 m-auto text-sm font-semibold items-center flex gap-2'> 
          Ordenes en curso 
          <FaCircle className='text-green-600 top-0 text-xs'/> 
        </h1>
        <Table
          className='w-11/12 m-auto mt-6'
          columns={columns}
          dataSource={ordenesEnCurso}
          pagination={{ pageSize: 10 }}
          // scroll={{ y: 240 }}
        />
      </>
  );
};

export default OrdenesEnCurso;
