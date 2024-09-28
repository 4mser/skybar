'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');  // Si no hay token, redirigir a la página de autenticación
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`, // Enviamos el token en el header
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth');  // Si falla la obtención de datos, redirigir a autenticación
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) {
    return <p>Cargando perfil...</p>;
  }
  const handleLogout = () => {
    localStorage.removeItem('token');  // Eliminamos el token de localStorage
    router.push('/auth');  // Redirigimos a la página de autenticación
  };
  
  return (
    <div className="min-h-[100dvh] text-white flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl mb-4">Perfil de Usuario</h1>
        <p><strong>Nombre de usuario:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <button
        className="w-full bg-red-500 py-2 mt-4 rounded hover:bg-red-600 transition"
        onClick={handleLogout}  // Llamamos a la función de logout
      >
        Cerrar Sesión
      </button>
      </div>
    </div>
  );
};

export default ProfilePage;
