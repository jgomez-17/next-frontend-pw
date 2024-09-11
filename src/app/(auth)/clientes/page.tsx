'use client'

import React, {useEffect, useState} from 'react'
import Navbar from '@/app/views/navbar/page'
import Link from 'next/link'
import { BackIcon, ReloadIcon } from '@/app/components/ui/iconos'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { message, Button } from "antd";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import { BsThreeDotsVertical } from "react-icons/bs";
import { DownloadIcon } from '@/app/components/ui/iconos'
import Historial from '@/app/(auth)/historial/page'
import Image from 'next/image'

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
  servicio: { nombre_servicios: string; costo: string; descuento: string };
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

    const fetchOrdenesEnCurso = () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/encurso`;

      fetch(apiUrl)
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

    const fetchOrdenesTerminadas = () => {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/terminadohoy`

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setOrdenesTerminadas(data.ordenes);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
      fetchOrdenesTerminadas();  // Fetch initial data
    }, []);

    const reloadPage = () => {
      const hideMessage = message.loading('Cargando...', 0);

      fetchOrdenesEnEspera()
      fetchOrdenesPorPagar()
      fetchOrdenesTerminadas()
      fetchOrdenesEnCurso()

      setTimeout(hideMessage, 1000);
    };

  return (
      <>
          <Image
            priority
            className='w-44 m-auto'
            src="/prontowash-img.png"
            alt='logo'
            width={500}
            height={300}
          ></Image>        
          <nav className='mt-4 gap-4 flex w-11/12 m-auto items-center justify-between font-geist'>
            <Link href="/"
                  className='hover:bg-gray-500/15 px-3 py-1 rounded-full'
            >
                <BackIcon />
            </Link>
            <Button type='text' onClick={reloadPage} className=' max-md:mr-auto'>
              <ReloadIcon />
            </Button>
            <Historial />
            <h1 className='ml-auto font-bold max-md:hidden'>Estado del servicio</h1>
        </nav>
        <Table className=" w-11/12 m-auto mt-4 font-geist">
        <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
          <TableRow className=" text-sm max-md:text-[11px]">
            <TableCell className="px-1 md:w-1/12 max-md:hidden max-md:justify-center">#</TableCell>
            <TableCell className="px-1 md:w-2/12 max-md:hidden">Cliente</TableCell>
            <TableCell className="px-1 md:w-2/12 max-md:w-1/5">Vehículo</TableCell>
            <TableCell className="px-1 md:w-2/6 max-md:w-2/6">Servicio</TableCell>
            <TableCell className="px-1 md:w-2/6 max-md:w-1/4">Lavador </TableCell>
            <TableCell className="px-1 md:w-2/12 max-md:w-1/4"> Estado</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnEspera &&
            ordenesEnEspera.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                <TableCell className="p-0.5 border-b max-md:hidden">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-0.5 border-b">
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
                <TableCell className="p-0.5 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col md:hidden max-md:hidden">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:leading-tight text-gray-500">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-0.5 border-b capitalize text-gray-500">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-0.5 gap-2 font-medium items-center max-md:flex-col max-md:items-start text-xs max-md:text-[10px] border-b">
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
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableBody>
          {ordenesEnCurso &&
            ordenesEnCurso.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                <TableCell className="p-0.5 border-b max-md:hidden">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-0.5 border-b">
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
                <TableCell className="p-0.5 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col md:hidden max-md:hidden">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:leading-tight text-gray-500">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-0.5 border-b capitalize text-gray-500">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-0.5 gap-2 font-medium items-center max-md:flex-col max-md:items-start text-xs max-md:text-[10px] border-b">
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
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableBody>
          {ordenesPorPagar &&
            ordenesPorPagar.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                <TableCell className="p-0.5 border-b max-md:hidden">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-0.5 border-b">
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
                <TableCell className="p-0.5 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col md:hidden max-md:hidden">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:leading-tight text-gray-500">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-0.5 border-b capitalize text-gray-500">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-0.5 gap-2 font-medium items-center max-md:flex-col max-md:items-start text-xs max-md:text-[10px] border-b">
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
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableBody>
          {ordenesTerminadas &&
            ordenesTerminadas.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                <TableCell className="max-md:hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                <TableCell className="p-0.5 border-b max-md:hidden">
                  <section>
                    <p className=" flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                  </section>
                </TableCell>
                <TableCell className="p-0.5 border-b">
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
                <TableCell className="p-0.5 border-b">
                  <section className="flex max-md:flex-col">
                    <p className="font-bold flex flex-col md:hidden max-md:hidden">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:leading-tight text-gray-500">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-0.5 border-b capitalize text-gray-500">
                      <p> {orden.empleado} </p>
                </TableCell>
                <TableCell className="p-0.5 gap-2 font-medium items-center max-md:flex-col max-md:items-start text-xs max-md:text-[10px] border-b">
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
                  </section>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      </>
 )
}

export default ClientesPage