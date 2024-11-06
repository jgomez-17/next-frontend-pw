'use client'

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { InputNumber, message } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import ResumenOrdenes from "../resumen-ordenes/page";
import ProtectedRoute from "@/app/components/protectedRoute";
import { DeleteIcon2, FlechaDerecha, FlechaIzquierda, Spin, Save, BackIcon } from "@/app/components/ui/iconos";
import { generarPDF } from "./crearPDF-cierre";

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
  const [totalDaviplata, setTotalDaviplata] = useState<number>(0);
  const [pagoAdministracion, setPagoAdministracion] = useState<number>(0);
  const [pagoVentas, setPagoVentas] = useState<number>(0);
  const [meta, setMeta] = useState<number>(0);
  const [gastosAdicionales, setGastosAdicionales] = useState<number>(0);
  const [totalSatelital, setTotalSatelital] = useState<number>(0); // Nuevo estado para total de "Satelital"
  const [totalSpa, setTotalSpa] = useState<number>(0); // Nuevo estado para total de "Satelital"
  const [loading, setLoading] = useState(false);

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
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estados/terminadohoy`

    fetch(apiUrl)
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
        setTotalDaviplata(data.totalDaviplata || 0);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/lavadores`

    fetch(apiUrl)
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

    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta fila?");
    if (!confirmacion) {
      return;
    }

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

  const handleGenerarPDF = () => {
    const totales = {
      totalRecaudado,
      totalSpa,
      totalSatelital,
      numeroOrdenesHoy,
      totalEfectivo,
      totalNequi,
      totalBancolombia,
      pagoAdministracion,
      pagoVentas,
      meta,
      gastosAdicionales,
      totalRestanteGeneral,
    };

    generarPDF(totales, ordenesPorLavador, lavadores, editableOrdenes);
  };

  //inserta los totales para el acumulado
  const insertAcumulados = () => {

    if (!pagoAdministracion || !pagoVentas) {
      message.error('Datos incompletos.');
      return; // Detener la ejecución si los valores no están llenos
    }

    if (totalRestanteGeneral < 0) {
      message.error('Verifica los valores');
      return; // Detener la ejecución si el total restante es negativo
    }

    // Detener la ejecución si algún lavador no tiene seleccionada la sección
    // if (lavadores.some(lavador => !lavador.seccion)) {
    //   message.error('Por favor, selecciona la sección del lavador.');
    //   return; 
    // }

    const dataTotales = {
      venta_diaria: totalRecaudado,
      prontowash: totalRestanteGeneral,
      servicios: numeroOrdenesHoy
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/acumulados/insertaracumulados`
    setLoading(true);

    fetch(apiUrl, {
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
        handleGenerarPDF();
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al hacer la solicitud al backend:', error);
        message.error('Error en la solicitud')
        setLoading(false);
      });
  };

  const handleBackButton = () => {
    if (window.confirm('¿Estás seguro que deseas regresar?')) {
      window.history.back();
    }
  };

  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
        <section className="w-full m-auto rounded-md tracking-tigh">
        <nav 
          className="w-full max-md:w-full m-auto gap-4 max-md:gap-1 flex items-center justify-between max-md:px-1 bg-white z-20 p-2"
        >
          <article className="flex gap-2">
            <Button onClick={handleBackButton} variant={'ghost'} className="h-9 rounded-full">
              <BackIcon />
            </Button>
            <ResumenOrdenes />

            <Button 
              className="h-9 gap-2"
              onClick={insertAcumulados}
              >
              {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <Spin />
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                          Guardar
                          <Save />
                        </span>
                    )}
            </Button>
          </article>
          <p className="flex gap-2 text-sm font-semibold">{fechaHoy}</p>
        </nav>
        <article id="pdf-content">

        <p className="md:hidden m-auto  text-center mt-3"> Activa el modo escritorio para visualizar... </p>
        <section 
            className="w-full border-b grid grid-cols-6 max-md:grid-cols-2 rounded text-sm max-md:text-xs m-auto mt-4 pb-4 max-md:hidden" 
        >
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className=" font-medium">Vendido</span>
            <span className="w-24 rounded px-2">
              {formatNumber(totalRecaudado)}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Spa</span>
            <span className="w-24 rounded px-2">
              {formatNumber(totalSpa)}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className=" font-medium">Efectivo</span> 
            <span className="w-24 rounded px-2">
              {formatNumber(totalEfectivo)}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Bancolombia</span> 
            <span className="w-24 rounded px-2">
              {formatNumber(totalBancolombia)}
            </span>
          </p>
          <p className="flex gap-2 col-span-1 items-center justify-end"><span className="font-medium">Administración:</span>
            <Input
                value={pagoAdministracion.toString()}
                onChange={(e) => setPagoAdministracion(Number(e.target.value))}
                className="h-6 w-24 text-xs"
              />
          </p>
          <p className="flex gap-2 col-span-1 items-center justify-end"><span className="font-medium">Meta:</span>
            <Input
                value={meta.toString()}
                onChange={(e) => setMeta(Number(e.target.value))}
                className=" h-6 w-24 text-xs"
            />
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Servicios</span> 
            <span className="w-24 rounded px-2">
              {numeroOrdenesHoy}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Satelital</span> 
            <span className="w-24 rounded px-2">
              {formatNumber(totalSatelital)}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Nequi</span>  
            <span className="w-24 rounded px-2">
              {formatNumber(totalNequi)}
            </span>
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1">
            <span className="font-medium">Daviplata</span>  
            <span className="w-24 rounded px-2">
              {formatNumber(totalDaviplata)}
            </span>
          </p>
          <p className="flex gap-2 col-span-1 items-center justify-end"><span className="font-medium">Ventas:</span>
            <Input
                value={pagoVentas.toString()}
                onChange={(e) => setPagoVentas(Number(e.target.value))}
                className=" h-6 w-24 text-xs"
            />      
          </p>
      

          <p className="flex gap-2 col-span-1 items-center justify-end"><span className="font-medium">Adicionales:</span>
            <Input
                value={gastosAdicionales.toString()}
                onChange={(e) => setGastosAdicionales(Number(e.target.value))}
                className=" h-6 w-24 text-xs"
            />
          </p>
          <p className="flex items-center justify-end gap-1 col-span-1 text-blue-700">
            <span className="font-medium">Prontowash</span> 
            <span className="w-24 rounded px-2">
              {formatNumber(totalRestanteGeneral)}
            </span>
          </p>

        </section>

        <main className="w-full flex flex-wrap gap-4 gap-y-8 mt-4">
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
              <div key={nombreLavador} className="text-sm tracking-tigh rounded shadow bg-white">
                <div className="flex items-center justify-between my-1 text-lg px-2">
                  <p className="font-bold ml-1 capitalize">{nombreLavador}</p>
                  <Select
                    defaultValue={lavador.seccion}
                    onValueChange={(value) => handleSectionChange(nombreLavador, value)}
                  >
                    <SelectTrigger className="w-[150px] h-8 rounded">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPA">SPA</SelectItem>
                      <SelectItem value="Satelital">Satelital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table className="border text-xs">
                  <TableHeader>
                    <TableRow className="font-bold">
                      <TableCell className="px-2 py-2 items-center"> # Nro </TableCell>
                      <TableCell className=" py-2">Vehículo</TableCell>
                      <TableCell className=" py-2">Placa</TableCell>
                      <TableCell className=" py-2">Valor</TableCell>
                      <TableCell className=" py-2"></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {ordenes.map((orden: Orden) => (
                      <TableRow key={orden.id}>
                        <TableCell className="py-0 px-2 font-semibold text-xs">
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
                        <TableCell className="py-0 px-2">
                          <button
                            onClick={() => handleDelete(nombreLavador, orden.id)}
                            className="p-0 m-0 w-full flex hover:bg-transparent"
                          >
                            <DeleteIcon2 />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium py-0 px-2">Totales</TableCell>
                      <TableCell className="font-medium py-2">
                        {formatNumber(totalCosto)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium py-0 px-2">Neto Lavador</TableCell>
                      <TableCell className="font-medium py-2">
                        {formatNumber(totalGanancia)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="font-medium py-0 px-2"></TableCell>
                      <TableCell className="font-medium py-2">
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
        </section> 
      </ProtectedRoute>
    </>
  );
};

export default GenerarPlanilla;

