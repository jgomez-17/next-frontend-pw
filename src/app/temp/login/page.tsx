'use client'

import React, { useState } from 'react';
import { message } from 'antd';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [userData, setUserData] = useState(null); // Define userData y setUserData


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:4000/api/usuarios2/verificarusuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contraseña }),
            });
    
            if (response.ok) {
                const userData = await response.json();
                setUserData(userData); // Guarda los datos del usuario en el estado local
                // Redirige al usuario a la página principal si la autenticación es exitosa
                window.location.href = '/views/dashboard/lista-ordenes';
                message.success('Ingreso correcto');
            } else {
                // Maneja errores de autenticación
                const errorData = await response.json();
                alert(errorData.mensaje);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Maneja errores de red u otros errores
            alert('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='mt-20 w-2/5 m-auto h-screen'>

            <section className="grid gap-4 py-10 bg-slate-50 px-10 rounded-lg">
            <Image
              className='m-auto'
              src="/prontowash-img.png"
              alt='logo'
              width={140}
              height={200}
            >   
            </Image>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="usuario" className="text-right">
                        Usuario
                    </Label>
                    <Input
                        id="usuario"
                        defaultValue="User"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contraseña" className="text-right">
                        Contraseña
                    </Label>
                    <Input
                        type='password'
                        id="contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        defaultValue="******"
                        className="col-span-3"
                    />
                </div>
                <Button type="submit" className=' w-28 m-auto'>
                    Ingresar
                </Button>
        </section>
        </form>
    );
};

export default Login;
