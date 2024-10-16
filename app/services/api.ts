import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Añadir el token a los encabezados
    }
    return config;
  }
);

// Registro de usuario
export const register = async (data: { username: string; email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error en el registro');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Inicio de sesión
export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', data);
    const { access_token } = response.data;

    // Guardar el token en localStorage
    localStorage.setItem('token', access_token);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error en el inicio de sesión');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Crear un anuncio
export const createAd = async (data: FormData) => {
  try {
    const response = await api.post('/ads', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al crear el anuncio');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Obtener anuncios por BarId y opcionalmente por SubMenuId
export const getAdsByBarAndSubMenu = async (barId: string, subMenuId?: string) => {
  try {
    let endpoint = `/ads/bar/${barId}`;
    if (subMenuId) {
      endpoint += `/submenu/${subMenuId}`;
    }
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener los anuncios');
    } else {
      throw new Error('Error desconocido');
    }
  }
};


// Eliminar un anuncio
export const deleteAd = async (adId: string) => {
  try {
    const response = await api.delete(`/ads/${adId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al eliminar el anuncio');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

// Otras funciones de API como agregar favoritos, etc.
export const addFavorite = async (productId: string) => {
  try {
    const response = await api.patch('/menus/me/favorites', { productId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al agregar favorito');
    } else {
      throw new Error('Error desconocido');
    }
  }
};

export const getFavoriteProducts = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token, el usuario no está autenticado');
  }

  try {
    const response = await api.get('/menus/me/favorites', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Retorna los productos favoritos completos
  } catch {
    throw new Error('Error al obtener productos favoritos');
  }
};

// Eliminar producto de favoritos
export const removeFavorite = async (productId: string) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No hay token, el usuario no está autenticado');
  }

  try {
    await api.delete(`/menus/me/favorites`, {
      data: { productId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Error al eliminar producto de favoritos');
  }
};

export default api;
