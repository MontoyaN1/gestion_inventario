import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const formatRole = (role) => {
    const roles = {
      '1': 'Administrador',
      'Cliente': 'Cliente',
      'default': 'Usuario'
    };
    return roles[role] || roles.default;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏠 Panel de Control</h1>
          <div className="user-info">
            <span>
              👋 Bienvenido, <strong style={{color: '#3498db'}}>
                {user?.username || user?.email}
              </strong>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-icon">🎉</div>
          <h2>¡Hola, {user?.username || 'Usuario'}!</h2>
          <p>Has iniciado sesión correctamente en el sistema de gestión de inventarios.</p>
          
          <div className="user-details">
            <div className="detail-item">
              <strong>📧 Email:</strong>
              <span>{user?.email}</span>
            </div>
            <div className="detail-item">
              <strong>👤 Rol:</strong>
              <span>{formatRole(user?.rol_id)}</span>
            </div>
            <div className="detail-item">
              <strong>🆔 ID de usuario:</strong>
              <span>#{user?.id_usuario}</span>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <h3>📊 Resumen General</h3>
            <p>Próximamente podrás ver estadísticas y resúmenes de tu actividad</p>
          </div>
          <div className="stat-card">
            <h3>⚡ Acciones Rápidas</h3>
            <p>Gestiona productos, inventario y movimientos desde aquí</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;