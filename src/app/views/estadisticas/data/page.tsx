'use client'

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Spin } from 'antd'
interface Estadisticas {
    totalOrdenes: number;
    totalVendido: number;
    clienteTop: { cliente: string; total: number };
    diaMaxVentas: { dia: string; total: number };
    diaMinVentas: { dia: string; total: number };
}

interface Props {
    mes: number;
    ano: number;
}

const EstadisticasData: React.FC<Props> = ({ mes, ano }) => {
    const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/estadisticas/${mes}/${ano}`);
                if (!response.ok) {
                    throw new Error('Error al obtener las estadísticas');
                }
                const data: Estadisticas = await response.json();
                setEstadisticas(data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchEstadisticas();
    }, [mes, ano]);

    if (loading) return <div className=' translate-x-14'>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    function formatNumber(number: number) {
        // Formatea el número con separadores de miles y redondeado a dos decimales
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, }).format(number);
    }

    return (
        <main style={{ fontFamily: 'Overpass Variable',}} className='w-11/12 m-auto mt-10'>

            <p>Total de ordenes: {estadisticas?.totalOrdenes ?? 'N/A'}</p>
            <p>
                Total Vendido: {' '}
                {estadisticas?.totalVendido ? (
                    <span>{formatNumber(estadisticas.totalVendido)}</span>
                ) : 'N/A'}
            </p>
            <time dateTime='' />
            <p className='capitalize'>
                Cliente Top: {' '}
                {estadisticas?.clienteTop?.cliente ? (
                    <span>{estadisticas.clienteTop.cliente}</span>
                ) : 'N/A'} - {' '}
                {estadisticas?.clienteTop?.total ? (
                    <span>{formatNumber(estadisticas.clienteTop.total)}</span>
                ) : 'N/A'}
            </p>
            <p>
                Día Máximo Ventas: {' '}
                {estadisticas?.diaMaxVentas?.dia ? (
                    <span>{format(new Date(estadisticas.diaMaxVentas.dia), 'dd/MM/yyyy')}</span>
                ) : 'N/A'} - {' '}
                {estadisticas?.diaMaxVentas?.total ? (
                    <span>{formatNumber(estadisticas.diaMaxVentas.total)}</span>
                ) : 'N/A'}
            </p>
            <p>
                Día Mínimo Ventas: {' '}
                {estadisticas?.diaMinVentas?.dia ? (
                    <span>{format(new Date(estadisticas.diaMinVentas.dia), 'dd/MM/yyyy')}</span>
                ) : 'N/A'} - {' '}
                {estadisticas?.diaMinVentas?.total ? (
                    <span>{formatNumber(estadisticas.diaMinVentas.total)}</span>
                ) : 'N/A'}
            </p>
        </main>
    );
};

export default EstadisticasData;
