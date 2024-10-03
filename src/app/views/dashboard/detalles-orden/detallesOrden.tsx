'use client'

import React, { useState } from "react";
import { Modal } from "antd";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";  // Importación correcta de la localización

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
  empleado: string;
}

interface Props {
  orden: Orden;
}

const OrdenInfoModal: React.FC<Props> = ({ orden }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const formattedDate = format(new Date(orden.fechaOrden), "PPPP 'a las' hh:mm a", { locale: es });

  function formatNumber(number: number) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  }

  return (
    <>
      <Button
        onClick={showModal}
        className="text-xs h-9 font-medium"
        variant={"ghost"}
      >
        Ver más detalles
      </Button>
      <Modal
        title={``}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >


        <main
          className="mt-2 gap-6 tracking-tighter font-mono"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold my-3">
              Orden # {orden.id}
            </p>
            <p className="text-xs mr-6 text-gray-500 ">
                {formattedDate}
            </p>
          </div>
          <div className="text-sm my-3">
            <span className="font-bold">Vehiculo</span>
            <span className="flex text-xs h-max gap-1 text-gray-500">
              <p className=""> {orden.vehiculo.tipo} </p> 
              <p className=""> {orden.vehiculo.marca} </p> 
              <p className=""> {orden.vehiculo.color} </p> 
            </span>
          </div>
          <div className="text-sm">
            <span className="font-bold"> Servicio/s </span>
            <p className=" text-gray-500 text-xs">
              {orden.servicio.nombre_servicios}
            </p>
          </div>

          <div className="flex my-3 flex-col">
            <span className="font-bold">Valor</span>
            <span className="text-gray-500 text-xs  flex flex-col">
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(Number(orden.servicio.costo))}
            </span>
          </div>

          <div className="text-sm flex flex-col gap-1 my-3">
            <span className="font-bold">Cliente</span>
            <span className="capitalize text-xs text-gray-500 ">
                {orden.cliente.nombre} <br />
                <p className="text-[11px]">{orden.cliente.celular}</p>
            </span>
          </div>

          <div className="flex flex-col gap-1 text-sm font-bold">
            <span>Lavador Asignado</span>
            <p className="capitalize text-gray-500 font-normal text-xs ">
              {orden.empleado}
            </p>
          </div>

          <p className="text-sm font-bold my-3">
              {orden.vehiculo.llaves} dejó llaves
          </p>

          <div className="flex items-center gap-2 my-3">
            <span className="font-bold">Estado</span>
            <p className={` w-max px-4 py-2 text-end rounded-md font-medium text-xs ${
              orden.estado === 'en espera' ? 'bg-blue-600/5 text-blue-600' :
              orden.estado === 'en curso' ? 'bg-green-500/5 text-green-600' :
              orden.estado === 'por pagar' ? 'bg-red-600/5 text-red-600' :
              orden.estado === 'terminado' ? 'bg-slate-600/5 text-black capitalize' :
              '' 
              }`}>
              {orden.estado}
            </p>
          </div>


          







        </main>
      </Modal>
    </>
  );
};

export default OrdenInfoModal;
