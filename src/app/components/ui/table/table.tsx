import React, { useState, useEffect } from 'react';
import { Tag, Space, Table } from 'antd';
import { FaCircle } from "react-icons/fa";


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



  // manejo de estados
  
  

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
    {
      title: '',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: string) => (
        <Tag color={estado === 'enCurso' ? 'geekblue' : estado === 'pendiente' ? 'volcano' : 'green'}>
          {estado ? estado.toUpperCase() : ''}
        </Tag>
      ),
    },
  ];

  return (
      <>
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
