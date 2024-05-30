'use client'

import React, { useEffect, useState } from "react";
import { message, Modal, Select, Button } from "antd";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button";
import { IoCarSportSharp } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

import { MdOutlinePayment } from "react-icons/md"; //icon ordenes por pagar
import { MdDoneAll } from "react-icons/md"; //icon ordenes terminadas
import { FaArrowTrendUp } from "react-icons/fa6";//icon total recaudado hoy 
import { FaPlay } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import Drawerform from "@/app/views/dashboard/formulario-crear-orden/formulario";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'


const { Option } = Select;

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

interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

const OrdenesDashboard = () => {
  const [ordenesEnEspera, setOrdenesEnEspera] = useState<Orden[]>([]);
  const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([])
  const [totalRecaudado, setTotalRecaudado] = useState<number>(0);
  const [selectedEmployees, setSelectedEmployees] = useState<{ [key: number]: string[] }>({});
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [buttonStates, setButtonStates] = useState<{ [key: number]: boolean }>({});

  const [numeroOrdenesEnEspera, setNumeroOrdenesEnEspera] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
  const [numeroOrdenesHoy, setNumeroOrdenesHoy] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
  const [numeroOrdenesPorPagar, setNumeroOrdenesPorPagar] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy


  //Fetch lavadores
  const fetchLavadores = () => {
    fetch('http://localhost:4000/api/lavadores/')
      .then(response => response.json())
      .then((data: { body: Lavador[] }) => {
        setLavadores(data.body);
      })
      .catch(error => console.error('Error al obtener datos de lavadores:', error));
  };

  useEffect(() => {
    fetchLavadores();
  }, []);

  //Fetch de ordenes en espera
  const fetchOrdenesEnEspera = () => {
     fetch('http://localhost:4000/api/estados/enespera')
      .then(response => response.json())
      .then(data => {
        setOrdenesEnEspera(data.ordenes);
        setNumeroOrdenesEnEspera(data.numeroOrdenesEnEspera || 0);
      })
      .catch(error => console.error('Error fetching data:', error));
      setNumeroOrdenesEnEspera(0)
      console.log('no hay ordenes en espera')
  };

  useEffect(() => {
    fetchOrdenesEnEspera();  // Fetch initial data
  }, []);

    //Fetch de ordenes en curso
    const fetchOrdenesEnCurso = () => {
      fetch('http://localhost:4000/api/estados/encurso')
        .then(response => response.json())
        .then(data => {
          setOrdenesEnCurso(data.ordenes);
          console.log(data.ordenes)
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
    fetch('http://localhost:4000/api/estados/porpagar')
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


  //Fetch de las ordenes terminadas hoy
  const fetchOrdenesTerminadasHoy = () => {
    fetch('http://localhost:4000/api/estados/terminadohoy')
      .then(response => response.json())
      .then(data => {
        setOrdenesTerminadas(data.ordenes)
        setTotalRecaudado(data.totalRecaudado || 0); // Actualizar el total recaudado
        setNumeroOrdenesHoy(data.numeroOrdenesHoy || 0); // Actualizar el número de órdenes terminadas
      })
      .catch(error => console.error('Error fetching data:', error));
      setTotalRecaudado(0);
      setNumeroOrdenesHoy(0)
  };

  useEffect(() => {
    fetchOrdenesTerminadasHoy();  // Fetch initial data
  }, []);


  //Funcion para asignar lavador y poner en curso 
  const actualizarEstadoOrden = (orderId: number, selectedEmployees: string[]) => {
    if (!selectedEmployees || selectedEmployees.length === 0) {
      message.warning("Por favor asigna un lavador");
      return;
    }

    const employeesString = selectedEmployees.join(", ");

    fetch("http://localhost:4000/api/ordenes/actualizarestado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: "en curso",
        employee: employeesString,
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Orden en curso");
          fetchOrdenesEnEspera();
          fetchOrdenesEnCurso();
        } else {
          throw new Error("Error al actualizar el estado de la orden");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de la orden:", error);
        message.error("Error al actualizar el estado de la orden");
      });
  };

  //Funcion para actualizar estado a por pagar 
  const actualizarEstadoOrden3 = (orderId: number) => {

    fetch("http://localhost:4000/api/ordenes/actualizarestado3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: "por pagar",
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Terminado en espera de pago");
          fetchOrdenesEnEspera();
          fetchOrdenesEnCurso();
          fetchOrdenesPorPagar()
        } else {
          throw new Error("Error al actualizar el estado de la orden");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de la orden:", error);
        message.error("Error al actualizar el estado de la orden");
      });
  };

  //funcion para cancelar la orden
  const cancelarOrden = (orderId: number) => {
    fetch("http://localhost:4000/api/ordenes/cancelarorden", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: "cancelada",
      }),
    })
    .then((respuesta) => {
      if (respuesta.ok) {
        message.error('Orden cancelada');
        fetchOrdenesEnEspera();
      }
      else {
        throw new Error("Error al cancelar la orden");
      }
    })
    .catch((error) => {
      console.error("Error al cancelar la orden:", error);
      message.error("Error al cancelar la orden");
    });
  }

  const handleEmpleadoChange = (orderId: number, value: string[]) => {
    if (buttonStates[orderId]) {
      message.warning("No puedes cambiar el empleado de una orden iniciada");
      return;
    }

    setSelectedEmployees((prevState) => ({
      ...prevState,
      [orderId]: value,
    }));
  };




  return (
    <> 
      <nav className=" gap-3 w-11/12 m-auto flex mt-[80px] mb-6 ">
        <Drawerform onOrderCreated={fetchOrdenesEnEspera} />
      </nav>
      <section style={{ fontFamily: 'Overpass Variable',}} className="z-10 w-11/12 mt-2 m-auto mb-8">
        <ul className="flex flex-wrap justify-between items-center gap-1">
          <li className="text-[0.95rem] shadow-lg hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              En espera
              <span className="flex items-center justify-between bottom-0">
                <p className="text-3xl max-md:text-2xl font-bold">
                  {numeroOrdenesEnEspera}
                </p>
                <IoCarSportSharp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </span>
            </a>
          </li>
          <li className=" text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="/views/dashboard/ordenes-por-pagar" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Por pagar
              <span className="flex items-center justify-between bottom-0">
                <p className="text-3xl max-md:text-2xl font-bold">
                 {numeroOrdenesPorPagar} 
                </p>
                <MdOutlinePayment className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </span>
            </a>
          </li>
          <li className="text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="/views/dashboard/ordenes-terminadas" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Terminadas
              <span className="flex items-center justify-between bottom-0">
                <p className="text-3xl max-md:text-2xl font-bold">
                   {numeroOrdenesHoy} 
                </p>
                <MdDoneAll className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </span>
            </a>
          </li>
          <li className="text-[0.95rem] shadow-md hover:shadow-sm rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Total Vendido Hoy
              <span className="flex items-center justify-between bottom-0">
                <p className="text-3xl max-md:text-2xl font-bold"> 
                {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(totalRecaudado)}
                </p>
                <FaArrowTrendUp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </span>
            </a>
          </li>
        </ul>
      </section>
      <Table style={{ fontFamily: 'Overpass Variable',}} className=" w-11/12 m-auto mt-4">
        <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
          <TableRow className="">
            <TableCell className="max-md:hidden max-md:justify-center  w-24 px-4">#</TableCell>
            <TableCell className="md:w-44 px-1 max-md:w-24 max-md:text-center">Cliente</TableCell>
            <TableCell className="md:w-36 px-1 max-md:w-24 max-md:text-center">Vehículo</TableCell>
            <TableCell className="md:w-72 px-1 max-md:text-center">Servicio</TableCell>
            <TableCell className=""></TableCell>
            <TableCell className="hidden"> Estado</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnEspera &&
            ordenesEnEspera.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px]">
                <TableCell className="max-md:hidden px-4 font-bold w-20 p-2 border-b">{orden.id}</TableCell>
                <TableCell className="p-1 max-md:text-center border-b">
                  <section>
                    <p className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                    <p className="">{orden.cliente.celular}</p>
                  </section>
                </TableCell>
                <TableCell className="p-1 max-md:text-center border-b">
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
                <TableCell className="px-1 py-3 max-md:text-center border-b">
                  <section className="flex items-center justify-between max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="p-2 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
                  <section className="gap-4 w-max flex m-auto">
                    <Select
                      className="my-auto max-md:hidden"
                      mode="multiple"
                      placeholder="Asignar lavadores"
                      value={selectedEmployees[orden.id] || []}
                      onChange={(values) => handleEmpleadoChange(orden.id, values)}
                      style={{ width: 160 }}
                    >
                      {lavadores
                        .filter(lavador => lavador.activo === "1" && !(selectedEmployees[orden.id] || []).includes(lavador.nombre))
                        .map(lavador => (
                          <Option key={lavador.id} value={lavador.nombre}>
                            <p className=" capitalize">{lavador.nombre}</p>
                          </Option>
                        ))}
                    </Select>
                    {orden.estado === "en espera" ? (
                        <Button
                          className="flex max-md:hidden items-center gap-2 text-white text-xs bg-black hover:bg-blue-800"
                          onClick={() => {
                            actualizarEstadoOrden(orden.id, selectedEmployees[orden.id]);
                          }}
                        >
                          Iniciar
                          <FaPlay />
                        </Button>
                    ) : (
                      <p>La orden está en otro estado</p>
                    )}

                    <DropdownMenu>
                    <DropdownMenuTrigger>
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                          <Button 
                            onClick={() => cancelarOrden(orden.id)} 
                            type="link"
                            title="Cancelar orden"
                            className="text-xs max-md:hidden text-red-600 font-medium"
                          >
                            Cancelar orden
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </section>
                </TableCell>
                <TableCell className="hidden w-24">
                  <p className="flex text-xs p-1 rounded-md bg-blue-600/5 text-blue-600"> 
                    {orden.estado} 
                  </p>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        {/* ORDENES EN CURSO */}
        <TableBody>
          {ordenesEnCurso &&
            ordenesEnCurso.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[12px]">
                <TableCell className="max-md:hidden px-4 font-bold w-20 p-2">{orden.id}</TableCell>
                <TableCell className="p-1 max-md:text-center">
                  <section>
                    <p className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </p>
                    <p className="">{orden.cliente.celular}</p>
                  </section>
                </TableCell>
                <TableCell className="p-1 max-md:text-center">
                  <p className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </p>
                  <section className="gap-1 md:flex">
                    <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
                    <p> {orden.vehiculo.marca} </p>
                    <p className="max-md:hidden"> {orden.vehiculo.color} </p>
                  </section>
                  <span className="max-md:hidden md:hidden">
                    {orden.vehiculo.llaves} <p>dejó llaves</p>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-3 max-md:text-center ">
                <section className="flex items-center justify-between max-md:flex-col">
                    <p className="font-bold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </p>
                  </section>
                  <p className="max-md:hidden">{orden.servicio.nombre_servicios}</p>
                </TableCell>
                <TableCell className="my-auto gap-4 mt-2 md:mx-10 flex text-xs">
                  <section className="my-auto max-md:hidden">
                  {orden.estado === "en curso" ? (
                      <Button
                          className="flex items-center font-medium m-auto gap-2 text-xs border bg-white"
                          onClick={() => {
                            actualizarEstadoOrden3(orden.id);
                          }}
                        >
                        Finalizar
                      <FaStop className=" " />
                    </Button>
                  ) : (
                    <p>La orden está en otro estado</p>
                  )}
                  </section>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="max-md:m-auto">
                      <BsThreeDotsVertical className=" text-2xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                          <Button 
                            onClick={() => cancelarOrden(orden.id)} 
                            type="link"
                            title="Cancelar orden"
                            className="text-xs max-md:hidden text-red-600 font-medium"
                          >
                            Cancelar orden
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span onClick={(e) => e.stopPropagation()}>
                          <DetallesOrden orden={orden} />
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden">
                  <p className="flex text-xs  p-1 rounded-md text-green-500 bg-green-500/5"> 
                    {orden.estado} 
                    </p>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdenesDashboard;
