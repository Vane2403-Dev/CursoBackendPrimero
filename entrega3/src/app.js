import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductsManager from './services/productServices.js';
import router from "./routes/router.js";
import mongoose from 'mongoose';

const app = express();
const PORT = 8080;
const manager = new ProductsManager();


/// conexion a base 

const connectMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products?retryWrites=true&w=majority');
        console.log("Conectado con exito a MongoDB usando Moongose.");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
};connectMongoDB();

///json middleware
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//Rutas
app.use("/", router);



// Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


// Inicializar Servidor HTTP
const server = http.createServer(app);
const io = new Server(server);

// Escuchar conexiones de clientes
io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    // Enviar productos actuales al cliente que se conecta
    socket.emit('productosActualizados', await manager.consultarProductos());

    // Escuchar nuevo producto
    socket.on('nuevoProducto', async (data) => {
        await manager.crearProducto(data);
        io.emit('productosActualizados', await manager.consultarProductos());
    });

    // Escuchar eliminación de producto
    socket.on('eliminarProducto', async (productId) => {
        await manager.eliminarProducto(productId);
        io.emit('productosActualizados', await manager.consultarProductos());
    });
a
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export { io };

