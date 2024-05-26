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
        className="text-xs"
        type="text"
        >
        Ver detalles
      </Button>
      <Modal
        title={`Detalles de la orden`}
        visible={visible}
        onCancel={handleCancel}
        footer={null}

        
      >
        <section>
          <span className="flex my-1 gap-2 font-medium">Numero de orden: 
            <p className=" font-normal"> {orden.id} </p>
          </span>
          <span className="flex gap-2 my-1">
            {orden.vehiculo.tipo}
            <p> {orden.vehiculo.marca}</p>
            <p>{orden.vehiculo.color}</p>
          </span>
          <span className=" font-medium flex gap-2 my-1">
            Servicio/s:
            <p className=" font-normal">
              {orden.servicio.nombre_servicios}
            </p>
          </span>
          <span className=" flex gap-2 font-medium my-1">
            Propietario:
            <p className=" font-normal"> 
              {orden.cliente.nombre}
            </p>
          </span>
          <span className=" font-medium flex gap-2 my-1">
            Dejó llaves?
            <p className=" font-normal">
              {orden.vehiculo.llaves}
            </p>
          </span>
          <span className=" flex gap-2 font-medium my-1">
            Asignado a:
            <p className=" font-normal"> 
              {orden.empleado}
            </p>
          </span>
            <span className="flex w-max px-3 py-1 my-3 m-auto bg-slate-600/10 rounded-md font-medium">
              {orden.estado} 
            </span>

        </section>

      </Modal>
    </>
  );
};

export default OrdenInfoModal;
