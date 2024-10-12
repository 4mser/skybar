// auth/success/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// Fuerza el renderizado dinámico para evitar prerendering
export const dynamic = 'force-dynamic';

export default function AuthSuccessPage() {
  const router = useRouter();
  const { setAuthState } = useContext(AuthContext);

  useEffect(() => {
    // Ejecutar solo en el cliente
    if (typeof window !== 'undefined') {
      // Obtener los parámetros de la URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (token) {
        // Actualizar el estado de autenticación
        setAuthState(token);
        // Redirigir al perfil del usuario
        router.push('/profile');
      } else {
        // Si no hay token, redirigir a la página de login
        router.push('/auth');
      }
    }
  }, [router, setAuthState]);

  return <p>Redirigiendo...</p>;
}
