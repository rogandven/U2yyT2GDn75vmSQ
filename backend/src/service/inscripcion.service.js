import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";

import UserEntity from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AWAITING } from "../constants/inscripcion.constants.js";

const inscripcionRepo = AppDataSource.getRepository(InscripcionEntity);
const userRepository = AppDataSource.getRepository(UserEntity);
const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

const findUser = async (id) => {
  try {
    if (isNaN(id)) {
      return null;
    }
    return await userRepository.findOne({where: {id: id}})
  } catch (error) {
    console.error(error);
    return null;
  }
}

const findElectivo = async (id) => {
  try {
    if (isNaN(id)) {
      return null;
    }
    return await electivoRepo.findOne({where: {id_instancia: id}})
  } catch (error) {
    console.error(error);
    return null;
  }
}

const parsearInscripciones = async (inscripciones) => {
  let usuario = null;
  let electivo = null;
  let current = null;
  const inscripcionesFiltradas = [];

  for (let i = 0; i < inscripciones.length; i++) {
    current = inscripciones[i];
    usuario = await findUser(current.id_usuario);
    if (!usuario) { continue; }
    electivo = await findElectivo(current.id_electivo);
    if (!electivo) { continue; }

    current.id_usuario = undefined;
    current.id_electivo = undefined;
    current.usuario = usuario;
    current.electivo = electivo;

    inscripcionesFiltradas.push(current);
  }

  return inscripcionesFiltradas;
}

export async function getInscripcionesFromService() {
    try {
      let inscripciones = await inscripcionRepo.find();
      if (!inscripciones || inscripciones.length <= 0) {
        return getServiceResult(false, inscripcionesFiltradas, "No hay inscripciones para mostrar", 0);
      }
      const inscripcionesFiltradas = await parsearInscripciones(inscripciones);

      return getServiceResult(false, inscripcionesFiltradas, "Inscripciones encontradas con exito", inscripciones.length);
    } catch (error) {
        console.error("Error al listar inscripciones:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar inscripciones", 0);
    }
}

export async function getInscripcionesSinAprobarFromService() {
    try {
      let inscripciones = await inscripcionRepo.find({where: {estado: AWAITING}});
      if (!inscripciones || inscripciones.length <= 0) {
        return getServiceResult(false, inscripcionesFiltradas, "No hay inscripciones para mostrar", 0);
      }
      const inscripcionesFiltradas = await parsearInscripciones(inscripciones);

      return getServiceResult(false, inscripcionesFiltradas, "Inscripciones encontradas con exito", inscripciones.length);
    } catch (error) {
        console.error("Error al listar inscripciones:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar inscripciones", 0);
    }
}

// TODO CREATE UPDATE DELETE