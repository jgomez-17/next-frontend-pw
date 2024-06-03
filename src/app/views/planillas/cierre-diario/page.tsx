'use client'

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { InputNumber } from "antd";
import { Button } from "@/components/ui/button";
import { MdOutlineDelete } from "react-icons/md";

interface Orden {
  id: number;
  vehiculo: { placa: string; marca: string };
  servicio: { costo: number };
  empleado: string;
}

interface Lavador {
  id: number;
  nombre: string;
}

const GenerarPlanilla = () => {
  const [ordenesTerminadas, setOrdenesTerminadas] = useState<Orden[]>([]);
  const [lavadores, setLavadores] = useState<Lavador[]>([]);
  const [editableOrdenes, setEditableOrdenes] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch('http://localhost:4000/api/estados/terminadohoy')
      .then(response => response.json())
      .then(data => {
        setOrdenesTerminadas(data.ordenes);
        const initialEditable = data.ordenes.reduce((acc: Record<number, number>, orden: Orden) => {
          acc[orden.id] = orden.servicio.costo;
          return acc;
        }, {});
        setEditableOrdenes(initialEditable);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/lavadores/')
      .then(response => response.json())
      .then((data: { body: Lavador[] }) => setLavadores(data.body))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCostChange = (ordenId: number, value: number | null) => {
    if (value !== null) {
      setEditableOrdenes((prev) => ({ ...prev, [ordenId]: value }));
    }
  };

  const handleDelete = (lavadorNombre: string, ordenId: number) => {
    setOrdenesTerminadas(prevOrdenes => {
      const newOrdenes = prevOrdenes.map(orden => {
        if (orden.empleado.includes(lavadorNombre) && orden.id === ordenId) {
          return { ...orden, empleado: orden.empleado.replace(lavadorNombre, '').trim() };
        }
        return orden;
      }).filter(orden => orden.empleado);
      return newOrdenes;
    });
  };

  const ordenesPorLavador = lavadores.reduce((acc, lavador) => {
    if (!Array.isArray(ordenesTerminadas)) {
      console.error('ordenesTerminadas no es un array o está indefinido');
      return acc;
    }
    
    const lavadorOrdenes = ordenesTerminadas.filter(orden =>
      orden.empleado.includes(lavador.nombre)
    );
    
    if (lavadorOrdenes.length) {
      acc[lavador.nombre] = lavadorOrdenes;
    }
    
    return acc;
  
  }, {} as Record<string, Orden[]>);

  const calcularTotales = (ordenes: Orden[]) => {
    const totalCosto = ordenes.reduce((acc, orden) => acc + editableOrdenes[orden.id], 0);
    const totalGanancia = totalCosto * 0.3;
    const totalRestante = totalCosto - totalGanancia;
    return { totalCosto, totalGanancia, totalRestante };
  };

  return (
    <>
    <nav className=" w-11/12 m-auto mt-20 text-right">      
        <h1 className=" font-semibold mb-4">Planilla de Lavadores</h1>
    </nav>
    <main className="w-11/12 m-auto flex flex-wrap gap-8 mt-4">
      {Object.keys(ordenesPorLavador).map(nombreLavador => {
        const ordenes = ordenesPorLavador[nombreLavador];
        const { totalCosto, totalGanancia, totalRestante } = calcularTotales(ordenes);
        return (
          <div key={nombreLavador} className="mb-8">
            <h2 className="font-semibold mb-2 capitalize">
              {nombreLavador}
            </h2>
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableCell className="w-24 py-1">Marca</TableCell>
                  <TableCell className="w-22 py-1">Placa</TableCell>
                  <TableCell className="w-32 py-1">Valor</TableCell>
                  <TableCell className="py-1"></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {ordenes.map(orden => (
                  <TableRow key={orden.id}>
                    <TableCell className="py-0 h-4">{orden.vehiculo.marca}</TableCell>
                    <TableCell className="py-0">{orden.vehiculo.placa}</TableCell>
                    <TableCell className="py-0">
                      <InputNumber
                        value={editableOrdenes[orden.id]}
                        onChange={(value) => handleCostChange(orden.id, value)}
                        formatter={value => new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(Number(value))}
                        parser={value => value ? Number(value.replace(/\$\s?|(\.*)/g, '').replace(',', '')) : 0}
                        style={{ width: '100%' }}
                      />
                    </TableCell>
                    <TableCell className="py-0 px-0">
                      <Button 
                        onClick={() => handleDelete(nombreLavador, orden.id)}
                        className="p-0 hover:bg-transparent"
                        variant={"ghost"}
                        >
                        <MdOutlineDelete className="text-xl text-black hover:text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-bold py-0">Totales</TableCell>
                  <TableCell className="font-bold py-2">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(totalCosto)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="font-bold py-0">Neto lavador</TableCell>
                  <TableCell className="font-bold py-2">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(totalGanancia)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="font-bold py-0"></TableCell>
                  <TableCell className="font-bold py-2">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(totalRestante)}
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
