import { Router } from 'express';
import CartsManager from '../services/cartsManager.js';
import ProductsManager from '../services/productServices.js';






const router = Router();
const manager = new CartsManager();
const Product = new ProductsManager();

// Ruta POST /: Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        // Extraemos la lista de productos del body
        const { products } = req.body;

        // Validamos que `products` sea un array y tenga al menos un producto
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).send({ error: 'Debe enviar al menos un producto en un array.' });
        }

        // Validamos que cada producto tenga `productId` y `quantity`
        for (const product of products) {
            if (!product.productId || typeof product.productId !== 'string') {
                return res.status(400).send({ error: `El productId '${product.productId}' debe ser una cadena válida.` });
            }
            if (!product.quantity || typeof product.quantity !== 'number' || product.quantity <= 0) {
                return res.status(400).send({ error: `La cantidad de '${product.productId}' debe ser un número mayor que 0.` });
            }
        }

        // Llamamos a la función para crear el carrito
        const newCart = await manager.createCart(products);

        // Respondemos con el carrito creado
        res.status(201).send({ message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



// Ruta POST /:cid/product/:pid: Agregar un producto al carrito

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        console.log('Params:', req.params);/// debugging ver que llega 

        const cartId = Number(req.params.cid);
        const productId = req.params.pid;
        const  {quantity } = req.body;
        
 

        if (isNaN(cartId)) {
            return res.status(400).send({ error: 'El cartId debe ser un número válido' });
        }

        if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ error: `La cantidad de '${productId}' debe ser un número mayor que 0.` });
        }

        const updatedCart = await manager.addProductToCart(cartId, productId, quantity);
        res.send({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: error.message });
    }
});



router.get('/:cid', async (req, res) => {
    try {
        const cartId = Number(req.params.cid);

        // Verificar si cartIdNumber es un número válido
        if (isNaN(cartId)) {
            return res.status(400).send({ error: 'El cartId debe ser un número válido' });
        }

        const cart = await manager.getCartById(cartId);

        if (!cart) {
            return res.status(404).send({ error: `Carrito con ID ${cartId} no encontrado` });
        }
       //// res.json(cart);

        res.render('carts', { cart  });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router;
