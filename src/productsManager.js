import fs from 'fs/promises'
import __dirname from './utils.js' 

class productsManager {
    constructor() {
        
        this.filePath = `${__dirname}/db/productos.json`
    }

    // Método para crear un producto
    async createProduct(data) {
        try {
            // Leer el archivo si existe, de lo contrario inicializar un arreglo vacío
            let productos = []
            try {
                const result = await fs.readFile(this.filePath, 'utf8')
                productos = result ? JSON.parse(result) : []
            } catch (error) {
                console.log("Archivo no encontrado o vacío, inicializando un arreglo vacío")
            }

            // Generar un nuevo ID
            const id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1

            // Añadir el ID al nuevo producto
            data.id = id

            // Agregar el nuevo producto al arreglo
            productos.push(data)

            // Guardar los datos actualizados en el archivo
            await fs.writeFile(this.filePath, JSON.stringify(productos, null, 2), 'utf8')
            console.log("Producto agregado de forma exitosa")
        } catch (error) {
            console.error("Error al crear producto:", error)
        }
    }

    // Método para consultar productos
    async consultarProductos() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            console.error(`Error al consultar productos: ${error}`)
            return []
        }
    }
}

export default productsManager
