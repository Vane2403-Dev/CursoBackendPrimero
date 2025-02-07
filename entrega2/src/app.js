import express from 'express'
import __dirname from './utils.js'
import hadlebars from 'express-handlebars'
import { Server } from 'socket.io'




const app = express()
const PORT =  8080

//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// configuracion handlebars
app.engine('handlebars', hadlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


// Datos iniciales
let products = [];

// Rutas
app.get('/products', (req, res) => {
    res.render('index', { products })
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
});

// Servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

// Configuración de WebSocket
const io = new Server(server);

io.on('connection', socket => {
    console.log('Usuario conectado')
    socket.emit('updateProducts', products)

    socket.on('addProduct', product => {
        products.push(product)
        io.emit('updateProducts', products)
    })

    socket.on('deleteProduct', id => {
        products = products.filter(product => product.id !== id)
        io.emit('updateProducts', products)
    })
})