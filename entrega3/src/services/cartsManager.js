import fs from 'fs/promises';
import __dirname from '../utils.js';



class CartManager {
    constructor() {
        this.filePath = `${__dirname}/db/carts.json`; // Ruta para el archivo de carritos
    }
/// funcion generica para obtener carrito
    async _getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }
/// funcion generica para guardar carrito 
    async _saveCarts(carts) {
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf8');
    }
/// crear
async createCart(products) {
    const carts = await this._getCarts();

    const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1, 
        productscarrito: products.map(product => ({
            product: product.productId, // Mantiene el ID como string
            quantity: product.quantity  // Usa la cantidad enviada por el cliente
        }))
    };

    carts.push(newCart);
    await this._saveCarts(carts);
    return newCart;
}

/// obtener carrito por id 
    async getCartById(cartId) {
        const carts = await this._getCarts();
        return carts.find(cart => cart.id === Number(cartId)) || null;
    }
//// agregar al carrito 
async addProductToCart(cartId, productId, quantity) {
    const carts = await this._getCarts();
    
    // Buscamos el carrito
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex === -1) {
        throw new Error(` Carrito con ID ${cartId} no encontrado.`);
    }

    const cart = carts[cartIndex];

    if (!cart.productscarrito) {
        cart.productscarrito = []; // Aseguramos que tenga la propiedad
    }

    const productIndex = cart.productscarrito.findIndex(p => p.product === productId);

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
        throw new Error(` La cantidad de '${productId}' debe ser un número mayor que 0.`);
    }

    if (productIndex !== -1) {
        // Si el producto ya existe, sumamos la cantidad
        cart.productscarrito[productIndex].quantity += quantityNumber;
    } else {
        // Si el producto no está, lo agregamos
        cart.productscarrito.push({ product: productId, quantity: quantityNumber });
    }

    // Guardamos la actualización
    carts[cartIndex] = cart;
    await this._saveCarts(carts);

    console.log(" Producto agregado correctamente:", cart);
    return cart;
}
}

export default CartManager;
