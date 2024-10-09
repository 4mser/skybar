'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa'; // Icono para el botón de editar

// Interfaz para usuarios y bares
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
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('users');
  const [newBarName, setNewBarName] = useState<string>(''); // Nombre del nuevo bar
  const [newBarLocation, setNewBarLocation] = useState<string>(''); // Ubicación del nuevo bar
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Para el usuario seleccionado
  const [showModal, setShowModal] = useState<boolean>(false); // Estado para mostrar el modal
  const [newRole, setNewRole] = useState<string>(''); // Para el nuevo rol
  const [selectedBar, setSelectedBar] = useState<string | null>(null); // Para el bar seleccionado
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

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setSelectedBar(user.barId || null); // Si ya tiene un bar asignado, lo mostramos
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Actualizar rol del usuario
      await axios.patch(`${process.env.NEXT_PUBLIC_API}/users/${selectedUser._id}/role`, {
        role: newRole,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Asignar o remover el bar
      if (selectedBar) {
        await axios.patch(`${process.env.NEXT_PUBLIC_API}/users/${selectedUser._id}/assign-bar`, {
          barId: selectedBar,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Remover el usuario del bar si no se seleccionó ninguno
        await axios.patch(`${process.env.NEXT_PUBLIC_API}/users/${selectedUser._id}/assign-bar`, {
          barId: null,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowModal(false); // Cerrar el modal
      setSelectedUser(null); // Limpiar el usuario seleccionado
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCreateBar = async () => {
    if (!newBarName || !newBarLocation) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Crear un nuevo bar
      await axios.post(`${process.env.NEXT_PUBLIC_API}/bars`, {
        name: newBarName,
        location: newBarLocation,
        lat: 0, // Aquí podrías pedir coordenadas reales si es necesario
        lng: 0,
        adminIds: [], // Inicialmente sin administradores
        workerIds: [],
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewBarName(''); // Limpiar campos del formulario
      setNewBarLocation('');
      // Recargar la lista de bares
      const barsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/bars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBars(barsResponse.data);
    } catch (error) {
      console.error('Error creating bar:', error);
    }
  };

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

      {/* Vista de Usuarios */}
      {currentView === 'users' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Usuarios</h2>
          <ul className="space-y-4">
            {users.map(user => (
              <li key={user._id} className="p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl shadow-md flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  {/* Foto del usuario */}
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={`${user.username}'s photo`}
                      className="w-14 h-14 rounded-full shadow-lg"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-300 text-white flex items-center justify-center rounded-full">
                      {user.username.charAt(0)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-white font-semibold">
                      {user.username} 
                    </p>
                    <p className="text-gray-400 text-wrap text-xs">({user.email})</p>
                    <p className="text-gray-300 text-sm">Rol actual: {user.role}</p>
                    <p className="text-gray-300 text-sm">Bar asignado: {bars.find(b => b._id === user.barId)?.name || 'Sin bar asignado'}</p>
                  </div>
                </div>
                <button onClick={() => openEditModal(user)} className="text-blue-500 text-lg p-2 rounded-full top-2 right-2 absolute hover:bg-white/10">
                  <FaEdit />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vista de Bares */}
      {currentView === 'bars' && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Bares</h2>
          <ul className="space-y-4">
            {bars.map(bar => (
              <li key={bar._id} className="p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl shadow-md">
                <div>
                  <p className="text-white font-semibold text-lg">{bar.name}</p>
                  <p className="text-gray-300">Ubicación: {bar.location}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Formulario para crear un nuevo bar (solo si es superadmin) */}
          {isSuperadmin && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Crear Nuevo Bar</h3>
              <input
                type="text"
                placeholder="Nombre del bar"
                value={newBarName}
                onChange={(e) => setNewBarName(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Ubicación del bar"
                value={newBarLocation}
                onChange={(e) => setNewBarLocation(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleCreateBar}
              >
                Crear Bar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para editar el usuario */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="backdrop-blur-md bg-white/10 p-6 rounded-[15px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Usuario: {selectedUser.username}</h2>

            <label className="block mb-2">Rol:</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full p-2 border rounded-full bg-white/10 ">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>

            <label className="block mt-4 mb-2">Asignar Bar:</label>
            <select value={selectedBar || ''} onChange={(e) => setSelectedBar(e.target.value || null)} className="w-full p-2 border rounded-full bg-white/10 ">
              <option value="">Sin bar asignado</option>
              {bars.map(bar => (
                <option key={bar._id} value={bar._id}>
                  {bar.name}
                </option>
              ))}
            </select>

            <div className="mt-6 flex justify-end space-x-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-[15px]" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-[15px]" onClick={handleUpdateUser}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
