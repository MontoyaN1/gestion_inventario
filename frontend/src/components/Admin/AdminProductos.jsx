import React, { useState, useEffect } from 'react';
import { useProduct } from '../../context/ProductoContext';
import { useAuth } from '../../context/AuthContext';
import './AdminProducto.css';

const AdminProducts = () => {
  const { logout } = useAuth();
  const { products, loading, error, createProduct, updateProduct, deleteProduct, clearError } = useProduct();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock_actual: '',
    stock_minimo: '',
    categoria: '',
    imagen: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));
      setFormErrors(prev => ({ ...prev, imagen: '' })); // ✅ Limpiar error al seleccionar imagen

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio,
      stock_actual: product.stock_actual,
      stock_minimo: product.stock_minimo || 5,
      categoria: product.categoria || '',
      imagen: null
    });

    // Usar la función getImageUrl para el preview también
    setImagePreview(getImageUrl(product.ruta_imagen));
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validar campos requeridos
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!formData.precio || formData.precio <= 0) errors.precio = 'El precio debe ser mayor a 0';
    if (!formData.stock_actual || formData.stock_actual < 0) errors.stock_actual = 'El stock actual no puede ser negativo';
    if (!formData.stock_minimo || formData.stock_minimo < 1) errors.stock_minimo = 'El stock mínimo debe ser al menos 1';

    // ✅ Validar que haya imagen SOLO cuando se crea un nuevo producto
    if (!editingProduct && !formData.imagen) {
      errors.imagen = 'La imagen es obligatoria';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id_producto, formData);
      } else {
        await createProduct(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error guardando producto:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock_actual: '',
      stock_minimo: '5',
      categoria: '',
      imagen: null
    });
    setImagePreview(null);
    setEditingProduct(null);
    setFormErrors({});
    setShowForm(false);
    clearError();
  };
  const handleCancel = () => {
    resetForm();
  };

  const getImageUrl = (ruta_imagen) => {
    if (!ruta_imagen) return '/placeholder-image.jpg';


    return `/images/${ruta_imagen}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para determinar el estado del stock
  const getStockStatus = (product) => {
    if (product.stock_actual === 0) {
      return { status: 'agotado', label: 'Agotado', class: 'stock-out' };
    } else if (product.stock_actual <= product.stock_minimo) {
      return { status: 'bajo', label: 'Stock Bajo', class: 'stock-low' };
    } else {
      return { status: 'normal', label: 'En Stock', class: 'stock-normal' };
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-products">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <div className="header-content">
          <h1>Gestión de Productos prueba UTS</h1>
          <p className="header-subtitle">Administra el inventario de productos</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <span className="btn-icon">+</span>
          Nuevo Producto
        </button>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Cerrar Sesión
        </button>
      </div>

      {error && (
        <div className="error-message">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      {/* Formulario de Producto */}
      {showForm && (
        <div className="product-form-overlay">
          <div className="product-form">
            <div className="form-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={handleCancel} className="close-form">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={`image-upload-section ${formErrors.imagen ? 'has-error' : ''}`}>
                <div className="image-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <div className="image-placeholder">
                      <span className="placeholder-icon">📷</span>
                      <span>Imagen del producto</span>
                    </div>
                  )}
                </div>

                <label className="file-input-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <span className="file-input-button">
                    {formData.imagen ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                  </span>
                </label>

                {/* ✅ Mostrar error de imagen */}
                {formErrors.imagen && (
                  <div className="field-error">
                    ⚠️ {formErrors.imagen}
                  </div>
                )}
              </div>

              <div className={`form-group ${formErrors.nombre ? 'has-error' : ''}`}>
                <label>Nombre del Producto *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  placeholder="Ingresa el nombre del producto"
                />
                {formErrors.nombre && (
                  <div className="field-error">⚠️ {formErrors.nombre}</div>
                )}
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={loading}
                  placeholder="Describe el producto..."
                  className="description-textarea"
                />
              </div>

              <div className="form-row">
                <div className={`form-group ${formErrors.precio ? 'has-error' : ''}`}>
                  <label>Precio *</label>
                  <div className="input-with-symbol">
                    <span className="input-symbol">$</span>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      disabled={loading}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.precio && (
                    <div className="field-error">⚠️ {formErrors.precio}</div>
                  )}
                </div>

                <div className={`form-group ${formErrors.stock_actual ? 'has-error' : ''}`}>
                  <label>Stock Actual *</label>
                  <input
                    type="number"
                    name="stock_actual"
                    value={formData.stock_actual}
                    onChange={handleInputChange}
                    min="0"
                    required
                    disabled={loading}
                    placeholder="0"
                  />
                  {formErrors.stock_actual && (
                    <div className="field-error">⚠️ {formErrors.stock_actual}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${formErrors.stock_minimo ? 'has-error' : ''}`}>
                  <label>Stock Mínimo *</label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={formData.stock_minimo}
                    onChange={handleInputChange}
                    min="1"
                    required
                    disabled={loading}
                    placeholder="5"
                  />
                  {formErrors.stock_minimo && (
                    <div className="field-error">⚠️ {formErrors.stock_minimo}</div>
                  )}
                  <small className="input-help">
                    Se mostrará alerta cuando el stock esté por debajo de este valor
                  </small>
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="Ej: Electrónicos, Ropa, etc."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Guardando...
                    </>
                  ) : (
                    editingProduct ? 'Actualizar Producto' : 'Crear Producto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Productos */}
      <div className="products-container">
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>Comienza agregando tu primer producto al inventario</p>
            <button
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Crear Primer Producto
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => {
              const stockStatus = getStockStatus(product);
              return (
                <div key={product.id_producto} className="product-card">
                  <div className="product-image">
                    {product.ruta_imagen ? (
                      <img
                        src={getImageUrl(product.ruta_imagen)}
                        alt={product.nombre}
                        onError={(e) => {
                          console.error('❌ Error cargando imagen:', {
                            ruta_imagen: product.ruta_imagen,
                            url_intentada: getImageUrl(product.ruta_imagen),
                            producto: product.nombre
                          });
                          e.target.src = '/placeholder-image.jpg';
                        }}

                      />
                    ) : (
                      <div className="image-placeholder-card">
                        <span>📷</span>
                      </div>
                    )}
                    <div className={`stock-badge ${stockStatus.class}`}>
                      {stockStatus.label}
                    </div>
                  </div>

                  <div className="product-content">
                    <h3>{product.nombre}</h3>
                    {product.descripcion && (
                      <p className="product-description">{product.descripcion}</p>
                    )}

                    <div className="product-details">
                      <div className="detail-item">
                        <span className="detail-label">Precio:</span>
                        <span className="price">${parseFloat(product.precio).toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Stock Actual:</span>
                        <span className="stock">{product.stock_actual} unidades</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Stock Mínimo:</span>
                        <span className="stock-minimum">{product.stock_minimo} unidades</span>
                      </div>
                      {product.categoria && (
                        <div className="detail-item">
                          <span className="detail-label">Categoría:</span>
                          <span className="category">{product.categoria}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn-edit"
                      disabled={loading}
                    >
                      <span className="action-icon">✏️</span>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id_producto)}
                      className="btn-delete"
                      disabled={loading}
                    >
                      <span className="action-icon">🗑️</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {loading && products.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;