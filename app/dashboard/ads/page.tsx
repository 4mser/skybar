'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createAd, getAdsByBarAndSubMenu, deleteAd } from '../../services/api'; // Asegúrate de que las funciones de la API estén correctamente implementadas
import { format } from 'date-fns';

interface Bar {
  _id: string;
  name: string;
}

interface Menu {
    _id: string;
    name: string;
    barId: string; // Añadir barId aquí
    subMenus: SubMenu[];
  }
  

interface SubMenu {
  _id: string;
  name: string;
}

interface Ad {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
}

const AdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [barId, setBarId] = useState<string>(''); // Para seleccionar el bar
  const [subMenuId, setSubMenuId] = useState<string>(''); // Para seleccionar el submenú
  const [bars, setBars] = useState<Bar[]>([]); // Estado para almacenar los bares
  const [menus, setMenus] = useState<Menu[]>([]); // Estado para almacenar los menús y submenús
  const [subMenus, setSubMenus] = useState<SubMenu[]>([]); // Submenús filtrados por el bar seleccionado
  const [startDate, setStartDate] = useState<string>(''); // Fecha de inicio
  const [endDate, setEndDate] = useState<string>(''); // Fecha de fin
  const [active, setActive] = useState<boolean>(true); // Estado del anuncio
  const [loading, setLoading] = useState<boolean>(false);

  // Obtener los bares
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const token = localStorage.getItem('token');
        const barsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/bars`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBars(barsResponse.data);
      } catch (error) {
        console.error('Error al obtener los bares:', error);
      }
    };

    fetchBars();
  }, []);

  // Obtener los menús y submenús asociados al bar seleccionado
  useEffect(() => {
    const fetchMenus = async () => {
      if (!barId) return;

      try {
        const token = localStorage.getItem('token');
        const menusResponse = await axios.get(`${process.env.NEXT_PUBLIC_API}/menus`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtrar menús que pertenezcan al bar seleccionado
        const filteredMenus = menusResponse.data.filter((menu: Menu) => menu.barId === barId);
        setMenus(filteredMenus);

        // Obtener todos los submenús de esos menús
        const allSubMenus = filteredMenus.flatMap((menu: Menu) => menu.subMenus);
        setSubMenus(allSubMenus);
      } catch (error) {
        console.error('Error al obtener los menús y submenús:', error);
      }
    };

    fetchMenus();
  }, [barId]);

  const fetchAds = async () => {
    if (!barId) return;

    try {
      const adsData = await getAdsByBarAndSubMenu(barId, subMenuId);
      setAds(adsData);
    } catch (error) {
      console.error('Error al obtener los anuncios:', error);
    }
  };

  // Obtener los anuncios cuando cambian el bar o submenú seleccionados
  useEffect(() => {
    if (barId) {
      fetchAds();
    }
  }, [barId, subMenuId]);

  // Manejo de la selección del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  // Crear o actualizar un anuncio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) {
      formData.append('file', file);
    }
    formData.append('barId', barId);
    if (subMenuId) {
      formData.append('subMenuId', subMenuId);
    }
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('active', active.toString());

    try {
      await createAd(formData);
      alert('Anuncio creado con éxito');
      fetchAds(); // Recargar anuncios después de crear
      setTitle('');
      setDescription('');
      setFile(null);
      setStartDate('');
      setEndDate('');
      setActive(true);
    } catch (error) {
      console.error('Error al crear el anuncio:', error);
      alert('Error al crear el anuncio');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un anuncio
  const handleDelete = async (adId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      return;
    }

    try {
      await deleteAd(adId);
      fetchAds(); // Recargar anuncios después de eliminar
    } catch (error) {
      console.error('Error al eliminar anuncio:', error);
      alert('Error al eliminar anuncio');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Anuncios</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="barId" className="block text-sm font-medium">Bar</label>
            <select
              id="barId"
              value={barId}
              onChange={(e) => setBarId(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Seleccionar Bar</option>
              {bars.map((bar) => (
                <option key={bar._id} value={bar._id}>
                  {bar.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="subMenuId" className="block text-sm font-medium">Submenú (opcional)</label>
            <select
              id="subMenuId"
              value={subMenuId}
              onChange={(e) => setSubMenuId(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar Submenú</option>
              {subMenus.map((subMenu) => (
                <option key={subMenu._id} value={subMenu._id}>
                  {subMenu.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium">Archivo (opcional)</label>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium">Fecha de inicio</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium">Fecha de fin</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="active" className="block text-sm font-medium">Activo</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="active" className="ml-2 text-sm font-medium">Activo</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Crear Anuncio'}
          </button>
        </form>

        <h2 className="text-xl font-bold mb-4">Anuncios existentes</h2>

        {ads.length === 0 ? (
          <p>No hay anuncios para este bar.</p>
        ) : (
          <ul className="space-y-4">
            {ads.map((ad) => (
              <li key={ad._id} className="bg-gray-800 shadow-md rounded-lg p-4">
                <h3 className="font-bold text-lg">{ad.title}</h3>
                <p className="text-sm text-gray-400">{ad.description}</p>
                {ad.fileUrl && (
                  <img src={ad.fileUrl} alt={ad.title} className="w-full h-40 object-cover mt-2 rounded-md" />
                )}
                <p className="text-sm mt-2">
                  {ad.startDate && `Inicio: ${format(new Date(ad.startDate), 'dd/MM/yyyy')}`}
                  {ad.endDate && ` | Fin: ${format(new Date(ad.endDate), 'dd/MM/yyyy')}`}
                </p>
                <p className="text-sm text-gray-400">Estado: {ad.active ? 'Activo' : 'Inactivo'}</p>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdsPage;
