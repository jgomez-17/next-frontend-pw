import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
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
  servicio: { nombre_servicios: string; costo: string; descuento: string };
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
  <>
  {ordenesEnCurso && ordenesEnCurso.length > 0 && (
  <TableBody>
    {ordenesEnCurso.map((orden: Orden) => (
      <TableRow key={orden.id} className="text-[12px]">
        <TableCell className="max-md:hidden px-4 font-bold w-20 py-1">{orden.id}</TableCell>
        <TableCell className="p-1">
          <section>
            <p className="font-semibold flex flex-col capitalize">
              {orden.cliente.nombre}
            </p>
            <p className="text-gray-500">{orden.cliente.celular}</p>
          </section>
        </TableCell>
        <TableCell className="p-1">
          <p className="w-full font-semibold">
            {orden.vehiculo.placa}
          </p>
          <section className="text-gray-500 gap-1 md:flex">
            <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
            <p> {orden.vehiculo.marca} </p>
            <p className="max-md:hidden"> {orden.vehiculo.color} </p>
          </section>
          <span className="max-md:hidden md:hidden">
            {orden.vehiculo.llaves} <p>dejó llaves</p>
          </span>
        </TableCell>
        <TableCell className="p-1">
        <section className="flex justify-between max-md:flex-col">
            <p className="font-bold flex flex-col">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(Number(orden.servicio.costo))}
            </p>
          </section>
          <p className="max-md:hidden text-gray-500">{orden.servicio.nombre_servicios}</p>
        </TableCell>
        <TableCell className="text-xs p-1">
          <section className="flex float-end w-max gap-4">
                <Button 
                    onClick={() => cancelarOrden(orden.id)} 
                    title="Cancelar orden"
                    variant={"link"}
                    className="text-xs text-red-600 h-8 font-medium max-md:hidden"
                  >
                    Cancelar orden
                </Button>
              {orden.estado === "en curso" ? (
                  <Button
                      title="Terminar"
                      className="flex items-center bg-red-700 hover:bg-red-800 font-medium m-auto gap-2 text-xs border h-8"
                      onClick={() => {
                        actualizarEstadoOrden3(orden.id);
                      }}
                    >
                  <FaStop className=" " />
                </Button>
              ) : (
                <p>La orden está en otro estado</p>
              )}

            <DropdownMenu>
            <DropdownMenuTrigger className="max-md:m-auto">
              <BsThreeDotsVertical className=" text-2xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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

export default OrdenesEnCursoTable;
