import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productRoutes from './routes/productRouter.js';
import ProductsManager from './services/productsManager.js';

const app = express();
const PORT = 8080;
const manager = new ProductsManager();

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productRoutes);

// Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Rutas para las vistas
app.get('/products', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('Products', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos.');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await manager.consultarProductos();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
});

// Inicializar Servidor HTTP
const server = http.createServer(app);
const io = new Server(server);

// Escuchar conexiones de clientes
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Enviar productos actuales al cliente que se conecta
    socket.emit('productosActualizados', await manager.consultarProductos());

    // Escuchar nuevo producto
    socket.on('nuevoProducto', async (productData) => {
        await manager.createProduct(productData);
        io.emit('productosActualizados', await manager.consultarProductos());
    });

    // Escuchar eliminación de producto
    socket.on('eliminarProducto', async (productId) => {
        await manager.eliminarProducto(productId);
        io.emit('productosActualizados', await manager.consultarProductos());
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { io };
