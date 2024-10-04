'use client'

import React, { useState } from 'react';
import EstadisticasMensuales from './data/estadisticas-data';
import ProtectedRoute from '@/app/components/protectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BackIcon } from '@/app/components/ui/iconos';

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

    const router = useRouter()
    const handleBackButton = () => {
        router.back();
    };

    return (
        <>
        <ProtectedRoute allowedRoles={['admin', 'espectador']}>
            <section className='w-full m-auto rounded-md bg-white p-2'>
                <nav className='flex tracking-tigh w-full gap-3 p-2 m-auto items-center justify-between'>
                    <Button onClick={handleBackButton} variant={'secondary'} className="h-9 rounded-full">
                        <BackIcon />
                    </Button>
                    <form onSubmit={handleSubmit} className='flex max-md:text-sm mr-auto'>
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
                    {/* <Button onClick={() => router.push('/views/planillas/acumulados')} className="h-8 text-xs">
                        Ver acumulado
                    </Button> */}
                    <h5 className='font-bold text-xl'>Estadísticas</h5>
                </nav>
                <EstadisticasMensuales mes={mesSeleccionado} ano={anoSeleccionado} />
            </section>
        </ProtectedRoute>
        </>
    );
};


export default EstadisticasPage;

