'use client'

import React, {useEffect, useState} from 'react'
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute'
import Link from 'next/link'
import { BackIcon, ReloadIcon } from '@/app/components/ui/iconos'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { message, Modal, Select, Button } from "antd";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import { BsThreeDotsVertical } from "react-icons/bs";



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


const ClientesPage = () => {
    const [ordenesEnEspera, setOrdenesEnEspera] = useState<Orden[]>([]);
    const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
    const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
    const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([])
    const [numeroOrdenesEnEspera, setNumeroOrdenesEnEspera] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
    const [numeroOrdenesHoy, setNumeroOrdenesHoy] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
    const [numeroOrdenesPorPagar, setNumeroOrdenesPorPagar] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy

    //Fetch de ordenes en espera
    const fetchOrdenesEnEspera = () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/enespera`; 
  
       fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setOrdenesEnEspera(data.ordenes);
          setNumeroOrdenesEnEspera(data.numeroOrdenesEnEspera || 0);
        })
        .catch(error => console.error('Error fetching data:', error));
        setNumeroOrdenesEnEspera(0)
    };
  
    useEffect(() => {
      fetchOrdenesEnEspera();  // Fetch initial data
    }, []);
  
    //Fetch de ordenes en curso
    const fetchOrdenesEnCurso = () => {
      fetch('https://express-api-pw.onrender.com/api/estados/encurso')
        .then(response => response.json())
        .then(data => {
          setOrdenesEnCurso(data.ordenes);
          // setNumeroOrdenesEnEspera(data.numeroOrdenesEnEspera || 0);
        })
        .catch(error => console.error('Error fetching data:', error));
        // setNumeroOrdenesEnEspera(0)
    };
    
    useEffect(() => {
      fetchOrdenesEnCurso();  // Fetch initial data
    }, []);
  
    //fech de las ordenes por pagar
    const fetchOrdenesPorPagar = () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/porpagar`
  
      fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setOrdenesPorPagar(data.ordenes);
        setNumeroOrdenesPorPagar(data.numeroOrdenesPorPagar || 0)
      })
      .catch(error => console.error('Error fetching data:', error));
      setNumeroOrdenesPorPagar(0)
    };
  
    useEffect(() => {
      fetchOrdenesPorPagar();
    }, []);

    //Fetch de ordenes en terminadas
    const fetchOrdenesTerminadas = () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/terminadohoy`

      fetch(apiUrl)
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

    const reloadPage = () => {
      window.location.reload();
    };

  return (
      <>
      <ProtectedRoute>
        <Navbar />
        <nav className='mt-20 gap-4 flex w-11/12 m-auto items-center justify-between' style={{ fontFamily: 'Roboto', }}>
            <Link href="/"
                  className='hover:bg-slate-200 px-3 py-0.5 rounded-full'  
            >
                <BackIcon />
            </Link>
            <Button onClick={reloadPage}>
              <ReloadIcon />
            </Button>
            <h1 className='ml-auto font-bold'>Clientes</h1>
        </nav>
        <Table className=" w-11/12 m-auto mt-4" style={{ fontFamily: 'Roboto'}}>
        <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
          <TableRow className=" text-sm max-md:text-[11px]">
            <TableCell className="max-md:hidden max-md:justify-center w-24 px-4">#</TableCell>
            <TableCell className="px-1 max-md:w-28">Cliente</TableCell>
            <TableCell className="px-1 max-md:w-28">Vehículo</TableCell>
            <TableCell className="px-1 max-md:w-24">Servicio</TableCell>
            <TableCell className="w-44">Lavador Asignado</TableCell>
            <TableCell className=""> Estado</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnEspera &&
            ordenesEnEspera.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden px-4 font-bold w-20 p-1 border-b">{orden.id}</TableCell>
                <TableCell className="p-1 border-b">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-1 border-b">
                  <p className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </p>
                  <section className="gap-1 md:flex">
                    <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
                    <p>{orden.vehiculo.marca}</p>
                    <p className="max-md:hidden">{orden.vehiculo.color}</p>
                  </section>
                  <span className="max-md:hidden md:hidden">
                    {orden.vehiculo.llaves} <p>dejó llaves</p>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-1 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-1 w-24 border-b capitalize">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-1 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
                  <section className="gap-4 w-max flex justify-between items-center ">
                    <p className={`flex w-max px-2 py-1 my-3 rounded-md ${
                      orden.estado === 'en espera' ? 'bg-blue-600/10 text-blue-600' :
                      orden.estado === 'en curso' ? 'bg-green-500/10 text-green-600' :
                      orden.estado === 'por pagar' ? 'bg-red-600/10 text-red-600' :
                      orden.estado === 'terminado' ? 'bg-slate-600/10 text-black capitalize' :
                      '' // clase por defecto o en caso de que no haya una coincidencia
                      }`}>
                      {orden.estado}
                    </p>
                    <p className='max-md:hidden'>
                      <DetallesOrden orden={orden} />
                    </p>
                    <DropdownMenu>
                    <DropdownMenuTrigger className='md:hidden'>
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableBody>
          {ordenesEnCurso &&
            ordenesEnCurso.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden px-1 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                <TableCell className="p-1 border-b">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-1 border-b">
                  <p className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </p>
                  <section className="gap-1 md:flex">
                    <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
                    <p>{orden.vehiculo.marca}</p>
                    <p className="max-md:hidden">{orden.vehiculo.color}</p>
                  </section>
                  <span className="max-md:hidden md:hidden">
                    {orden.vehiculo.llaves} <p>dejó llaves</p>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-1 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="w-24 p-2 border-b capitalize">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-1 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
                  <section className="gap-4 w-max flex justify-between items-center ">
                    <p className={`flex w-max px-2 py-1 my-3 rounded-md ${
                      orden.estado === 'en espera' ? 'bg-blue-600/10 text-blue-600' :
                      orden.estado === 'en curso' ? 'bg-green-500/10 text-green-600' :
                      orden.estado === 'por pagar' ? 'bg-red-600/10 text-red-600' :
                      orden.estado === 'terminado' ? 'bg-slate-600/10 text-black capitalize' :
                      '' // clase por defecto o en caso de que no haya una coincidencia
                      }`}>
                      {orden.estado}
                    </p>
                    <p className='max-md:hidden'>
                      <DetallesOrden orden={orden} />
                    </p>
                    <DropdownMenu>
                    <DropdownMenuTrigger className='md:hidden'>
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>        
        <TableBody>
          {ordenesPorPagar &&
            ordenesPorPagar.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden px-1 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                <TableCell className="p-1 border-b">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-1 border-b">
                  <p className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </p>
                  <section className="gap-1 md:flex">
                    <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
                    <p>{orden.vehiculo.marca}</p>
                    <p className="max-md:hidden">{orden.vehiculo.color}</p>
                  </section>
                  <span className="max-md:hidden md:hidden">
                    {orden.vehiculo.llaves} <p>dejó llaves</p>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-1 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="w-24 p-2 border-b capitalize">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-1 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
                  <section className="gap-4 w-max flex justify-between items-center ">
                    <p className={`flex w-max px-2 py-1 my-3 rounded-md ${
                      orden.estado === 'en espera' ? 'bg-blue-600/10 text-blue-600' :
                      orden.estado === 'en curso' ? 'bg-green-500/10 text-green-600' :
                      orden.estado === 'por pagar' ? 'bg-red-600/10 text-red-600' :
                      orden.estado === 'terminado' ? 'bg-slate-600/10 text-black capitalize' :
                      '' // clase por defecto o en caso de que no haya una coincidencia
                      }`}>
                      {orden.estado}
                    </p>
                    <p className='max-md:hidden'>
                      <DetallesOrden orden={orden} />
                    </p>
                    <DropdownMenu>
                    <DropdownMenuTrigger className='md:hidden'>
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableBody>
          {ordenesTerminadas &&
            ordenesTerminadas.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden px-1 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                <TableCell className="p-1 border-b">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-1 border-b">
                  <p className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </p>
                  <section className="gap-1 md:flex">
                    <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
                    <p>{orden.vehiculo.marca}</p>
                    <p className="max-md:hidden">{orden.vehiculo.color}</p>
                  </section>
                  <span className="max-md:hidden md:hidden">
                    {orden.vehiculo.llaves} <p>dejó llaves</p>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-1 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="w-24 p-2 border-b capitalize">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-1 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
                  <section className="gap-4 w-max flex justify-between items-center ">
                    <p className={`flex w-max px-2 py-1 my-3 rounded-md ${
                      orden.estado === 'en espera' ? 'bg-blue-600/10 text-blue-600' :
                      orden.estado === 'en curso' ? 'bg-green-500/10 text-green-600' :
                      orden.estado === 'por pagar' ? 'bg-red-600/10 text-red-600' :
                      orden.estado === 'terminado' ? 'bg-slate-600/10 text-black capitalize' :
                      '' // clase por defecto o en caso de que no haya una coincidencia
                      }`}>
                      {orden.estado}
                    </p>
                    <p className='max-md:hidden'>
                      <DetallesOrden orden={orden} />
                    </p>
                    <DropdownMenu>
                    <DropdownMenuTrigger className='md:hidden'>
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      </ProtectedRoute>
      </>
 )
}

export default ClientesPage