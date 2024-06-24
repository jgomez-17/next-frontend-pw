'use client'

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { InputNumber, message } from "antd";
import { Button } from "@/components/ui/button";
import { MdOutlineDelete } from "react-icons/md";
import { IoMdCloudDownload } from "react-icons/io";
import { Input } from "@/components/ui/input"; 
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import ResumenOrdenes from "../resumen-ordenes/page";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from "@/app/components/protectedRoute";
import { DownloadIcon, DeleteIcon, BackIcon } from "@/app/components/ui/iconos";
import Link from "next/link";


interface Orden {
  id: number;
  fechaOrden: string;
  estado: string;
  empleado: string;
  metodoDePago: string;
  cliente: { nombre: string; celular: string };
  vehiculo: {
    marca: string;
    placa: string;
    tipo: string;
    color: string;
    llaves: string;
  };
  servicio: { costo: number };
}

const GenerarPlanilla = () => {
  const [totalRecaudado, setTotalRecaudado] = useState<number>(0);
  const [numeroOrdenesHoy, setNumeroOrdenesHoy] = useState<number>(0);
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [editableOrdenes, setEditableOrdenes] = useState<Record<string, number>>({});
  const [lavadores, setLavadores] = useState<any[]>([]);
  const [totalEfectivo, setTotalEfectivo] = useState<number>(0);
  const [totalNequi, setTotalNequi] = useState<number>(0);
  const [totalBancolombia, setTotalBancolombia] = useState<number>(0);
  const [pagoAdministracion, setPagoAdministracion] = useState<number>(0);
  const [pagoVentas, setPagoVentas] = useState<number>(0);
  const [meta, setMeta] = useState<number>(0);
  const [gastosAdicionales, setGastosAdicionales] = useState<number>(0);
  const [totalSatelital, setTotalSatelital] = useState<number>(0); // Nuevo estado para total de "Satelital"
  const [totalSpa, setTotalSpa] = useState<number>(0); // Nuevo estado para total de "Satelital"

  const calcularTotalesSeccion =  useCallback(() => {
    let totalSpa = 0;
    let totalSatelital = 0;
  
    lavadores.forEach(lavador => {
      const nombreLavador = lavador.nombre;
      const ordenes = ordenesTerminadas.filter(orden => orden.empleado.includes(nombreLavador));
      const totalCosto = ordenes.reduce((acc, orden) => acc + (editableOrdenes[`${nombreLavador}-${orden.id}`] || 0), 0);
  
      if (lavador.seccion === "Satelital") {
        totalSatelital += totalCosto;
      } else {
        totalSpa += totalCosto;
      }
    });
  
    setTotalSpa(totalSpa);
    setTotalSatelital(totalSatelital);
  },[editableOrdenes, lavadores, ordenesTerminadas, setTotalSpa, setTotalSatelital]);
  

  useEffect(() => {
    fetchOrdenesTerminadasHoy();
  }, []);

  const fetchOrdenesTerminadasHoy = () => {
    fetch('https://express-api-pw.onrender.com/api/estados/terminadohoy')
      .then(response => response.json())
      .then(data => {
        const ordenes = data.ordenes || [];
        setOrdenesTerminadas(ordenes);
        setTotalRecaudado(data.totalRecaudado || 0);
        setNumeroOrdenesHoy(data.numeroOrdenesHoy || 0);
        const initialEditable = ordenes.reduce((acc: Record<string, number>, orden: Orden) => {
          const empleados = orden.empleado.split(',').map(emp => emp.trim());
          empleados.forEach(empleado => {
            acc[`${empleado}-${orden.id}`] = 0;
          });
          return acc;
        }, {});
        setEditableOrdenes(initialEditable);
        setTotalEfectivo(data.totalEfectivo || 0);
        setTotalNequi(data.totalNequi || 0);
        setTotalBancolombia(data.totalBancolombia || 0);
        console.log(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetch('https://express-api-pw.onrender.com/api/lavadores/')
      .then(response => response.json())
      .then((data: any) => setLavadores(data.body || []))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    calcularTotalesSeccion();
  }, [editableOrdenes, lavadores, calcularTotalesSeccion]);

  const handleCostChange = (lavadorNombre: string, ordenId: number, value: number | null) => {
    if (value !== null) {
      setEditableOrdenes(prev => ({ ...prev, [`${lavadorNombre}-${ordenId}`]: value }));
    }
  };

  const handleDelete = (lavadorNombre: string, ordenId: number) => {
    setOrdenesTerminadas(prevOrdenes => {
      const newOrdenes = prevOrdenes.map((orden: Orden) => {
        if (orden.empleado.includes(lavadorNombre) && orden.id === ordenId) {
          return { ...orden, empleado: orden.empleado.replace(lavadorNombre, '').trim() };
        }
        return orden;
      }).filter((orden: Orden) => orden.empleado);
      return newOrdenes;
    });
  };

  const handleSectionChange = (nombreLavador: string, value: string) => {
    setLavadores(prevLavadores => {
      return prevLavadores.map(lavador => {
        if (lavador.nombre === nombreLavador) {
          return { ...lavador, seccion: value };
        }
        return lavador;
      });
    });
  };

  const ordenesPorLavador = lavadores.reduce((acc, lavador) => {
    const lavadorOrdenes = ordenesTerminadas.filter((orden: Orden) =>
      orden.empleado.includes(lavador.nombre)
    );

    if (lavadorOrdenes.length) {
      acc[lavador.nombre] = lavadorOrdenes;
    }

    return acc;
  }, {} as Record<string, Orden[]>);

  const calcularTotales = (ordenes: Orden[], lavadorNombre: string, porcentaje: number) => {
    const totalCosto = ordenes.reduce((acc, orden) => acc + editableOrdenes[`${lavadorNombre}-${orden.id}`], 0);
    const totalGanancia = totalCosto * porcentaje;
    const totalRestante = totalCosto - totalGanancia;
    return { totalCosto, totalGanancia, totalRestante };
  };

  const totalRestanteGeneral =
    Object.keys(ordenesPorLavador).reduce((acc, nombreLavador) => {
      const lavador = lavadores.find((l) => l.nombre === nombreLavador);
      const porcentaje = lavador.seccion === "Satelital" ? 0.45 : 0.30;
      const ordenes = ordenesPorLavador[nombreLavador];
      const { totalRestante } = calcularTotales(ordenes, nombreLavador, porcentaje);
      return acc + totalRestante;
    }, 0) - pagoAdministracion - pagoVentas - meta - gastosAdicionales;

  const fechaHoy = new Date().toLocaleDateString('es-CO');

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };


  // const handleGenerarPDF = () => {
  //   const doc = new jsPDF();

  //   const fechaHoy = new Date().toLocaleDateString('es-CO');
  //   const resumenData = [
  //     { label: 'Fecha:', value: fechaHoy },
  //     { label: 'Vendido:', value: formatNumber(totalRecaudado) },
  //     { label: 'Servicios:', value: numeroOrdenesHoy },
  //     { label: 'Efectivo:', value: formatNumber(totalEfectivo) },
  //     { label: 'Transferencia:', value: formatNumber(totalTransferencia) },
  //     { label: 'Administración:', value: formatNumber(pagoAdministracion) },
  //     { label: 'Ventas:', value: formatNumber(pagoVentas) },
  //     { label: 'Meta:', value: formatNumber(meta) },
  //     { label: 'Adicionales:', value: formatNumber(gastosAdicionales) },
  //     { label: 'Total Restante:', value: formatNumber(totalRestanteGeneral) }
  //   ];


  //   doc.setFont('times');
  //   doc.setFontSize(10);
  //   doc.setTextColor('#333');
  //   doc.text('Planillario de gestion', 20, 20);
  //   // doc.textWithLink('Click me!', 20, 30, { url: 'https://www.example.com' });

  //   doc.setFont('times');

  //   let posYLeft = 30; // Posición Y inicial para la columna izquierda
  //   let posYRight = 30; // Posición Y inicial para la columna derecha

  //   const halfLength = Math.ceil(resumenData.length / 2);
  //   const firstHalf = resumenData.slice(0, halfLength);
  //   const secondHalf = resumenData.slice(halfLength);

  //   firstHalf.forEach((item, index) => {
  //     doc.text(`${item.label} ${item.value}`, 20, posYLeft);
  //     posYLeft += 6; // Incremento vertical reducido para la columna izquierda
  //   });

  //   secondHalf.forEach((item, index) => {
  //     doc.text(`${item.label} ${item.value}`, 120, posYRight);
  //     posYRight += 6; // Incremento vertical reducido para la columna derecha
  //   });

  //   // Generar las tablas por lavador
  //   let posY = 80; // Posición Y inicial de la primera tabla

  //   Object.keys(ordenesPorLavador).forEach(nombreLavador => {
  //     const ordenes = ordenesPorLavador[nombreLavador];
  //     const lavador = lavadores.find(l => l.nombre === nombreLavador);
  //     const porcentaje = lavador.seccion === 'Satelital' ? 0.45 : 0.30;
  //     const { totalCosto, totalGanancia, totalRestante } = calcularTotales(ordenes, nombreLavador, porcentaje);

  //     const tableData = ordenes.map((orden: Orden) => {
  //       return [orden.id.toString(), orden.vehiculo.marca, orden.vehiculo.placa, formatNumber(editableOrdenes[`${nombreLavador}-${orden.id}`])];
  //     });

  //     const lavadorRow = [
  //       { content: `${nombreLavador}`, styles: { cellWidth: 50 } },
  //       { content: `${lavador.seccion}`, styles: { cellWidth: 40 } }
  //     ];

  //     const totalRow = [
  //       'Totales:',
  //       '',
  //       '',
  //       formatNumber(totalCosto)
  //     ];

  //     const netoLavadorRow = [
  //       'Neto Lavador:',
  //       '',
  //       '',
  //       formatNumber(totalGanancia)
  //     ];

  //     const totalRestanteRow = [
  //       '',
  //       '',
  //       '',
  //       formatNumber(totalRestante)
  //     ];

  //     const tableHeight = (tableData.length * 10) + 40;
  //     const totalHeight = (tableData.length * 10) + 60;

  //     if (posY + totalHeight > doc.internal.pageSize.height - 20) {
  //       doc.addPage();
  //       posY = 20;
  //     }

  //     autoTable(doc, {
  //       body: [lavadorRow],
  //       startY: posY,
  //       columnStyles: {
  //         0: { cellWidth: 50 },
  //         1: { cellWidth: 40 }
  //       },
  //       bodyStyles: { fontSize: 8 },
  //     });

  //     posY += 10;

  //     if (posY + tableHeight > doc.internal.pageSize.height - 20) {
  //       doc.addPage();
  //       posY = 20;
  //     }

  //     autoTable(doc, {
  //       head: [['ODT#', 'Vehículo', 'Placa', 'Valor']],
  //       body: tableData,
  //       startY: posY,
  //       headStyles: { fillColor: [51, 65, 85], fontSize: 8  }, // Cambia el color de fondo de los títulos a azul
  //       columnStyles: {
  //         0: { cellWidth: 20 },
  //         1: { cellWidth: 30 },
  //         2: { cellWidth: 20 },
  //         3: { cellWidth: 20 },
  //       },
  //       bodyStyles: { fontSize: 8 },
  //     });

  //     if (posY + totalHeight > doc.internal.pageSize.height - 20) {
  //       doc.addPage();
  //       posY = 20;
  //     }

  //     autoTable(doc, {
  //       body: [totalRow, netoLavadorRow, totalRestanteRow],
  //       startY: posY + (tableData.length * 10) + 10,
  //       columnStyles: {
  //         0: { cellWidth: 40 },
  //         1: { cellWidth: 10 },
  //         2: { cellWidth: 20 },
  //         3: { cellWidth: 20 },
  //       },
  //       bodyStyles: { fontSize: 8 },
  //     });

  //     posY += (tableData.length * 10) + 40;
  //   });

  //   // Obtener la fecha actual
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = today.getMonth() + 1;
  //   const day = today.getDate();
    
  //   // Formatear la fecha como YYYY-MM-DD
  //   const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

  //   doc.save(`planilla_${formattedDate}.pdf`);
  // };
  
  const handleGenerarPDF = () => {
      const doc = new jsPDF();

      const fechaHoy = new Date().toLocaleDateString('es-CO');
      const resumenData = [
          { label: 'Vendido:', value: formatNumber(totalRecaudado) },
          { label: 'SPA:', value: formatNumber(totalSpa) },
          { label: 'Satelital:', value: formatNumber(totalSatelital) },
          { label: 'Servicios:', value: numeroOrdenesHoy },
          { label: 'Efectivo:', value: formatNumber(totalEfectivo) },
          { label: 'Bancolombia:', value: formatNumber(totalBancolombia) },
          { label: 'Nequi:', value: formatNumber(totalNequi) },
          { label: 'Administración:', value: formatNumber(pagoAdministracion) },
          { label: 'Ventas:', value: formatNumber(pagoVentas) },
          { label: 'Meta:', value: formatNumber(meta) },
          { label: 'Adicionales:', value: formatNumber(gastosAdicionales) },
          { label: 'Total Restante:', value: formatNumber(totalRestanteGeneral) }
      ];

      doc.setFont('times');
      doc.setFontSize(10);
      doc.setTextColor('#333');
          const titulo = 'Planillario de gestión';
      doc.text(titulo, 15, 15);
          const tituloWidth = doc.getTextWidth(titulo);
          const fechaPosX = doc.internal.pageSize.width - 15 - doc.getTextWidth(fechaHoy);
      doc.text(fechaHoy, fechaPosX, 15);

      let posY = 30; // Posición Y inicial
    

      // Imprimir resumen en dos columnas
      const halfLength = Math.ceil(resumenData.length / 2);
      const firstHalf = resumenData.slice(0, halfLength);
      const secondHalf = resumenData.slice(halfLength);

      firstHalf.forEach((item, index) => {
          doc.text(`${item.label} ${item.value}`, 15, posY);
          posY += 6; // Incremento vertical
      });

      posY = 30; // Reiniciar posY para la segunda columna

      secondHalf.forEach((item, index) => {
          doc.text(`${item.label} ${item.value}`, 90, posY);
          posY += 6; // Incremento vertical
      });

      posY += 10;
      let posX = 15
      // Generar las tablas por lavador
      Object.keys(ordenesPorLavador).forEach(nombreLavador => {
          const ordenes = ordenesPorLavador[nombreLavador];
          const lavador = lavadores.find(l => l.nombre === nombreLavador);
          const porcentaje = lavador.seccion === 'Satelital' ? 0.45 : 0.30;
          const { totalCosto, totalGanancia, totalRestante } = calcularTotales(ordenes, nombreLavador, porcentaje);

          const tableData = ordenes.map((orden: Orden) => {
              return [orden.id.toString(), orden.vehiculo.marca, orden.vehiculo.placa, formatNumber(editableOrdenes[`${nombreLavador}-${orden.id}`])];
          });

          if (posX === 15) {
            posX = 90; // Cambiar posición horizontal para la segunda tabla
        } else {
            posX = 15; // Reiniciar posición horizontal para la siguiente fila de tablas
        }

          const lavadorRow = [
              { content: `${nombreLavador}`, styles: { cellWidth: 20 } },
              { content: `${lavador.seccion}`, styles: { cellWidth: 20 } },
              '',
              '',
          ];

          const totalRow = [
              'Totales:',
              '',
              '',
              formatNumber(totalCosto)
          ];

          const netoLavadorRow = [
              'Neto Lavador',
              '',
              '',
              formatNumber(totalGanancia)
          ];

          const totalRestanteRow = [
              '',
              '',
              '',
              formatNumber(totalRestante)
          ];

          const tableHeight = (tableData.length * 10) + 30;

          if (posY + tableHeight > doc.internal.pageSize.height - 20) {
              doc.addPage();
              posY = 30;
          }

          autoTable(doc, {
              body: [...tableData, totalRow, netoLavadorRow, totalRestanteRow],
              head: [lavadorRow, ['Id', 'Vehículo', 'Placa', 'Valor']], // Agregar lavadorRow como parte del head
              startY: posY,
              headStyles: { fillColor: [226, 232, 240], font: 'helvetica', textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold' },
              columnStyles: {
                  0: { cellWidth: 5, },
                  1: { cellWidth: 20 },
                  2: { cellWidth: 20 },
                  3: { cellWidth: 20 },
              },
              bodyStyles: { fontSize: 8 },
          });

          posY += tableHeight + 10; // Incremento vertical para la próxima tabla
      });

      // Obtener la fecha actual
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      // Formatear la fecha como YYYY-MM-DD
      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

      doc.save(`planilla_${formattedDate}.pdf`);
  };

//inserta los totales para el acumulado
  const insertAcumulados = () => {

    const dataTotales = {
      venta_diaria: totalRecaudado,
      prontowash: totalRestanteGeneral,
      servicios: numeroOrdenesHoy
    }
    
    fetch('https://express-api-pw.onrender.com/api/acumulados/insertaracumulados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: dataTotales }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta del backend:', data);
        console.log ('insertado', dataTotales )
        message.success('guardado correctamente')
        // Puedes realizar otras acciones después de recibir la respuesta
      })
      .catch(error => {
        console.error('Error al hacer la solicitud al backend:', error);
      });
  };

  const insertarYdescargar = () => {
    insertAcumulados();
    handleGenerarPDF()
  };

  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
      <Navbar /> 

      <nav 
        className="w-full gap-4 max-md:gap-1 flex items-center justify-between md:px-10 max-md:px-1 bg-white-500/30 backdrop-blur-sm z-50 py-2 m-auto top-16 fixed"
        style={{ fontFamily: 'Roboto'}}
      >
        <Link
            className=' py-1 px-3 rounded-full flex font-medium transition-all hover:bg-slate-200 text-sm items-center gap-2'
            href="/">
            <BackIcon />
        </Link>
        <ResumenOrdenes />
        <p className="flex gap-2 max-md:mr-auto text-sm rounded">{fechaHoy}</p>

        <Button 
          className="md:ml-auto rounded-md h-8 text-xs gap-2 bg-black"
          onClick={insertarYdescargar}
          >
          Guardar y descargar
          <DownloadIcon />
        </Button>
        <h1 className='w-max flex font-bold text-md max-md:hidden'>Planillario de Gestion</h1>
      </nav>

      <article id="pdf-content" style={{ fontFamily: 'Roboto'}}>

      <section 
          className="w-11/12 max-md:w-full max-md:mx-1 gap-1 flex p-1 items-baseline rounded justify-between flex-wrap text-xs max-md:text-xs m-auto mt-32 mb-8" 
      >
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Servicios:</strong>{numeroOrdenesHoy}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Vendido:</strong> {formatNumber(totalRecaudado)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Spa:</strong> {formatNumber(totalSpa)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Satelital:</strong> {formatNumber(totalSatelital)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Efectivo:</strong> {formatNumber(totalEfectivo)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Bancolombia:</strong> {formatNumber(totalBancolombia)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Nequi:</strong> {formatNumber(totalNequi)}</p>
        <p className="flex flex-col gap-2 max-md:px-1 rounded"><strong>Administración:</strong>
          <Input
              value={pagoAdministracion.toString()}
              onChange={(e) => setPagoAdministracion(Number(e.target.value))}
              className="h-6 w-28 text-xs"
            />
        </p>
        <p className="flex flex-col gap-2"><strong>Ventas:</strong>
          <Input
              value={pagoVentas.toString()}
              onChange={(e) => setPagoVentas(Number(e.target.value))}
              className=" h-6 w-28 text-xs"
          />      
        </p>
    
        <p className="flex flex-col gap-2"><strong>Meta:</strong>
          <Input
              value={meta.toString()}
              onChange={(e) => setMeta(Number(e.target.value))}
              className=" h-6 w-28 text-xs"
          />
        </p>
        <p className="flex flex-col gap-2"><strong>Adicionales:</strong>
          <Input
              value={gastosAdicionales.toString()}
              onChange={(e) => setGastosAdicionales(Number(e.target.value))}
              className=" h-6 w-28 text-xs"
          />
        </p>
        <p className="flex flex-col gap-2"><strong>Total Restante:</strong> {formatNumber(totalRestanteGeneral)}</p>
      </section>

      <main className="w-11/12 m-auto flex flex-wrap gap-8 mt-4">
        {Object.keys(ordenesPorLavador).sort((a, b) => {
          const lavadorA = lavadores.find(l => l.nombre === a);
          const lavadorB = lavadores.find(l => l.nombre === b);
          if (lavadorA.seccion === 'SPA' && lavadorB.seccion !== 'SPA') return -1;
          if (lavadorA.seccion !== 'SPA' && lavadorB.seccion === 'SPA') return 1;
          return 0;
        }).map((nombreLavador) => {
          const ordenes = ordenesPorLavador[nombreLavador];
          const lavador = lavadores.find(l => l.nombre === nombreLavador);
          const porcentaje = lavador.seccion === 'Satelital' ? 0.45 : 0.30;
          const { totalCosto, totalGanancia, totalRestante } = calcularTotales(ordenes, nombreLavador, porcentaje);
          return (
            <div key={nombreLavador} className="mb-8 ml-2 text-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold mb-2 capitalize">{nombreLavador}</h2>
                <Select
                  defaultValue={lavador.seccion}
                  onValueChange={(value) => handleSectionChange(nombreLavador, value)}
                >
                  <SelectTrigger className="w-[100px] h-7">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SPA">SPA</SelectItem>
                    <SelectItem value="Satelital">Satelital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table className="border">
                <TableHeader>
                  <TableRow>
                    <TableCell className="px-2 w-10 py-1 text-xs items-center">Id</TableCell>
                    <TableCell className="w-24 py-1">Vehículo</TableCell>
                    <TableCell className="w-22 py-1">Placa</TableCell>
                    <TableCell className="w-20 py-1">Valor</TableCell>
                    <TableCell className="py-1"></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {ordenes.map((orden: Orden) => (
                    <TableRow key={orden.id}>
                      <TableCell className="py-0 px-2 h-4 text-xs">
                        {orden.id}
                      </TableCell>
                      <TableCell className="py-0 h-4">{orden.vehiculo.marca}</TableCell>
                      <TableCell className="py-0">{orden.vehiculo.placa}</TableCell>
                      <TableCell className="p-0 py-0 ">
                        <InputNumber
                          value={editableOrdenes[`${nombreLavador}-${orden.id}`]}
                          onChange={(value) => handleCostChange(nombreLavador, orden.id, value)}
                          formatter={(value) => formatNumber(Number(value))}
                          parser={(value) => value ? Number(value.replace(/\$\s?|(\.*)/g, '').replace(',', '')) : 0}

                          className="text-xs border-none bg-transparent"
                        />
                      </TableCell>
                      <TableCell className="py-0 px-0">
                        <button
                          onClick={() => handleDelete(nombreLavador, orden.id)}
                          className="p-0 m-0 w-full flex hover:bg-transparent"
                        >
                          <DeleteIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold py-0 px-2">Totales</TableCell>
                    <TableCell className="font-bold py-2">
                      {formatNumber(totalCosto)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold py-0 px-2">Neto Lavador</TableCell>
                    <TableCell className="font-bold py-2">
                      {formatNumber(totalGanancia)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold py-0 px-2"></TableCell>
                    <TableCell className="font-bold py-2">
                      {formatNumber(totalRestante)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          );
        })}
      </main>
      </article>
      </ProtectedRoute>
    </>
  );
};

export default GenerarPlanilla;

