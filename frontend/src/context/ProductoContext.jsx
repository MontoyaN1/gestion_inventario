import React, { createContext, useContext, useState, useEffect } from 'react';
import { productService } from '../services/productoService';

const ProductContext = createContext();

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct debe ser usado dentro de un ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todos los productos
    const getProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProducts();
            setProducts(data);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Obtener producto por ID
    const getProduct = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.getProduct(id);
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Crear producto
    const createProduct = async (productData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.createProduct(productData);
            // Recargar la lista de productos después de crear
            await getProducts();
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar producto
    const updateProduct = async (id, productData) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.updateProduct(id, productData);
            // Recargar la lista de productos después de actualizar
            await getProducts();
            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await productService.deleteProduct(id);
            // Recargar la lista de productos después de eliminar
            await getProducts();
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

    // Cargar productos al inicializar (opcional)
    useEffect(() => {
        getProducts();
    }, []);

    const updateProductStock = (productId, newStock) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id_producto === productId
                    ? { ...product, stock_actual: newStock }
                    : product
            )
        );
    };


    const value = {
        products,
        loading,
        error,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        clearError
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};