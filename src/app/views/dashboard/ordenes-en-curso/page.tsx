// OrdenesEnCursoTable.tsx

import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Button } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStop } from "react-icons/fa";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden';

interface Orden {
  id: number;
  fechaOrden: string;
  empleado: string;
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

interface OrdenesEnCursoTableProps {
  ordenesEnCurso: Orden[];
  actualizarEstadoOrden3: (orderId: number) => void;
  cancelarOrden: (orderId: number) => void;
}

const OrdenesEnCursoTable: React.FC<OrdenesEnCursoTableProps> = ({
  ordenesEnCurso,
  actualizarEstadoOrden3,
  cancelarOrden
}) => (
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
);

export default OrdenesEnCursoTable;
