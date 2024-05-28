import React, { useState } from "react";
import { Modal, Button } from "antd";

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

  return (
    <>
      <Button
        onClick={showModal}
        className="text-xs font-medium"
        type="text"
        >
        Ver mas detalles
      </Button>
      <Modal
        title={`Detalles de la orden`}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        style={{fontFamily: 'Overpass Variable',}}
      >
        <section 
          style={{ fontFamily: 'Overpass Variable',}}
          className=" bg-gray-400/10 p-3 rounded-md"        
        >
          <span className="flex my-1 gap-2 font-bold">Numero de orden: 
            <p className=" font-normal"> {orden.id} </p>
          </span>
          <span className="flex gap-2 my-1">
            {orden.vehiculo.tipo}
            <p> {orden.vehiculo.marca}</p>
            <p>{orden.vehiculo.color}</p>
          </span>
          <span className=" font-bold flex gap-2 my-1">
            Servicio/s:
            <p className="font-normal">
              {orden.servicio.nombre_servicios}
            </p>
          </span>
          <span className=" flex gap-2 font-bold my-1">
            Propietario:
            <p className="capitalize font-normal"> 
              {orden.cliente.nombre}
            </p>
          </span>
          <span className="flex gap-2 font-bold">
            Celular: 
            <p className="font-normal"> 
              {orden.cliente.celular} 
            </p>
          </span>
          <span className="font-bold flex gap-2 my-1">
            Dejó llaves?
            <p className=" font-normal">
              {orden.vehiculo.llaves}
            </p>
          </span>
          <span className="flex gap-2 font-bold my-1">
            Asignado a:
            <p className=" font-normal"> 
              {orden.empleado}
            </p>
          </span>

        </section>
          <span className={`flex w-max px-3 py-1 my-3 m-auto rounded-md font-medium ${
            orden.estado === 'en espera' ? 'bg-blue-600/5 text-blue-600' :
            orden.estado === 'en curso' ? 'bg-green-500/5 text-green-600' :
            orden.estado === 'por pagar' ? 'bg-red-600/5 text-red-600' :
            orden.estado === 'terminado' ? 'bg-slate-600/5 text-black capitalize' :
            '' // clase por defecto o en caso de que no haya una coincidencia
            }`}>
            {orden.estado} 
          </span>

      </Modal>
    </>
  );
};

export default OrdenInfoModal;
