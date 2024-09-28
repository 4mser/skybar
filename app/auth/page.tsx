'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Cambiamos a next/navigation
import { login, register } from '../services/api';  // Asegúrate que el path sea correcto

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // Nuevo estado para el email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();  // useRouter de next/navigation

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login({ username, password });
        console.log('Inicio de sesión exitoso:', response);
        router.push('/profile');  // Redirige al perfil después de iniciar sesión
      } else {
        await register({ username, email, password });  // Incluye email en el registro
        console.log('Registro exitoso');
        setIsLogin(true);  // Cambia a la vista de login después de registrarse
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-[100dvh]  text-white">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4">{isLogin ? 'Iniciar Sesión' : 'Registro'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre de usuario</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-700 rounded"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-neutral-700 px-3 py-2  rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required={!isLogin}  // Email es obligatorio solo en el registro
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-neutral-700 rounded"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className="text-red-400 mb-4">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-500 py-2 rounded hover:bg-cyan-600 transition font-semibold"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrar'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button onClick={toggleForm} className="text-cyan-400 hover:underline">
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
