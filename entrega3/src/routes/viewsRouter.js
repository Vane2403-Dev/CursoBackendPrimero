
import { Router } from 'express';
import ProductsManager from '../services/productsManager.js';


const router = Router();

const manager = new ProductsManager();

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