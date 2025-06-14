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
      res.status(200).send(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error en la consulta");
    }
})

app.delete('/api/alumnos/:id', async (req, res) => {
  let estado;
  let respuesta;

  try {
    const id = req.params.id;

    if (isNaN(id)) {
    estado = 400;
      respuesta = 'ID no numérico';
    } else 
    {
      const sql = 'DELETE FROM Alumnos WHERE id = $1';
      const result = await client.query(sql, [id]);

      if   (result.rowCount === 0) {
        estado = 404;
        respuesta = 'Alumno no encontrado';
      } else {
        estado = 200 ;
        respuesta= `Alumno con ID ${id} eliminado con éxito`;
      }
    }
  } catch (err) {
    console.error(err);
    estado = 500;
    respuesta = 'Error en la consulta';
  }

  res.status(estado).send(respuesta);
});


app.put('/api/alumnos/:id', async (req,res)=>{
  let estado;
  let respuesta;  
  try {
    const id=req.params.id;
    if(!isNaN(id)){
      const nombre=req.query.nombre;
      const apellido=req.query.apellido;
      const id_curso=req.query.id_curso;
      const fecha_nacimiento=req.query.fecha_nacimiento;
      const hace_deportes=req.query.hace_deportes;
      const error=validarAlumno(nombre, apellido, id_curso,fecha_nacimiento, hace_deportes);
      if(error==null){
        const sql=`UPDATE Alumnos SET
        nombre=$1,
        apellido=$2,
        id_curso=$3,
        fecha_nacimiento=$4,
        hace_deportes=$5
        WHERE id=$6`;
      const values=[nombre, apellido, id_curso, fecha_nacimiento, hace_deportes,id];
      const result = await client.query(sql,values);
      if(result.rowCount>0){
        estado=201;
        respuesta=`Alumno actualiado con éxito!`;
      }
      else{
        estado=404;
        respuesta=`Alumno no encontrado`;
      }
      }
      else{
        estado=400;
        respuesta=error;
      }
    }}
    catch (err) {
      console.error(err);
      estado=500;
        respuesta=`Error en la consulta`;
    }
    res.status(estado).send(respuesta);
})

function validarAlumno(nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) {
  let error = null;

  if (!nombre || nombre.length < 3) {
    error = 'Nombre inválido (mínimo 3 letras)';
  } else if (!apellido || apellido.length < 2) {
    error = 'Apellido inválido (mínimo 2 letras)';
  } else if (id_curso == null || isNaN(Number(id_curso))) {
    error = 'ID de curso inválido (debe ser un número)';
  } else if (!fecha_nacimiento || isNaN(new Date(fecha_nacimiento).getTime())) {
    error = 'Fecha de nacimiento inválida (formato incorrecto)';
  } else if (hace_deportes !== '0' && hace_deportes !== '1') {
    error = 'Debe indicar si hace deportes con 0 o 1';
  }
  return error;
}


app.post('/api/alumnos', async (req,res)=>{
  try {
    const nombre=req.query.nombre;
    const apellido=req.query.apellido;
    const id_curso=req.query.id_curso;
    const fecha_nacimiento=req.query.fecha_nacimiento;
    const hace_deportes=req.query.hace_deportes;
    const error=validarAlumno(nombre, apellido, id_curso,fecha_nacimiento, hace_deportes);
    if(error==null){
      let sql = `INSERT INTO Alumnos 
      (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
      VALUES ($1, $2, $3, $4, $5)`;
      const values=[nombre, apellido, id_curso, fecha_nacimiento, hace_deportes];
      const result = await client.query(sql);
      res.status(200).send(`${nombre} añadido con éxito!`);
    }
    else{
      res.status(400).send(error);
    }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error en la consulta");
    }
})

app.get('/api/alumnos/:id', async (req, res)=>{
  try {
    let estado;
    let respuesta;
    const id=req.params.id;
    if(!isNaN(id)){
      const sql="SELECT * FROM Alumnos WHERE id=$1";
      const values=[id];
      const result=await client.query(sql,values);
      if(result!=null){
        estado=200;
        respuesta=result.rows;
      }
      else{
        estado=404;
        respuesta='ID not found';
      }
    }
    else{
      estado=400;
      respuesta='ID no numérico';
    }
    } catch (error) {
      console.error(err);
      estado=500;
      respuesta='Error en la consulta';
    }
    res.status(estado).send(respuesta);
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
