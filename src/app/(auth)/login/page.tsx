'use client'

import React, { useState } from 'react';
import { message } from 'antd';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const now = new Date();
    const expires = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 horas en milisegundos


    const handleLogin = async (e: any) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setError('');
        setLoading(true); // Inicia el estado de carga


        if (!usuario || !password) {
            setError('Por favor, ingresa todos los campos.');
            setLoading(false); // Finaliza el estado de carga
            return;
        }

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/login`
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { token, usuario: user, nombre, rol, activo } = data.token;

                // localStorage.setItem('token', data.token);
                Cookies.set('token', token, {expires}); // Cookie expira en 7 días
                Cookies.set('rol', rol, { expires});
                Cookies.set('username', usuario, { expires});

                router.replace('/views');
                // window.location.href = '/views/dashboard/lista-ordenes';
            } else {
                setError(data.message || 'Error al iniciar sesión');
                message.error('verifica tu conexion');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            message.error('Error al conectar con el servidor');
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex tracking-tighter items-center justify-center h-screen">
            <section className="grid gap-4 py-10 px-10 rounded-lg">
                {/* <Image
                    className='m-auto'
                    src="/prontowash-img.png"
                    alt='logo'
                    width={140}
                    height={200}
                /> */}
                <p className='text-center text-xl font-bold'> Acceso al sistema </p>
                <article className="flex flex-col gap-1">
                    <Label htmlFor="usuario" className="text-gray-500 text-sm">
                        Usuario
                    </Label>
                    <Input
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="col-span-3 h-9"
                    />
                </article>
                <article className="flex flex-col gap-1">
                    <Label htmlFor="contraseña" className=" text-gray-500 text-sm">
                        Contraseña
                    </Label>
                    <Input
                        type='password'
                        id="contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3 h-9"
                    />
                </article>
                {error && (
                    <div className="text-red-500 text-center my-4 text-sm">
                        {error}
                    </div>
                )}
                <Button type="submit" className='w-[300px] float-right'>
                    Ingresar
                </Button>
            </section>
        </form>
    );
};

export default LoginPage;
