/*
import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";
import { formatMessage } from "./utils/utils.inscription.service.js";
import { inscripcionAlreadyExists as IAE_helper } from "./utils/utils.inscription.service.js";
import sendMail from "../services/email.service.js";
import { RAW_getUserById } from "./user.service.js";
import { RAW_getElectivoById } from "./electivo.service.js";
import { STUDENT_ROLE } from "../constants/user.constants.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { parseUnixDate_ALT, parseUnixDate } from "../helpers/date.helper.js";
import { AWAITING } from "../constants/inscripcion.constants.js";
// import UserEntity from "../entity/user.entity.js";
// import ElectivoEntity from "../entity/electivo.entity.js";

const inscripcionRepo = AppDataSource.getRepository(InscripcionEntity);
// const userRepository = AppDataSource.getRepository(UserEntity);
// const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

export const isInvalidInscripcion = async (inscripcion, addtionalChecks, req, user_PARAM) => {
  let user = null;
  const electivo = await RAW_getElectivoById(inscripcion.id_electivo);
  if (!electivo) {
    return "Electivo no encontrado";
  }
  if (electivo.estado !== ESTADOS_VALIDOS.APROBADO) {
    return "El electivo no ha sido aprobado todavía";
  }
  if (user_PARAM) {
    user = user_PARAM;
  }
  user = await RAW_getUserById(inscripcion.id_usuario);
  if (!user) {
    return "Usuario no encontrado";
  }
  if (user.role !== STUDENT_ROLE){
    return `El usuario ${user.fullname || user.username || user.id} no es un estudiante.`;
  }
  if (!(String(electivo.carreras).split(",").includes(user.carrera))) {
    return `El usuario ${user.fullname || user.username || user.id} no pertenece a ninguna de las carreras requeridas`;
  }
  if (addtionalChecks) {
    const today = String(parseUnixDate_ALT(Date.now().toString()));
    if (today.localeCompare(electivo.cierre) > 0) {
      return "Ya se cerraron las inscripciones para este electivo";
    }
    if (today.localeCompare(electivo.apertura) > 0) {
      if (electivo.creditos_requeridos > req.user.creditos) {
        return "No cumple con los suficientes créditos para inscribir este electivo";
      }
      if (String(electivo.semestre_minimo).localeCompare(String(req.user.generacion)) < 0) {
        return "No pertenece a la generación establecida";
      }
      if (Number(electivo.creditos_requeridos) > Number(req.user.creditos)) {
        return "No posee los suficientes créditos para inscribir este electivo";
      }
    }
  }
  return null;
}

export const shallDisplayWarning = async (usuario_id, electivo_id) => {
  const electivo = await RAW_getElectivoById(electivo_id);
  if (!electivo) {
    return true;
  }
  const usuario = await RAW_getUserById(usuario_id);
  if (!usuario) {
    return true;
  }
  if (electivo.creditos_requeridos > req.user.creditos) {
    return true;
  }
  if (String(electivo.semestre_minimo).localeCompare(String(req.user.generacion)) < 0) {
    return true;
  }
  if (Number(electivo.creditos_requeridos) > Number(req.user.creditos)) {
    return true;
  }
  return false;
}

const cleanUpInscripcionArray = async (array, req) => {
  if (!Array.isArray(array)) {
    return [];
  }

  let current = null;
  for (let i = 0; i < array.length; i++) {
    current = array[i];
    if (await isInvalidInscripcion(current, false, req)) {
      array[i] = undefined;
    }
  }
  array = array.filter((inscripcion) => {
    return inscripcion !== undefined;
  });

  return array;
}

export async function getInscripciones(req) {
  const dynamicMessage = (inscripciones) => {
    return (inscripciones.length <= 0) ? "No hay inscripciones para mostrar" : "¡Inscripciones encontradas!";
  }

  const BASE_CASE = [];

  try {
    let inscripciones = await inscripcionRepo.find();
    if (!inscripciones) {
      return formatMessage(BASE_CASE, dynamicMessage(BASE_CASE));
    }
    inscripciones = await cleanUpInscripcionArray(inscripciones, req);
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

export async function updateInscripcion(data, inscripcion, inscripcionAntigua, creador) {
  const dynamicMessage = (inscripcion) => {
    return inscripcion ? "¡Inscripcion editada!" : "No se pudo editar la inscripción";
  }

  let sendEmail = (data?.estado !== AWAITING);

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    let inscripcionEditada = await inscripcionRepo.update(inscripcion, data);
    throwErrorIfFailedUpdate(inscripcionEditada);

    try {
      if (sendEmail) {
        const electivo = await RAW_getElectivoById(inscripcionAntigua.id_electivo);
        sendMail(creador?.email, String(data?.estado).toUpperCase(), `Su inscripción para ${String(electivo?.nombre).toUpperCase()} ha sido ${String(data?.estado).toUpperCase()}.`);
      }
    } catch (error) {
      console.error(error);
    }

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
}*/

"use strict";

import { AppDataSource } from "../config/configDb.js";
import { PreinscripcionEntity } from "../entity/preinscripcion.entity.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";

export async function crearPreinscripcionService(idElectivo, usuario) {
  try {
    const repo = AppDataSource.getRepository(PreinscripcionEntity);
    const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

    const electivo = await electivoRepo.findOneBy({ id_electivo: idElectivo });
    if (!electivo || electivo.estado !== "APROBADO") {
      return { error: true, details: "Electivo no disponible" };
    }

    const existe = await repo.findOne({
      where: {
        usuario: { id: usuario.id },
        electivo: { id_electivo: idElectivo },
      },
    });

    if (existe) {
      return { error: true, details: "Ya estás preinscrito" };
    }

    const pre = repo.create({
      usuario,
      electivo,
      estado: "PENDIENTE",
    });

    await repo.save(pre);

    return { error: false, details: "Preinscripción creada", data: pre };
  } catch (error) {
    return { error: true, details: "Error en preinscripción", errorData: error };
  }
}
