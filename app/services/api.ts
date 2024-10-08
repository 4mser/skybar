import axios from 'axios';

const API_URL = 'http://localhost:3000';

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
  },
  (error) => {
    return Promise.reject(error);
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
  } catch (error) {
    throw new Error('Error al obtener productos favoritos');
  }
};

export default api;
