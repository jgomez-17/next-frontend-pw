'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale"; 
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DownloadIcon, SearchIcon } from '@/app/components/ui/iconos';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Orden = {
  id: number;
  fecha_orden: string;
  estado: string;
  empleado: string;
  metododepago: string;
  cliente: {
    id: number;
    nombre: string;
    celular: string;
    correo: string;
  };
  vehiculo: {
    id: number;
    placa: string;
    marca: string;
    tipo: string;
    color: string;
    llaves: string;
    observaciones: string;
  };
  servicio: {
    id: number;
    nombre: string;
    descuento: number;
    costo: number;
  };
};

const OrdenesPorPlaca: React.FC = () => {
  const [placa, setPlaca] = useState<string>('');
  const [ordenes, setOrdenes] = useState<Orden[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const obtenerOrdenesPorPlaca = async (placa: string) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/clientes/placas/${placa}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          setOrdenes(null); // Limpiar órdenes si no se encontraron resultados
          setError('No se encontraron órdenes para la placa ingresada');
        } else {
          throw new Error('Error al obtener las órdenes. Por favor, inténtalo de nuevo.');
        }
      } else {
        const data = await response.json();
        // Ordenar las órdenes por fecha de manera descendente (más recientes primero)
        data.sort((a: Orden, b: Orden) => new Date(b.fecha_orden).getTime() - new Date(a.fecha_orden).getTime());
        setOrdenes(data);
        setError(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      console.error('Error:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    obtenerOrdenesPorPlaca(placa);
  };

  const formatFecha = (fecha: string) => {
    try {
      const formattedDate = format(new Date(fecha), "PPPP 'a las' hh:mm a", { locale: es });
      return formattedDate;
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha no disponible';
    }
  };


  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };

  // Función para generar el PDF
  const generarPDF = () => {
      if (!ordenes || ordenes.length === 0) return;
  
      const doc = new jsPDF();
  
      // Fecha actual formateada
      const fechaActual = new Date();
      const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  
      // Datos del primer cliente y vehículo encontrados
      const primerOrden = ordenes[0];
      const { cliente, vehiculo, servicio } = primerOrden;
  
      // Encabezado
      doc.setFontSize(18);
      doc.setFont('times'); 
      doc.text('Factura', 20, 20);
  
      // Fecha
      doc.setFontSize(10);
      doc.text(`Fecha: ${fechaFormateada}`, 150, 22);
  
      // Datos del cliente
      doc.setFontSize(10);
      doc.text(`Facturar a:`, 20, 40);
      doc.text(`${cliente.nombre}`, 20, 46);
      doc.text(`${cliente.celular}`, 20, 52);
  
      // Datos del vehículo
      doc.text(`Vehículo: `, 150, 40);
      doc.text(`${vehiculo.tipo} ${vehiculo.marca} ${vehiculo.color}`, 150, 46);
      doc.text(`Placa: ${vehiculo.placa}`, 150, 51);
  
      // Observaciones del vehículo (si las hay)
      if (vehiculo.observaciones) {
        doc.text(`Observaciones: ${vehiculo.observaciones}`, 150, 52);
      }
  
      // Detalles de los servicios
      const serviciosData = ordenes.map((orden) => [
        orden.servicio.nombre,
        formatNumber(orden.servicio.costo)
      ]);
      const columnStyles = {
        0: { cellWidth: 100 },
        1: { cellWidth: 70 }
      };
  
      // Calcular subtotal, descuento y total
      const subtotal = ordenes.reduce((acc, curr) => acc + curr.servicio.costo, 0);
      const descuento = servicio.descuento || 0;
      const total = subtotal - descuento;
  
      // Generar tabla de servicios
      autoTable(doc, {
        head: [['Servicio', 'Costo Unitario']],
        body: serviciosData,
        startY: 80,
        theme: 'plain',
        margin: { left: 20 },
        headStyles: { fillColor: [226, 232, 240], font: 'times', textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: columnStyles,
        bodyStyles: {font: 'times'},
        didDrawPage: (data) => {
          // Totales
          const cursorY = data.cursor?.y ?? 10;
          const totalY = cursorY + 10;
          doc.text(`Subtotal: ${formatNumber(subtotal)}`, 22, totalY);
          doc.text(`Descuento: ${formatNumber(descuento)}`, 22, totalY + 5);
          doc.text(`Total: ${formatNumber(total)}`, 22, totalY + 10);
        }
      });
  
      // Guardar o mostrar el PDF
      doc.save(`Factura_${placa}.pdf`);
    };

  return (
    <>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

            <DialogTrigger className='transition text-xs flex items-center gap-2 bg-black text-white hover:bg-slate-900 px-3 h-8 py-1 rounded-md'>
              Descargar Factura 
              <DownloadIcon />
            </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> </DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          <div className="w-full mx-auto rounded-md">
              <form onSubmit={handleSubmit} className="mb-4 max-md:w-max flex flex-col">
                <p className='text-sm font-medium'> Ingrese la placa del vehiculo</p>
                <label className="flex items-center gap-3 w-max">
                  <Input
                    type="text"
                    className="uppercase w-36 h-8 my-4"
                    value={placa}
                    onChange={(e) => {
                      let inputValue = e.target.value.toUpperCase();
                      inputValue = inputValue.replace(/[^A-Z, 0-9]/g, '');

                      if (inputValue.length > 3) {
                        inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
                      }

                      inputValue = inputValue.replace(/[^A-Z0-9\-]/g, '');

                      if (inputValue.includes('-')) {
                        const parts = inputValue.split('-');
                        parts[1] = parts[1].replace(/[^0-9]/g, '');
                        inputValue = parts.join('-');
                      }

                      inputValue = inputValue.slice(0, 7);
                      setPlaca(inputValue);
                    }} 
                    maxLength={7} // Permitir 3 letras, 1 guión y 3 números
                    required 
                  />
                <Button type='submit' variant={'default'}  className=' bg-black text-white h-8 text-xs'>
                  <SearchIcon />
                </Button>
                </label>
              </form>
              {error && <p className=" mb-4">{error}</p>}
              {ordenes && (
                <div className='w-full'>
                  <div className='flex items-center justify-between'>
                    <h3 className="text-sm font-medium text-gray-600">Historial </h3>
                    <p className='text-xs font-light text-gray-500'>(seleccione su nombre para descargar su recibo)</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {ordenes.map((orden) => (
                      <AccordionItem key={orden.id} value={`item-${orden.id}`}>
                        <AccordionTrigger>
                          <div className="flex items-center w-full py-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <Button 
                                onClick={generarPDF}
                                className="block font-semibold text-xs capitalize p-0 h-4 bg-white text-black hover:bg-white"
                              >
                                {orden.cliente.nombre}
                              </Button>
                              <p className="text-[11px] md:text-xs text-gray-500">{formatFecha(orden.fecha_orden)}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="py-2">
                            <div className="flex items-start justify-between w-full">
                              <div className="w-[40%]">
                                <p className="text-[11px] md:text-xs text-gray-500">{orden.vehiculo.marca}</p>
                                <p className="text-[11px] md:text-xs text-gray-500">{orden.vehiculo.placa}</p>
                                {/* Mostrar más detalles según sea necesario */}
                              </div>
                              <div className="w-[60%] flex flex-col gap-1">
                                <p className="text-[11px] md:text-xs text-gray-500 leading-tight">{orden.servicio.nombre}</p>
                                {/* Mostrar más detalles adicionales aquí */}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdenesPorPlaca;
