'use client'

import React, {useState, useEffect} from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import { MdOutlineArrowBackIos } from "react-icons/md";


interface Orden {
  id: number;
  fechaOrden: string; // Asegúrate de que esta propiedad esté incluida
  cliente: { nombre: string; celular: string };
  vehiculo: {
    tipo: string;
    marca: string;
    color: string;
    placa: string;
    llaves: string;
  };
  servicio: { nombre_servicios: string; costo: string };
  estado: string;
  empleado: string
}

const page = () => {
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);


    //Fetch de ordenes en espera
    const fetchOrdenesTerminadas = () => {
      fetch('http://localhost:4000/api/estados/terminadohoy')
        .then(response => response.json())
        .then(data => {
          setOrdenesTerminadas(data.ordenes);
        })
        .catch(error => console.error('Error fetching data:', error));
        console.log('no hay ordenes en espera')
    };
  
    useEffect(() => {
      fetchOrdenesTerminadas();  // Fetch initial data
    }, []);

  return (
    <>
      <div style={{ fontFamily: 'Overpass Variable',}} className='roundedflex-col flex justify-between w-11/12 m-auto mt-20'>
        <a
          className='w-8 p-2 rounded-full font-medium transition-all bg-slate-100 hover:bg-slate-200 text-sm items-center gap-2'
          href="/views/dashboard/lista-ordenes">
          <MdOutlineArrowBackIos />
        </a>
        <span className=' font-medium pt-1 text-[0.9rem]'>
          Todas las ordenes de hoy
        </span>
      </div>
      <Table style={{ fontFamily: 'Overpass Variable',}} className=" w-11/12 m-auto mt-5 ">
          <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
            <TableRow className="">
              <TableCell className="max-md:hidden max-md:justify-center  w-24 px-4">#</TableCell>
              <TableCell className="w-36 px-1 max-md:w-24 max-md:text-center">Cliente</TableCell>
              <TableCell className="w-44 px-1 max-md:w-24 max-md:text-center">Vehículo</TableCell>
              <TableCell className="md:w-72 px-1 max-md:text-center">Servicio</TableCell>
              <TableCell className="md:hidden"> Estado</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesTerminadas &&
              ordenesTerminadas.map((orden: Orden) => (
                <TableRow key={orden.id} className="text-[12px]">
                  <TableCell className="max-md:hidden px-4 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                  <TableCell className="p-1 max-md:text-center border-b">
                    <section>
                      <span className="font-semibold flex flex-col capitalize">
                        {orden.cliente.nombre}
                      </span>
                      <span className="hidden">{orden.cliente.celular}</span>
                    </section>
                  </TableCell>
                  <TableCell className="p-1 max-md:text-center border-b">
                    <span className="w-full font-semibold">
                      {orden.vehiculo.placa}
                    </span>
                    <section className="gap-4">
                      <span className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </span>
                      <span> {orden.vehiculo.marca} </span>
                      <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                    </section>
                    <span className="max-md:hidden md:hidden">
                      {orden.vehiculo.llaves} <span>dejó llaves</span>
                    </span>
                  </TableCell>
                  <TableCell className="px-1 py-3 max-md:text-center border-b">
                    <section className="flex items-center justify-between max-md:flex-col">
                      <span className="font-bold flex flex-col">
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(orden.servicio.costo))}
                      </span>
                      <span className="translate-y-3">
                        <DetallesOrden orden={orden} />
                      </span>
                    </section>
                    <span className="max-md:hidden">{orden.servicio.nombre_servicios}</span>
                  </TableCell>
                  <TableCell className="w-24 border-b">
                    <span className=" text-center text-xs p-1 rounded-md bg-blue-600/5 text-blue-600"> 
                      {orden.estado} 
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
    </>
  )
}

export default page