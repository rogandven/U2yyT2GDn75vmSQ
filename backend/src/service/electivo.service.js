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
          current = await countInscripcionesAprobadas(resultados.id);
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

export async function updateElectivoFromService(id_instancia, data, carrera, user_role, careerString, electivo) {
  if (!careerString) {
    throw new Error("Función mal llamada");
  }
  
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

export async function changeElectivoEstadoFromService(id_instancia, nuevo_estado, user_career, user_role) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });

    if (!electivo) {
      return getServiceResult(false, null, "Electivo no encontrado", 0);
    }
    if (electivo.estado === nuevo_estado) {
      return getServiceResult(false, null, `Electivo ya ${nuevo_estado}`, 0);
    }
    const array = breakDownCarreraArray(electivo.carreras);
    if ((user_role !== ADMIN_ROLE) && (!(array.includes(String(user_career))))) {
      return getServiceResult(false, null, "No pertenece a la carrera del electivo", 0);
    }

    Object.assign(electivo, { estado: nuevo_estado });
    await electivoRepo.save(electivo);

    const creador = (await RAW_getUserById(electivo.id_profesor))?.email;
    sendMail(creador, "Rechazo", `Su electivo ${String(electivo.nombre).toUpperCase()} ha sido rechazado.`);

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

    if ((user_role !== ADMIN_ROLE) && (!(String(electivo.carreras).split(",").includes(String(user_career))))) {
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