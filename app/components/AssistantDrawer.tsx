'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lottie from "lottie-react"
import aiAnimation from '@/public/animate-icons/AI.json'; // Ubicación correcta de la animación JSON

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

  const createMessage = useCallback((sender: 'assistant' | 'user', text: string): Message => ({
    sender,
    text,
  }), []);

  const isValidMessage = useCallback((msg: unknown): msg is Message => {
    return (
      (msg as Message).sender === 'assistant' || (msg as Message).sender === 'user' &&
      typeof (msg as Message).text === 'string'
    );
  }, []);

  const typeAssistantMessages = useCallback(async (text: string) => {
    return new Promise<void>((resolve) => {
      const recommendations = text.split('\n').filter((rec) => rec.trim() !== '');
      let index = 0;
      const sectionDelay = 500;

      const typeNext = () => {
        if (index < recommendations.length) {
          setMessages((prevMessages) => [
            ...prevMessages,
            createMessage('assistant', recommendations[index]),
          ]);
          index++;
          setTimeout(typeNext, sectionDelay);
        } else {
          resolve();
        }
      };

      typeNext();
    });
  }, [createMessage]);

  const initialAssistantMessage = useCallback((): Message => createMessage(
    'assistant',
    `¡Hola! Soy tu asistente de IA. Cuéntame tus gustos o lo que te apetece, y te recomendaré opciones disponibles en ${submenuName}.`
  ), [submenuName, createMessage]);

  // Función para borrar la conversación
  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('assistantDrawerMessages'); // Limpiar almacenamiento local
  }, []);

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

  useEffect(() => {
    localStorage.setItem('assistantDrawerMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open) {
      if (messages.length === 0 || messages[0].text !== initialAssistantMessage().text) {
        setMessages((prevMessages) => [initialAssistantMessage(), ...prevMessages]);
      }
    }
  }, [open, initialAssistantMessage, messages]);

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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-neon z-0 flex items-center justify-center transition-transform transform hover:scale-105 animate-neon p-[2px]"
        >
          <div className=" bg-black/50 rounded-full font-bold flex items-center">
            {/* Añadimos la animación Lottie al botón */}
            <Lottie
              animationData={aiAnimation} // Asegúrate de usar la propiedad correcta
              loop={true}
              className="w-12 h-12 " // Ajusta el tamaño de la animación
            />
            <p className='mr-3 font-medium text-sm'>Asistente IA</p>
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white rounded-t-2xl max-h-screen h-[80vh] overflow-hidden flex flex-col border-t border-white/10">
        {/* Barra superior del Drawer */}
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-white/30"></div>

        <DrawerHeader>
          <p className='text-white font-bold'>Asistente AI</p>
        <div className="absolute right-0 bottom-20 px-4 py-2 text-right">
          <button
            onClick={clearMessages}
            className=" text-white/80 px-4 text-xs py-2 rounded-full shadow-delete "
          >
            Eliminar conversación
          </button>
        </div>
        </DrawerHeader>

        {/* Botón para eliminar la conversación */}

        {/* Mensajes */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4" ref={messagesEndRef}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex ${message.sender === 'assistant' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`px-6 py-3 mt-3 rounded-3xl max-w-xs ${message.sender === 'assistant' ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white  shadow-assistant' : 'bg-gradient-to-r from-blue-500/30 to-teal-500/30 text-white shadow-user'}`}>
                <p>{message.text}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-6 py-3 rounded-3xl  text-white backdrop-blur-md flex items-center space-x-2 shadow-assistant">
                <motion.div className="flex space-x-2" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex items-center">
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
