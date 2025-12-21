import { AppDataSource } from '../config/configDb.js';
import Mensaje from '../entity/mensaje.entity.js';

export async function createMensaje(mensajeData) {
  const mensajeRepository = AppDataSource.getRepository(Mensaje);

  const nuevoMensaje = mensajeRepository.create({
    contenido: mensajeData.contenido,
    tipo_usuario: mensajeData.tipo_usuario,
    id_usuario: mensajeData.id_usuario,
    id_usuario2: mensajeData.id_usuario2,
    leido: false
  });

  await mensajeRepository.save(nuevoMensaje);
  return nuevoMensaje;
}

export async function getMensajesByUsuario2(id) {
  const mensajeRepository = AppDataSource.getRepository(Mensaje);
  return await mensajeRepository.find({
    where: { id_usuario2: id },
    order: { fecha_envio: 'ASC' }
  });
}
