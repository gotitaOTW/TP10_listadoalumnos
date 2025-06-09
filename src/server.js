//queda aprender como interactuar con una base de datos.
//ya se construir una api ahora solo necesito q tenga una bd para pode pedirle cosas
import express from "express";
import cors from "cors";
import config from './configs/db-config.js'
import pkg from 'pg'

const {Client} = pkg;

const app = express();
const port = 9302;
app.use(cors());
app.use(express.json());

app.get('/api/alumnos', async (req,res)=>{
    const result= await Client.query("SELECT * FROM Alumnos");// <-- es por acá
    console.log(result);
    res.send(`hola ${req.params.nombre}`)
})

app.listen(port,()=>{
    console.log(`App escuchando en puerto ${port}`);
})
