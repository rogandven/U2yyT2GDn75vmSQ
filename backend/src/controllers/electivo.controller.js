/*
"use strict";

import {
  createValidation,
  dateCreationValidation,
  integrityValidation,
  updateValidation,
} from "../validations/electivo.validation.js";
import { getElectivosFromService, createElectivoFromService, getElectivoByIdFromService, updateElectivoFromService, deleteElectivoFromService, getElectivosSinAprobarFromService, changeElectivoEstadoFromService, RAW_getElectivoById, RAW_getAllApprovedElectivos } from "../service/electivo.service.js";
import { fullNameProcessor, getControllerResult_NEW, processCarrera } from "./utils/utils.controller.js";
import { getElectivosIntegrityValidation } from "../validations/electivo.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";
import { AWAITING } from "../constants/validationConstants.js";
import { ADMIN_ROLE, CAREER_HEAD_ROLE } from "../constants/user.constants.js";
import { shallBeAllowedToMakeChanges } from "../service/utils/utils.career.service.js";

export async function getElectivos(req, res) {
  if (req.query && req.query.area && typeof(req.query.area) === "string") {
    req.query.area = String(req.query.area).toUpperCase();
  }
  if (req.query && req.query.filtro && typeof(req.query.filtro) === "string") {
    req.query.filtro = String(req.query.filtro).toUpperCase();
  }

  const { error } = getElectivosIntegrityValidation.validate(req.query);
  if (error) {
    return res.status(400).json(getControllerResult_NEW(error.message, null));
  }

  const serviceResult = await getElectivosFromService(req.query);
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult_NEW("Error al obtener electivos", serviceResult));
  }
  return res.status(200).json(getControllerResult_NEW("Electivos encontrados con éxito", serviceResult));
}

export async function getElectivosSinAprobar(req, res) {
  const serviceResult = await getElectivosSinAprobarFromService();
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult_NEW("Error al obtener electivos", serviceResult));
  }
  return res.status(200).json(getControllerResult_NEW("Electivos encontrados con éxito", serviceResult)); 
}


const createElectivoHelper = async (req, res, estadoNuevo) => {
  if (!req || !req.body) {
    return res.status(400).json(getControllerResult_NEW("Datos no proporcionados", null));
  }
  if (req.body.nombre) {
    req.body.nombre = fullNameProcessor(req.body.nombre);
  }
  req.body.carreras = processCarrera(req.body.carreras);
  req.body.estado = estadoNuevo;
  req.body.id_profesor = req.user.id;

  if (!shallBeAllowedToMakeChanges(req.user.role || req.user.rol, req.user.carrera || req.user.career, req.body.carreras)) {
    return res.status(401).json(getControllerResult_NEW("Debe pertenecer a una de las carreras listadas"));
  }

  let result = createValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  } 
  result = integrityValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }
  result = dateCreationValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult_NEW(result.error.message, null));
  }

  const serviceResult = await createElectivoFromService(req.body);
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult_NEW("Error interno del servidor", serviceResult));
  }
  if (serviceResult.length <= 0) {
    serviceResult.error = true;
    return res.status(401).json(getControllerResult_NEW("Error al crear electivo", serviceResult));
  }
  return res.status(200).json(getControllerResult_NEW("Electivo creado con éxito", serviceResult));
}

export async function createElectivoProfesor(req, res) {
  if (req && req.body && req.body.estado) {
    return res.status(400).json(getControllerResult_NEW("No se puede autoasignar un estado", null));
  }

  return await createElectivoHelper(req, res, ESTADOS_VALIDOS.PENDIENTE);
};

export async function createElectivoJefeDeCarrera(req, res) {
  return await createElectivoHelper(req, res, ESTADOS_VALIDOS.APROBADO);
};

export async function getElectivoById(req, res) {
    const { id } = req.params;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }
    const serviceResult = await getElectivoByIdFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult_NEW(serviceResult.details, serviceResult));
}

export async function updateElectivo(req, res) {
  try {
    const { id } = req.params;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }
    
    let { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json(getControllerResult_NEW(error.message ? error.message : "Datos inválidos", null));
    }
    error = integrityValidation.validate(req.body).error;
    if (error) {
      return res.status(400).json(getControllerResult_NEW(error.message ? error.message : "Datos inválidos", null));
    }

    if (!req.body) {
      return res.status(400).json(getControllerResult_NEW("Datos no proporcionados", null));
    }
    if (req.body.nombre) {
      req.body.nombre = fullNameProcessor(req.body.nombre);
    }
    if (req.body.carreras) {
      req.body.carreras = processCarrera(req.body.carreras);
      if (String(req.body.carreras).search(String(req.user.career || req.user.carrera)) === -1) {
        return res.status(401).json(getControllerResult_NEW("Debe pertenecer a una de las carreras listadas"));
      }
    }
    if ((req.user.role || req.user.rol) !== CAREER_HEAD_ROLE) {
      req.body.estado = ESTADOS_VALIDOS.PENDIENTE;
    }
    const electivo = await RAW_getElectivoById(id);
    if (!electivo) {
      return res.status(404).json(getControllerResult_NEW("Electivo no encontrado", null));
    }
    if (!shallBeAllowedToMakeChanges(req.user.rol || req.user.role, req.user.career || req.user.carrera, electivo.carreras)) {
      return res.status(401).json(getControllerResult_NEW("No pertenece a la carrera correspondiente al electivo"));
    }
    const serviceResult = await updateElectivoFromService(id, req.body, (req.user.carrera), req.user.role || req.user.rol, req.body.carreras, electivo);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult_NEW("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult_NEW("Electivo actualizado con éxito", serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult_NEW("Error al actualizar electivo", null));
  }
}

const changeElectivoEstado = async (req, res, estado) => {
  try {
    if (!estado || !ARRAY_ESTADOS_VALIDOS.includes(estado)) {
      return getControllerResult_NEW(`Solo se permiten los siguientes estados: ${ARRAY_ESTADOS_VALIDOS.join(", ")}`, null);
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(getControllerResult_NEW("ID no proporcionado", null));
    }
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }
    console.log(req.user.carrera);;
    const serviceResult = await changeElectivoEstadoFromService(id, estado, req.user.carrera || req.user.career, req.user.rol || req.user.role);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult_NEW("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult_NEW(`Electivo ${String(estado).toLowerCase()} con éxito`, serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult_NEW("Error al modificar electivo", null));
  }
}

export async function approveElectivo(req, res) {
  return await changeElectivoEstado(req, res, ESTADOS_VALIDOS.APROBADO);
}

export async function rejectElectivo(req, res) {
  return await changeElectivoEstado(req, res, ESTADOS_VALIDOS.RECHAZADO);
}

export async function deleteElectivo(req, res) {
  try {
    const { id } = req.params;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }
    
    const serviceResult = await deleteElectivoFromService(id, req.user.id, (req.user.role || req.user.rol), req.user.career || req.user.carrera);
    if (serviceResult.error) {
      return res.status(400).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult_NEW(serviceResult.details, serviceResult));
  } catch (error) {
    console.error("Error al eliminar electivo", error);
    return res.status(500).json(getControllerResult_NEW("Error al eliminar electivo", null));
  }
}

export const getElectivoName = async (id) => {
    const BASE_CASE = "Electivo desconocido";
    try {
      const electivo = await RAW_getElectivoById(id);
      return String(electivo.nombre) || BASE_CASE;
    } catch (error) {
      return BASE_CASE;
    }
} 


export const getAllElectivoNames = async (req, res) => {
  const electivos = await RAW_getAllApprovedElectivos();
  const nombres = [];
  for (let i = 0; i < electivos.length; i++) {
    if (electivos[i] && electivos[i].id && electivos[i].nombre) {
      nombres.push(String(electivos[i].id) + ". " + String(electivos[i].nombre).toUpperCase());
    }
  }
  return res.status(200).json({lista: nombres});
}*/


/*
"use strict";

import { AppDataSource } from "../config/configDb.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { ElectivoCarreraEntity } from "../entity/electivoCarrera.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { getControllerResult_NEW } from "./utils/utils.controller.js";


export async function crearElectivo(req, res) {
    try {
        const user = req.user;

        if (user.rol !== "PROFESOR") {
            return res
                .status(403)
                .json(getControllerResult_NEW("Solo profesores pueden crear electivos", null));
        }

        const {
            nombre_electivo,
            descripcion,
            cupos,
            fecha_inicio,
            fecha_fin,
            area_electivo,
            creditos_minimos_aprobados,
            carreras
        } = req.body;

        const electivoRepo = AppDataSource.getRepository(ElectivoEntity);
        const carreraRepo = AppDataSource.getRepository(CarreraEntity);
        const electivoCarreraRepo = AppDataSource.getRepository(ElectivoCarreraEntity);

        const electivo = electivoRepo.create({
            nombre_electivo,
            descripcion,
            cupos,
            fecha_inicio,
            fecha_fin,
            area_electivo,
            creditos_minimos_aprobados,
            profesor: user,
            estado: "PENDIENTE"
        });

        const electivoGuardado = await electivoRepo.save(electivo);

        if (Array.isArray(carreras)) {
            for (const idCarrera of carreras) {
                const carrera = await carreraRepo.findOneBy({ id: idCarrera });
                if (!carrera) continue;

                await electivoCarreraRepo.save(
                    electivoCarreraRepo.create({
                        electivo: electivoGuardado,
                        carrera,
                        cupos
                    })
                );
            }
        }

        return res
            .status(201)
            .json(getControllerResult_NEW("Electivo creado correctamente", electivoGuardado));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al crear electivo", null));
    }
}

export async function listarElectivos(req, res) {
    try {
        const user = req.user;
        const repo = AppDataSource.getRepository(ElectivoEntity);

        if (!user || !user.rol) {
            return res
                .status(401)
                .json(getControllerResult_NEW("Usuario no autenticado", null));
        }

        let where = {};
        let mensajeSinResultados = "No existen electivos disponibles";

        switch (user.rol) {
            case "PROFESOR":
                where = { profesor: { id: user.id } };
                mensajeSinResultados = "El profesor no tiene electivos asociados";
                break;

            case "JEFE_DE_CARRERA":
                where = { estado: "PENDIENTE" };
                mensajeSinResultados = "No existen electivos pendientes de aprobación";
                break;

            case "ESTUDIANTE":
                where = { estado: "APROBADO" };
                mensajeSinResultados = "No existen electivos aprobados disponibles";
                break;

            case "ADMINISTRADOR":
                where = {}; // ve todos
                mensajeSinResultados = "No existen electivos registrados en el sistema";
                break;

            default:
                return res
                    .status(403)
                    .json(getControllerResult_NEW("Rol no autorizado para listar electivos", null));
        }

        const electivos = await repo.find({
            where,
            relations: {
                profesor: true,
                carreras: { carrera: true },
                horarios: true
            },
            order: {
                id_electivo: "DESC"
            }
        });

        if (!electivos || electivos.length === 0) {
            return res
                .status(200)
                .json(getControllerResult_NEW(mensajeSinResultados, []));
        }

        return res
            .status(200)
            .json(getControllerResult_NEW(
                "Electivos obtenidos correctamente",
                electivos
            ));

    } catch (error) {
        console.error("Error en listarElectivos:", error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al listar electivos", null));
    }
}


export async function aprobarElectivo(req, res) {
    try {
        if (req.user.rol !== "JEFE_DE_CARRERA") {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        const repo = AppDataSource.getRepository(ElectivoEntity);
        const electivo = await repo.findOneBy({ id_electivo: req.params.id });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        electivo.estado = "APROBADO";
        electivo.motivo_rechazo = null;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo aprobado correctamente", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al aprobar electivo", null));
    }
}


export async function rechazarElectivo(req, res) {
    try {
        if (req.user.rol !== "JEFE_DE_CARRERA") {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        const { motivo_rechazo } = req.body;

        if (!motivo_rechazo) {
            return res
                .status(400)
                .json(getControllerResult_NEW("El motivo de rechazo es obligatorio", null));
        }

        const repo = AppDataSource.getRepository(ElectivoEntity);
        const electivo = await repo.findOneBy({ id_electivo: req.params.id });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        electivo.estado = "RECHAZADO";
        electivo.motivo_rechazo = motivo_rechazo;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo rechazado correctamente", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al rechazar electivo", null));
    }
}


export async function editarElectivo(req, res) {
    try {
        const repo = AppDataSource.getRepository(ElectivoEntity);

        const electivo = await repo.findOne({
            where: { id_electivo: req.params.id },
            relations: { profesor: true }
        });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        if (electivo.profesor.id !== req.user.id) {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        if (electivo.estado !== "RECHAZADO") {
            return res
                .status(400)
                .json(getControllerResult_NEW("Solo se pueden editar electivos rechazados", null));
        }

        Object.assign(electivo, req.body);
        electivo.estado = "PENDIENTE";
        electivo.motivo_rechazo = null;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo reenviado para aprobación", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al editar electivo", null));
    }
}
*/

"use strict";

import { AppDataSource } from "../config/configDb.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { ElectivoCarreraEntity } from "../entity/electivoCarrera.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { getControllerResult_NEW } from "./utils/utils.controller.js";

import {
    prerequisitosArrayToString,
    prerequisitosStringToArray,
    parseDateToISO
} from "../helpers/electivo.helper.js";


export async function crearElectivo(req, res) {
    try {
        const user = req.user;

        if (user.rol !== "PROFESOR") {
            return res
                .status(403)
                .json(getControllerResult_NEW("Solo profesores pueden crear electivos", null));
        }

        const {
            nombre_electivo,
            descripcion,
            cupos,
            fecha_inicio,
            fecha_fin,
            area_electivo,
            creditos_minimos_aprobados,
            prerequisitos_asignaturas,
            carreras
        } = req.body;

        // Validación prerrequisitos
        if (
            prerequisitos_asignaturas &&
            (!Array.isArray(prerequisitos_asignaturas) || prerequisitos_asignaturas.length > 2)
        ) {
            return res
                .status(400)
                .json(getControllerResult_NEW("Máximo 2 prerrequisitos permitidos", null));
        }

        const electivoRepo = AppDataSource.getRepository(ElectivoEntity);
        const carreraRepo = AppDataSource.getRepository(CarreraEntity);
        const electivoCarreraRepo = AppDataSource.getRepository(ElectivoCarreraEntity);

        const electivo = electivoRepo.create({
            nombre_electivo,
            descripcion,
            cupos,
            fecha_inicio: parseDateToISO(fecha_inicio),
            fecha_fin: parseDateToISO(fecha_fin),
            area_electivo,
            creditos_minimos_aprobados,
            prerequisitos_asignaturas: prerequisitosArrayToString(prerequisitos_asignaturas),
            profesor: user,
            estado: "PENDIENTE"
        });

        const electivoGuardado = await electivoRepo.save(electivo);

        if (Array.isArray(carreras)) {
            for (const idCarrera of carreras) {
                const carrera = await carreraRepo.findOneBy({ id: idCarrera });
                if (!carrera) continue;

                await electivoCarreraRepo.save(
                    electivoCarreraRepo.create({
                        electivo: electivoGuardado,
                        carrera,
                        cupos
                    })
                );
            }
        }

        return res
            .status(201)
            .json(getControllerResult_NEW("Electivo creado correctamente", electivoGuardado));

    } catch (error) {
        console.error("Error crearElectivo:", error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al crear electivo", null));
    }
}
/*
export async function listarElectivos(req, res) {
    try {
        const user = req.user;
        const repo = AppDataSource.getRepository(ElectivoEntity);

        if (!user || !user.rol) {
            return res
                .status(401)
                .json(getControllerResult_NEW("Usuario no autenticado", null));
        }

        let where = {};
        let mensajeSinResultados = "No existen electivos disponibles";

        switch (user.rol) {
            case "PROFESOR":
                where = { profesor: { id: user.id } };
                mensajeSinResultados = "El profesor no tiene electivos asociados";
                break;

            case "JEFE_DE_CARRERA":
                where = { estado: "PENDIENTE" };
                mensajeSinResultados = "No existen electivos pendientes de aprobación";
                break;

            case "ESTUDIANTE":
                where = { estado: "APROBADO" };
                mensajeSinResultados = "No existen electivos aprobados disponibles";
                break;

            case "ADMINISTRADOR":
                where = {};
                mensajeSinResultados = "No existen electivos registrados en el sistema";
                break;

            default:
                return res
                    .status(403)
                    .json(getControllerResult_NEW("Rol no autorizado para listar electivos", null));
        }

        const electivos = await repo.find({
            where,
            relations: {
                profesor: true,
                carreras: { carrera: true },
                horarios: true
            },
            order: {
                id_electivo: "DESC"
            }
        });

        if (!electivos || electivos.length === 0) {
            return res
                .status(200)
                .json(getControllerResult_NEW(mensajeSinResultados, []));
        }

        // Convertir prerrequisitos a array
        const electivosFormateados = electivos.map(e => ({
            ...e,
            prerequisitos_asignaturas: prerequisitosStringToArray(e.prerequisitos_asignaturas)
        }));

        return res
            .status(200)
            .json(getControllerResult_NEW(
                "Electivos obtenidos correctamente",
                electivosFormateados
            ));

    } catch (error) {
        console.error("Error listarElectivos:", error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al listar electivos", null));
    }
}
*/



export async function listarElectivos(req, res) {
    try {
        const user = req.user;
        const repo = AppDataSource.getRepository(ElectivoEntity);

        if (!user || !user.rol) {
            return res
                .status(401)
                .json(getControllerResult_NEW("Usuario no autenticado", null));
        }

        let where = {};
        let mensajeSinResultados = "No existen electivos disponibles";

        switch (user.rol) {
            case "PROFESOR":
                where = { profesor: { id: user.id } };
                mensajeSinResultados = "El profesor no tiene electivos asociados";
                break;

            case "JEFE_DE_CARRERA":
                where = { estado: "PENDIENTE" };
                mensajeSinResultados = "No existen electivos pendientes de aprobación";
                break;

            case "ESTUDIANTE":
                where = { estado: "APROBADO" };
                mensajeSinResultados = "No existen electivos aprobados disponibles";
                break;

            case "ADMINISTRADOR":
                where = {};
                mensajeSinResultados = "No existen electivos registrados en el sistema";
                break;

            default:
                return res
                    .status(403)
                    .json(getControllerResult_NEW("Rol no autorizado para listar electivos", null));
        }

        const electivos = await repo.find({
            where,
            relations: {
                profesor: true,
                carreras: { carrera: true },
                horarios: true
            },
            order: {
                id_electivo: "DESC"
            }
        });

        if (!electivos || electivos.length === 0) {
            return res
                .status(200)
                .json(getControllerResult_NEW(mensajeSinResultados, []));
        }

        // Convertir prerrequisitos a array
        const electivosFormateados = electivos.map(e => ({
            ...e,
            prerequisitos_asignaturas: prerequisitosStringToArray(e.prerequisitos_asignaturas)
        }));

        return res
            .status(200)
            .json(getControllerResult_NEW(
                "Electivos obtenidos correctamente",
                electivosFormateados
            ));

    } catch (error) {
        console.error("Error listarElectivos:", error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al listar electivos", null));
    }
}


export async function aprobarElectivo(req, res) {
    try {
        if (req.user.rol !== "JEFE_DE_CARRERA") {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        const repo = AppDataSource.getRepository(ElectivoEntity);
        const electivo = await repo.findOneBy({ id_electivo: req.params.id });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        electivo.estado = "APROBADO";
        electivo.motivo_rechazo = null;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo aprobado correctamente", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al aprobar electivo", null));
    }
}

export async function rechazarElectivo(req, res) {
    try {
        if (req.user.rol !== "JEFE_DE_CARRERA") {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        const { motivo_rechazo } = req.body;

        if (!motivo_rechazo) {
            return res
                .status(400)
                .json(getControllerResult_NEW("El motivo de rechazo es obligatorio", null));
        }

        const repo = AppDataSource.getRepository(ElectivoEntity);
        const electivo = await repo.findOneBy({ id_electivo: req.params.id });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        electivo.estado = "RECHAZADO";
        electivo.motivo_rechazo = motivo_rechazo;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo rechazado correctamente", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al rechazar electivo", null));
    }
}

export async function editarElectivo(req, res) {
    try {
        const repo = AppDataSource.getRepository(ElectivoEntity);

        const electivo = await repo.findOne({
            where: { id_electivo: req.params.id },
            relations: { profesor: true }
        });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW("Electivo no encontrado", null));
        }

        if (electivo.profesor.id !== req.user.id) {
            return res
                .status(403)
                .json(getControllerResult_NEW("No autorizado", null));
        }

        if (electivo.estado !== "RECHAZADO") {
            return res
                .status(400)
                .json(getControllerResult_NEW("Solo se pueden editar electivos rechazados", null));
        }

        // Prerrequisitos
        if (req.body.prerequisitos_asignaturas) {
            if (
                !Array.isArray(req.body.prerequisitos_asignaturas) ||
                req.body.prerequisitos_asignaturas.length > 2
            ) {
                return res
                    .status(400)
                    .json(getControllerResult_NEW("Máximo 2 prerrequisitos permitidos", null));
            }

            req.body.prerequisitos_asignaturas =
                prerequisitosArrayToString(req.body.prerequisitos_asignaturas);
        }

        if (req.body.fecha_inicio) {
            req.body.fecha_inicio = parseDateToISO(req.body.fecha_inicio);
        }

        if (req.body.fecha_fin) {
            req.body.fecha_fin = parseDateToISO(req.body.fecha_fin);
        }

        Object.assign(electivo, req.body);
        electivo.estado = "PENDIENTE";
        electivo.motivo_rechazo = null;

        await repo.save(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW("Electivo reenviado para aprobación", electivo));

    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(getControllerResult_NEW("Error al editar electivo", null));
    }
}


export async function eliminarElectivo(req, res) {
    try {
        const user = req.user;

        if (!user || user.rol !== "PROFESOR") {
            return res
                .status(403)
                .json(getControllerResult_NEW(
                    "Solo profesores pueden eliminar electivos",
                    null
                ));
        }

        const repo = AppDataSource.getRepository(ElectivoEntity);

        const electivo = await repo.findOne({
            where: { id_electivo: req.params.id },
            relations: { profesor: true }
        });

        if (!electivo) {
            return res
                .status(404)
                .json(getControllerResult_NEW(
                    "Electivo no encontrado",
                    null
                ));
        }

        // Validar que sea el profesor creador
        if (electivo.profesor.id !== user.id) {
            return res
                .status(403)
                .json(getControllerResult_NEW(
                    "No autorizado para eliminar este electivo",
                    null
                ));
        }

        // Validar estado
        if (electivo.estado !== "PENDIENTE") {
            return res
                .status(400)
                .json(getControllerResult_NEW(
                    "Solo se pueden eliminar electivos en estado PENDIENTE",
                    null
                ));
        }

        await repo.remove(electivo);

        return res
            .status(200)
            .json(getControllerResult_NEW(
                "Electivo eliminado correctamente",
                null
            ));

    } catch (error) {
        console.error("Error al eliminar electivo:", error);
        return res
            .status(500)
            .json(getControllerResult_NEW(
                "Error al eliminar electivo",
                null
            ));
    }
}
