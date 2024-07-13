'use client'

import React, { useEffect, useState } from "react";
import { message, Select, Button } from "antd";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlay } from "react-icons/fa6";
import Navbar from '@/app/views/navbar/page'
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden'
import CardsStats from "../cards-status/cards-status";
import OrdenesEnCurso from "../ordenes-en-curso/ordenes-en-curso";
import OrdenesEnEspera from "../ordenes-en-espera/ordenes-en-espera"; // Import the new component
import NewForm from "@/app/views/dashboard/new-formulario/new-form";
import Link from "next/link";
import ProtectedRoute from "@/app/components/protectedRoute";
import { ReloadIcon } from "@/app/components/ui/iconos";

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
  servicio: { nombre_servicios: string; costo: string; descuento: string };
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLavadores = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores`; 

    fetch(apiUrl)
      .then(response => response.json())
      .then((data: { body: Lavador[] }) => {
        setLavadores(data.body || '');
      })
      .catch(error => console.error('Error al obtener datos de lavadores:', error));
  };

  useEffect(() => {
    fetchLavadores();
  }, []);

  const fetchOrdenesEnEspera = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/enespera`; 

     fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setOrdenesEnEspera(data.ordenes);
        setNumeroOrdenesEnEspera(data.numeroOrdenesEnEspera || 0);
      })

      // .catch(error => console.error('Error fetching data:', error));
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
        setOrdenesEnCurso(data.ordenes || [] );
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

  const fetchOrdenesTerminadasHoy = () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/terminadohoy`

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setOrdenesTerminadas(data.ordenes || [] )
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
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ordenes/actualizarestado`

    fetch(apiUrl, {
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
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ordenes/actualizarestado3`

    fetch(apiUrl, {
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
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ordenes/cancelarorden`

    fetch(apiUrl, {
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

  const reloadPage = () => {
      const hideMessage = message.loading('Cargando...', 0);
  
      fetchOrdenesEnEspera();
      fetchOrdenesEnCurso();
      fetchOrdenesPorPagar();
      fetchOrdenesTerminadasHoy();
    
      setTimeout(hideMessage, 1000);
  };

  return (
    <>
    <ProtectedRoute>
      <Navbar />

      <nav 
        className=" gap-3 w-11/12 justify-between m-auto flex items-center mt-[80px] mb-6 font-geist "
      >


          <Button onClick={reloadPage} className=" border-none">
            <ReloadIcon />
          </Button>

          <article className="flex items-center gap-4">
          <Link 
            href="/views/planillas/cierre-diario"
            className="text-xs font-medium border hover:bg-slate-50 hover:border-transparent py-2 px-5 rounded-md"
          >
            Cierre
          </Link>
          <NewForm fetchOrdenesEnEspera={fetchOrdenesEnEspera} />
          </article>
      
      </nav>
      <CardsStats
        numeroOrdenesEnEspera={numeroOrdenesEnEspera}
        numeroOrdenesHoy={numeroOrdenesHoy}
        numeroOrdenesPorPagar={numeroOrdenesPorPagar}
        totalRecaudado={totalRecaudado}
      />
      

      <Table className=" w-11/12 m-auto mt-4">
        <TableHeader className="text-[1rem] font-bold max-md:text-[0.89rem] ">
          <TableRow className=" text-sm">
            <TableCell className="max-md:hidden max-md:justify-center w-24 px-4">#</TableCell>
            <TableCell className="md:w-44 px-1 max-md:w-28">Cliente</TableCell>
            <TableCell className="md:w-36 px-1 max-md:w-28">Vehículo</TableCell>
            <TableCell className="md:w-72 px-1 max-md:w-24">Servicio</TableCell>
            <TableCell className="max-md:w-14"></TableCell>
            <TableCell className="hidden"> Estado</TableCell>
          </TableRow>
        </TableHeader>
          <OrdenesEnEspera
          ordenesEnEspera={ordenesEnEspera}
          actualizarEstadoOrden={actualizarEstadoOrden}
          cancelarOrden={cancelarOrden}
          selectedEmployees={selectedEmployees}
          handleEmpleadoChange={handleEmpleadoChange}
          lavadores={lavadores}
        />  

        {/* ORDENES EN CURSO */}
        <OrdenesEnCurso
          ordenesEnCurso={ordenesEnCurso}
          actualizarEstadoOrden3={actualizarEstadoOrden3}
          cancelarOrden={cancelarOrden}
        />
      </Table>
      </ProtectedRoute>
    </>
  );
};

export default OrdenesDashboard;
