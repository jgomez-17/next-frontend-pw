'use client'

import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { MdOutlineDeleteOutline } from "react-icons/md";

interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

const Componente = () => {
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [numeroLavadores, setNumeroLavadores] = useState<number>(0);

  const fetchLavadores = () => {
    fetch('http://localhost:4000/api/lavadores/')
      .then(response => response.json())
      .then((data: { body: Lavador[] }) => {
        setLavadores(data.body);
        setNumeroLavadores(data.body.length);
      })
      .catch(error => console.error('Error al obtener datos de lavadores:', error));
  };

  useEffect(() => {
    fetchLavadores();
  }, []);

  // Esto se ejecutará solo si no hay lavadores
  if (numeroLavadores === 0) {
    console.log('No hay lavadores disponibles');
  }

  //funcion para eliminar lavador
  const eliminarLavador = async (id: number) => {

    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este lavador?");
    if (!confirmacion) {
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/lavadores/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Eliminar lavador del estado local si la solicitud fue exitosa
        setLavadores(prevLavadores => prevLavadores.filter(lavador => lavador.id !== id));
        fetchLavadores();
        message.success('Eliminado correctamente')
      } else {
        message.error('Error al eliminar el lavador');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className='w-11/12 m-auto mt-20'>
      <h1 className='font-medium w-max bg-slate-300 flex'>Lavadores</h1>
      <table className='mt-5 p-3 rounded'>
        <thead>
          <tr>
            <th className='w-14 text-left p-1 border-b'>ID</th>
            <th className='w-44 text-left p-1 border-b'>Nombre</th>
            <th className='w-36 text-left p-1 border-b'>Estado</th>
            <th className='w-36 text-left p-1 border-b'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lavadores.map(lavador => (
            <tr className=' rounded-xl' key={lavador.id}>
              <td className='p-1 border-b'>{lavador.id}</td>
              <td className='p-1 border-b'>{lavador.nombre}</td>
              <td className='p-1 border-b'>{lavador.activo === "1" ? "Activo" : "Inactivo"}</td>
              <td className='p-1 border-b'>
                <button onClick={() => eliminarLavador(lavador.id)}> 
                  <MdOutlineDeleteOutline className=' text-lg' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Componente;
