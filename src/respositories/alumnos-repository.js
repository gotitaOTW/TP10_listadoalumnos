import config from 'src/configs/db-config.js'
import pkg from 'pg';
const {Client,Pool}=pkg;

export default class AlumnoRepository{
    constructor() {
        console.log('Ejecutando en postgre');
    }

    async getAll() {
        const sql = "SELECT * FROM Alumnos";
        const result = await this.client.query(sql);
        return result.rows;
      }
    
      async getById(id) {
        const sql = "SELECT * FROM Alumnos WHERE id = $1";
        const values = [id];
        const result = await this.client.query(sql, values);
        return result.rows.length > 0 ? result.rows[0] : null;
      }
    
      async create({ nombre, apellido, id_curso, fecha_nacimiento, hace_deportes }) {
        const sql = `INSERT INTO Alumnos 
          (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes)
          VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes];
        const result = await this.client.query(sql, values);
        return result.rows[0];
      }
    
      async update(id, { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes }) {
        const sql = `UPDATE Alumnos SET
          nombre = $1,
          apellido = $2,
          id_curso = $3,
          fecha_nacimiento = $4,
          hace_deportes = $5
          WHERE id = $6 RETURNING *`;
        const values = [nombre, apellido, id_curso, fecha_nacimiento, hace_deportes, id];
        const result = await this.client.query(sql, values);
        return result.rows.length > 0 ? result.rows[0] : null;
      }
    
      async delete(id) {
        const sql = "DELETE FROM Alumnos WHERE id = $1 RETURNING *";
        const values = [id];
        const result = await this.client.query(sql, values);
        return result.rows.length > 0;
      }
    }