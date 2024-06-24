'use client'

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Spin } from 'antd'
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
);

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
                const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estadisticas/${mes}/${ano}`

                const response = await fetch(apiUrl);
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

    const totalOrdenesData = {
        labels: [''],
        datasets: [{
            label: 'Total de Ordenes',
            data: [estadisticas?.totalOrdenes ?? 0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const totalVendidoData = {
        labels: [''],
        datasets: [{
            label: 'Total Vendido',
            data: [estadisticas?.totalVendido ?? 0],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    const clienteTopData = {
        labels: [estadisticas?.clienteTop?.cliente ?? 'Cliente Top'],
        datasets: [{
            label: 'Cliente Top',
            data: [estadisticas?.clienteTop?.total ?? 0],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
        }]
    };

    const diasVentasData = {
        labels: [
            estadisticas?.diaMaxVentas?.dia ? format(new Date(estadisticas.diaMaxVentas.dia), 'dd/MM/yyyy') : '',
            estadisticas?.diaMinVentas?.dia ? format(new Date(estadisticas.diaMinVentas.dia), 'dd/MM/yyyy') : ''
        ],
        datasets: [
            {
                label: 'Día Máximo Ventas',
                data: [estadisticas?.diaMaxVentas?.total ?? 0, null],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Día Mínimo Ventas',
                data: [null, estadisticas?.diaMinVentas?.total ?? 0],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <main style={{ fontFamily: 'Roboto' }} className='w-11/12 flex flex-wrap gap-16 m-auto mt-10'>
            <div className="chart-container" style={{ width: '300px', height: '200px' }}>
                <Bar data={totalOrdenesData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Total de Ordenes' } } }} />
            </div>
            <div className="chart-container" style={{ width: '300px', height: '200px' }}>
                <Bar data={totalVendidoData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Total Vendido' } } }} />
            </div>
            <div className="chart-container" style={{ width: '300px', height: '200px' }}>
                <Bar data={clienteTopData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Cliente Top' } } }} />
            </div>
            <div className="chart-container" style={{ width: '400px', height: '300px' }}>
                <Line data={diasVentasData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Ventas por Día Máximo y Mínimo' } } }} />
            </div>
        </main>
    );
};

export default EstadisticasData;
