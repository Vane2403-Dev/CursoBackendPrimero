
import { Router } from 'express'
import productsManager from '../productsManager.js'

const router = new Router()

// Crea una instancia de ProductsManager
const manager = new productsManager()

// Obtener todos los productos  - LISTAR
router.get('/', async (req, res) => {
    try {
        // Usar la instancia 'manager' para llamar a los métodos
        const productos = await manager.consultarProductos()  // Cambiado de productsManager a manager
        res.json(productos)
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener los productos' })
    }
})

// Crear todos los productos
router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body
        // Usar la instancia 'manager' para llamar a los métodos
        await manager.createProduct(nuevoProducto)  // Cambiado de productsManager a manager
        res.status(201).json({ message: 'Producto creado exitosamente' })
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' })
    }
})

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params // Obtener el id desde los parámetros de la URL

    try {
        // Usar la instancia 'manager' para llamar a los métodos
        const productos = await manager.consultarProductos()  // Cambiado de productsManager a manager
        const producto = productos.find(p => p.id == pid)

        if (producto) {
            res.json(producto)
        } else {
            res.status(404).json({ error: 'Producto no encontrado' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto por ID' })
    }
})

export default router
