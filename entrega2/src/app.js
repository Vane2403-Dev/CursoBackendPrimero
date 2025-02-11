import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js'
import productRoutes from './routes/productRouter.js';
import ProductsManager from './services/productsManager.js';

const app = express();
const PORT = 8080;
const manager = new ProductsManager();

app.use(express.json());
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productRoutes)



// configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

////Rutas para las vistas de handlebars 
app.get('/products', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('Products', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos en tiempo real');
    }
});
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos en tiempo real');
    }
});


// Servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Inicializar Socket.IO
const io = new Server(server);

// Escuchar conexiones de clientes
   
    io.on('connection', (socket) => {
        console.log('Cliente conectado');
    
 
    
        // Escuchar nuevo producto
        socket.on('nuevoProducto', async (productData) => {
             manager.createProduct(productData);
            io.emit('productosActualizados',  manager.consultarProductos());
        });
    
        // Escuchar eliminación de producto
        socket.on('eliminarProducto', async (productId) => {
            manager.eliminarProducto(productId);
            io.emit('productosActualizados',  manager.consultarProductos());
        });
    });

export { io };
