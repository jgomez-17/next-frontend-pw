'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from '@/app/views/navbar/page';
import { BackIcon, DownloadIcon, ReloadIcon } from '@/app/components/ui/iconos';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import ProtectedRoute from '@/app/components/protectedRoute';
import { message, Spin } from 'antd';
import { generarPDF } from './crearPDF-acum';

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

const AcumuladosComponent = () => {
    const [data, setData] = useState<Acumulado[]>([]);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const fechaActual = new Date();
    const currentYear = fechaActual.getFullYear();
    const currentMonth = fechaActual.getMonth() + 1;
    const mesYAnio = format(fechaActual, 'MMMM yyyy', { locale: es });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/acumulados/acumuladosdelmes`; // Cambia la URL según tu configuración de API
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Error al obtener los datos.');
                }

                const responseData = await response.json();

                if (Array.isArray(responseData)) {
                    setData(responseData);
                    setDataLoaded(true);
                } else {
                    throw new Error('La respuesta no es un array válido.');
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                setData([]);
                setDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    const obtenerNombreDia = (fecha: string) => {
        try {
            const date = new Date(fecha);

            if (isNaN(date.getTime())) {
                throw new Error('Fecha no válida');
            }

            return format(date, "EEEE", { locale: es });
        } catch (error) {
            console.error('Error al obtener nombre del día:', error);
            return '';
        }
    };

    function formatNumber(number: number) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(number);
    }

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1);

    const totalAcumulado = data.length > 0 ? data[data.length - 1] : null;

    const reloadPage = () => {
        window.location.reload();
        const hideMessage = message.loading('Cargando...', 0);

        setTimeout(hideMessage, 1000);
    };

    const GenerarPDF = () => {
        generarPDF(data, mesYAnio, totalAcumulado, obtenerNombreDia, formatNumber);
    };

    return (
        <>
            <ProtectedRoute allowedRoles={['admin', 'espectador']}>
                <Navbar />
                <nav className='mt-20 max-md:w-full max-md:px-1 w-11/12 gap-4 m-auto flex items-center justify-between'>
                    <Link href="/" className=' hover:bg-slate-100 px-3 py-1 rounded-full'>
                        <BackIcon />
                    </Link>
                    <p className='text-sm max-md:mr-auto capitalize font-semibold'> {mesYAnio} </p>
                    <Button onClick={reloadPage} className='h-8' variant={'ghost'}>
                        <ReloadIcon />
                    </Button>
                    <Button onClick={GenerarPDF} className='md:ml-auto bg-black gap-2 flex h-8 items-center text-xs hover:outline-slate-200'>
                        Descargar PDF
                        <DownloadIcon />
                    </Button>
                    <h1 className='font-bold text-sm max-md:hidden'>Acumulado de ventas</h1>
                </nav>
                {dataLoaded && (
                    <Table className='w-11/12 max-md:w-[98%] m-auto mt-4'>
                        <TableHeader className='font-semibold text-sm max-md:text-[10px]'>
                            <TableRow>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>D/S</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Día</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Venta Diaria</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Acum. Venta Diaria</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Prontowash</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Acum. Prontowash</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Servicios</TableCell>
                                <TableCell className=' max-md:leading-tight max-md:p-1'>Acum. Servicios</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='text-xs max-md:text-[9px]'>
                            {daysArray.map((day) => {
                                const record = data.find((item) => {
                                    const itemDay = new Date(item.fecha).getDate(); // Obtener el día del mes del registro
                                    return itemDay === day; // Comparar con el día del mes actual iterado
                                });

                                const nombreDiaSemana = record && record.fecha ? obtenerNombreDia(record.fecha) : '';

                                return (
                                    <TableRow key={day}>
                                        <TableCell className='py-1 border max-md:px-1 px-3 capitalize'>{nombreDiaSemana}</TableCell>
                                        <TableCell className='py-1 border max-md:px-1 px-3'>{day}</TableCell>
                                        {record ? (
                                            <>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{formatNumber(record.venta_diaria)}</TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{formatNumber(record.acum_venta_diaria)}</TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{formatNumber(record.prontowash)}</TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{formatNumber(record.acum_prontowash)}</TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{record.servicios}</TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'>{record.acum_servicios}</TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                                <TableCell className='py-1 px-3 max-md:px-1 border'></TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {totalAcumulado && (
                                <TableRow>
                                    <TableCell className='py-1 px-3 font-semibold'>Totales</TableCell>
                                    <TableCell className='py-1 px-3'></TableCell>
                                    <TableCell className='py-1 px-3'></TableCell>
                                    <TableCell className='py-1 px-3'>{formatNumber(totalAcumulado.acum_venta_diaria)}</TableCell>
                                    <TableCell className='py-1 px-3'></TableCell>
                                    <TableCell className='py-1 px-3'>{formatNumber(totalAcumulado.acum_prontowash)}</TableCell>
                                    <TableCell className='py-1 px-3'></TableCell>
                                    <TableCell className='py-1 px-3'>{totalAcumulado.acum_servicios}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
                {!dataLoaded && (
                    <p className='text-center mt-4'>Cargando...</p>
                )}
            </ProtectedRoute>
        </>
    );
};

export default AcumuladosComponent;
