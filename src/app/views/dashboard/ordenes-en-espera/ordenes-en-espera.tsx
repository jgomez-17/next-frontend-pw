import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Select } from "antd";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden';
import { PlayOutlineIcon } from "@/app/components/ui/iconos";

const { Option } = Select;

interface Orden {
  id: number;
  fechaOrden: string;
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
  empleado: string;
}

interface Lavador {
  id: number;
  nombre: string;
  activo: string;
}

interface OrdenesEnEsperaProps {
  ordenesEnEspera: Orden[];
  actualizarEstadoOrden: (orderId: number, selectedEmployees: string[]) => void;
  cancelarOrden: (orderId: number) => void;
  selectedEmployees: { [key: number]: string[] };
  handleEmpleadoChange: (orderId: number, empleados: string[]) => void;
  lavadores: Lavador[];
}

const OrdenesEnEspera: React.FC<OrdenesEnEsperaProps> = ({
  ordenesEnEspera,
  actualizarEstadoOrden,
  cancelarOrden,
  selectedEmployees,
  handleEmpleadoChange,
  lavadores,
}) => {

  return (
    <>
    {ordenesEnEspera && (
    <TableBody>
      {ordenesEnEspera.map((orden) => (
        <TableRow key={orden.id} className="text-[12px]">
          <TableCell className="max-md:hidden px-3 font-medium w-20 py-1 border-b">{orden.id}</TableCell>
          <TableCell className="p-1 border-b">
            <section>
              <p className="font-medium flex flex-col capitalize">
                {orden.cliente.nombre}
              </p>
              <p className="text-slate-500">{orden.cliente.celular}</p>
            </section>
          </TableCell>
          <TableCell className="p-1 border-b">
            <p className="w-full font-semibold">
              {orden.vehiculo.placa}
            </p>
            <section className="gap-1 md:flex text-slate-500">
              <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
              <p>{orden.vehiculo.marca}</p>
              <p className="max-md:hidden">{orden.vehiculo.color}</p>
            </section>
            <span className="max-md:hidden md:hidden">
              {orden.vehiculo.llaves} <p>dejó llaves</p>
            </span>
          </TableCell>
          <TableCell className="p-1 border-b">
            <section className="flex max-md:flex-col">
              <p className="font-medium flex flex-col">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(Number(orden.servicio.costo))}
              </p>
            </section>
            <p className="max-md:hidden text-slate-500 font-sans">{orden.servicio.nombre_servicios}</p>
          </TableCell>
          <TableCell className="p-1 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b">
            <section className="gap-4 w-max flex float-end">
            <Select
              className=" max-md:hidden"
              mode="multiple"
              style={{ width: 160 }}
              placeholder="Asignar empleados"
              value={selectedEmployees[orden.id] || []}
              onChange={(value) => handleEmpleadoChange(orden.id, value)}
            >
              {lavadores
              .filter(lavador => lavador.activo === "1" && !(selectedEmployees[orden.id] || []).includes(lavador.nombre))
              .map((lavador) => (
                <Select.Option key={lavador.id} value={lavador.nombre}>
                  <p className="capitalize">{lavador.nombre}</p>
                </Select.Option>
              ))}
            </Select>
              <Button
                title="Iniciar"
                variant={"default"}
                className="flex h-7 bg-transparent hover:bg-transparent text-green-600 items-center text-xs"
                onClick={() => {
                  actualizarEstadoOrden(orden.id, selectedEmployees[orden.id] || []);
                }}
              >
                    <PlayOutlineIcon />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <BsThreeDotsVertical className=" text-2xl" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className=" max-md:hidden">
                    <Button 
                      onClick={() => cancelarOrden(orden.id)} 
                      variant={"ghost"}
                      title="Cancelar orden"
                      className="text-xs text-red-600 font-medium h-8"
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
        </TableRow>
      ))}
    </TableBody>
    )}
    </>
  );
};

export default OrdenesEnEspera;
