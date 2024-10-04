'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

// Interfaz para usuarios, bares, secciones de menú y productos
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  barId?: string | null;
  photo?: string;
}

interface Bar {
  _id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  adminIds: string[];
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('users');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth');
          return;
        }

        const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = profileResponse.data;
        setIsSuperadmin(currentUser.role === 'superadmin');

        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data);

        const barsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/bars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBars(barsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/auth');
      }
    };

    fetchData();
  }, [router]);

  const goToMenuPage = () => {
    router.push('/dashboard/menu'); // Redirige a la página de menús
  };

  // Animación con GSAP
  useEffect(() => {
    const elements = document.querySelectorAll('.card-item');
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' }
    );
  }, [users, bars, currentView]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!isSuperadmin) {
    return null;
  }

  return (
    <div className="p-6 pt-16">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Dashboard de Administración</h1>

      {/* Navegación */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-[10px] ${currentView === 'users' ? 'bg-blue-600' : 'bg-gray-500'} text-white`}
          onClick={() => setCurrentView('users')}
        >
          Usuarios
        </button>
        <button
          className={`px-4 py-2 rounded-[10px] ${currentView === 'bars' ? 'bg-blue-600' : 'bg-gray-500'} text-white`}
          onClick={() => setCurrentView('bars')}
        >
          Bares
        </button>
        <button
          className={`px-4 py-2 rounded-[10px] ${currentView === 'menu' ? 'bg-blue-600' : 'bg-gray-500'} text-white`}
          onClick={goToMenuPage}
        >
          Menú
        </button>
      </div>

      {/* Renderizar la vista seleccionada */}
      {currentView === 'users' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Usuarios</h2>
          <ul>
            {users.map(user => (
              <li key={user._id} className="card-item p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl mb-4 shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3">
                    {/* Foto del usuario */}
                    {user.photo && (
                      <img
                        src={user.photo}
                        alt={`${user.username}'s photo`}
                        className="w-16 h-16 rounded-full mb-4 shadow-lg"
                      />
                    )}

                    <div>
                      <p className="text-white font-semibold">
                        {user.username} <span className="text-gray-400">({user.email})</span>
                      </p>
                      <p className="text-gray-300">Rol actual: {user.role}</p>
                      <p className="text-gray-300">Bar asignado: {bars.find(b => b._id === user.barId)?.name || 'Sin bar asignado'}</p>
                    </div>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition">
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentView === 'bars' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Bares</h2>
          <ul>
            {bars.map(bar => (
              <li key={bar._id} className="card-item p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl mb-4 shadow-md text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{bar.name}</p>
                    <p className="text-sm text-gray-400">Administradores: {bar.adminIds.length > 0 ? bar.adminIds.join(', ') : 'Sin administradores'}</p>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition">
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
