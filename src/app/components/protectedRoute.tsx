'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ReactNode } from 'react';
import { message } from 'antd';

// Definir las props del componente ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // Lista de roles permitidos para esta ruta
}

// Componente funcional ProtectedRoute
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const token = Cookies.get('token');
  const rol = Cookies.get('rol');

  const checkAccess = (rol: string | undefined): boolean => {
    // Si no se han definido roles permitidos, se permite el acceso
    if (allowedRoles.length === 0) {
      return true;
    }

    // Verificar si el rol actual está en la lista de roles permitidos
    return allowedRoles.includes(rol || '');
  };

  useEffect(() => {

    if (!token) {
      router.replace('/login'); // Redireccionar al login si no hay token o rol
      return;
    }

    if (!checkAccess(rol)) {
      router.replace('/views/sin-acceso'); // Redireccionar a acceso denegado si el rol no es permitido
    }

  }, [router, token, rol, children]);

  return <>{children}</>;
};

export default ProtectedRoute;
