import { useState } from 'react';
import { useMovimiento } from '../../context/MovimientoConstext';
import { useProduct } from '../../context/ProductoContext';
import { useAuth } from '../../context/AuthContext';
import './ClienteDashboard.css'

const ClientDashboard = ({ user }) => {
  const { logout } = useAuth();
  const { products, updateProductStock } = useProduct();
  const { createMovimiento, loading } = useMovimiento();
  const [quantities, setQuantities] = useState({}); // ✅ Declarar quantities como estado

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

  const getStockStatus = (product) => {
    if (product.stock_actual === 0) {
      return { status: 'agotado', label: 'Agotado', class: 'stock-out' };
    } else if (product.stock_actual <= product.stock_minimo) {
      return { status: 'bajo', label: 'Stock Bajo', class: 'stock-low' };
    } else {
      return { status: 'normal', label: 'En Stock', class: 'stock-normal' };
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity)
    }));
  };

  const handleBuy = async (product) => {
    const quantity = quantities[product.id_producto] || 1; // ✅ Usar quantity de quantities

    try {
      await createMovimiento({
        id_producto: product.id_producto,
        id_usuario: user.id_usuario,
        cantidad: quantity,
        tipo: 'venta',
        forma_pago: 'efectivo',
        direccion: ''
      });

      alert('¡Compra realizada exitosamente!');
      // Limpiar la cantidad para este producto después de comprar
      setQuantities(prev => ({
        ...prev,
        [product.id_producto]: 1
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Agregar console.log para debug
  console.log('🔍 ClientDashboard Debug:', {
    user,
    productsCount: products?.length,
    products: products,
    quantities
  });

  if (!products) {
    return (
      <div className="client-dashboard">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      <div className="client-header">
        <h1>Catálogo de Productos</h1>
        <p>Bienvenido, {user?.username}</p>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="products-container">
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos disponibles</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => {
              const stockStatus = getStockStatus(product);
              const quantity = quantities[product.id_producto] || 1;

              return (
                <div key={product.id_producto} className="product-card">
                  <div className="product-image">
                    <img
                      src={getImageUrl(product.ruta_imagen)}
                      alt={product.nombre}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className={`stock-badge ${stockStatus.class}`}>
                      {stockStatus.label}
                    </div>
                  </div>

                  <div className="product-content">
                    <h3>{product.nombre}</h3>
                    {product.descripcion && (
                      <p className="product-description">{product.descripcion}</p>
                    )}
                    <p className="price">${parseFloat(product.precio).toFixed(2)}</p>
                    <p className="stock">Disponibles: {product.stock_actual}</p>

                    {product.stock_actual > 0 ? (
                      <div className="buy-section">
                        <input
                          type="number"
                          min="1"
                          max={product.stock_actual}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(
                            product.id_producto,
                            parseInt(e.target.value) || 1
                          )}
                          className="quantity-input"
                        />
                        <button
                          onClick={() => handleBuy(product)}
                          disabled={loading || quantity > product.stock_actual}
                          className="btn-buy"
                        >
                          {loading ? 'Procesando...' : 'Comprar'}
                        </button>
                      </div>
                    ) : (
                      <button disabled className="btn-out-of-stock">
                        Agotado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;