const express = require('express');
require('dotenv').config();
const cors = require('cors');

const dbConnection = require('./database/config');


// Crear servidor de express
const app = express();

//Conexión a la base de datos
dbConnection();

//Cors
app.use(cors());

//Configuración del directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());


//Rutas
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));


//Escuchar peticiones 
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
});