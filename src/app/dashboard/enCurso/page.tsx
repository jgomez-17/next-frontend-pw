'use client'

import React, { useEffect, useState } from "react";
import { message, Modal, Select } from "antd";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { FaCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoCarSportSharp } from "react-icons/io5";
import { AiOutlineFrown } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
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
}

const OPTIONS = ['Jose', 'Josue', 'Luis', 'Camilo', 'Eduardo', 'Pedro'];

const OrdenesEnCurso = () => {
  const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [ordenesPorPagar, setOrdenesPorPagar] = useState<Orden[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<{ [key: number]: string[] }>({});
  const [buttonStates, setButtonStates] = useState<{ [key: number]: boolean }>({});


  const fetchOrdenesEnCurso = () => {
    fetch('http://localhost:4000/api/estados/encurso')
      .then(response => response.json())
      .then(data => {
        setOrdenesEnCurso(data.ordenes);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchOrdenesEnCurso();  // Fetch initial data

    // const intervalId = setInterval(fetchOrdenesEnCurso, 7000); 

    // return () => clearInterval(intervalId); 
  }, []);

  // useEffect(() => {
  //   fetch('http://localhost:4000/api/estados/encurso')
  //     .then(response => response.json())
  //     .then(data => {
  //       setOrdenesEnCurso(data.ordenes);
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  //Funcion para actualizar el estado y asignar lavador 
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
        newStatus: "por pagar",
        employee: employeesString,
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Estado de la orden actualizado correctamente");
          fetchOrdenesEnCurso();
          fetchOrdenesPorPagar();
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
        fetchOrdenesEnCurso();
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

  const numeroOrdenes =
  ordenesEnCurso && ordenesEnCurso.length > 0 ? ordenesEnCurso.length : 0;


  //fech de las ordenes por pagar
  const fetchOrdenesPorPagar = () => {
    fetch('http://localhost:4000/api/estados/porpagar')
    .then(response => response.json())
    .then(data => {
      setOrdenesPorPagar(data.ordenes);
    })
    .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchOrdenesPorPagar();
  }, []);

  const numeroOrdenesPorPagar =
  ordenesPorPagar && ordenesPorPagar.length > 0 ? ordenesPorPagar.length : 0;

  const fetchOrdenesTerminadas = () => {
    fetch('http://localhost:4000/api/estados/terminado')
      .then(response => response.json())
      .then(data => {
        setOrdenesTerminadas(data.ordenes);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchOrdenesTerminadas();  // Fetch initial data
  }, []);

  const numeroOrdenesTerminadas =
  ordenesTerminadas && ordenesTerminadas.length > 0 ? ordenesTerminadas.length : 0;

  return (
    <> 
      <nav className=" gap-3 w-11/12 m-auto flex mt-20 mb-6 ">
        <VerificarPlaca />
        <Drawerform onOrderCreated={fetchOrdenesEnCurso} />
      </nav>
      <article className="z-10 w-11/12 mt-2 m-auto mb-8">
        <ul className="flex flex-wrap justify-between items-center gap-2">
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              En curso
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold">
                  {numeroOrdenes}
                </span>
                <IoCarSportSharp className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className=" text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="/dashboard/porPagar" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Por pagar
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold">
                 {numeroOrdenesPorPagar} 
                </span>
                <IoCarSportSharp className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className="font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Terminadas
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold">
                   {numeroOrdenesTerminadas} 
                </span>
                <AiOutlineFrown className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="text-[0.95rem] bg-slate-50 transition-all max-md:w-[48.5%] w-[24%] md:h-[160px] h-[130px] p-2 md:p-4 rounded">
            <a href="" className=" font-medium text-sm max-md:text-xs max-md:font-normal flex flex-col gap-14 md:gap-16">
              Total hoy
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl max-md:text-2xl font-semibold"> 400.000 </span>
                <MdAttachMoney className="card-icon text-gray-800/60 text-3xl" />
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
                <TableCell className="p-2 max-md:hidden gap-2 flex items-center max-md:flex-col max-md:items-start text-xs">
                  <Select
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
                  {orden.estado === "en curso" ? (
                    <Button
                      variant={"secondary"}
                      className={`px-3 h-8 rounded-lg text-xs ${
                        buttonStates[orden.id]
                          ? "text-red-700 bg-red-700/10"
                          : "text-green-700 bg-green-700/10"
                      }`}
                      onClick={() => {
                        if (!selectedEmployees[orden.id] || selectedEmployees[orden.id].length === 0) {
                          message.error("Por favor selecciona al menos un empleado");
                          return;
                        }
                        handleButtonStateChange(orden.id);
                      }}
                    >
                      {buttonStates[orden.id] ? <FaStop /> : <FaPlay /> }
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
      </Table>
    </>
  );
};

export default OrdenesEnCurso;
