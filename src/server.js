import { Express } from "express";
import cors from "cors";
import config from './configs/db-config.js'
import pkg from 'pg'

const {Client} = pkg;

const app=express();
const port = 9302;
app.use(cors());
app.use(express.json());

app.get('/api/alumnos', async (req,res)=>{

})

app.isten(port,()=>{
    console.log(`App escuchando en puerto ${port}`);
})
