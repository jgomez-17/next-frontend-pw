'use client'

import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { BsThreeDotsVertical } from "react-icons/bs";

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
  servicio: { nombre_servicios: string; costo: string };
  estado: string;
  empleado: string
}

interface OrdenesEnCursoTableProps {
  ordenesEnCurso: Orden[];
  marcarOrdenTerminada: (ordenId: number) => void;
}

const OrdenesEnCursoTable: React.FC<OrdenesEnCursoTableProps> = ({
  ordenesEnCurso,
  marcarOrdenTerminada
}) => {
  return (
    <section className="py-10">
      <h2 className="text-lg font-bold mb-6">Órdenes en Curso</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-bold">Fecha</TableCell>
            <TableCell className="font-bold">Cliente</TableCell>
            <TableCell className="font-bold">Vehículo</TableCell>
            <TableCell className="font-bold">Servicio</TableCell>
            <TableCell className="font-bold">Estado</TableCell>
            <TableCell className="font-bold">Empleado</TableCell>
            <TableCell className="font-bold">Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenesEnCurso.map((orden) => (
            <TableRow key={orden.id}>
              <TableCell>{orden.fechaOrden}</TableCell>
              <TableCell>{orden.cliente.nombre}</TableCell>
              <TableCell>
                <p>Tipo: {orden.vehiculo.tipo}</p>
                <p>Marca: {orden.vehiculo.marca}</p>
                <p>Color: {orden.vehiculo.color}</p>
                <p>Placa: {orden.vehiculo.placa}</p>
                <p>Llaves: {orden.vehiculo.llaves}</p>
              </TableCell>
              <TableCell>{orden.servicio.nombre_servicios}</TableCell>
              <TableCell>{orden.estado}</TableCell>
              <TableCell>{orden.empleado}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <BsThreeDotsVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => marcarOrdenTerminada(orden.id)}>
                      Marcar como Terminada
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default OrdenesEnCursoTable;
