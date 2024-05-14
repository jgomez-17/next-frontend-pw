import React, { useEffect, useState } from "react";
import { message } from "antd";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaCircle } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa6";
import { AiOutlineFrown } from "react-icons/ai";
import { MdAttachMoney } from "react-icons/md";
import { IoPlay } from "react-icons/io5";


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

const OrdenesEnCurso = () => {
  const [ordenesEnCurso, setOrdenesEnCurso] = useState<Orden[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<{
    [key: number]: string;
  }>({});
  const [buttonStates, setButtonStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    const storedButtonStates = JSON.parse(
      localStorage.getItem("buttonStates") || "{}"
    );
    setButtonStates(storedButtonStates);
  }, []);

  useEffect(() => {
    const storedSelectedEmployee = JSON.parse(
      localStorage.getItem("selectedEmployee") || "{}"
    );
    setSelectedEmployee(storedSelectedEmployee);
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/estados/encurso')
      .then(response => response.json())
      .then(data => {
        setOrdenesEnCurso(data.ordenes);
        // Restaurar estados de los botones solo para órdenes en curso
        const storedButtonStates = JSON.parse(localStorage.getItem('buttonStates') || '{}');
        const filteredButtonStates = data.ordenes.reduce((acc: { [key: number]: boolean }, ord: Orden) => {
          if (ord.estado === 'en curso' && storedButtonStates[ord.id] !== undefined) {
            acc[ord.id] = storedButtonStates[ord.id];
          }
          return acc;
        }, {});
        setButtonStates(prevState => ({ ...prevState, ...filteredButtonStates }));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const actualizarEstadoOrden = (orderId: number, selectedEmployee: string) => {
    if (!selectedEmployee) {
      message.error("Por favor selecciona un empleado");
      return;
    }

    fetch("http://localhost:4000/api/ordenes/actualizarestado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: "por pagar",
        employee: selectedEmployee,
      }),
    })
      .then((response) => {
        if (response.ok) {
          message.success("Estado de la orden actualizado correctamente");
          // Actualiza las órdenes después de actualizar el estado
          fetch("http://localhost:4000/api/estados/encurso")
            .then((response) => response.json())
            .then((data) => {
              setOrdenesEnCurso(data.ordenes);
            })
            .catch((error) => console.error("Error fetching data:", error));
        } else {
          throw new Error("Error al actualizar el estado de la orden");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el estado de la orden:", error);
        message.error("Error al actualizar el estado de la orden");
      });
  };

  const handleEmpleadoChange = (orderId: number, value: string) => {
    // Verifica si la orden está iniciada (botón presionado)
    if (buttonStates[orderId]) {
      message.warning("No puedes cambiar el empleado de una orden iniciada");
      return;
    }
  
    setSelectedEmployee((prevState) => ({
      ...prevState,
      [orderId]: value,
    }));
  };

  const handleButtonStateChange = (orderId: number) => {
    if (!selectedEmployee[orderId]) {
      message.error("Por favor selecciona un empleado");
      return;
    }

    setButtonStates((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));

    if (buttonStates[orderId]) {
      actualizarEstadoOrden(orderId, selectedEmployee[orderId]);
    }
  };
  
  useEffect(() => {
    localStorage.setItem("buttonStates", JSON.stringify(buttonStates));
  }, [buttonStates]);
  
  useEffect(() => {
    localStorage.setItem("selectedEmployee", JSON.stringify(selectedEmployee));
  }, [selectedEmployee]);
  
  
    const numeroOrdenes =
      ordenesEnCurso && ordenesEnCurso.length > 0 ? ordenesEnCurso.length : 0;
      
  return (
    <>
      <article className="body z-10 w-11/12 m-auto mb-8">
        <ul className="cards flex flex-wrap justify-between items-center">
          <li className="transition-all w-[270px] h-32 p-2 shadow rounded">
            <a href="" className="flex flex-col gap-14">
              En curso
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl font-semibold">
                  {" "}
                  {numeroOrdenes}{" "}
                </span>
                <FaCarSide className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="transition-all w-[270px] h-32 p-2 shadow rounded">
            <a href="" className="flex flex-col gap-14">
              Pendientes
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl font-semibold"> 2 </span>
                <FaCarSide className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="transition-all w-[270px] h-32 p-2 shadow rounded">
            <a href="" className="flex flex-col gap-14">
              Nose
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl font-semibold"> 7 </span>
                <AiOutlineFrown className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
          <li className="transition-all w-[270px] h-32 p-2 shadow rounded">
            <a href="" className="flex flex-col gap-14">
              Total hoy
              <article className="flex items-center justify-between bottom-0">
                <span className="text-3xl font-semibold"> 400.000 </span>
                <MdAttachMoney className="card-icon text-gray-800/60 text-3xl" />
              </article>
            </a>
          </li>
        </ul>
      </article>
      <h1 className="w-11/12 pl-3 m-auto text-sm font-semibold items-center flex gap-2">
        Ordenes en curso
        <FaCircle className="text-green-600 top-0 text-xs" />
      </h1>
      <Table className="w-11/12 m-auto mt-6">
        <TableHeader className="bg-slate-100/30 rounded-xl">
          <TableRow>
            <TableCell className="w-24">Nro Orden</TableCell>
            <TableCell className="w-40">Cliente</TableCell>
            <TableCell className=" w-56">Vehículo</TableCell>
            <TableCell className=" w-72">Servicio</TableCell>
            <TableCell className=""></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnCurso &&
            ordenesEnCurso.map((orden: Orden) => (
              <TableRow key={orden.id}>
                <TableCell>{orden.id}</TableCell>
                <TableCell className=" p-2">
                  <section>
                    <span className="font-semibold flex flex-col capitalize">
                      {orden.cliente.nombre}
                    </span>
                    <span>{orden.cliente.celular}</span>
                  </section>
                </TableCell>
                <TableCell className="p-2">
                  <span className="w-full font-semibold">
                    {orden.vehiculo.placa}
                  </span>
                  <section className="gap-4">
                    <span> {orden.vehiculo.tipo} </span>
                    <span> {orden.vehiculo.marca} </span>
                    <span> {orden.vehiculo.color} </span>
                  </section>
                  <span>
                    {orden.vehiculo.llaves} <span>dejó llaves</span>
                  </span>
                </TableCell>
                <TableCell className="p-2">
                  <section>
                    <span className="font-semibold flex flex-col">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format(Number(orden.servicio.costo))}
                    </span>
                    <span>{orden.servicio.nombre_servicios}</span>
                  </section>
                </TableCell>
                <TableCell className="p-2 gap-2 items-center flex">
                  <Select
                    value={selectedEmployee[orden.id]}
                    onValueChange={(value) =>
                      handleEmpleadoChange(orden.id, value)
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Asignar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Jose">Jose</SelectItem>
                        <SelectItem value="Josue">Josue</SelectItem>
                        <SelectItem value="Luis">Luis</SelectItem>
                        <SelectItem value="Camilo">Camilo</SelectItem>
                        <SelectItem value="Eduardo">Eduardo</SelectItem>
                        <SelectItem value="Pedro">Pedro</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {orden.estado === "en curso" ? (
                    <Button
                      variant={"secondary"}
                      className={`px-3 py-1 rounded-lg text-xs ${
                        buttonStates[orden.id]
                          ? "text-red-700 bg-red-700/10"
                          : "text-green-700 bg-green-700/10"
                      }`}
                      onClick={() => {
                        if (!selectedEmployee[orden.id]) {
                          message.error("Por favor selecciona un empleado");
                          return;
                        }
                        handleButtonStateChange(orden.id);
                      }}
                    >
                      {buttonStates[orden.id] ? "Terminar" : "Iniciar" }
                    </Button>
                  ) : (
                    <span>La orden está en otro estado</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdenesEnCurso;
