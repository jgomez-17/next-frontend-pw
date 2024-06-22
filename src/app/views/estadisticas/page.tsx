'use client'

import React, { useState } from 'react';
import EstadisticasMensuales from './data/page';
import Navbar from '@/app/views/navbar/page'
import ProtectedRoute from '@/app/components/protectedRoute';
import Link from 'next/link';

const EstadisticasPage: React.FC = () => {
    const mesActual = new Date().getMonth() + 1; // Mes actual (enero es 0, por eso sumamos 1)
    const anoActual = new Date().getFullYear(); // Año actual

    const [mesSeleccionado, setMesSeleccionado] = useState(mesActual);
    const [anoSeleccionado, setAnoSeleccionado] = useState(anoActual);

    const handleChangeMes = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMesSeleccionado(Number(event.target.value));
    };

    const handleChangeAno = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAnoSeleccionado(Number(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Aquí podrías enviar la solicitud al backend con el mesSeleccionado y anoSeleccionado
        console.log('Mes seleccionado:', mesSeleccionado);
        console.log('Año seleccionado:', anoSeleccionado);
    };

    return (
        <>
        <ProtectedRoute allowedRoles={['admin', 'espectador']}>
            <Navbar />
            <main style={{ fontFamily: 'Roboto',}} className=' mt-20'>
                <nav className='flex w-11/12 gap-4 m-auto justify-between'>
                    
                    <form onSubmit={handleSubmit} className='flex'>
                        <label>
                            Mes:
                            <select className='mx-2 rounded bg-slate-100' value={mesSeleccionado} onChange={handleChangeMes}>
                                {/* Generar opciones para los meses */}
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                                    <option key={mes} value={mes}>
                                        {mes}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Año:
                            <select className='mx-2 bg-slate-100 rounded' value={anoSeleccionado} onChange={handleChangeAno}>
                                {/* Generar opciones para los años (p. ej., desde 2020 hasta el año actual) */}
                                {Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => 2020 + i).map(ano => (
                                    <option key={ano} value={ano}>
                                        {ano}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {/* <button type="submit">Buscar</button> */}
                    </form>
                    <Link href="/views/planillas/acumulados"
                          className='rounded-md underline mr-auto hover:text-blue-900 px-3 text-sm flex items-center font-semibold'  
                    >
                        Ver Acumulado
                    </Link>
                    <h1 className='font-bold'>Estadísticas</h1>
                </nav>
                <EstadisticasMensuales mes={mesSeleccionado} ano={anoSeleccionado} />
            </main>
        </ProtectedRoute>
        </>
    );
};


export default EstadisticasPage;
