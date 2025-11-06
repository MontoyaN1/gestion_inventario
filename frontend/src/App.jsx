import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

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

  if (isAuthenticated) {
    return <Dashboard user={user} />;
  }

  return isLogin ? 
    <Login onToggleForm={() => setIsLogin(false)} /> : 
    <Register onToggleForm={() => setIsLogin(true)} />;
};

function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
}

export default App;