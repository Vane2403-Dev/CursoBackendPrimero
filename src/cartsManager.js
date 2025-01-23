import fs from 'fs/promises';
import __dirname from './utils.js';

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
    async createCart() {
        const carts = await this._getCarts();
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1, 
            productscarrito: []
        };
        carts.push(newCart);
        await this._saveCarts(carts);
        return newCart;no
    }
/// obtener carrito por id 
    async getCartById(cartId) {
        const carts = await this._getCarts();
        return carts.find(cart => cart.id === Number(cartId)) || null;
    }
//// agregar al carrito 
    async addProductToCart(cartId, productId) {
        const carts = await this._getCarts();
        const cart = carts.find(cart => cart.id === Number(cartId));
        if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

        const productIndex = cart.productscarrito.findIndex(product => product.product === Number(productId));
        if (productIndex !== -1) {
            cart.productscarrito[productIndex].quantity += 1; // Incrementa cantidad si ya existe
        } else {
            cart.productscarrito.push({ product: Number(productId), quantity: 1 }); // Agrega nuevo producto
        }
        await this._saveCarts(carts);
        return cart;
    }
}

export default CartManager;
