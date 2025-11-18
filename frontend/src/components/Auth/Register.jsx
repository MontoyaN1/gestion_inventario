import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('Por favor, completa los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>👤 Crear Cuenta</h2>
          
          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              required
              disabled={loading}
            />
          </div>

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
              placeholder="Crea una contraseña segura"
              required
              disabled={loading}
            />
          </div>

          

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? '🔄 Creando cuenta...' : '✅ Registrarse'}
          </button>

          <p className="toggle-form">
            ¿Ya tienes cuenta? 
            <span onClick={onToggleForm} className="toggle-link">
              Inicia sesión aquí
            </span>
          </p>
        </form>
      </div>
      
      <div className="auth-background">
        <div className="background-content">
          <h1>Únete a nosotros</h1>
          <p>Comienza a gestionar tu negocio de forma profesional hoy mismo</p>
          <div style={{marginTop: '2rem', fontSize: '4rem'}}>🚀</div>
        </div>
      </div>
    </div>
  );
};

export default Register;