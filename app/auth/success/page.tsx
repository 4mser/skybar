'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Desactivar prerendering en esta página
export const dynamic = 'force-dynamic';

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Obtener el token de la URL
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
  }, [router, searchParams]);

  return <p>Redirigiendo...</p>;
}
