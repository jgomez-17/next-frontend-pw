'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BackIcon, DownloadIcon, ReloadIcon, Spin1 } from '@/app/components/ui/iconos';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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
                const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/acumulados/acumuladosdelmes`;
                const response = await fetch(apiUrl);
                

                if (!response.ok) {
                    throw new Error('Error al obtener los datos.');
                }

                const responseData = await response.json();
                console.log(responseData)
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

    const router = useRouter()
    const handleBackButton = () => {
        router.back();
    };

    return (
        <>
            <ProtectedRoute allowedRoles={['admin', 'espectador']}>
                    <section className='w-full m-auto rounded-md p-2 bg-white tracking-tighter'>
                    <nav className='w-full gap-4 m-auto flex items-center p-2 justify-between mb-2'>
                        <Button onClick={handleBackButton} variant={'secondary'} className="h-9 rounded-full">
                            <BackIcon />
                        </Button>
                        <Button onClick={reloadPage} className='h-9' variant={'ghost'}>
                            <ReloadIcon />
                        </Button>
                        <p className='text-sm max-md:mr-auto capitalize font-semibold'> {mesYAnio} </p>
                        <Button onClick={GenerarPDF} className='md:ml-auto gap-2 h-9'>
                            Descargar PDF
                            <DownloadIcon />
                        </Button>
                        <h1 className='font-bold max-md:hidden'>Acumulado de ventas</h1>
                    </nav>
                        {dataLoaded && (
                            <Table className='w-full m-auto mt-4'>
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
                                            const registrosEnElDia: Acumulado[] = data.filter((item) => {
                                            const itemDay = new Date(item.fecha).getDate(); // Obtener el día del mes del registro
                                            return itemDay === day; // Comparar con el día del mes actual iterado
                                        });

                                        const record: Acumulado | null = registrosEnElDia.length > 0 ? registrosEnElDia[registrosEnElDia.length - 1] : null; // Selecciona el último registro del día


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
                            <p className='text-center mt-4'> <Spin1 /> </p>
                        )}
                    </section>
            </ProtectedRoute>
        </>
    );
};

export default AcumuladosComponent;
