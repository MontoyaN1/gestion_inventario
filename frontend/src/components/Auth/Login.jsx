import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>🔐 Iniciar Sesión</h2>
          
          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '🔄 Iniciando sesión...' : '🚀 Iniciar Sesión'}
          </button>

          <p className="toggle-form">
            ¿No tienes cuenta? 
            <span onClick={onToggleForm} className="toggle-link">
              Regístrate aquí
            </span>
          </p>
        </form>
      </div>
      
      <div className="auth-background">
        <div className="background-content">
          <h1>Bienvenido de vuelta</h1>
          <p>Gestiona tu inventario de manera eficiente y profesional</p>
          <div style={{marginTop: '2rem', fontSize: '4rem'}}>📊</div>
        </div>
      </div>
    </div>
  );
};

export default Login;