'use client'

import React, { useState } from 'react';


const Login: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Aquí puedes realizar la llamada a tu backend para autenticar al usuario
        try {
            const response = await fetch('http://localhost:4000/api/usuarios2/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, contraseña }),
            });

            if (response.ok) {
                // Si la autenticación es exitosa, redirige al usuario a la página de inicio
                window.location.href = '/';
            } else {
                // Maneja errores de autenticación
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Maneja errores de red u otros errores
            alert('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='mt-20'>
            <div>
                <label htmlFor="username">Usuario:</label>
                <input
                    type="text"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Contraseña:</label>
                <input
                    type="password"
                    id="usuario"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                />
            </div>
            <button type="submit">Iniciar sesión</button>
        </form>
    );
};

export default Login;
