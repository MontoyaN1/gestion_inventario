

export const authService = {
  // Login
  async login(email, password) {
    try {
      const response = await fetch(`/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Importante para las cookies de sesión
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el login');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Registro
  async register(userData) {
    try {
      const response = await fetch(`/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const response = await fetch(`/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error en el logout');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};