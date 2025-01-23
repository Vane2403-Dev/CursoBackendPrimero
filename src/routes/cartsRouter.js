
import { Router } from 'express';
import CartsManager from '../cartsManager.js';

const router = Router();
const manager = new CartsManager();

// Ruta POST /: Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await manager.createCart();
        res.status(201).send({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Ruta GET /:cid: Obtener productos de un carrito específico
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await manager.getCartById(cartId);
        if (!cart) {
            return res.status(404).send({ error: `Carrito con ID ${cartId} no encontrado` });
        }
        res.send(cart.products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Ruta POST /:cid/product/:pid: Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await manager.addProductToCart(cartId, productId);
        res.send({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
