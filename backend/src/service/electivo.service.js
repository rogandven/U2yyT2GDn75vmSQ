import { breakDownCarreraArray, getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import ElectivoEntity, { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { ADMIN_ROLE, CAREER_HEAD_ROLE } from "../constants/user.constants.js";
import { RAW_getUserById } from "./user.service.js";
import sendMail from "../services/email.service.js";
import { countInscripcionesAprobadas } from "./utils/utils.inscription.service.js";
import { shallBeAllowedToMakeChanges } from "./utils/utils.career.service.js";

const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

const processElectivoArray = async (resultados) => {
    let nombre_profesor = "JUANITO PÉREZ";
    let current = null;
    let inscritos = null;
    if (Array.isArray(resultados)) {
      for (let i = 0; i < resultados.length; i++) {
        try {
          current = await RAW_getUserById(resultados[i].id_profesor);
          nombre_profesor = String((current && current.fullname) || "JUANITO PÉREZ").toUpperCase();
          current = await countInscripcionesAprobadas(resultados[i].id);
          // console.log(current);
          inscritos = Number(current) || 0;
          Object.assign(resultados[i], {nombre_profesor: nombre_profesor, inscritos: inscritos});
        } catch (error) {
          console.log(error);
        }
      }
    }
    return resultados;
}

export async function getElectivosFromService(data) {
    try {
        let query = electivoRepo.createQueryBuilder("electivo");
        if (data.filtro) {
            query = query.andWhere(
                "(electivo.nombre ILIKE :filtro OR electivo.descripcion ILIKE :filtro)",
                { filtro: `%${data.filtro}%` }
            );
        }
        if (data.area) {
            query = query.andWhere("electivo.area ILIKE :area", { area });
        }
        if (data.apertura) {
            query = query.andWhere("DATE(electivo.apertura) = :apertura", {
                apertura,
            });
        }
        if (data.cierre) {
            query = query.andWhere("DATE(electivo.cierre) = :cierre", { cierre });
        }
        query = query.addOrderBy("electivo.nombre", "ASC");
        let resultados = await query.getMany();

        if (!Array.isArray(resultados)) {
            throw Error("No se pudieron parsear los electivos como arreglo");
        }
        resultados = await processElectivoArray(resultados);

        return getServiceResult(false, resultados, "Electivos obtenidos correctamente", resultados.length ? resultados.length : 0);
    } catch (error) {
        console.error("Error al listar electivos:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar electivos", 0);
    }
}

export async function getElectivosSinAprobarFromService() {
  try {
      let resultados = await electivoRepo.find({relations: {usuarios: true}});

      if (!Array.isArray(resultados)) {
          throw Error("No se pudieron parsear los electivos como arreglo");
      }

      resultados = resultados.filter((value) => {
        if (value && value.estado && value.estado !== ESTADOS_VALIDOS.APROBADO) {
          return true;
        }
        return false;
      })

      resultados = await processElectivoArray(resultados);
      return getServiceResult(false, resultados, "Electivos obtenidos correctamente", resultados.length ? resultados.length : 0);
  } catch (error) {
      console.error("Error al listar electivos:", error);
      return getServiceResult(true, null, error.message ? error.message : "Error al listar electivos", 0);
  }
}

export async function createElectivoFromService(data) {
  try {
    const nuevoElectivo = electivoRepo.create(data);
    await electivoRepo.save(nuevoElectivo);

    if (String(nuevoElectivo.apertura).localeCompare(String(nuevoElectivo.cierre)) > 0) {
      return getServiceResult(false, null, "La fecha de apertura debe ser menor a la fecha de cierre");
    }

    return getServiceResult(false, nuevoElectivo, "Electivo creado correctamente", 1);
  } catch (error) {
    console.error("Error al crear electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al crear electivo", 0);
  }
}

export async function getElectivoByIdFromService(id_instancia) {
try {
    const electivos = await electivoRepo.findOne({ where: { id: id_instancia }, relations: {usuarios: true} });

    if (!electivos) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    return getServiceResult(false, electivos, "Electivo encontrado", 1);
  } catch (error) {
    console.error("Error en electivo.controller.js -> getUserById(): ", error);
    return getServiceResult(true, null, error.message? error.message : "Error al encontrar electivo", 0);
  }
}

export async function updateElectivoFromService(id_instancia, data, electivo) {
  try {
    Object.assign(electivo, data);

    if (String(electivo.apertura).localeCompare(String(electivo.cierre)) > 0) {
      return getServiceResult(false, null, "La fecha de apertura debe ser menor a la fecha de cierre");
    }

    delete electivo.id;
    const result = await electivoRepo.update({id: id_instancia}, electivo);
    console.log(result);

    return getServiceResult(false, electivo, "Electivo actualizado correctamente", 1);
  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al actualizar electivo", 0);
  }
}

export async function changeElectivoEstadoFromService(id_instancia, nuevo_estado, user_id, user_career, user_role, plazo = null, motivo = null) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });

    if (!electivo) {
      return getServiceResult(false, null, "Electivo no encontrado", 0);
    }
    if (electivo.estado === nuevo_estado) {
      return getServiceResult(false, null, `Electivo ya ${nuevo_estado}`, 0);
    }
    const array = breakDownCarreraArray(electivo.carreras);
    // Normalize user_career: accept object with 'sigla' or 'nombre', or string
    let userCareerString = "";
    try {
      if (typeof user_career === 'string') {
        userCareerString = user_career;
      } else if (user_career && typeof user_career === 'object') {
        userCareerString = (user_career.sigla || user_career.nombre || user_career.id_carrera || "");
      } else {
        userCareerString = String(user_career || "");
      }
    } catch (e) {
      userCareerString = String(user_career || "");
    }
    const normalizedUserCareer = String(userCareerString || "").trim().toUpperCase();
    const careerMatch = array.some((c) => String(c || "").trim().toUpperCase() === normalizedUserCareer);
    if ((user_role !== ADMIN_ROLE) && (Number(user_id) !== Number(electivo.id_profesor)) && (!careerMatch)) {
      return getServiceResult(false, null, "No pertenece a la carrera del electivo", 0);
    }

    Object.assign(electivo, { estado: nuevo_estado });
    // If a motivo is provided (e.g. on rejection), store it
    if (motivo) {
      Object.assign(electivo, { motivo: String(motivo) });
    }
    // If approving, accept either a period string like '2026-1' or a numeric plazo (days)
    if (String(nuevo_estado) === String(ESTADOS_VALIDOS.APROBADO)) {
      const periodPattern = /^\d{4}-[12]$/; // e.g. 2026-1 or 2026-2
      if (plazo && typeof plazo === 'string' && periodPattern.test(plazo.trim())) {
        // store period as plazo_renovacion string
        Object.assign(electivo, { plazo_renovacion: String(plazo).trim() });
        // fecha_renovacion left null when using period semantics
        Object.assign(electivo, { fecha_renovacion: null });
      } else {
        // fallback: numeric days behavior (existing logic)
        if (plazo && !isNaN(Number(plazo)) && Number(plazo) > 0) {
          Object.assign(electivo, { plazo_renovacion: Number(plazo) });
        }
        const days = Number(electivo.plazo_renovacion) && Number(electivo.plazo_renovacion) > 0 ? Number(electivo.plazo_renovacion) : 30;
        try {
          const now = new Date();
          now.setDate(now.getDate() + days);
          // store as YYYY-MM-DD
          const isoDate = now.toISOString().split('T')[0];
          Object.assign(electivo, { fecha_renovacion: isoDate });
        } catch (e) {
          // ignore date set errors
        }
      }
    }
    await electivoRepo.save(electivo);

    const creador = (await RAW_getUserById(electivo.id_profesor))?.email;
    try {
      let subject = `Estado electivo: ${String(nuevo_estado).toUpperCase()}`;
      let text = `Su electivo ${String(electivo.nombre).toUpperCase()} ha cambiado de estado a ${String(nuevo_estado).toUpperCase()}.`;
      if (String(nuevo_estado) === String(ESTADOS_VALIDOS.RECHAZADO)) {
        subject = "Rechazo";
        const motivoText = motivo ? `\n\nMotivo: ${String(motivo)}` : "";
        text = `Su electivo ${String(electivo.nombre).toUpperCase()} ha sido rechazado.${motivoText}`;
      } else if (String(nuevo_estado) === String(ESTADOS_VALIDOS.APROBADO)) {
        subject = "Aprobación";
        const renovText = electivo.fecha_renovacion ? `\n\nPlazo de renovación hasta: ${String(electivo.fecha_renovacion)}` : "";
        text = `Su electivo ${String(electivo.nombre).toUpperCase()} ha sido aprobado.${renovText}`;
      }
      sendMail(creador, subject, text);
    } catch (error) {
      console.error('Error enviando correo de notificación de estado:', error);
    }

    return getServiceResult(false, electivo, `Electivo ${nuevo_estado} correctamente`, 1);
  } catch (error) {
    console.error(`Error al ${nuevo_estado} electivo:`, error);
    return getServiceResult(true, null, error.message ? error.message : `Error al ${nuevo_estado} electivo`, 0);
  }
}

export async function deleteElectivoFromService(id_instancia, user_id, user_role, user_career) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });

    if (!electivo) {
        return getServiceResult(true, null, "Electivo no encontrado", 0);
    }
    if ((user_role !== ADMIN_ROLE) && (user_career !== electivo.carreraIdCarrera)) {
      return getServiceResult(true, null, "No pertenece a la carrera del electivo", 0);
    }

    if ((electivo.id_profesor !== user_id) && user_role !== CAREER_HEAD_ROLE) {
      return getServiceResult(true, null, "No tiene permiso para borrar este electivo", 0);
    }

    await electivoRepo.remove(electivo);
    return getServiceResult(false, null, "Electivo eliminado correctamente", 0);
  } catch (error) {
    console.error("Error al eliminar electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al eliminar electivo", 0);
  }
}

export async function electivoExists(id_instancia) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia});
    if (!electivo) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error al encontrar electivo: ", error);
    return null;
  }
}

export async function RAW_getElectivoById(id) {
  try {
    const electivo = await electivoRepo.findOne({id: Number(id), where: {id: Number(id)}});
    if (!electivo) {
      throw new Error("Electivo no encontrado");
    }
    return electivo;
  } catch (error) {
    return null;
  }
}

export async function RAW_getAllApprovedElectivos() {
  const BASE_CASE = [];
  try {
    const electivos = await electivoRepo.find();
    if (!electivos) {
      return BASE_CASE;
    }
    return electivos;
  } catch (error) {
    return BASE_CASE;
  }
}

