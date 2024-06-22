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

  // Formatear la fecha y hora en formato de 12 horas
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
        style={{ fontFamily: 'Fira Sans'}}
      >
        <section
          style={{ fontFamily: 'Roboto', }}
          className="bg-slate-50/10 p-3 rounded-md"
        >
          <span className="flex font-bold gap-2 my-1">
            Orden
            <p>{orden.id}</p>
          </span>

          <span className="font-bold">
            Fecha 
            <p className="font-normal">{formattedDate}</p>
          </span>

          <span className="flex font-bold gap-2 my-1">
            Vehículo:
            <p className="font-normal">{orden.vehiculo.tipo}</p>
            <p className="font-normal">{orden.vehiculo.marca}</p>
            <p className="font-normal">{orden.vehiculo.color}</p>
          </span>
          <span className="flex gap-2 font-bold my-1">
            Propietario:
            <p className="capitalize font-normal">
              {orden.cliente.nombre}
            </p>
          </span>
          <span className="flex items-center gap-2 font-bold">
            Celular: 
            <p className="font-normal text-xs">
              {orden.cliente.celular}
            </p>
          </span>
          <span className="font-bold flex gap-2 my-1">
            Dejó llaves?
            <p className="font-normal">
              {orden.vehiculo.llaves}
            </p>
          </span>

          <span className="flex gap-2 font-bold my-1">
            Asignado a:
            <p className="font-normal">
              {orden.empleado}
            </p>
          </span>
          <span className="font-bold flex gap-2 my-1">
            Servicio/s:
            <p className="font-normal">
              {orden.servicio.nombre_servicios}
            </p>
          </span>
          <span className={`flex w-max px-2 py-1 my-3 rounded-md font-medium ${
            orden.estado === 'en espera' ? 'bg-blue-600/5 text-blue-600' :
            orden.estado === 'en curso' ? 'bg-green-500/5 text-green-600' :
            orden.estado === 'por pagar' ? 'bg-red-600/5 text-red-600' :
            orden.estado === 'terminado' ? 'bg-slate-600/5 text-black capitalize' :
            '' // clase por defecto o en caso de que no haya una coincidencia
            }`}>
            {orden.estado}
          </span>

        </section>

      </Modal>
    </>
  );
};

export default OrdenInfoModal;
