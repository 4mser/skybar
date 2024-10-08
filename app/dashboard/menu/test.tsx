// page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit } from 'react-icons/fa';

// Interfaces
interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface MenuSection {
  _id?: string;
  name: string;
  products: Product[];
}

interface SubMenu {
  _id?: string;
  name: string;
  sections: MenuSection[];
}

interface Menu {
  _id: string;
  barId: string | { _id: string; name: string };
  subMenus: SubMenu[];
}

interface Bar {
  _id: string;
  name: string;
}

// Componente Modal personalizado con Glassmorphism
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div
        className="relative p-6 rounded-[10px] max-w-md w-full
            bg-gradient-to-br from-white/10 to-transparent
            backdrop-blur-md border border-white/20 text-white"
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

const MenuPage = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);

  // Estados para controlar los modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const router = useRouter();

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
  const handleCreateMenu = async () => {
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

  // Función para agregar un nuevo submenú
  const handleCreateSubmenu = (menuId: string, submenuName: string) => {
    const addSubmenu = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu`,
          { name: submenuName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al agregar submenú:', error);
      }
    };
    addSubmenu();
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
  const handleAddProductToSection = (
    menuId: string,
    submenuName: string,
    sectionName: string,
    product: Product
  ) => {
    const addProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedSubmenuName = encodeURIComponent(submenuName);
        const encodedSectionName = encodeURIComponent(sectionName);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product`,
          product,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al agregar producto:', error);
      }
    };
    addProduct();
  };

  // Función para actualizar un submenú
  const handleUpdateSubmenu = (
    menuId: string,
    oldSubmenuName: string,
    newSubmenuName: string
  ) => {
    const updateSubmenu = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedOldSubmenuName = encodeURIComponent(oldSubmenuName);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedOldSubmenuName}`,
          { newName: newSubmenuName },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al actualizar submenú:', error);
      }
    };
    updateSubmenu();
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
  const handleUpdateProduct = (
    menuId: string,
    submenuName: string,
    sectionName: string,
    productId: string,
    updatedProduct: Product
  ) => {
    const updateProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        const encodedSubmenuName = encodeURIComponent(submenuName);
        const encodedSectionName = encodeURIComponent(sectionName);

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API}/menus/${menuId}/submenu/${encodedSubmenuName}/section/${encodedSectionName}/product/${productId}`,
          updatedProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchMenus();
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    };
    updateProduct();
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
  

  // Componentes de formulario para modales
  const SubmenuForm = ({
    menuId,
    initialName = '',
    oldSubmenuName,
  }: {
    menuId: string;
    initialName?: string;
    oldSubmenuName?: string;
  }) => {
    const [submenuName, setSubmenuName] = useState<string>(initialName);

    const isEditing = !!oldSubmenuName;

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
        <button
          onClick={() => {
            if (isEditing && oldSubmenuName) {
              handleUpdateSubmenu(menuId, oldSubmenuName, submenuName);
            } else {
              handleCreateSubmenu(menuId, submenuName);
            }
            closeModal();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Submenú'}
        </button>
      </div>
    );
  };

  const SectionForm = ({
    menuId,
    submenuName,
    initialName = '',
    oldSectionName,
  }: {
    menuId: string;
    submenuName: string;
    initialName?: string;
    oldSectionName?: string;
  }) => {
    const [sectionName, setSectionName] = useState<string>(initialName);

    const isEditing = !!oldSectionName;

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
          onClick={() => {
            if (isEditing && oldSectionName) {
              handleUpdateSection(
                menuId,
                submenuName,
                oldSectionName,
                sectionName
              );
            } else {
              handleAddSectionToSubmenu(menuId, submenuName, sectionName);
            }
            closeModal();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Sección'}
        </button>
      </div>
    );
  };

  const ProductForm = ({
    menuId,
    submenuName,
    sectionName,
    initialProduct,
  }: {
    menuId: string;
    submenuName: string;
    sectionName: string;
    initialProduct?: Product;
  }) => {
    const [product, setProduct] = useState<Product>(
      initialProduct || {
        name: '',
        description: '',
        price: 0,
        available: true, // Agregamos 'available' al objeto por defecto
      }
    );
  
    const isEditing = !!initialProduct;
  
    return (
      <div>
        <h2 className="text-xl mb-4">
          {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
        <button
          onClick={() => {
            if (isEditing && product._id) {
              handleUpdateProduct(
                menuId,
                submenuName,
                sectionName,
                product._id,
                product
              );
            } else {
              handleAddProductToSection(
                menuId,
                submenuName,
                sectionName,
                product
              );
            }
            closeModal();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          {isEditing ? 'Guardar Cambios' : 'Agregar Producto'}
        </button>
      </div>
    );
  };
  

  return (
    <div className="p-6 max-w-5xl mx-auto text-white min-h-screen">
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
            className="mb-6 p-6 rounded-[10px]
                  bg-gradient-to-br from-white/10 to-transparent
                  backdrop-blur-md border border-white/20"
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
            {menu.subMenus.map((submenu, index) => (
              <div key={`${submenu.name}-${index}`} className="mb-6">
                <div
                  className="flex justify-between items-center p-4 rounded
                        bg-gradient-to-br from-white/10 to-transparent
                        backdrop-blur-md border border-white/20 flex-wrap"
                >
                  <h3 className="font-semibold text-xl">{submenu.name}</h3>
                  <div className="flex mt-2 md:mt-0">
                    <button
                      onClick={() =>
                        openModal(
                          <SectionForm
                            menuId={menu._id}
                            submenuName={submenu.name}
                          />
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mr-2 flex items-center"
                    >
                      <FaPlus />
                    </button>
                    <button
                      onClick={() =>
                        openModal(
                          <SubmenuForm
                            menuId={menu._id}
                            initialName={submenu.name}
                            oldSubmenuName={submenu.name}
                          />
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>

                {/* Muestra las Secciones dentro del submenú */}
                {submenu.sections.map((section, idx) => (
                  <div key={`${section.name}-${idx}`} className="ml-4 mt-4">
                    <div
                      className="flex justify-between items-center p-3 rounded
                            bg-gradient-to-br from-white/10 to-transparent
                            backdrop-blur-md border border-white/20 flex-wrap"
                    >
                      <h4 className="font-semibold text-lg">
                        {section.name}
                      </h4>
                      <div className="flex mt-2 md:mt-0">
                        <button
                          onClick={() =>
                            openModal(
                              <ProductForm
                                menuId={menu._id}
                                submenuName={submenu.name}
                                sectionName={section.name}
                              />
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mr-2 flex items-center"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() =>
                            openModal(
                              <SectionForm
                                menuId={menu._id}
                                submenuName={submenu.name}
                                initialName={section.name}
                                oldSectionName={section.name}
                              />
                            )
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>

                    {/* Muestra los Productos dentro de la sección */}
                    {section.products.map((product, i) => (
                      <div
                        key={`${product.name}-${i}`}
                        className="ml-4 mt-3 p-3 rounded flex justify-between items-center
                              bg-gradient-to-br from-white/10 to-transparent
                              backdrop-blur-md border border-white/20 flex-wrap"
                      >
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-300">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 md:mt-0">
                          <div className="text-right">
                            <p>${product.price.toFixed(2)}</p>
                          </div>
                          {/* Switch de disponibilidad */}
                          <div>
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
                          <button
                            onClick={() =>
                              openModal(
                                <ProductForm
                                  menuId={menu._id}
                                  submenuName={submenu.name}
                                  sectionName={section.name}
                                  initialProduct={product}
                                />
                              )
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mt-2 flex items-center justify-end"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
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