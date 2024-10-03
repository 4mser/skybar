'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

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
  coordinates: {
    lat: number;
    lng: number;
  };
  adminIds: string[];
  workerIds: string[];
}

// Dashboard para Superadmin
const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const [barsSelection, setBarsSelection] = useState<{ [key: string]: string }>({});
  const [isBarModalOpen, setIsBarModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
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
          headers: { Authorization: `Bearer ${token}` }
        });

        const currentUser = profileResponse.data;
        if (currentUser.role !== 'superadmin') {
          router.push('/profile');
          return;
        }

        setIsSuperadmin(true);

        const usersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);

        const barsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/bars`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const openBarModal = (bar: Bar) => {
    setSelectedBar(bar);
    setIsBarModalOpen(true);
  };

  const closeBarModal = () => {
    setSelectedBar(null);
    setIsBarModalOpen(false);
  };

  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setIsUserModalOpen(false);
  };

  const removeUserFromBar = async (userId: string, role: string) => {
    if (selectedBar) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/bars/${selectedBar._id}/remove-user/${userId}`,
          { role },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (role === 'admin') {
          setBars(bars.map(bar => 
            bar._id === selectedBar._id
              ? { ...bar, adminIds: bar.adminIds.filter(id => id !== userId) }
              : bar
          ));
        } else if (role === 'worker') {
          setBars(bars.map(bar => 
            bar._id === selectedBar._id
              ? { ...bar, workerIds: bar.workerIds.filter(id => id !== userId) }
              : bar
          ));
        }

        setUsers(users.map(user =>
            user._id === userId ? { ...user, barId: null } : user
          ));
          
        closeBarModal();
      } catch (error) {
        console.error('Error removing user from bar:', error);
      }
    }
  };

  const updateRole = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/users/${selectedUser._id}/role`,
          { role: roles[selectedUser._id] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.map(user => user._id === selectedUser._id ? { ...user, role: roles[selectedUser._id] } : user));
        closeUserModal();
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  const assignBar = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/users/${selectedUser._id}/assign-bar`,
          { barId: barsSelection[selectedUser._id] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(users.map(user => user._id === selectedUser._id ? { ...user, barId: barsSelection[selectedUser._id] } : user));
        closeUserModal();
      } catch (error) {
        console.error('Error assigning bar:', error);
      }
    }
  };

  // GSAP animation for the list items
  useEffect(() => {
    const elements = document.querySelectorAll('.user-item');
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50, visibility: 'hidden' },
      { opacity: 1, y: 0, visibility: 'visible', stagger: 0.2, duration: 0.8, ease: 'power3.out' }
    );
  }, [users]);

  const getAdminNames = (adminIds: string[]) => {
    const adminNames = users
      .filter(user => adminIds.includes(user._id))
      .map(user => user.username);
    return adminNames.length ? adminNames.join(', ') : 'Sin administradores';
  };

  const getWorkerNames = (workerIds: string[]) => {
    const workerNames = users
      .filter(user => workerIds.includes(user._id))
      .map(user => user.username);
    return workerNames.length ? workerNames.join(', ') : 'Sin trabajadores';
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Usuarios</h2>
          <ul>
            {users.map(user => (
              <li key={user._id} className="user-item p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl mb-4 shadow-md" style={{ visibility: 'hidden' }}>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-3'>
                    {/* Foto del usuario */}
                    {user.photo && (
                    <img
                        src={user.photo}
                        alt={`${user.username}'s photo`}
                        className="w-16 h-16 rounded-full mb-4 shadow-lg"
                    />
                    )}

                    <div>
                      <p className="text-white font-semibold">{user.username} <span className="text-gray-400">({user.email})</span></p>
                      <p className="text-gray-300">Rol actual: {user.role}</p>
                      <p className="text-gray-300">Bar asignado: {bars.find(b => b._id === user.barId)?.name || 'Sin bar asignado'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => openUserModal(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Bares</h2>
          <ul>
            {bars.map(bar => (
              <li key={bar._id} className="p-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg rounded-2xl mb-4 shadow-md text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{bar.name}</p>
                    <p className="text-sm text-gray-400">Administradores: {getAdminNames(bar.adminIds)}</p>
                    <p className="text-sm text-gray-400">Trabajadores: {getWorkerNames(bar.workerIds)}</p>
                  </div>
                  <button
                    onClick={() => openBarModal(bar)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal para editar administradores y trabajadores */}
      {isBarModalOpen && selectedBar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl mb-4">Editar Usuarios de {selectedBar.name}</h2>
            <ul className="mb-4">
              {selectedBar.adminIds.map(adminId => {
                const admin = users.find(user => user._id === adminId);
                return (
                  <li key={adminId} className="flex justify-between items-center mb-2">
                    <span>{admin?.username || 'Desconocido'}</span>
                    <button
                      onClick={() => removeUserFromBar(adminId, 'admin')}
                      className="bg-red-500 text-white px-2 py-1 rounded-2xl hover:bg-red-600 transition"
                    >
                      Eliminar Administrador
                    </button>
                  </li>
                );
              })}
              {selectedBar.workerIds.map(workerId => {
                const worker = users.find(user => user._id === workerId);
                return (
                  <li key={workerId} className="flex justify-between items-center mb-2">
                    <span>{worker?.username || 'Desconocido'}</span>
                    <button
                      onClick={() => removeUserFromBar(workerId, 'worker')}
                      className="bg-red-500 text-white px-2 py-1 rounded-2xl hover:bg-red-600 transition"
                    >
                      Eliminar Trabajador
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={closeBarModal} className="bg-gray-500 text-white px-3 py-1 rounded-2xl hover:bg-gray-600 transition">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para editar usuarios */}
      {isUserModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl mb-4">Editar Usuario: {selectedUser.username}</h2>
            <div className="mb-4">
              <label className="block mb-2">Rol:</label>
              <select
                value={roles[selectedUser._id] || selectedUser.role}
                onChange={e => setRoles({ ...roles, [selectedUser._id]: e.target.value })}
                className="bg-gray-500 text-white py-1 px-2 rounded-2xl w-full"
              >
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Asignar Bar:</label>
              <select
                value={barsSelection[selectedUser._id] || selectedUser.barId || ''}
                onChange={e => setBarsSelection({ ...barsSelection, [selectedUser._id]: e.target.value })}
                className="bg-gray-500 text-white py-1 px-2 rounded-2xl w-full"
              >
                <option value="">Sin bar asignado</option>
                {bars.map(bar => (
                  <option key={bar._id} value={bar._id}>{bar.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={updateRole} className="bg-blue-500 text-white px-3 py-1 rounded-2xl hover:bg-blue-600 transition">
                Actualizar Rol
              </button>
              <button onClick={assignBar} className="bg-green-500 text-white px-3 py-1 rounded-2xl hover:bg-green-600 transition">
                Asignar Bar
              </button>
              <button onClick={closeUserModal} className="bg-gray-500 text-white px-3 py-1 rounded-2xl hover:bg-gray-600 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
