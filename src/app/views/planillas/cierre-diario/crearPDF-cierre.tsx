import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Orden {
  id: number;
  vehiculo: {
    marca: string;
    placa: string;
  };
}

interface Lavador {
  nombre: string;
  seccion: string;
}

interface Totales {
  totalRecaudado: number;
  totalSpa: number;
  totalSatelital: number;
  numeroOrdenesHoy: number;
  totalEfectivo: number;
  totalNequi: number;
  totalBancolombia: number;
  pagoAdministracion: number;
  pagoVentas: number;
  meta: number;
  gastosAdicionales: number;
  totalRestanteGeneral: number;
}

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
};

export const generarPDF = (
  totales: Totales,
  ordenesPorLavador: Record<string, Orden[]>,
  lavadores: Lavador[],
  editableOrdenes: Record<string, number>
) => {
  const doc = new jsPDF();
  const fechaHoy = new Date().toLocaleDateString('es-CO');
  const resumenData = [
    { label: 'Vendido:', value: formatNumber(totales.totalRecaudado) },
    { label: 'SPA:', value: formatNumber(totales.totalSpa) },
    { label: 'Satelital:', value: formatNumber(totales.totalSatelital) },
    { label: 'Servicios:', value: totales.numeroOrdenesHoy },
    { label: 'Efectivo:', value: formatNumber(totales.totalEfectivo) },
    { label: 'Bancolombia:', value: formatNumber(totales.totalBancolombia) },
    { label: 'Nequi:', value: formatNumber(totales.totalNequi) },
    { label: 'Administración:', value: formatNumber(totales.pagoAdministracion) },
    { label: 'Ventas:', value: formatNumber(totales.pagoVentas) },
    { label: 'Meta:', value: formatNumber(totales.meta) },
    { label: 'Adicionales:', value: formatNumber(totales.gastosAdicionales) },
    { label: 'Total Restante:', value: formatNumber(totales.totalRestanteGeneral) },
  ];

  doc.setFont('times');
  doc.setFontSize(10);
  doc.setTextColor('#333');
  const titulo = 'Planillario de gestión';
  doc.text(titulo, 15, 15);
  const tituloWidth = doc.getTextWidth(titulo);
  const fechaPosX = doc.internal.pageSize.width - 15 - doc.getTextWidth(fechaHoy);
  doc.text(fechaHoy, fechaPosX, 15);

  let posY = 30;

  const halfLength = Math.ceil(resumenData.length / 2);
  const firstHalf = resumenData.slice(0, halfLength);
  const secondHalf = resumenData.slice(halfLength);

  firstHalf.forEach((item) => {
    doc.text(`${item.label} ${item.value}`, 15, posY);
    posY += 6;
  });

  posY = 30;

  secondHalf.forEach((item) => {
    doc.text(`${item.label} ${item.value}`, 90, posY);
    posY += 6;
  });

  posY += 10;
  let posX = 15;

  Object.keys(ordenesPorLavador).forEach((nombreLavador) => {
    const ordenes = ordenesPorLavador[nombreLavador];
    const lavador = lavadores.find((l) => l.nombre === nombreLavador);

    if (!lavador) {
      console.warn(`Lavador ${nombreLavador} no encontrado.`);
      return; // Skip this lavador if not found
    }

    const porcentaje = lavador.seccion === 'Satelital' ? 0.45 : 0.30;
    const totalCosto = ordenes.reduce((acc, orden) => acc + editableOrdenes[`${nombreLavador}-${orden.id}`], 0);
    const totalGanancia = totalCosto * porcentaje;
    const totalRestante = totalCosto - totalGanancia;

    const tableData = ordenes.map((orden: Orden) => {
      return [orden.id.toString(), orden.vehiculo.marca, orden.vehiculo.placa, formatNumber(editableOrdenes[`${nombreLavador}-${orden.id}`])];
    });

    if (posX === 15) {
      posX = 90;
    } else {
      posX = 15;
    }

    const lavadorRow = [
      { content: `${nombreLavador}`, styles: { cellWidth: 20 } },
      { content: `${lavador.seccion}`, styles: { cellWidth: 20 } },
      '',
      '',
    ];

    const totalRow = [
      'Totales',
      '',
      '',
      formatNumber(totalCosto),
    ];

    const netoLavadorRow = [
      'Neto Lavador',
      '',
      '',
      formatNumber(totalGanancia),
    ];

    const totalRestanteRow = [
      '',
      '',
      '',
      formatNumber(totalRestante),
    ];

    const tableHeight = (tableData.length * 10) + 30;

    if (posY + tableHeight > doc.internal.pageSize.height - 20) {
      doc.addPage();
      posY = 30;
    }

    autoTable(doc, {
      body: [...tableData, totalRow, netoLavadorRow, totalRestanteRow],
      head: [lavadorRow, ['#', 'Vehículo', 'Placa', 'Valor']],
      startY: posY,
      theme: 'grid',
      headStyles: { fillColor: [226, 232, 240], font: 'helvetica', textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 5 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
      },
      bodyStyles: { fontSize: 8 },
    });

    posY += tableHeight + 10;
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  doc.save(`planilla_${formattedDate}.pdf`);
};
