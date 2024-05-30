'use client'

import React, { useEffect, useState } from 'react';

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

const EstadisticasMensuales: React.FC<Props> = ({ mes, ano }) => {
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <main style={{ fontFamily: 'Overpass Variable',}} className='w-11/12 m-auto mt-10'>

            <p>Total Órdenes: {estadisticas?.totalOrdenes ?? 'N/A'}</p>
            <p>Total Vendido: {estadisticas?.totalVendido ?? 'N/A'}</p>
            <p>Cliente Top: {estadisticas?.clienteTop?.cliente ?? 'N/A'} - {estadisticas?.clienteTop?.total ?? 'N/A'}</p>
            <p>Día Máximo Ventas: {estadisticas?.diaMaxVentas?.dia ?? 'N/A'} - {estadisticas?.diaMaxVentas?.total ?? 'N/A'}</p>
            <p>Día Mínimo Ventas: {estadisticas?.diaMinVentas?.dia ?? 'N/A'} - {estadisticas?.diaMinVentas?.total ?? 'N/A'}</p>
        </main>
    );
};

export default EstadisticasMensuales;
