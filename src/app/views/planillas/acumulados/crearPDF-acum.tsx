// pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Acumulado {
    id: number;
    venta_diaria: number;
    acum_venta_diaria: number;
    prontowash: number;
    acum_prontowash: number;
    servicios: number;
    acum_servicios: number;
    fecha: string;
}

export const generarPDF = (data: Acumulado[], mesYAnio: string, totalAcumulado: Acumulado | null, obtenerNombreDia: (fecha: string) => string, formatNumber: (number: number) => string) => {
    const doc = new jsPDF();

    // Título y fecha
    doc.setFontSize(12);
    doc.setFont('times');
    doc.text(`Acumulado de ventas Prontowash`, 14, 20);
    doc.setFontSize(10);
    doc.text(` ${mesYAnio}`, 180, 20);

    // Construir datos para la tabla
    const tableData = data.map(item => [
        obtenerNombreDia(item.fecha), // Día de la semana
        new Date(item.fecha).getDate(), // Día del mes
        formatNumber(item.venta_diaria), // Venta diaria
        formatNumber(item.acum_venta_diaria), // Acumulado venta diaria
        formatNumber(item.prontowash), // Prontowash
        formatNumber(item.acum_prontowash), // Acumulado prontowash
        item.servicios.toString(), // Servicios
        item.acum_servicios.toString(), // Acumulado servicios
    ]);

    // Totales
    const totalRow = [
        'Totales',
        '',
        '',
        formatNumber(totalAcumulado?.acum_venta_diaria || 0), // Acumulado venta diaria
        '',
        formatNumber(totalAcumulado?.acum_prontowash || 0), // Acumulado prontowash
        '',
        totalAcumulado?.acum_servicios.toString() || '0', // Acumulado servicios
    ];

    tableData.push(totalRow);

    // Generar la tabla
    autoTable(doc, {
        startY: 30,
        head: [
            ['D/S', 'Día', 'Venta Diaria', 'Acum. Venta Diaria', 'Prontowash', 'Acum. Prontowash', 'Servicios', 'Acum. Servicios']
        ],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [226, 232, 240], textColor: [0, 0, 0], fontSize: 9, fontStyle: 'bold', font: 'times' },
        styles: { fontSize: 8, font: 'helvetica' },
        margin: { top: 25 },
    });

    // Descargar el PDF
    doc.save(`acumulado_ventas_${mesYAnio}.pdf`);
};
