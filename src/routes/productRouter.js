import { Router } from 'express';
import ProductsManager from '../logica/productsManager';

const router = new Router();
const manager = new ProductsManager();

// Ruta raíz: Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await manager.consultarProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const productos = await manager.consultarProductos();
        const producto = productos.find(p => p.id === Number(pid));
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        await manager.createProduct(nuevoProducto);
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;
    try {
        await manager.actualizarProducto(pid, updatedData);
        res.json({ message: `Producto con ID ${pid} actualizado exitosamente` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await manager.eliminarProducto(pid);
        res.json({ message: `Producto con ID ${pid} eliminado exitosamente` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
