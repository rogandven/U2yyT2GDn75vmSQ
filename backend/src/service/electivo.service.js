import { getServiceResult } from "./utils/utils.service.js";
import { AppDataSource } from "../config/configDb.js";
import ElectivoEntity, { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { sendDeletionMail } from "../services/email.service.js";
import { RAW_getAllStudents } from "./user.service.js";

const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

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
        
        const resultados = await query.getMany();

        if (!Array.isArray(resultados)) {
            throw Error("No se pudieron parsear los electivos como arreglo");
        }

        return getServiceResult(false, resultados, "Electivos obtenidos correctamente", resultados.length ? resultados.length : 0);
    } catch (error) {
        console.error("Error al listar electivos:", error);
        return getServiceResult(true, null, error.message ? error.message : "Error al listar electivos", 0);
    }
}

export async function getElectivosSinAprobarFromService() {
  try {
      let resultados = await electivoRepo.find();

      if (!Array.isArray(resultados)) {
          throw Error("No se pudieron parsear los electivos como arreglo");
      }

      resultados = resultados.filter((value) => {
        if (value && value.estado && value.estado !== ESTADOS_VALIDOS.APROBADO) {
          return true;
        }
        return false;
      })

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
    return getServiceResult(false, nuevoElectivo, "Electivo creado correctamente", 1);
  } catch (error) {
    console.error("Error al crear electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al crear electivo", 0);
  }
}

export async function getElectivoByIdFromService(id_instancia) {
try {
    const electivos = await electivoRepo.findOne({ where: { id: id_instancia } });

    if (!electivos) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    return getServiceResult(false, electivos, "Electivo encontrado", 1);
  } catch (error) {
    console.error("Error en electivo.controller.js -> getUserById(): ", error);
    return getServiceResult(true, null, error.message? error.message : "Error al encontrar electivo", 0);
  }
}

export async function updateElectivoFromService(id_instancia, data) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });

    if (!electivo) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    Object.assign(electivo, data);
    await electivoRepo.save(electivo);

    return getServiceResult(false, electivo, "Electivo actualizado correctamente", 1);
  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al actualizar electivo", 0);
  }
}

export async function changeElectivoEstadoFromService(id_instancia, nuevo_estado) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });

    if (!electivo) {
      return getServiceResult(false, null, "Electivo no encontrado", 0);
    }
    if (electivo.estado === nuevo_estado) {
      return getServiceResult(false, null, `Electivo ya ${nuevo_estado}`, 0);
    }

    Object.assign(electivo, { estado: nuevo_estado });
    await electivoRepo.save(electivo);

    return getServiceResult(false, electivo, `Electivo ${nuevo_estado} correctamente`, 1);
  } catch (error) {
    console.error(`Error al ${nuevo_estado} electivo:`, error);
    return getServiceResult(true, null, error.message ? error.message : `Error al ${nuevo_estado} electivo`, 0);
  }
}

export async function deleteElectivoFromService(id_instancia) {
  try {
    const electivo = await electivoRepo.findOneBy({ id: id_instancia });
    let currentUserBatch = null;

    if (!electivo) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    await electivoRepo.remove(electivo);

    const carreras = String(electivo.carreras).split(",");
    console.log(carreras);

    for (let i = 0; i < carreras.length; i++) {
      try {
        currentUserBatch = await RAW_getAllStudents(String(carreras[i]).trim().toUpperCase());
        if (Array.isArray(currentUserBatch)) {
          for (let j = 0; j < currentUserBatch.length; j++) {
            sendDeletionMail(currentUserBatch[j].email, electivo, req.user);
          }
        }
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    sendDeletionMail()

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