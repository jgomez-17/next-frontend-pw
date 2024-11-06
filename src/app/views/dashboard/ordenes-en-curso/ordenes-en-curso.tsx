import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import DetallesOrden from '@/app/views/dashboard/detalles-orden/detallesOrden';
import { StopIcon } from "@/app/components/ui/iconos";

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
      <TableRow key={orden.id} className="md:text-[13px] text-xs font-bold">
        <TableCell className="max-md:hidden text-sm px-3 font-bold w-20 py-1 border-b border-black/20">{orden.id}</TableCell>
        <TableCell className="p-2 border-b border-black/20">
          <section className="flex flex-col gap-1 capitalize
          ">
            <p>
              {orden.cliente.nombre}
            </p>
            <p className="text-gray-500 font-medium text-xs">{orden.cliente.celular}</p>
          </section>
        </TableCell>
        <TableCell className="p-2 border-b border-black/20">
          <p className="py-0.5">
            {orden.vehiculo.placa}
          </p>
          <section className="text-gray-500 font-medium gap-1 md:flex">
            <p className="max-md:hidden md:hidden"> {orden.vehiculo.tipo} </p>
            <p> {orden.vehiculo.marca} </p>
            <p className="max-md:hidden"> {orden.vehiculo.color} </p>
          </section>
          <span className="max-md:hidden md:hidden">
            {orden.vehiculo.llaves} <p>dejó llaves</p>
          </span>
        </TableCell>
        <TableCell className="p-2 border-b border-black/20">
        <section className="flex justify-between flex-col gap-1">
            <p>
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(Number(orden.servicio.costo))}
            </p>
          <p className="max-md:hidden text-gray-500 font-medium">{orden.servicio.nombre_servicios}</p>
          </section>
        </TableCell>
        <TableCell className="p-2 border-b border-black/20">
          <section className="flex float-end w-max gap-4 max-md:hidden">
                <Button 
                    onClick={() => cancelarOrden(orden.id)} 
                    title="Cancelar orden"
                    variant={"destructive"}
                    className="h-8 text-xs rounded-none font-medium max-md:hidden"
                  >
                    Cancelar orden
                </Button>
              {orden.estado === "en curso" ? (
                  <Button
                      title="Terminar"
                      className="h-8 bg-black text-xs font-semibold flex items-center gap-2 rounded-none"
                      onClick={() => {
                        actualizarEstadoOrden3(orden.id);
                      }}
                    >
                    <span className="max-md:hidden">Terminar</span>
                    <StopIcon />
                </Button>
              ) : (
                <p>La orden está en otro estado</p>
              )}
            
            <DropdownMenu>
            <DropdownMenuTrigger className="max-md:m-auto">
              <BsThreeDotsVertical className=" text-2xl" />
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                  <DetallesOrden orden={orden} />
            </DropdownMenuContent>
          </DropdownMenu>
          </section>
          <section className="md:hidden">
            <DetallesOrden orden={orden} />  
          </section>
        </TableCell>
      </TableRow>
    ))}
</TableBody>
)}
</>
);

export default OrdenesEnCursoTable;
