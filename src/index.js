import express from 'express'
import __dirname from './utils.js'
import productRouter from './routes/productRouter.js'
import cartsRouter from './routes/cartsRouter.js'





/// expres y puerto

const app = express()
const PORT = 8080

// prepara la confiuguracion del servidor para trabajar con archivos JSON y urlencode
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))

//// Middleware a nivel de Application
app.use((req, res, next) => {
    console.log("Middleware - Application")
    console.log(`Request: ${req.method} ${req.url}`)
    next()
})

// Definimos el routers
app.use('/api/products', productRouter)

app.use('/api/carts', cartsRouter)



// la escucha del puerto de comunicacion
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})






