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
            console.log(data)

            if (response.ok) {
                const { token, usuario: user, nombre, rol, activo } = data.token;

                // localStorage.setItem('token', data.token);
                Cookies.set('token', token, {expires}); // Cookie expira en 7 días
                Cookies.set('rol', rol, { expires});
                Cookies.set('username', usuario, { expires});

                 console.log(token);
                 console.log('Usuario:', usuario)
                 console.log('Nombre:', nombre);
                 console.log('Rol:', rol);
                 console.log('Activo:', activo);

                router.replace('/views/dashboard/lista-ordenes');
                // window.location.href = '/views/dashboard/lista-ordenes';
            } else {
                setError(data.message || 'Error al iniciar sesión');
                message.error('Datos de acceso incorrectos');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            message.error('Error al conectar con el servidor');
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex items-center justify-center h-screen">
            <section className="grid gap-4 py-10 bg-slate-50 max-md:bg-slate-50/60 px-10 rounded-lg">
                <Image
                    className='m-auto'
                    src="/prontowash-img.png"
                    alt='logo'
                    width={140}
                    height={200}
                />
                <article className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usuario" className="text-right">
                        Usuario
                    </Label>
                    <Input
                        id="usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="col-span-3"
                    />
                </article>
                <article className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contraseña" className="text-right">
                        Contraseña
                    </Label>
                    <Input
                        type='password'
                        id="contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                    />
                </article>
                {error && (
                    <div className="text-red-500 text-center my-4">
                        {error}
                    </div>
                )}
                <Button type="submit" className='w-28 m-auto'>
                    Ingresar
                </Button>
            </section>
        </form>
    );
};

export default LoginPage;
