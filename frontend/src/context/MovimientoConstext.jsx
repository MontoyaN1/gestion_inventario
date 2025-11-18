import React, { createContext, useContext, useState } from 'react';
import { movimientoService } from '../services/movimientoService';
import { useProduct } from './ProductoContext';

const MovimientoContext = createContext();

export const useMovimiento = () => {
    const context = useContext(MovimientoContext);
    if (!context) {
        throw new Error('useMovimiento debe ser usado dentro de un MovimientoProvider');
    }
    return context;
};

export const MovimientoProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { updateProductStock } = useProduct();

    // Crear movimiento (venta)
    const createMovimiento = async (movimientoData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await movimientoService.createMovimiento(movimientoData);

            if (data.producto_actualizado) {
                updateProductStock(
                    movimientoData.id_producto,
                    data.producto_actualizado.stock_actual
                );
            }
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Limpiar errores
    const clearError = () => {
        setError(null);
    };

    const value = {
        loading,
        error,
        createMovimiento,
        clearError
    };

    return (
        <MovimientoContext.Provider value={value}>
            {children}
        </MovimientoContext.Provider>
    );
};