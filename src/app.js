import express from 'express'
import __dirname from './utils.js'
import hadlebars from 'express-handlebars'
import { Server } from 'socket.io'

const app = express();
const PORT =  8080

//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// configuracion handlebars
app.engine('handlebars', hadlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')


// Rutas prueba
app.use('/ping', (req, res) => {
    res.json({ message: 'Pong!' });
})

app.use('/', (req, res) => {
     res.render('index', {})
 })






const httpServer = app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
})