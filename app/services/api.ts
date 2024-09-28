import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  