import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";
import { electivoExists, formatMessage, userExists } from "./utils/utils.inscription.service.js";
import { inscripcionAlreadyExists as IAE_helper } from "./utils/utils.inscription.service.js";
// import UserEntity from "../entity/user.entity.js";
// import ElectivoEntity from "../entity/electivo.entity.js";
// import { AWAITING, MAX_INSCRIPCIONES } from "../constants/inscripcion.constants.js";

const inscripcionRepo = AppDataSource.getRepository(InscripcionEntity);
// const userRepository = AppDataSource.getRepository(UserEntity);
// const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

export const isInvalidInscripcion = async (inscripcion) => {
  return !(await electivoExists(inscripcion.id_electivo)) || !(await userExists(inscripcion.id_usuario));
}

const cleanUpInscripcionArray = async (array) => {
  if (!Array.isArray(array)) {
    return [];
  }

  let current = null;
  for (let i = 0; i < array.length; i++) {
    current = array[i];
    if (await isInvalidInscripcion(current)) {
      array[i] = undefined;
    }
  }
  array = array.filter((inscripcion) => {
    return inscripcion !== undefined;
  });

  return array;
}

export async function getInscripciones() {
  const dynamicMessage = (inscripciones) => {
    return (inscripciones.length <= 0) ? "No hay inscripciones para mostrar" : "¡Inscripciones encontradas!";
  }

  const BASE_CASE = [];

  try {
    let inscripciones = await inscripcionRepo.find();
    if (!inscripciones) {
      return formatMessage(BASE_CASE, dynamicMessage(BASE_CASE));
    }
    inscripciones = await cleanUpInscripcionArray(inscripciones);
    return formatMessage(inscripciones, dynamicMessage(inscripciones));
  } catch (error) {
    console.error(error);
    return formatMessage(BASE_CASE, dynamicMessage(BASE_CASE));
  }
}

export async function getInscripcion(id) {
  const dynamicMessage = (inscripcion) => {
    return inscripcion ? "¡Inscripcion encontrada!" : "Inscripción no encontrada";
  }

  try {
    const inscripcion = await inscripcionRepo.findOne({where: {id_inscripcion: id}});
    return formatMessage(inscripcion, dynamicMessage(inscripcion));
  } catch (error) {
    console.error(error);
    return formatMessage(null, dynamicMessage(null));
  }
}

export async function createInscripcion(data) {
  const dynamicMessage = (inscripcion) => {
    return inscripcion ? "¡Inscripcion creada!" : "No se pudo crear la inscripción";
  }

  try {
    let nuevaInscripcion = inscripcionRepo.create(data);
    nuevaInscripcion = await inscripcionRepo.save(nuevaInscripcion);
    // console.log(JSON.stringify(nuevaInscripcion));
    return formatMessage(nuevaInscripcion, dynamicMessage(nuevaInscripcion));
  } catch (error) {
    console.error(error);
    return null;
  }
}

const throwErrorIfFailedUpdate = (inscripcionEditada) => {
  if (!inscripcionEditada.affected || (inscripcionEditada.affected !== 1)) {
    throw new Error(`Se afectaron ${inscripcionEditada.affected} inscripciones`);
  }
}

export async function updateInscripcion(data, inscripcion, inscripcionAntigua) {
  const dynamicMessage = (inscripcion) => {
    return inscripcion ? "¡Inscripcion editada!" : "No se pudo editar la inscripción";
  }
 
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    let inscripcionEditada = await inscripcionRepo.update(inscripcion, data);
    throwErrorIfFailedUpdate(inscripcionEditada);

    return formatMessage(inscripcionEditada, dynamicMessage(inscripcionEditada));
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return formatMessage(null, dynamicMessage(null));;
  }
}

export async function deleteInscripcion(inscripcion) {
  const dynamicMessage = (inscripcion) => {
    return inscripcion ? "¡Inscripcion eliminada!" : "No se pudo eliminar la inscripción";
  }

  const queryRunner = AppDataSource.createQueryRunner();
  try {
    queryRunner.startTransaction();

    const inscripcionBorrada = await inscripcionRepo.delete({id_inscripcion: inscripcion.id_inscripcion});
    
    if (inscripcionBorrada.affected && (inscripcionBorrada.affected === 1)) {
      queryRunner.commitTransaction();
      return formatMessage(inscripcion, dynamicMessage(inscripcion));
    }

    queryRunner.rollbackTransaction();
    return formatMessage(null, dynamicMessage(null));
  } catch (error) {
    queryRunner.rollbackTransaction();
    console.error(error);
    return formatMessage(null, dynamicMessage(null));
  }
}

export async function inscripcionAlreadyExists(id_inscripcion, id_usuario, id_electivo) {
  return await IAE_helper(id_inscripcion, id_usuario, id_electivo);
}