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
import Lottie from 'lottie-react';
import aiAnimation from '@/public/animate-icons/AI.json';

gsap.registerPlugin(ScrollToPlugin);

interface Product {
  name: string;
  imageUrl: string | null;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  imageUrl?: string;
}

interface AssistantDrawerProps {
  barId: string;
  submenuName: string;
}

const AssistantDrawer: React.FC<AssistantDrawerProps> = ({ barId, submenuName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]); // Guardar productos disponibles

  const createMessage = useCallback((sender: 'assistant' | 'user', text: string, imageUrl?: string): Message => ({
    sender,
    text,
    imageUrl,
  }), []);

  const isValidMessage = useCallback((msg: unknown): msg is Message => {
    return (
      (msg as Message).sender === 'assistant' || (msg as Message).sender === 'user' &&
      typeof (msg as Message).text === 'string'
    );
  }, []);

  // 1. Obtener productos disponibles desde el menú
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/menus?barId=${barId}`);
        const menu = response.data[0]; // Asumiendo que solo tienes un menú
        const products: Product[] = [];

        menu.subMenus.forEach((submenu: any) => {
          submenu.sections.forEach((section: any) => {
            section.products.forEach((product: any) => {
              if (product.available) {
                products.push({
                  name: product.name,
                  imageUrl: product.imageUrl ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}` : null,
                });
              }
            });
          });
        });

        setAvailableProducts(products);
      } catch (error) {
        console.error('Error al obtener productos disponibles:', error);
      }
    };

    fetchAvailableProducts();
  }, [barId]);

  // 2. Hacer el match de los productos
  const typeAssistantMessages = useCallback(async (response: { recommendations: string }) => {
    const { recommendations } = response;

    return new Promise<void>((resolve) => {
      const recommendationLines = recommendations.split('\n').filter((rec) => rec.trim() !== '');
      let index = 0;
      const sectionDelay = 500;

      const typeNext = () => {
        if (index < recommendationLines.length) {
          const recommendationText = recommendationLines[index];

          // Buscar el producto por nombre
          const productMatch = availableProducts.find((product) => recommendationText.includes(product.name));

          setMessages((prevMessages) => [
            ...prevMessages,
            createMessage('assistant', recommendationText, productMatch?.imageUrl || undefined),
          ]);

          index++;
          setTimeout(typeNext, sectionDelay);
        } else {
          resolve();
        }
      };

      typeNext();
    });
  }, [availableProducts, createMessage]);

  const initialAssistantMessage = useCallback((): Message => createMessage(
    'assistant',
    `¡Hola! Soy tu asistente de IA. Cuéntame tus gustos o lo que te apetece, y te recomendaré opciones disponibles en ${submenuName}.`
  ), [submenuName, createMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('assistantDrawerMessages');
  }, []);

  useEffect(() => {
    const storedMessages = localStorage.getItem('assistantDrawerMessages');
    if (storedMessages) {
      try {
        const parsedMessages: unknown[] = JSON.parse(storedMessages) as Message[];
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          const validMessages: Message[] = parsedMessages.filter(isValidMessage);
          setMessages(validMessages);
        } else {
          setMessages([initialAssistantMessage()]);
        }
      } catch (error) {
        console.error('Error al parsear los mensajes almacenados:', error);
        setMessages([initialAssistantMessage()]);
      }
    } else {
      setMessages([initialAssistantMessage()]);
    }
  }, [isValidMessage, initialAssistantMessage]);

  useEffect(() => {
    localStorage.setItem('assistantDrawerMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([initialAssistantMessage()]);
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

  const formatMessageText = (text: string) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = text.split(regex);

    return parts.map((part, index) => (
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    ));
  };

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/gpt/recommendations`,
        { preferences, barId, submenuName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const assistantResponse = response.data;
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
      <DrawerTrigger asChild>
        <button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-neon z-0 flex items-center justify-center transition-transform transform hover:scale-105 animate-neon p-[2px]"
        >
          <div className=" bg-black/50 rounded-full font-bold flex items-center">
            <Lottie
              animationData={aiAnimation}
              loop={true}
              className="w-12 h-12"
            />
            <p className='mr-3 font-medium text-sm'>Asistente IA</p>
          </div>
        </button>
      </DrawerTrigger>

      <DrawerContent className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white rounded-t-2xl max-h-screen h-[80vh] overflow-hidden flex flex-col border-t border-white/10">
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-white/30"></div>

        <DrawerHeader>
          <p className='text-white font-bold'>Asistente AI</p>
          <div className="absolute right-0 top-10 px-4 py-2 text-right">
            <button
              onClick={clearMessages}
              className="opacity-70 hover:opacity-100  px-4 text-xs py-2 rounded-full shadow-delete "
            >
              <img src="/icons/delete.svg" alt="" />
            </button>
          </div>
        </DrawerHeader>

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
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Producto recomendado"
                    className="w-full h-32 object-cover rounded-[10px] mb-2"
                  />
                )}
                <p>{formatMessageText(message.text)}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-6 py-3 rounded-3xl  text-white backdrop-blur-md flex items-center space-x-2 shadow-assistant bg-gradient-to-r from-purple-500/30 to-indigo-500/30">
                <motion.div className="flex space-x-2" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

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
