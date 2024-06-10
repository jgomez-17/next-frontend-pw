'use client'

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { InputNumber } from "antd";
import { Button } from "@/components/ui/button";
import { MdOutlineDelete } from "react-icons/md";
import { Input } from "@/components/ui/input"; 
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"; 

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
  };
  servicio: { costo: number };
}

const GenerarPlanilla = () => {
  const [totalRecaudado, setTotalRecaudado] = useState<number>(0);
  const [numeroOrdenesHoy, setNumeroOrdenesHoy] = useState<number>(0);
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [editableOrdenes, setEditableOrdenes] = useState<Record<number, number>>({});
  const [lavadores, setLavadores] = useState<any[]>([]);
  const [totalEfectivo, setTotalEfectivo] = useState<number>(0);
  const [totalTransferencia, setTotalTransferencia] = useState<number>(0);
  const [pagoAdministracion, setPagoAdministracion] = useState<number>(0);
  const [pagoVentas, setPagoVentas] = useState<number>(0);
  const [meta, setMeta] = useState<number>(0);
  const [gastosAdicionales, setGastosAdicionales] = useState<number>(0);
  // Declara un nuevo estado para almacenar el porcentaje de participación de cada lavador en cada orden
  const [porcentajesPorOrden, setPorcentajesPorOrden] = useState<Record<number, Record<string, number>>>({});


  useEffect(() => {
    fetchOrdenesTerminadasHoy();
  }, []);

  const fetchOrdenesTerminadasHoy = () => {
    fetch('http://localhost:4000/api/estados/terminadohoy')
      .then(response => response.json())
      .then(data => {
        const ordenes = data.ordenes || [];
        setOrdenesTerminadas(ordenes);
        setTotalRecaudado(data.totalRecaudado || 0);
        setNumeroOrdenesHoy(data.numeroOrdenesHoy || 0);
        const initialEditable = ordenes.reduce((acc: Record<number, number>, orden: Orden) => {
          acc[orden.id] = orden.servicio.costo;
          return acc;
        }, {});
        setEditableOrdenes(initialEditable);
        setTotalEfectivo(data.totalEfectivo || 0);
        setTotalTransferencia(data.totalTransferencia || 0);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/lavadores/')
      .then(response => response.json())
      .then((data: any) => setLavadores(data.body || []))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCostChange = (ordenId: number, value: number | null) => {
    if (value !== null) {
      setEditableOrdenes(prev => ({ ...prev, [ordenId]: value }));
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

  const calcularTotales = (ordenes: Orden[], porcentaje: number) => {
    const totalCosto = ordenes.reduce((acc, orden) => acc + editableOrdenes[orden.id], 0);
    const totalGanancia = totalCosto * porcentaje;
    const totalRestante = totalCosto - totalGanancia;
    return { totalCosto, totalGanancia, totalRestante };
  };

  const totalRestanteGeneral =
  Object.keys(ordenesPorLavador).reduce((acc, nombreLavador) => {
    const lavador = lavadores.find((l) => l.nombre === nombreLavador);
    const porcentaje = lavador.seccion === "Satelital" ? 0.45 : 0.30;
    const ordenes = ordenesPorLavador[nombreLavador];
    const { totalRestante } = calcularTotales(ordenes, porcentaje);
    return acc + totalRestante;
  }, 0) - pagoAdministracion - pagoVentas - meta - gastosAdicionales;


  const fechaHoy = new Date().toLocaleDateString('es-CO');

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <>
      <nav className="w-11/12 m-auto mt-20 text-right" style={{ fontFamily: 'Overpass Variable' }}>
        <h1 className="font-semibold mb-4">Planilla de Lavadores</h1>
      </nav>
      <section 
          className="w-11/12 gap-4 flex py-2 items-center rounded justify-around flex-wrap text-sm m-auto mt-4 mb-8 bg-slate-50" 
          style={{ fontFamily: 'Overpass Variable' }}>
        <p className="flex flex-col gap-1"><strong>Fecha:</strong>{fechaHoy}</p>
        <p className="flex flex-col gap-1"><strong>Vendido:</strong> {formatNumber(totalRecaudado)}</p>
        <p className="flex flex-col gap-1"><strong>Servicios:</strong>{numeroOrdenesHoy}</p>
        <p className="flex flex-col gap-1"><strong>Efectivo:</strong> {formatNumber(totalEfectivo)}</p>
        <p className="flex flex-col gap-1"><strong>Transferencia:</strong> {formatNumber(totalTransferencia)}</p>
        <p className="flex flex-col gap-1"><strong>Administración:</strong>
          <Input
              value={pagoAdministracion.toString()}
              onChange={(e) => setPagoAdministracion(Number(e.target.value))}
              className=" h-7 w-28"
            />
        </p>
        <p className="flex flex-col "><strong>Ventas:</strong>
          <Input
              value={pagoVentas.toString()}
              onChange={(e) => setPagoVentas(Number(e.target.value))}
              className=" h-7 w-28"
          />      
        </p>
        <p className="flex flex-col"><strong>Meta:</strong>
          <Input
              value={meta.toString()}
              onChange={(e) => setMeta(Number(e.target.value))}
              className=" h-7 w-28"
          />
        </p>
        <p className="flex flex-col"><strong>Gastos Adicionales:</strong>
          <Input
              value={gastosAdicionales.toString()}
              onChange={(e) => setGastosAdicionales(Number(e.target.value))}
              className=" h-7 w-28"
          />
</p>
        <p className="flex flex-col gap-1"><strong>Total Restante:</strong> {formatNumber(totalRestanteGeneral)}</p>
      </section>

      <main className="w-11/12 m-auto flex flex-wrap gap-8 mt-4" style={{ fontFamily: 'Overpass Variable' }}>
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
          const { totalCosto, totalGanancia, totalRestante } = calcularTotales(ordenes, porcentaje);
          return (
            <div key={nombreLavador} className="mb-8">
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
                    <TableCell className="px-2 py-1 text-xs">ODT#</TableCell>
                    <TableCell className="w-24 py-1">Vehículo</TableCell>
                    <TableCell className="w-22 py-1">Placa</TableCell>
                    <TableCell className="w-20 py-1">Valor</TableCell>
                    <TableCell className="py-1"></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {ordenes.map((orden: any) => (
                    <TableRow key={orden.id}>
                      <TableCell className="py-0 px-2 h-4 text-xs">
                        {orden.id}
                      </TableCell>
                      <TableCell className="py-0 h-4">{orden.vehiculo.marca}</TableCell>
                      <TableCell className="py-0">{orden.vehiculo.placa}</TableCell>
                      <TableCell className="p-0">
                        <InputNumber
                          value={editableOrdenes[orden.id]}
                          onChange={(value) => handleCostChange(orden.id, value)}
                          formatter={(value) => formatNumber(Number(value))}
                          parser={(value) => value ? Number(value.replace(/\$\s?|(\.*)/g, '').replace(',', '')) : 0}
                          style={{ width: '100%' }}
                          className="text-xs border-none bg-transparent"
                        />
                      </TableCell>
                      <TableCell className="py-0 px-0">
                        <Button
                          onClick={() => handleDelete(nombreLavador, orden.id)}
                          className="p-0 hover:bg-transparent"
                          variant="ghost"
                        >
                          <MdOutlineDelete className="text-xl text-black hover:text-red-600" />
                        </Button>
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
    </>
  );
};

export default GenerarPlanilla;
