import { Router } from 'express';
import ProductsManager from '../services/productServices.js';



const router = Router();
const manager = new ProductsManager();

// Obtener todos los productos


// Rutas para las vistas
router.get('/page', async (req, res) => {
    let page= parseInt(req.query.page) || 1;
    let Limit=  parseInt(req.query.limit) || 4;
    try {
        const products = await manager.consultarProductosPaginados(page, Limit);
    // validacion de extremos en la plantilla de hbs

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
        console.error('Error al cargar la vista de productos en tiempo real:', error);
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
  
});



// Rutas para las operaciones CRUD

// Obtener un producto 
router.get('/', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('Products', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await manager.consultarProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado.');
        }
        res.json(producto);
    } catch (error) {
        res.status(500).send('Error al consultar el producto.');
    }
}); 

router.delete('/:id', async (req, res) => {
    try {
        await manager.eliminarProducto(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await manager.actualizarProducto(req.params.id, req.body);
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto.');
    }
});

router.post('/', async (req, res) => {
    try {
        const productoCreado = await manager.crearProducto(req.body);
        res.status(201).json(productoCreado);
    } catch (error) {
        res.status(500).send('Error al crear el producto.');
    }
});

export default router;

