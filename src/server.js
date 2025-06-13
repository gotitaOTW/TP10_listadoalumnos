//queda aprender como interactuar con una base de datos.
//ya se construir una api ahora solo necesito q tenga una bd para pode pedirle cosas
import express from "express";
import cors from "cors";
import config from './configs/db-config.js'
import pkg from 'pg'
const {Client} = pkg;

const app = express();
const port = 9302;
const client = new Client(config);
console.log('client es:', client);
app.use(cors());
app.use(express.json());

app.get('/api/alumnos', async (req,res)=>{
    try {
        let sql = "SELECT * FROM Alumnos";
        const result = await client.query(sql);
        res.status(200).send(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).send("Error en la consulta");
      }
})
startServer();
async function startServer() {
    try {
      await client.connect();
      app.listen(port, () => {
        console.log(`App escuchando en puerto ${port}`);
      });
    } catch (err) {
      console.error("Error conectando a la base:", err);
    }
  }