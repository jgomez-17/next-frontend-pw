// pdfGenerator.ts

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

export const generarPDF = (orden: Orden) => {
  const doc = new jsPDF();
  
  // Fecha actual formateada
  const fechaActual = new Date();
  const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  
  // Datos del cliente y vehículo de la orden especificada
  const { cliente, vehiculo, servicio } = orden;
  
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
  
  // Detalles del servicio
  const serviciosData = [
    [servicio.nombre, formatNumber(servicio.costo)]
  ];
  const columnStyles = {
    0: { cellWidth: 100 },
    1: { cellWidth: 70 }
  };
  
  // Calcular subtotal, descuento y total
  const subtotal = servicio.costo;
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
    bodyStyles: { font: 'times' },
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
  doc.save(`Factura_${vehiculo.placa}_${orden.id}.pdf`);
};

function formatNumber(number: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
}
