import { Router } from 'express';
import ProductsManager from '../services/productsManager.js';
import { io } from '../app.js'; 

const router = new Router();
const manager = new ProductsManager();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await manager.consultarProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por su ID
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

// Crear un nuevo producto y notificar a los clientes
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        await manager.createProduct(nuevoProducto);
        const productosActualizados = await manager.consultarProductos();
        
        io.emit('updateProducts', productosActualizados); 
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto por su ID y notificar a los clientes
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;
    try {
        await manager.actualizarProducto(pid, updatedData);
        const productosActualizados = await manager.consultarProductos();
        
        io.emit('updateProducts', productosActualizados); // Notificar actualización en tiempo real

        res.json({ message: `Producto con ID ${pid} actualizado exitosamente` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto por su ID y notificar a los clientes
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await manager.eliminarProducto(pid);
        const productosActualizados = await manager.consultarProductos();
        
        io.emit('updateProducts', productosActualizados); // Notificar actualización en tiempo real

        res.json({ message: `Producto con ID ${pid} eliminado exitosamente` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Rutas para las vistas
router.get('/products', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('Products', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos.');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
});

export default router;
