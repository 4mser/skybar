'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Fuerza el renderizado dinámico y evita prerendering
export const dynamic = 'force-dynamic';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ejecutar solo en el cliente
    if (typeof window !== 'undefined') {
      const token = searchParams.get('token');
      
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
  }, [router, searchParams]);

  return <p>Redirigiendo...</p>;
}
