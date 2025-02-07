import fs from 'fs/promises';
import __dirname from './utils.js';

class ProductsManager {
    constructor() {
        this.filePath = `${__dirname}/db/productos.json`;
    }

    // Método para crear un producto
    async createProduct(data) {
        try {
            // Validar campos requeridos
            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'status'];
            for (let field of requiredFields) {
                if (data[field] === undefined) {
                    throw new Error(`El campo '${field}' es obligatorio`);
                }
            }

            // Leer archivo o inicializar arreglo vacío
            let productos = [];
            try {
                const result = await fs.readFile(this.filePath, 'utf8');
                productos = result ? JSON.parse(result) : [];
            } catch {
                console.log("Archivo no encontrado o vacío, inicializando un arreglo vacío");
            }

            // Generar un nuevo ID único
            const id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

            // Crear y guardar el nuevo producto
            const newProduct = { id, ...data };
            productos.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2), 'utf8');
            console.log("Producto agregado de forma exitosa");
        } catch (error) {
            console.error("Error al crear producto:", error.message);
            throw error;
        }
    }

    // Método para consultar productos
    async consultarProductos() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al consultar productos:", error.message);
            return [];
        }
    }

  // Método para actualizar un producto
async actualizarProducto(id, updatedData) {
    try {
        let productos = [];
        try {
            // Leer el archivo de productos
            const result = await fs.readFile(this.filePath, 'utf8');
            productos = result ? JSON.parse(result) : [];
        } catch {
            console.log("Archivo no encontrado o vacío, inicializando un arreglo vacío");
        }

        // Buscar el índice del producto a actualizar
        const productIndex = productos.findIndex(product => product.id === Number(id));
        if (productIndex === -1) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }

        // Mezclar las propiedades actuales del producto con las nuevas
        productos[productIndex] = {
            ...productos[productIndex], // Mantiene las propiedades existentes
            ...updatedData, // Sobrescribe solo las propiedades enviadas
        };

        // Escribir los datos actualizados en el archivo
        await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2), 'utf8');
        console.log(`Producto con ID ${id} actualizado exitosamente`);
    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        throw error;
    }
}

    // Método para eliminar un producto
    async eliminarProducto(id) {
        try {
            let productos = [];
            try {
                const result = await fs.readFile(this.filePath, 'utf8');
                productos = result ? JSON.parse(result) : [];
            } catch {
                console.log("Archivo no encontrado o vacío, inicializando un arreglo vacío");
            }

            const newProducts = productos.filter(product => product.id !== Number(id));
            if (newProducts.length === productos.length) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            await fs.writeFile(this.filePath, JSON.stringify(newProducts, null, 2), 'utf8');
            console.log(`Producto con ID ${id} eliminado exitosamente`);
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
            throw error;
        }
    }
}

export default ProductsManager;
