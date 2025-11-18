import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductoContext';
import { MovimientoProvider } from './context/MovimientoConstext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';
import AdminProductos from './components/Admin/AdminProductos';
import ClientDashboard from './components/Cliente/ClienteDashboard';

const AuthApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {

    if (user.rol_id == 1) {
      return <AdminProductos user={user} />

    } else if (user.rol_id == 2) {
      return <ClientDashboard user={user} />

    }

  }

  return isLogin ?
    <Login onToggleForm={() => setIsLogin(false)} /> :
    <Register onToggleForm={() => setIsLogin(true)} />;
};

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <MovimientoProvider>
          <AuthApp />
        </MovimientoProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;