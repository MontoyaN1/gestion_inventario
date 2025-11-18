export const productService = {
    // Crear producto con imagen
    async createProduct(productData) {
        try {
            const formData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key === 'imagen' && productData[key]) {
                    formData.append('imagen', productData[key]);
                } else {
                    formData.append(key, productData[key]);
                }
            });

            const response = await fetch(`/producto/crear`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear producto');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },


    async updateProduct(id, productData) {
        try {
            const formData = new FormData();

            // Solo agregar campos que tienen valor
            Object.keys(productData).forEach(key => {
                // Solo agregar la imagen si realmente hay un archivo nuevo
                if (key === 'imagen') {
                    if (productData[key] instanceof File) {
                        formData.append('imagen', productData[key]);
                    }
                    // Si no hay archivo nuevo, no agregamos nada para mantener la imagen actual
                } else {
                    // Para otros campos, siempre agregarlos
                    formData.append(key, productData[key]);
                }
            });

            const response = await fetch(`/producto/actualizar/${id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar producto');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async getProducts() {
        try {
            const response = await fetch(`/producto/listar`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al obtener productos');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async getProduct(id) {
        try {
            const response = await fetch(`/producto/buscar/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al obtener el producto');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await fetch(`/producto/eliminar/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar producto');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};