// components/AssistantModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface AssistantModalProps {
  onClose: () => void;
  barId: string;
  submenuName: string; // Añadimos el submenuName como prop
}

const AssistantModal: React.FC<AssistantModalProps> = ({
  onClose,
  barId,
  submenuName,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mensaje inicial del asistente
    setMessages([
      {
        sender: 'assistant',
        text: `¡Hola! Soy tu asistente virtual. Cuéntame tus gustos o lo que te apetece, y te recomendaré opciones disponibles en ${submenuName}.`,
      },
    ]);
  }, [submenuName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: inputText.trim() },
    ]);

    const preferences = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró un token de autenticación');
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'assistant',
            text: 'Necesitas iniciar sesión para utilizar el asistente.',
          },
        ]);
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/gpt/recommendations`,
        { preferences, barId, submenuName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const assistantResponse = response.data.recommendations;

      // Agregar respuesta del asistente
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'assistant', text: assistantResponse },
      ]);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'assistant',
          text: 'Lo siento, ha ocurrido un error al obtener las recomendaciones. Por favor, inténtalo de nuevo.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md mx-auto rounded-lg shadow-lg flex flex-col">
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Asistente Virtual</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        {/* Mensajes */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === 'assistant' ? 'text-left' : 'text-right'
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.sender === 'assistant'
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-left'
                    : 'bg-blue-600 text-white text-right'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="mb-4 text-left">
              <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                Escribiendo...
              </div>
            </div>
          )}
        </div>
        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-300 dark:border-gray-700 flex"
        >
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 mr-2 focus:outline-none bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200"
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssistantModal;
