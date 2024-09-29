'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Fuerza el renderizado dinámico para evitar prerendering
export const dynamic = 'force-dynamic';

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Ejecutar solo en el cliente
    if (typeof window !== 'undefined') {
      // Obtener los parámetros de la URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      
      if (token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', token);
        // Redirigir al perfil del usuario
        router.push('/profile');
      } else {
        // Si no hay token, redirigir a la página de login
        router.push('/auth');
      }
    }
  }, [router]);

  return <p>Redirigiendo...</p>;
}
