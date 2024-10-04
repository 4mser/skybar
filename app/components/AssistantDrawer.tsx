// components/AssistantDrawer.tsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface AssistantDrawerProps {
  barId: string;
  submenuName: string;
}

const AssistantDrawer: React.FC<AssistantDrawerProps> = ({ barId, submenuName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Estado para controlar el Drawer
  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para el scroll automático

  // Helper function to create a Message
  const createMessage = useCallback((sender: 'assistant' | 'user', text: string): Message => ({
    sender,
    text,
  }), []);

  // Función para validar si un objeto es del tipo Message
  const isValidMessage = useCallback((msg: unknown): msg is Message => {
    return (
      (msg as Message).sender === 'assistant' || (msg as Message).sender === 'user' &&
      typeof (msg as Message).text === 'string'
    );
  }, []);
  

  // Función para simular la escritura del asistente por secciones
  const typeAssistantMessages = useCallback(async (text: string) => {
    return new Promise<void>((resolve) => {
      // Suponiendo que las recomendaciones están separadas por saltos de línea
      const recommendations = text.split('\n').filter((rec) => rec.trim() !== '');
      console.log('Recommendations:', recommendations); // Depuración
      let index = 0;
      const sectionDelay = 500; // Retardo entre cada recomendación en ms

      const typeNext = () => {
        if (index < recommendations.length) {
          setMessages((prevMessages) => [
            ...prevMessages,
            createMessage('assistant', recommendations[index]),
          ]);
          console.log(`Añadido mensaje: ${recommendations[index]}`); // Depuración
          index++;
          setTimeout(typeNext, sectionDelay);
        } else {
          resolve();
        }
      };

      typeNext();
    });
  }, [createMessage]);

  // Mensaje inicial del asistente
  const initialAssistantMessage = useCallback((): Message => createMessage(
    'assistant',
    `¡Hola! Soy tu asistente de IA. Cuéntame tus gustos o lo que te apetece, y te recomendaré opciones disponibles en ${submenuName}.`
  ), [submenuName, createMessage]);

  // Cargar mensajes desde localStorage al montar el componente
  useEffect(() => {
    const storedMessages = localStorage.getItem('assistantDrawerMessages');
    if (storedMessages) {
      try {
        const parsedMessages: unknown[] = JSON.parse(storedMessages) as Message[];
        if (Array.isArray(parsedMessages)) {
          const validMessages: Message[] = parsedMessages.filter(isValidMessage);
          setMessages(validMessages);
        }
      } catch (error) {
        console.error('Error al parsear los mensajes almacenados:', error);
        setMessages([]);
      }
    }
  }, [isValidMessage]);

  // Guardar mensajes en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('assistantDrawerMessages', JSON.stringify(messages));
  }, [messages]);

  // Añadir mensaje inicial del asistente cada vez que se abre el Drawer
  useEffect(() => {
    if (open) {
      // Verificar si el primer mensaje es el inicial
      if (messages.length === 0 || messages[0].text !== initialAssistantMessage().text) {
        setMessages((prevMessages) => [initialAssistantMessage(), ...prevMessages]);
      }
    }
  }, [open, initialAssistantMessage, messages]);

  // Scroll al final de los mensajes cuando cambian
  useEffect(() => {
    if (messagesEndRef.current) {
      gsap.to(messagesEndRef.current, {
        duration: 0.5,
        scrollTo: { y: messagesEndRef.current.scrollHeight },
        ease: 'power2.out',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prevMessages) => [
      ...prevMessages,
      createMessage('user', inputText.trim()),
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
          createMessage('assistant', 'Necesitas iniciar sesión para utilizar el asistente.'),
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

      const assistantResponse: string = response.data.recommendations;
      console.log('Assistant Response:', assistantResponse); // Depuración

      // Procesar las recomendaciones y agregar cada una como un mensaje separado
      await typeAssistantMessages(assistantResponse);
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        createMessage('assistant', 'Lo siento, ha ocurrido un error al obtener las recomendaciones. Por favor, inténtalo de nuevo.'),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* Botón para abrir el Drawer */}
      <DrawerTrigger asChild>
        <button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white  rounded-full shadow-neon z-50 flex items-center justify-center transition-transform transform hover:scale-105 animate-neon p-[2px]"
        >
          {/* Puedes reemplazar con un ícono */}
          <div className='p-3 bg-black/50 rounded-full font-bold'>
          Asistente IA
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white rounded-t-2xl max-h-screen h-[80vh] overflow-hidden flex flex-col border-t border-white/10"
      >
        {/* Barra superior del Drawer */}
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-white/30"></div>

        <DrawerHeader className="p-4">
          <DrawerTitle className="text-lg font-semibold">Asistente AI</DrawerTitle>
          <DrawerDescription className="text-sm text-gray-300">
            Cuéntame tus gustos y te recomendaré opciones disponibles.
          </DrawerDescription>
        </DrawerHeader>

        {/* Mensajes */}
        <div
          className="flex-1 px-4 pb-4 overflow-y-auto space-y-4"
          ref={messagesEndRef}
        >
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex ${
                message.sender === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`px-6 py-3 mt-3 rounded-3xl max-w-xs ${
                  message.sender === 'assistant'
                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white backdrop-blur-md shadow-assistant'
                    : 'bg-gradient-to-r from-blue-500/30 to-teal-500/30 text-white backdrop-blur-md shadow-user'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-6 py-3 rounded-3xl bg-white/20 text-white backdrop-blur-md flex items-center space-x-2 shadow-assistant">
                {/* Animación de escritura */}
                <motion.div
                  className="flex space-x-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-white/10 flex items-center"
        >
          <input
            type="text"
            className="flex-1 border border-gray-700 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-300 transition-all duration-300"
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full shadow-send transition-transform transform hover:scale-105 shadow-assistant"
            disabled={loading}
          >
            Enviar
          </button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AssistantDrawer;
