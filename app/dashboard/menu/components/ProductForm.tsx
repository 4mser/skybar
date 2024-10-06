// ProductForm.tsx
import React, { useState } from 'react';
interface Product {
    _id?: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
  }
const ProductForm = ({
  menuId,
  submenuName,
  sectionName,
  initialProduct,
  handleAddProductToSection,
  handleUpdateProduct,
  closeModal,
}: {
  menuId: string;
  submenuName: string;
  sectionName: string;
  initialProduct?: Product;
  handleAddProductToSection: (
    menuId: string,
    submenuName: string,
    sectionName: string,
    product: Product
  ) => void;
  handleUpdateProduct: (
    menuId: string,
    submenuName: string,
    sectionName: string,
    productId: string,
    updatedProduct: Product
  ) => void;
  closeModal: () => void;
}) => {
  const [product, setProduct] = useState<Product>(
    initialProduct || { name: '', description: '', price: 0, available: true }
  );

  const isEditing = !!initialProduct;

  const handleSubmit = () => {
    if (isEditing && product._id) {
      handleUpdateProduct(menuId, submenuName, sectionName, product._id, product);
    } else {
      handleAddProductToSection(menuId, submenuName, sectionName, product);
    }
    closeModal();
  };

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
        onChange={(e) => setProduct({ ...product, description: e.target.value })}
        placeholder="Descripción del Producto"
        className="p-2 border border-white/20 rounded mb-2 w-full bg-white/10 text-white placeholder-gray-300"
      />
      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
        placeholder="Precio del Producto"
        className="p-2 border border-white/20 rounded mb-4 w-full bg-white/10 text-white placeholder-gray-300"
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

export default ProductForm;
