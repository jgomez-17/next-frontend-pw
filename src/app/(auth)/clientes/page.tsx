'use client'

import React, {useEffect, useState} from 'react'
import { FlechaDerecha, ReloadIcon } from '@/app/components/ui/iconos'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { message } from "antd";
import { Button } from '@/components/ui/button'
import Historial from '@/app/(auth)/historial/page'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
        <Sheet>
              <SheetTrigger asChild>
                <Button variant={'secondary'} className='h-9 w-2/3 m-auto tracking-tight'>Consulte el estado de su servicio</Button>
              </SheetTrigger>
              <SheetContent style={{  maxWidth: '100vw'}} 
              className='max-md:w-svw overflow-y-auto tracking-tigh'>
                <SheetHeader>
                  <SheetTitle className='text-center font-bold'>Estado de servicios</SheetTitle>
                  <SheetDescription>
                  </SheetDescription>
                  <nav className='gap-4 flex w-full max-md:px-2 m-auto items-center justify-between'>
                      <Button onClick={reloadPage} className='h-9 flex gap-2 items-center' variant={'ghost'}>
                        <ReloadIcon />
                        Actualizar
                      </Button>
                      <Historial />
                  </nav>
                  <Table className="w-full max-md:w-[95%] m-auto mt-4 tracking-tigh">
                  <TableHeader className="text-[1rem] font-medium max-md:text-[0.89rem] bg-slate-50">
                    <TableRow className=" text-sm text-slate-500">
                      <TableCell className="px-1 md:w-1/4 hidden max-md:justify-center">#</TableCell>
                      <TableCell className="px-2 md:w-1/4 hidden">Cliente</TableCell>
                      <TableCell className="px-2 w-1/6">Vehículo</TableCell>
                      <TableCell className="px-2 w-1/4">Servicio</TableCell>
                      <TableCell className="px-2 w-1/4">Lavador </TableCell>
                      <TableCell className="px-2 w-1/6"> Estado</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordenesEnEspera &&
                      ordenesEnEspera.map((orden: Orden) => (
                        <TableRow key={orden.id} className="text-[12px] max-md:text-[10px]">
                          <TableCell className="hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                          <TableCell className="p-0.5 border-b hidden">
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
                            <p className="max-md:leading-tight text-slate-500">{orden.servicio.nombre_servicios}</p>
                          </TableCell>
                          <TableCell className="p-0.5 border-b capitalize text-slate-500">
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
                          <TableCell className="hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                          <TableCell className="p-0.5 border-b hidden">
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
                          <TableCell className="hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                          <TableCell className="p-0.5 border-b hidden">
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
                          <TableCell className="hidden font-bold p-0.5 border-b">{orden.id}</TableCell>
                          <TableCell className="p-0.5 border-b hidden">
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
                </SheetHeader>
              </SheetContent>
        </Sheet>
    </>
 )
}

export default ClientesPage