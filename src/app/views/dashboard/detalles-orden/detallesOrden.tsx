'use client'

import React, { useState } from "react";
import { Modal, Button } from "antd";
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

  return (
    <>
      <Button
        onClick={showModal}
        className="text-xs text-black font-medium"
        type="link"
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
          className="mt-2 gap-2 flex"
        >
          
        <section className="flex flex-col w-full gap-4">
          <p className="inline-block font-geist text-xs font-medium">
            Orden # {orden.id}
          </p>
            <div className="text-xs">
              <span className="font-medium">Vehiculo:</span>
              <span className="flex h-max gap-1 text-gray-500">
                <p className=""> {orden.vehiculo.tipo} </p> 
                <p className=""> {orden.vehiculo.marca} </p> 
                <p className=""> {orden.vehiculo.color} </p> 
              </span>
            </div>
          <div className="text-xs">
            <span className="font-medium"> Servicio: </span>
            <p className=" text-gray-500">
              {orden.servicio.nombre_servicios}
            </p>
          </div>
            <p className="text-xs font-medium">
              {orden.vehiculo.llaves} dejó llaves
          </p>
        </section>

        <section className=" flex flex-col w-full gap-4">
          <p className="text-xs float-end mr-6 text-gray-500 ">
                {formattedDate}
          </p>
          <div className="text-xs flex flex-col gap-1">
            <span className="font-medium">Cliente:</span>
            <span className="capitalize text-xs text-gray-500 ">
                {orden.cliente.nombre} <br />
                <p className="text-[11px]">{orden.cliente.celular}</p>
            </span>
          </div>
          <span className="flex gap-2 text-xs font-medium">
            Lavador:
            <p className="capitalize text-gray-500 font-normal ">
              {orden.empleado}
            </p>
          </span>

          <span className={` w-max px-2 rounded-md font-medium text-xs ${
            orden.estado === 'en espera' ? 'bg-blue-600/5 text-blue-600' :
            orden.estado === 'en curso' ? 'bg-green-500/5 text-green-600' :
            orden.estado === 'por pagar' ? 'bg-red-600/5 text-red-600' :
            orden.estado === 'terminado' ? 'bg-slate-600/5 text-black capitalize' :
            '' 
            }`}>
            {orden.estado}
          </span>
        </section>



          







        </main>
      </Modal>
    </>
  );
};

export default OrdenInfoModal;
