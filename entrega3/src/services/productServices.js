import { Product} from "./models/product.js";


class ProductsServices {
    // Crear un nuevo producto en la base de datos
    async crearProducto(data) {
        try {
            // Validar campos requeridos
            const requiredFields = ['title', 'description', 'price', 'stock', 'category'];
            for (let field of requiredFields) {
                if (!data[field]) {
                    throw new Error(`El campo ${field} es requerido.`);
                }
            } 
            
            // Crear y guardar el producto en MongoDB   
            const newProduct = new Product(data);
            await newProduct.save();
            console.log("Producto creado con éxito:", newProduct);
            return newProduct;
        } catch (error) {   
            console.error("Error al crear producto:", error.message);
            throw error;
        }
    }

    // consultar todos los productos 
// Consultar todos los productos
async consultarProductos() {
    try {
        const products = await Product.find().lean();  // Convertimos a objetos JS con .lean()
        products.forEach(product => product._id = product._id.toString());
        console.log("Productos consultados con éxito:", products);
        return products;
    } catch (error) {
        console.error("Error al consultar productos:", error.message);
        throw error;
    }
}



    // Consultar todos los productos paginados
    async  consultarProductosPaginados(page, limit = 4) {
        try {
            const pages = page 
            const limits = limit 
            const products = await Product.paginate({}, { limit: limits, page: pages, lean: true });
        

            console.log("Productos consultados con éxito:", products);  // Devuelve la lista de productos y el objeto de paginación
            return products; // Devuelve todo el objeto de paginación
        } catch (error) {
            console.error("Error al consultar productos:", error.message);
            throw error;
        }
    }
   
    

    // Consultar un producto por ID
    async consultarProductoPorId(id) {
        try {
            const product = await Product.findById(id).lean()  ;
            if (!product) throw new Error(`Producto con ID ${id} no encontrado.`);
            console.log("Producto consultado con éxito:", product);
            return product;
        } catch (error) {
            console.error("Error al consultar producto:", error.message);
            throw error;
        }
    }       
    // Actualizar un producto
    async actualizarProducto(id, updatedData) {
            try {
                const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
                if (!product) throw new Error(`Producto con ID ${id} no encontrado.`);
                console.log("Producto actualizado con éxito:", product);
                return product;
            } catch (error) {
                console.error("Error al actualizar producto:", error.message);
                throw error;
            }
        }
        async eliminarProducto(productId) {
            try {
                const product = await Product.findByIdAndDelete(productId);
                if (!product) throw new Error(`Producto con ID ${productId} no encontrado.`);
                console.log("Producto eliminado con éxito:", product);
            } catch (error) {
                console.error("Error al eliminar producto:", error.message);
                throw error;
            }
        }
        
}

export default ProductsServices;

