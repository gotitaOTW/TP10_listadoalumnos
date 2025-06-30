import AlumnosRepository from '../repositories/alumnos-repository.js';

export default class AlumnosService {
  constructor() {
    this.repo = new AlumnosRepository();
  }

  validarAlumno(entity) {
    if (!entity.nombre || entity.nombre.length < 3) {
      return 'Nombre inválido (mínimo 3 letras)';
    }
    if (!entity.apellido || entity.apellido.length < 2) {
      return 'Apellido inválido (mínimo 2 letras)';
    }
    if (entity.id_curso == null || isNaN(Number(entity.id_curso))) {
      return 'ID de curso inválido (debe ser un número)';
    }
    if (!entity.fecha_nacimiento || isNaN(new Date(entity.fecha_nacimiento).getTime())) {
      return 'Fecha de nacimiento inválida (formato incorrecto)';
    }
    if (entity.hace_deportes !== '0' && entity.hace_deportes !== '1') {
      return 'Debe indicar si hace deportes con 0 o 1';
    }
    return null;
  }

  async getAllAsync() {
    return await this.repo.getAllAsync();
  }

  async getByIdAsync(id) {
    if (isNaN(id)) throw new Error('ID no numérico');
    return await this.repo.getByIdAsync(id);
  }

  async createAsync(entity) {
    const error = this.validarAlumno(entity);
    if (error) throw new Error(error);
    return await this.repo.createAsync(entity);
  }

  async updateAsync(entity) {
    if (isNaN(entity.id)) throw new Error('ID no numérico');
    const error = this.validarAlumno(entity);
    if (error) throw new Error(error);
    return await this.repo.updateAsync(entity);
  }

  async deleteByIdAsync(id) {
    if (isNaN(id)) throw new Error('ID no numérico');
    return await this.repo.deleteByIdAsync(id);
  }
}
