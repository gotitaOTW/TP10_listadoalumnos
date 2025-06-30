import express from "express";
import cors from "cors";
import config from './configs/db-config.js'
import pkg from 'pg'
import AlumnosController from './controllers/alumnos-controller.js';
const {Client} = pkg;

const app = express();
const port = 9302;
const client = new Client(config);
console.log('client es:', client);
app.use(cors());
app.use(express.json());

app.use('/api/alumnos', AlumnosController);

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
