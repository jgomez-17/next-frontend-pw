'use client'

import React, { useState } from 'react';
import { message } from 'antd';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { PasswordValidation, Spin, UserLogin, UserLogin2, UsersIcon, UsersIcon2 } from '@/app/components/ui/iconos';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"


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
        setLoading(true);


        if (!usuario || !password) {
            setError('Por favor, ingresa todos los campos.');
            setLoading(false);
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
                Cookies.set('token', token, {expires});
                Cookies.set('rol', rol, { expires});
                Cookies.set('username', usuario, { expires});

                router.replace('/views');
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
            message.error('Error al conectar con el servidor');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='h-9 w-2/3 m-auto tracking-tigh bg-transparent text-black flex items-center gap-2'>Ingresar <UsersIcon2 /></Button>
            </SheetTrigger>
            <SheetContent className='h-screen flex' side={'top'} >
                <SheetHeader>
                </SheetHeader>
                <form onSubmit={handleLogin} className="flex w-max tracking-tight rounded-3xl md:shadow-2xl items-center justify-center m-auto">
                    <section className="grid md:border relative m-auto gap-8 p-20 bg-white rounded-lg">
                        <span className='bg-sky-600 text-white w-max p-5 rounded-full absolute top-0 right-0 left-0 m-auto -translate-y-8 outline outline-sky-500/30 md:shadow-lg'>
                            <UserLogin2 />
                        </span>
                        <p className='text-center text-2xl font-bold mt-5'> Login </p>
                        <article className="flex gap-2">
                            <Label htmlFor="usuario" className="flex absolute left-0 rounded-md text-gray-300 items-center px-2">
                                <UserLogin />
                            </Label>
                            <Input
                                id="usuario"
                                placeholder='Usuario'
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="w-full h-9 placeholder:opacity-50"
                            />
                        </article>
                        <article className="flex gap-2">
                            <Label htmlFor="contraseña" className="flex absolute left-0 rounded-md text-gray-300 items-center px-2.5 justify-between">
                                <PasswordValidation />
                            </Label>
                            <Input
                                id="contraseña"
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3 h-9 placeholder:opacity-50"
                                placeholder='Contraseña'
                            />
                        </article>
                        {error && (
                            <div className="text-red-500 text-center my-4 text-sm">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className='w-[200px] m-auto bg-sky-600 hover:bg-sky-700' disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <Spin />
                                </span>
                            ) : (
                                'Ingresar'
                            )}
                        </Button>
                    </section>
                </form>
            </SheetContent>
        </Sheet> 
    );
};

export default LoginPage;
