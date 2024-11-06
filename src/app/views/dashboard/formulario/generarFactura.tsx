// pdfGenerator.ts

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Servicio {
  nombre: string;
  costo: number;
}

export interface OrdenData {
  nombre: string;
  celular: string;
  tipo: string;
  marca: string;
  color: string;
  placa: string;
  observaciones: string;
  servicios: Servicio[];
  descuento: number;
  costoConDescuento: number;
}

export const generarFacturaPDF = (orden: OrdenData) => {
  const { nombre, celular, tipo, marca, color, placa, observaciones, servicios, descuento, costoConDescuento } = orden;

  const doc = new jsPDF();

  doc.setFont('times');
  doc.setFontSize(10);
  doc.setTextColor('#333');

  const fechaActual = new Date();
  const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

  // Encabezado
  doc.setFontSize(18);
  doc.text('Factura', 20, 20);

  // Encabezado de los datos del cliente
  doc.setFontSize(12);
  doc.text(`Fecha: ${fechaFormateada}`, 150, 22); // Mostrar la fecha

  doc.setFontSize(10);
  doc.text(`Facturar a:`, 20, 40);

  doc.setFontSize(10);
  doc.text(`${nombre}`, 20, 46);
  doc.text(`${celular}`, 20, 52);

  // Encabezado de los datos del vehículo
  doc.setFontSize(10);
  doc.text(`Vehículo: `, 150, 40);
  doc.setFontSize(10);
  doc.text(`${tipo} ${marca} ${color}`, 150, 46);
  doc.text(`Placa: ${placa}`, 150, 52);

  doc.text(`Observaciones: ${observaciones}`, 20, 70);

  // Detalles de los servicios
  const serviciosData = servicios.map(servicio => [servicio.nombre, formatCurrency(servicio.costo)]);

  const columnStyles = {
    0: { cellWidth: 100 },
    1: { cellWidth: 70 }
  };

  autoTable(doc, {
    head: [['Servicio', 'Costo Unitario']],
    body: serviciosData,
    theme: 'plain',
    startY: 80,
    margin: { left: 20 },
    headStyles: { fillColor: [226, 232, 240], font: 'times', textColor: [0, 0, 0], fontStyle: 'bold' },
    bodyStyles: { font: 'times' },
    columnStyles: columnStyles,
    didDrawPage: (data) => {
      const cursorY = data.cursor?.y ?? 80;
      const totalY = cursorY + 10;
      doc.text(`Subtotal: ${formatCurrency(servicios.reduce((total, servicio) => total + servicio.costo, 0))}`, 22, totalY);
      doc.text(`Descuento: ${formatCurrency(descuento)}`, 22, totalY + 5);
      doc.text(`Total: ${formatCurrency(costoConDescuento)}`, 22, totalY + 10);
    }
  });

  doc.save(`Factura_${placa}.pdf`);
};

function formatCurrency(number: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
}
