import { getServiceResult } from "./utils/utils.service.js";

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
      const resultados = await electivoRepo.find({where: {aprobado: false}});

      if (!Array.isArray(resultados)) {
          throw Error("No se pudieron parsear los electivos como arreglo");
      }

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
    const electivos = await ElectivoEntityRepository.findOne({ where: { id_instancia } });

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
    const electivo = await electivoRepo.findOneBy({ id_instancia });

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

export async function approveElectivoFromService(id_instancia) {
  try {
    const electivo = await electivoRepo.findOneBy({ id_instancia });

    if (!electivo) {
      return getServiceResult(false, null, "Electivo no encontrado", 0);
    }
    if (electivo.aprobado) {
      return getServiceResult(false, null, "Electivo ya aprobado", 0);
    }

    Object.assign(electivo, { aprobado: true });
    await electivoRepo.save(electivo);

    return getServiceResult(false, electivo, "Electivo aprobado correctamente", 1);
  } catch (error) {
    console.error("Error al aprobar electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al aprobar electivo", 0);
  }
}

export async function deleteElectivoFromService(id_instancia) {
  try {
    const electivo = await electivoRepo.findOneBy({ id_instancia });

    if (!electivo) {
        return getServiceResult(false, null, "Electivo no encontrado", 0);
    }

    await electivoRepo.remove(electivo);
    return getServiceResult(false, null, "Electivo eliminado correctamente", 0);
  } catch (error) {
    console.error("Error al eliminar electivo:", error);
    return getServiceResult(true, null, error.message ? error.message : "Error al eliminar electivo", 0);
  }
}