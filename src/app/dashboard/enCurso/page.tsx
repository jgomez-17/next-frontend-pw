'use client'

import React, { useEffect, useState } from "react";
import { message, Modal, Select } from "antd";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { FaCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoCarSportSharp } from "react-icons/io5";
import { AiOutlineFrown } from "react-icons/ai";
import { MdOutlinePayment } from "react-icons/md"; //icon ordenes por pagar
import { MdDoneAll } from "react-icons/md"; //icon ordenes terminadas
import { FaArrowTrendUp } from "react-icons/fa6";//icon total recaudado hoy 
import { FaPlay } from "react-icons/fa6";
import { FaStop } from "react-icons/fa";
import io from "socket.io-client";
import Drawerform from "@/app/components/ui/drawerform/drawer";
import CardsStates from '@/app/components/principalpage/cardsStates/page';
import VerificarPlaca from '@/app/components/ui/modal2/butonmodal'
import { link } from "fs";

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

const OPTIONS = ['Lavador 1', 'Lavador 2', 'Lavador 3', 'Lavador 4', 'Lavador 5', 'Lavador 6'];

const OrdenesEnCurso = () => {
  const [ordenesEnEspera, setOrdenesEnEspera] = useState<Orden[]>([]);
  const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([])
  const [totalRecaudado, setTotalRecaudado] = useState<number>(0);
  const [selectedEmployees, setSelectedEmployees] = useState<{ [key: number]: string[] }>({});
  const [buttonStates, setButtonStates] = useState<{ [key: number]: boolean }>({});

  const [numeroOrdenesEnEspera, setNumeroOrdenesEnEspera] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
  const [numeroOrdenesHoy, setNumeroOrdenesHoy] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy
  const [numeroOrdenesPorPagar, setNumeroOrdenesPorPagar] = useState<number>(0); // Nuevo estado para el número de órdenes terminadas hoy


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


  //Funcion para asignar lavador y poner en curso 
  const actualizarEstadoOrden = (orderId: number, selectedEmployees: string[]) => {
    if (!selectedEmployees || selectedEmployees.length === 0) {
      message.error("Por favor selecciona al menos un empleado");
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
          message.success("Terminado y enviado a por pagar");
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

  const handleButtonStateChange = (orderId: number) => {
    if (!selectedEmployees[orderId] || selectedEmployees[orderId].length === 0) {
      message.error("Por favor selecciona al menos un empleado");
      return;
    }

    setButtonStates((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));

    if (buttonStates[orderId]) {
      actualizarEstadoOrden(orderId, selectedEmployees[orderId]);
    }
  };


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

  return (
    <> 
      <nav className=" gap-3 w-11/12 m-auto flex mt-20 mb-6 ">
        <VerificarPlaca />
        <Drawerform onOrderCreated={fetchOrdenesEnEspera} />
      </nav>
      <article className="z-10 w-11/12 mt-2 m-auto mb-8">
        <ul className="flex flex-wrap justify-between items-center gap-1">
          <li className="text-[0.95rem] shadow-md rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              En espera
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-bold">
                  {numeroOrdenesEnEspera}
                </span>
                <IoCarSportSharp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </article>
            </a>
          </li>
          <li className=" text-[0.95rem] shadow-md rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="/dashboard/porPagar" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Por pagar
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-bold">
                 {numeroOrdenesPorPagar} 
                </span>
                <MdOutlinePayment className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] shadow-md rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Terminadas
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-bold">
                   {numeroOrdenesHoy} 
                </span>
                <MdDoneAll className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] shadow-md rounded-lg transition-all max-md:w-[48.5%] w-[24.5%] md:h-[160px] h-[130px] p-2 md:p-4">
            <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Total Vendido Hoy
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-bold"> 
                {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(totalRecaudado)}
                </span>
                <FaArrowTrendUp className="text-gray-800/60 -translate-y-10 -translate-x-2 max-md:text-3xl text-5xl opacity-30" />
              </article>
            </a>
          </li>
        </ul>
      </article>
      <Table className=" w-11/12 m-auto mt-4">
        <TableHeader className="rounded-xl font-medium">
          <TableRow>
            <TableCell className="hidden md:block w-24 px-1">Nro Orden</TableCell>
            <TableCell className="w-36 px-1">Cliente</TableCell>
            <TableCell className="w-52 px-1">Vehículo</TableCell>
            <TableCell className="md:w-72 px-1 max-md:w-80">Servicio</TableCell>
            <TableCell className=" max-md:hidden"></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnEspera &&
            ordenesEnEspera.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[13px]">
                <TableCell className="max-md:hidden w-20 p-2">{orden.id}</TableCell>
                <TableCell className="p-1">
                  <section>
                    <span className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </span>
                    <span>{orden.cliente.celular}</span>
                  </section>
                </TableCell>
                <TableCell className="p-1">
                  <span className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </span>
                  <section className="gap-4">
                    <span className="max-md:hidden"> {orden.vehiculo.tipo} </span>
                    <span> {orden.vehiculo.marca} </span>
                    <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                  </section>
                  <span className="max-md:hidden">
                    {orden.vehiculo.llaves} <span>dejó llaves</span>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-3 ">
                  <section>
                    <span className="font-semibold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </span>
                    <span className="max-md:text-[0.7rem]">{orden.servicio.nombre_servicios}</span>
                  </section>
                </TableCell>
                <TableCell className="p-2max-md:hidden gap-2 flex items-center max-md:flex-col max-md:items-start text-xs">
                  <Select
                    className="my-auto"
                    mode="multiple"
                    placeholder="Asignar lavadores"
                    value={selectedEmployees[orden.id] || []}
                    onChange={(values) => handleEmpleadoChange(orden.id, values)}
                    style={{ width: 160 }}
                  >
                    {OPTIONS.filter((o) => !(selectedEmployees[orden.id] || []).includes(o)).map((item) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                  {orden.estado === "en espera" ? (
                      <Button
                      variant={"secondary"}
                      className="px-3 h-8 rounded-lg text-xs text-green-700 bg-green-700/10"
                      onClick={() => {
                        if (!selectedEmployees[orden.id] || selectedEmployees[orden.id].length === 0) {
                          message.error("Por favor selecciona al menos un empleado");
                          return;
                        }
                        actualizarEstadoOrden(orden.id, selectedEmployees[orden.id]);
                      }}
                    >
                      <FaPlay />
                    </Button>
                  ) : (
                    <span>La orden está en otro estado</span>
                  )}
                  <Button 
                    onClick={() => cancelarOrden(orden.id)} 
                    variant={"link"}
                    className="text-xs px-3 h-8 text-red-700"
                    >
                    Cancelar orden
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        {/* ORDENES EN CURSO */}
        <TableBody>
          {ordenesEnCurso &&
            ordenesEnCurso.map((orden: Orden) => (
              <TableRow key={orden.id} className="text-[13px]">
                <TableCell className="max-md:hidden w-20 p-2">{orden.id}</TableCell>
                <TableCell className="p-1">
                  <section>
                    <span className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </span>
                    <span>{orden.cliente.celular}</span>
                  </section>
                </TableCell>
                <TableCell className="p-1">
                  <span className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </span>
                  <section className="gap-4">
                    <span className="max-md:hidden"> {orden.vehiculo.tipo} </span>
                    <span> {orden.vehiculo.marca} </span>
                    <span className="max-md:hidden"> {orden.vehiculo.color} </span>
                  </section>
                  <span className="max-md:hidden">
                    {orden.vehiculo.llaves} <span>dejó llaves</span>
                  </span>
                </TableCell>
                <TableCell className="px-1 py-3 ">
                  <section>
                    <span className="font-semibold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </span>
                    <span className="max-md:text-[0.7rem]">{orden.servicio.nombre_servicios}</span>
                  </section>
                </TableCell>
                <TableCell className="px-2 py-3 my-auto max-md:hidden gap-4 flex items-start max-md:flex-col text-xs">
                  <span className="font-semibold w-40 rounded-lg bg-gray-100/50 px-2 py-2">
                    {orden.empleado}
                  </span>
                  <span className="my-auto">
                  {orden.estado === "en curso" ? (
                      <Button
                      variant={"secondary"}
                      className="px-3 h-8 m-auto flex rounded-lg text-xs text-red-700 bg-red-700/10"
                      onClick={() => {
                        actualizarEstadoOrden3(orden.id);
                      }}
                    >
                      <FaStop />
                    </Button>
                  ) : (
                    <span>La orden está en otro estado</span>
                  )}
                  </span>
                  <span className=" bg-sky-600/5 py-1 px-2 my-auto rounded-lg">
                    {orden.estado}
                  </span>
                  
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdenesEnCurso;
