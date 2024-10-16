'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { Bar, Menu, Product } from '@/types/types';
import Image from 'next/image';

// Componente Modal personalizado con Glassmorphism
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className="relative p-6 rounded-[10px] backdrop-blur-md max-w-md w-full
                bg-gradient-to-br from-white/10 to-transparent
                 border border-white/20 text-white"
      >
        <button
          className="absolute top-3 right-3 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const MenuPage: React.FC = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);

  // Estados para controlar los modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const router = useRouter();

  // Estado para controlar las secciones abiertas (para acordeón)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Estado para controlar los submenús abiertos (para acordeón)
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Obtener bares y perfil del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth');
          return;
        }

        // Obtén los datos del perfil del usuario
        const profileResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentUser = profileResponse.data;
        setIsSuperadmin(currentUser.role === 'superadmin');

        // Obtén la lista de bares
        const barsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/bars`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBars(barsResponse.data);

        // Si es admin, selecciona automáticamente el bar asignado
        if (currentUser.role === 'admin') {
          const bar = barsResponse.data.find(
            (bar: Bar) => bar._id === currentUser.barId
          );
          setSelectedBar(bar?._id || null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/auth');
      }
    };

    fetchData();
  }, [router]);

  // Función para obtener menús
  const fetchMenus = async () => {
    if (!selectedBar) return;

    try {
      const token = localStorage.getItem('token');
      const menusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/menus`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filtrar menús por barId
      const filteredMenus = menusResponse.data.filter((menu: Menu) => {
        const barId =
          typeof menu.barId === 'object' ? menu.barId._id : menu.barId;
        return barId === selectedBar;
      });

      setMenus(filteredMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // Obtener menús cuando cambia el bar seleccionado
  useEffect(() => {
    fetchMenus();
  }, [selectedBar]);

  // Funciones para abrir y cerrar modales
  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  // Función para crear un nuevo menú
  const handleCreateMenu = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/menus`,
        { barId: selectedBar },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Después de crear el menú, obtenemos los menús nuevamente
      fetchMenus();
    } catch (error) {
      console.error('Error al crear el menú:', error);
    }
  };

  // Función para agregar una nueva sección a un submenú
  const handleAddSectionToSubmenu = (
    menuId: string,
    submenuName: string,
    sectionName: string
  ) => {
    const addSection = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedSubmenuName = encodeURIComponent(submenuName);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section`,
          { name: sectionName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al agregar sección:', error);
      }
    };
    addSection();
  };

  // Función para agregar un producto a una sección de un submenú
  const handleAddProductToSection = async (
    menuId: string,
    submenuName: string,
    sectionName: string,
    data: Product | FormData // Puede aceptar tanto FormData como Product
  ) => {
    try {
      const token = localStorage.getItem('token');
      const encodedSubmenuName = encodeURIComponent(submenuName);
      const encodedSectionName = encodeURIComponent(sectionName);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product`,
        data, // Aquí pasamos `FormData` o `Product`
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(data instanceof FormData && {
              'Content-Type': 'multipart/form-data',
            }), // Solo si es FormData, establecemos el tipo correcto
          },
        }
      );
      fetchMenus();
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  // Función para actualizar una sección
  const handleUpdateSection = (
    menuId: string,
    submenuName: string,
    oldSectionName: string,
    newSectionName: string
  ) => {
    const updateSection = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedSubmenuName = encodeURIComponent(submenuName);
        const encodedOldSectionName = encodeURIComponent(oldSectionName);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedOldSectionName}`,
          { newName: newSectionName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al actualizar sección:', error);
      }
    };
    updateSection();
  };

  // Función para actualizar un producto
  const handleUpdateProduct = async (
    menuId: string,
    submenuName: string,
    sectionName: string,
    productId: string,
    updatedData: Product | FormData // Puede aceptar tanto FormData como Product
  ) => {
    try {
      const token = localStorage.getItem('token');
      const encodedSubmenuName = encodeURIComponent(submenuName);
      const encodedSectionName = encodeURIComponent(sectionName);

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product/${productId}`,
        updatedData, // Aquí pasamos `FormData` o `Product`
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(updatedData instanceof FormData && {
              'Content-Type': 'multipart/form-data',
            }), // Solo si es FormData, establecemos el tipo correcto
          },
        }
      );
      fetchMenus();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  // Función para togglear la disponibilidad de un producto
  const handleToggleAvailability = (
    menuId: string,
    submenuName: string,
    sectionName: string,
    product: Product
  ) => {
    const updateProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedSubmenuName = encodeURIComponent(submenuName);
        const encodedSectionName = encodeURIComponent(sectionName);

        // Actualizamos la disponibilidad
        const updatedProduct = { ...product, available: !product.available };

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product/${product._id}`,
          updatedProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error(
          'Error al actualizar disponibilidad del producto:',
          error
        );
      }
    };
    updateProduct();
  };

  // Funciones para eliminar elementos
  // Función para eliminar un submenú
  const handleDeleteSubmenu = async (
    menuId: string,
    submenuName: string
  ): Promise<void> => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar el submenú "${submenuName}"?`
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const encodedSubmenuName = encodeURIComponent(submenuName);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMenus();
    } catch (error) {
      console.error('Error al eliminar submenú:', error);
    }
  };

  // Función para eliminar una sección
  const handleDeleteSection = async (
    menuId: string,
    submenuName: string,
    sectionName: string
  ): Promise<void> => {
    if (
      !confirm(
        `¿Estás seguro de que deseas eliminar la sección "${sectionName}"?`
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const encodedSubmenuName = encodeURIComponent(submenuName);
      const encodedSectionName = encodeURIComponent(sectionName);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMenus();
    } catch (error) {
      console.error('Error al eliminar sección:', error);
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (
    menuId: string,
    submenuName: string,
    sectionName: string,
    productId: string
  ): Promise<void> => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const encodedSubmenuName = encodeURIComponent(submenuName);
      const encodedSectionName = encodeURIComponent(sectionName);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMenus();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  // Función para togglear la sección (para acordeón)
  const toggleSection = (submenuIndex: number, sectionIndex: number): void => {
    const key = `${submenuIndex}-${sectionIndex}`;
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Función para togglear el submenú (para acordeón)
  const toggleSubmenu = (submenuIndex: number): void => {
    const key = `${submenuIndex}`;
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Componentes de formulario para modales

  interface SubmenuFormProps {
    menuId: string;
    initialName?: string;
    oldSubmenuName?: string;
  }

  const SubmenuForm: React.FC<SubmenuFormProps> = ({
    menuId,
    initialName = '',
    oldSubmenuName,
  }) => {
    const [submenuName, setSubmenuName] = useState<string>(initialName);
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para el archivo de imagen

    const isEditing = !!oldSubmenuName;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setSelectedFile(file); // Guardar el archivo en el estado
    };

    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('name', submenuName); // Nombre del submenú
        if (selectedFile) {
          formData.append('file', selectedFile); // Si hay un archivo, agregarlo
        }

        if (isEditing && oldSubmenuName) {
          const encodedOldSubmenuName = encodeURIComponent(oldSubmenuName);
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedOldSubmenuName}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Necesario para enviar FormData
              },
            }
          );
        } else {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Necesario para enviar FormData
              },
            }
          );
        }

        fetchMenus();
        closeModal();
      } catch (error) {
        console.error('Error al agregar o actualizar submenú:', error);
      }
    };

    return (
      <div>
        <h2 className="text-xl mb-4">
          {isEditing ? 'Editar Submenú' : 'Agregar Nuevo Submenú'}
        </h2>
        <input
          type="text"
          value={submenuName}
          onChange={(e) => setSubmenuName(e.target.value)}
          placeholder="Nombre del Submenú"
          className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange} // Manejar el archivo seleccionado
          className="mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Submenú'}
        </button>
      </div>
    );
  };

  interface SectionFormProps {
    menuId: string;
    submenuName: string;
    initialName?: string;
    oldSectionName?: string;
  }

  const SectionForm: React.FC<SectionFormProps> = ({
    menuId,
    submenuName,
    initialName = '',
    oldSectionName,
  }) => {
    const [sectionName, setSectionName] = useState<string>(initialName);

    const isEditing = !!oldSectionName;

    const handleSubmit = () => {
      if (isEditing && oldSectionName) {
        handleUpdateSection(menuId, submenuName, oldSectionName, sectionName);
      } else {
        handleAddSectionToSubmenu(menuId, submenuName, sectionName);
      }
      closeModal();
    };

    return (
      <div>
        <h2 className="text-xl mb-4">
          {isEditing ? 'Editar Sección' : 'Agregar Nueva Sección'}
        </h2>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Nombre de la Sección"
          className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Sección'}
        </button>
      </div>
    );
  };

  interface ProductFormProps {
    menuId: string;
    submenuName: string;
    sectionName: string;
    initialProduct?: Product;
  }

  const ProductForm: React.FC<ProductFormProps> = ({
    menuId,
    submenuName,
    sectionName,
    initialProduct,
  }) => {
    const [product, setProduct] = useState<Product>(
      initialProduct || {
        name: '',
        description: '',
        price: 0,
        available: true,
      }
    );

    const isEditing = !!initialProduct;

    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para almacenar el archivo de imagen

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setSelectedFile(file);
    };

    const handleSubmit = async () => {
      // Verifica si los campos obligatorios están completos
      if (!product.name || !product.description || product.price <= 0) {
        alert(
          'Todos los campos son obligatorios y el precio debe ser mayor que 0.'
        );
        return;
      }

      try {
        // Si hay un archivo seleccionado, usamos FormData
        if (selectedFile) {
          const formData = new FormData();
          formData.append('name', product.name);
          formData.append('description', product.description);
          formData.append('price', product.price.toString());
          formData.append('available', product.available.toString());
          formData.append('file', selectedFile); // Solo si hay archivo

          if (isEditing && product._id) {
            // Si estamos editando y hay un archivo, usamos FormData
            await handleUpdateProduct(
              menuId,
              submenuName,
              sectionName,
              product._id,
              formData
            );
          } else {
            // Si es un nuevo producto y hay un archivo, usamos FormData
            await handleAddProductToSection(
              menuId,
              submenuName,
              sectionName,
              formData
            );
          }
        } else {
          // Si no hay archivo, usamos el objeto Product
          if (isEditing && product._id) {
            // Editar producto sin archivo
            await handleUpdateProduct(
              menuId,
              submenuName,
              sectionName,
              product._id,
              product
            );
          } else {
            // Agregar nuevo producto sin archivo
            await handleAddProductToSection(
              menuId,
              submenuName,
              sectionName,
              product
            );
          }
        }

        closeModal();
      } catch (error) {
        console.error('Error al agregar o actualizar producto:', error);
      }
    };

    return (
      <div>
        <h2 className="text-xl mb-4">
          {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <input
          type="text"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          placeholder="Nombre del Producto"
          className="p-2 border border-white/20 rounded mb-2 w-full bg-white/10 text-white placeholder-gray-300"
        />
        <input
          type="text"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Descripción del Producto"
          className="p-2 border border-white/20 rounded mb-2 w-full bg-white/10 text-white placeholder-gray-300"
        />
        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: parseFloat(e.target.value) })
          }
          placeholder="Precio del Producto"
          className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </div>
    );
  };

  // Nuevo componente para mostrar detalles del producto en el modal
  interface ProductModalContentProps {
    menuId: string;
    submenuName: string;
    sectionName: string;
    product: Product;
  }

  const ProductModalContent: React.FC<ProductModalContentProps> = ({
    menuId,
    submenuName,
    sectionName,
    product,
  }) => {
    return (
      <div>
        {/* Mostrar imagen del producto si existe */}
        {product.imageUrl && (
          <Image
            width={600}
            height={600}
            src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
            alt={product.name}
            className="w-full object-cover rounded-[15px] mb-4"
          />
        )}
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="mb-2">{product.description}</p>
        <p className="mb-4 font-bold">${product.price.toLocaleString('es-CL')}</p>
        <div className="flex justify-around">
          <button
            onClick={() => {
              closeModal();
              openModal(
                <ProductForm
                  menuId={menuId}
                  submenuName={submenuName}
                  sectionName={sectionName}
                  initialProduct={product}
                />
              );
            }}
            className={editButtonClass}
          >
            <FaEdit className="mr-2" /> Editar
          </button>
          <button
            onClick={() => {
              handleDeleteProduct(
                menuId,
                submenuName,
                sectionName,
                product._id!
              );
              closeModal();
            }}
            className={deleteButtonClass}
          >
            <FaTrash className="mr-2" /> Eliminar
          </button>
        </div>
      </div>
    );
  };

  // Clases para botones
  const baseButtonClass =
    'text-white px-2 py-1 rounded flex items-center opacity-80 hover:opacity-100';
  const addButtonClass = `${baseButtonClass}  opacity-80 hover:opacity-100`;
  const editButtonClass = `${baseButtonClass}  opacity-80 hover:opacity-100`;
  const deleteButtonClass = `${baseButtonClass}  opacity-80 hover:opacity-100`;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Menús</h1>

      {/* Selección del bar si es superadmin */}
      {isSuperadmin && (
        <div className="mb-8">
          <label className="block text-xl mb-2 text-white">
            Selecciona un Bar
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white/10 border border-white/20 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white/20 focus:border-white/50"
              value={selectedBar || ''}
              onChange={(e) => setSelectedBar(e.target.value)}
            >
              <option value="">Seleccionar Bar</option>
              {bars.map((bar) => (
                <option key={bar._id} value={bar._id}>
                  {bar.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                viewBox="0 0 20 20"
              >
                <path d="M10 12L6 8h8l-4 4z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Si no hay menús disponibles */}
      {menus.length === 0 ? (
        selectedBar ? (
          <div className="text-center">
            <p>No hay menús disponibles para este bar.</p>
            <button
              onClick={handleCreateMenu}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-4 rounded w-full flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Crear Menú
            </button>
          </div>
        ) : (
          <p className="text-center">
            Selecciona un bar para ver o crear su menú.
          </p>
        )
      ) : (
        menus.map((menu) => (
          <div
            key={menu._id}
            className=" "
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Menú del Bar:{' '}
              {typeof menu.barId === 'object' ? menu.barId.name : menu.barId}
            </h2>

            {/* Botón para agregar un nuevo submenú */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => openModal(<SubmenuForm menuId={menu._id} />)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" /> Agregar Submenú
              </button>
            </div>

            {/* Muestra los Submenús dentro del menú */}
            {menu.subMenus.map((submenu, submenuIndex) => {
              const key = `${submenuIndex}`;
              const isSubmenuOpen = openSubmenus[key];

              return (
                <div key={`${submenu.name}-${submenuIndex}`} className="mb-6">
                  <div
                    className="flex justify-between items-center p-4 rounded
                              bg-gradient-to-br from-white/10 to-transparent
                               border border-white/20 flex-wrap cursor-pointer"
                    onClick={() => toggleSubmenu(submenuIndex)}
                  >
                    <div className="flex items-center">
                      <h3 className="font-semibold text-xl mr-2">
                        {submenu.name}
                      </h3>
                      {isSubmenuOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    <div className="flex mt-2 md:mt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(
                            <SectionForm
                              menuId={menu._id}
                              submenuName={submenu.name}
                            />
                          );
                        }}
                        className={addButtonClass}
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(
                            <SubmenuForm
                              menuId={menu._id}
                              initialName={submenu.name}
                              oldSubmenuName={submenu.name}
                            />
                          );
                        }}
                        className={editButtonClass}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubmenu(menu._id, submenu.name);
                        }}
                        className={deleteButtonClass}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Muestra las Secciones dentro del submenú */}
                  {isSubmenuOpen &&
                    submenu.sections.map((section, sectionIndex) => {
                      const sectionKey = `${submenuIndex}-${sectionIndex}`;
                      const isOpen = openSections[sectionKey];

                      return (
                        <div key={sectionKey} className="ml-4 mt-4">
                          <div
                            className="flex justify-between items-center p-3 rounded
                                        bg-gradient-to-br from-white/10 to-transparent
                                         border border-white/20 flex-wrap cursor-pointer"
                            onClick={() =>
                              toggleSection(submenuIndex, sectionIndex)
                            }
                          >
                            <div className="flex items-center">
                              <h4 className="font-semibold text-lg mr-2">
                                {section.name}
                              </h4>
                              {isOpen ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </div>
                            <div className="flex mt-2 md:mt-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(
                                    <ProductForm
                                      menuId={menu._id}
                                      submenuName={submenu.name}
                                      sectionName={section.name}
                                    />
                                  );
                                }}
                                className={addButtonClass}
                              >
                                <FaPlus />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal(
                                    <SectionForm
                                      menuId={menu._id}
                                      submenuName={submenu.name}
                                      initialName={section.name}
                                      oldSectionName={section.name}
                                    />
                                  );
                                }}
                                className={editButtonClass}
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSection(
                                    menu._id,
                                    submenu.name,
                                    section.name
                                  );
                                }}
                                className={deleteButtonClass}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          {/* Mostrar u ocultar productos */}
                          {isOpen && (
                            <div
                              className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2"
                            >
                              {section.products.map((product, i) => (
                                <div
                                  key={`${product.name}-${i}`}
                                  className="p-2 rounded-[10px] bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex flex-col"
                                >
                                  <div
                                    className="cursor-pointer flex-grow"
                                    onClick={() =>
                                      openModal(
                                        <ProductModalContent
                                          menuId={menu._id}
                                          submenuName={submenu.name}
                                          sectionName={section.name}
                                          product={product}
                                        />
                                      )
                                    }
                                  >
                                    {/* Mostrar imagen del producto si existe */}
                                    {product.imageUrl && (
                                      <Image
                                      width={500}
                                      height={500}
                                        src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${product.imageUrl}`}
                                        alt={product.name}
                                        className="w-full max-h-20 object-cover rounded mb-2"
                                      />
                                    )}
                                    <h5 className=" mb-2 text-sm">
                                      {product.name}
                                    </h5>
                                  </div>
                                  {/* Switch de disponibilidad */}
                                  <div className="mt-2 flex items-center ">
                                    <label className="flex items-center cursor-pointer">
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          checked={product.available}
                                          className="sr-only"
                                          onChange={() =>
                                            handleToggleAvailability(
                                              menu._id,
                                              submenu.name,
                                              section.name,
                                              product
                                            )
                                          }
                                        />
                                        <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                                        <div
                                          className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
                                            product.available
                                              ? 'transform translate-x-full bg-green-500'
                                              : ''
                                          }`}
                                        ></div>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        ))
      )}

      {/* Componente Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default MenuPage;
