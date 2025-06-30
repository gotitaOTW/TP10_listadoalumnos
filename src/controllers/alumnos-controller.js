import { Router } from 'express';
import AlumnosService from '../services/alumnos-service.js';

const router = Router();
const service = new AlumnosService();

router.get('/', async (req, res) => {
  try {
    const alumnos = await service.getAllAsync();
    res.status(200).json(alumnos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const alumno = await service.getByIdAsync(req.params.id);
    if (alumno) res.status(200).json(alumno);
    else res.status(404).send('Alumno no encontrado');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const newId = await service.createAsync(req.body);
    res.status(201).json({ id: newId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entity = { ...req.body, id: req.params.id };
    const rowsAffected = await service.updateAsync(entity);
    if (rowsAffected > 0) {
      res.status(200).send('Alumno actualizado con éxito');
    } else {
      res.status(404).send('Alumno no encontrado');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const rowsAffected = await service.deleteByIdAsync(req.params.id);
    if (rowsAffected > 0) {
      res.status(200).send(`Alumno con ID ${req.params.id} eliminado con éxito`);
    } else {
      res.status(404).send('Alumno no encontrado');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
