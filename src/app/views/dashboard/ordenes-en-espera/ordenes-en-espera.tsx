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
        <TableRow key={orden.id} className="md:text-[13px] text-xs font-bold">
          <TableCell className="max-md:hidden px-3 text-sm font-bold w-20 py-1 border-b border-black/20">{orden.id}</TableCell>
          <TableCell className="p-2 border-b border-black/20">
            <section className="flex flex-col gap-1 capitalize">
              <p>
                {orden.cliente.nombre}
              </p>
              <p className="text-gray-500 font-semibold text-xs">{orden.cliente.celular}</p>
            </section>
          </TableCell>
          <TableCell className="p-2 border-b border-black/20">
            <p className="py-0.5">
              {orden.vehiculo.placa}
            </p>
            <section className="gap-1 md:flex text-gray-500 font-medium">
              <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
              <p>{orden.vehiculo.marca}</p>
              <p className="max-md:hidden">{orden.vehiculo.color}</p>
            </section>
            <span className="max-md:hidden md:hidden">
              {orden.vehiculo.llaves} <p>dejó llaves</p>
            </span>
          </TableCell>
          <TableCell className="p-2 border-b border-black/20">
            <section className="flex flex-col gap-1">
              <p className="flex flex-col">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(Number(orden.servicio.costo))}
              </p>
            <p className="max-md:hidden text-gray-500 font-medium">{orden.servicio.nombre_servicios}</p>
            </section>
          </TableCell>
          <TableCell className="p-2 gap-2 items-center max-md:flex-col max-md:items-start text-xs border-b border-black/20">
            <section className="gap-4 w-max flex float-end max-md:hidden">
              <Select
                className=" max-md:hidden font-medium w-44"
                mode="multiple"
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
                variant={'default'}
                className="flex gap-2 font-semibold h-8 bg-green-700 hover:bg-green-800 items-center text-xs rounded-none"
                onClick={() => {
                  actualizarEstadoOrden(orden.id, selectedEmployees[orden.id] || []);
                }}
              >
                  <span className="max-md:hidden">Iniciar</span>
                  <PlayOutlineIcon />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <BsThreeDotsVertical className=" text-2xl" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      onClick={() => cancelarOrden(orden.id)} 
                      variant={"destructive"}
                      title="Cancelar orden"
                      className="text-xs font-medium h-8 max-md:hidden rounded-none"
                    >
                      Cancelar orden
                    </Button>
                    <DetallesOrden orden={orden} />
                </DropdownMenuContent>
              </DropdownMenu>
            </section>
            <section className="md:hidden" onClick={(e) => e.stopPropagation()}>
              <DetallesOrden orden={orden} />
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
