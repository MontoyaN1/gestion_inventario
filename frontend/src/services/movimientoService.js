export const movimientoService = {
  // Crear movimiento (esto restará automáticamente del stock)
  async createMovimiento(movimientoData) {
    try {
      const response = await fetch(`/movimiento/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoData),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrar la venta');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};