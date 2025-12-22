import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";

import UserEntity from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AWAITING, MAX_INSCRIPCIONES } from "../constants/inscripcion.constants.js";

const inscripcionRepo = AppDataSource.getRepository(InscripcionEntity);
const userRepository = AppDataSource.getRepository(UserEntity);
const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

const findUser = async (id) => {
  try {
    if (!id || isNaN(id)) {
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
    if (!id || isNaN(id)) {
      return null;
    }
    return await electivoRepo.findOne({where: {id_instancia: id}})
  } catch (error) {
    console.error(error);
    return null;
  }
}

const findCopy = async (userId, electivoId) => {
  try {
    if ((!userId || isNaN(userId)) || (!electivoId || isNaN(electivoId))) {
      return null;
    }

    return await inscripcionRepo.findOne({where: {user_id: userId, id_electivo: electivoId}});
  } catch (error) {
    console.error(error);
    return null;
  }
} 

const findCopyEdit = async (inscripcionId, userId, electivoId) => {
  const BASE_CASE = [];
  try {
    if ((!inscripcionId || isNaN(inscripcionId)) || (!userId || isNaN(userId)) || (!electivoId || isNaN(electivoId))) {
      return BASE_CASE;
    }
    let array = await inscripcionRepo.find({where: {user_id: userId, id_electivo: electivoId}});
    if (!array || !(array.filter)) {
      console.log("La consulta retornó algo que no tiene método filter()");
      return BASE_CASE;
    }
    array = array.filter((element) => {
      return element.id_inscripcion !== inscripcionId;
    });
    return array;
  } catch (error) {
    console.error(error);
    return BASE_CASE;
  }
}

const findInscripcionesByUser = async (userId) => {
  const BASE_CASE = [];
  try {
    if (isNaN(userId)) {
      return BASE_CASE;
    }
    return await inscripcionRepo.find({where: {id_usuario: userId}});
  } catch (error) {
    console.error(error);
    return [];
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
        return getServiceResult(false, [], "No hay inscripciones para mostrar", 0);
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
        return getServiceResult(false, [], "No hay inscripciones para mostrar", 0);
      }
      const inscripcionesFiltradas = await parsearInscripciones(inscripciones);

      return getServiceResult(false, inscripcionesFiltradas, "Inscripciones encontradas con exito", inscripciones.length);
    } catch (error) {
        console.error("Error al listar inscripciones:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar inscripciones", 0);
    }
}

export async function getInscripcionesByUserFromService(user_id) {
    const genericFailure = () => {
      return getServiceResult(false, [], "No hay inscripciones para mostrar", 0);
    };

    if (!user_id || isNaN(user_id)) {
      return genericFailure();
    }

    try {
      let inscripciones = await inscripcionRepo.find({where: {id_usuario: user_id}});
      if (!inscripciones || inscripciones.length <= 0) {
        return genericFailure();
      }
      const inscripcionesFiltradas = await parsearInscripciones(inscripciones);

      return getServiceResult(false, inscripcionesFiltradas, "Inscripciones encontradas con exito", inscripciones.length);
    } catch (error) {
        console.error("Error al listar inscripciones:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar inscripciones", 0);
    }
}

const checkForExistingData = async (userId, electivoId) => {
    const genericFailure = (message) => {
      return getServiceResult(false, null, String(message) || "Error desconocido", 0);
    }
    const user = await findUser(userId || null);
    if (!user) {
      return genericFailure("Usuario no encontrado");
    }
    const electivo = await findUser(electivoId || null);
    if (!electivo) {
      return genericFailure("Electivo no encontrado");
    }
    const copia = await findCopy(userId, electivoId);
    if (copia) {
      return getServiceResult(true, copia, "Ya existe la inscripción", 1);
    }
    const inscripciones = await findInscripcionesByUser(userId);
    if (inscripciones.length >= MAX_INSCRIPCIONES) {
      return getServiceResult(true, inscripciones, "Se ha superado el límite de inscripciones", inscripciones.length);
    }
    return null;
}

export async function createInscripcionFromService(data) {
  if (!data) {
    return getServiceResult(true, null, "Datos no proporcionados", 0);
  }

  try {
    const checkResult = await checkForExistingData(data.id_usuario, data.id_electivo);
    if (checkResult) {
      return checkResult;
    }
    const inscripcionNueva = inscripcionRepo.create(data);
    await inscripcionRepo.save(inscripcionNueva);
    return getServiceResult(false, inscripcionNueva, "Inscripción creada con éxito", 1);
  } catch (error) {
    console.error("Error al crear inscripcion:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al crear inscripción", 0);
  }  
}

export async function updateInscripcionFromService(id, data) {
  if (!data || !id || isNaN(id)) {
    return getServiceResult(true, null, "Datos no proporcionados", 0);
  }

  try {
    const checkResult = await findCopyEdit(id, data.user_id, data.id_electivo);
    if (checkResult.length > 0) {
      return getServiceResult(false, checkResult, "Ya existe esta inscripción", checkResult.length);
    }
    let inscripcionEditada = await inscripcionRepo.findOne({where: {id_inscripcion: id}});
    if (!inscripcionEditada) {
      return getServiceResult(false, null, "Inscripción no encontrada", 0);
    }
    inscripcionEditada = Object.assign(inscripcionEditada, data);
    await inscripcionRepo.save(inscripcionEditada);
    return getServiceResult(false, inscripcionEditada, "Inscripción editada con éxito", 1);
  } catch (error) {
    console.error("Error al editar inscripción:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al editar inscripciones", 0);
  }  
}

export async function deleteInscripcionFromService(id) {
  if (!id || isNaN(id)) {
    return getServiceResult(false, null, "Datos no proporcionados", 0);
  }

  try {
    const inscripcion = await inscripcionRepo.findOne({where: {id_inscripcion: id}});
    if (!inscripcion) {
      return getServiceResult(false, null, "Inscripción no encontrada", 0);
    }
    await inscripcionRepo.delete(inscripcion);
    return getServiceResult(false, inscripcion, "Inscripción eliminada con éxito", 1);
  } catch (error) {
    console.error("Error al eliminar inscripción");
    return getServiceResult(true, null, error.message ? error.message : "Error al eliminar inscripción", 0);
  }
}

export async function public_deleteInscripcionFromService(id, userId) {
  try {
    const result = await checkIfUserMadeInscripcion(userId, id);
    if (result) {
      return await deleteInscripcionFromService(id);
    }
    return getServiceResult(false, null, "Acceso denegado", 0);
  } catch (error) {
    return getServiceResult(true, null, error.message ? error.message : "Error al eliminar inscripción", 0);
  }
}

export async function public_updateInscripcionFromService(id, userId, data) {
  try {
    const result = await checkIfUserMadeInscripcion(userId, id);
    if (result) {
      return await updateInscripcionFromService(id, data);
    }
    return getServiceResult(false, null, "Acceso denegado", 0);
  } catch (error) {
    return getServiceResult(true, null, error.message ? error.message : "Error al eliminar inscripción", 0);
  }
}

const checkIfUserMadeInscripcion = async (userId, inscripcionId) => {
  const NOT_FOUND = Error("Inscripción no encontrada");
  try {
    if (!userId || !inscripcionId || isNaN(userId) || isNaN(inscripcionId)) {
      throw Error("Datos no proporcionados");
    }
    const inscripcion = await inscripcionRepo.findOne({where: {id_inscripcion: inscripcionId}});
    if (!inscripcion) {
      throw NOT_FOUND;
    }
    if (inscripcion.id_usuario === userId) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al encontrar inscripción: ", error.message ? error.message : "Mensaje desconocido", error);
    throw NOT_FOUND;
  }
}

export async function getInscripcionFromService(id, userId, checksEnabled) {
  try {
    console.log("id: " + id);
    console.log("userId: " + userId);
    console.log("checksEnabled: " + checksEnabled);
    if (id === undefined || userId === undefined || checksEnabled === undefined) {
      throw Error("Dato no proporcionado");
    }
    const inscripcion = await inscripcionRepo.findOne({where: {id_inscripcion: id}});
    if (!inscripcion) {
      return getServiceResult(false, null, "Inscripción no encontrada", 0);
    }
    if (checksEnabled && (inscripcion.id_usuario !== userId)) {
      return getServiceResult(false, null, "Acceso denegado", 0);
    }
    return getServiceResult(false, inscripcion, "Inscripción encontrada con éxito", 1);
  } catch (error) {
    console.error("Error al encontrar inscripción: ", error.message ? error.message : "Mensaje desconocido", error);
    return getServiceResult(true, null, "Error interno del servidor", 0);
  }
}