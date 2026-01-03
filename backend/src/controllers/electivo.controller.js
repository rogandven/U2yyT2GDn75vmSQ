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
import { getElectivosIntegrityValidation, rejectElectivoValidation } from "../validations/electivo.validation.js";
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
  console.log(req.body);

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

  //lo comente para poder crear electivos y que puedan ser tomados hoy
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
    const motivo = (req.body && req.body.motivo) ? String(req.body.motivo) : null;
    // accept a period string like '2026-1' or a numeric plazo (days)
    const periodo = (req.body && (req.body.periodo_renovacion || req.body.plazo_renovacion || req.body.plazo)) ? req.body.periodo_renovacion || req.body.plazo_renovacion || req.body.plazo : null;
    const serviceResult = await changeElectivoEstadoFromService(id, estado, req.user.id, req.user.carrera || req.user.career, req.user.rol || req.user.role, periodo, motivo);
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
  try {
          const {error} = rejectElectivoValidation.validate(req.body);
          
          if(error){
              return res.status(400).json({
                  message: "Error de validación",
                  errors: error.details.map(e => e.message)
              });
          }
          
  
          req.body.estado = ESTADOS_VALIDOS.RECHAZADO;
          return await changeElectivoEstado(req, res, ESTADOS_VALIDOS.RECHAZADO);
      } catch(error) {
          console.error("Error en Electivo:", error);
          return res.status(500).json({ message: "Error interno del servidor" });
      }
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

"use strict";

import {
  createValidation,
  dateCreationValidation,
  integrityValidation,
  updateValidation,
} from "../validations/electivo.validation.js";

import {
  getElectivosFromService,
  createElectivoFromService,
  getElectivoByIdFromService,
  updateElectivoFromService,
  deleteElectivoFromService,
  getElectivosSinAprobarFromService,
  changeElectivoEstadoFromService,
  RAW_getElectivoById,
  RAW_getAllApprovedElectivos
} from "../service/electivo.service.js";

import {
  fullNameProcessor,
  getControllerResult_NEW,
  processCarrera
} from "./utils/utils.controller.js";

import { getElectivosIntegrityValidation } from "../validations/electivo.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";
import { AWAITING } from "../constants/validationConstants.js";
import { CAREER_HEAD_ROLE } from "../constants/user.constants.js";

/* ===========================
   OBTENER ELECTIVOS
=========================== */
export async function getElectivos(req, res) {
  if (req.query?.area) {
    req.query.area = String(req.query.area).toUpperCase();
  }
  if (req.query?.filtro) {
    req.query.filtro = String(req.query.filtro).toUpperCase();
  }

  const { error } = getElectivosIntegrityValidation.validate(req.query);
  if (error) {
    return res.status(400).json(getControllerResult_NEW(error.message, null));
  }

  const serviceResult = await getElectivosFromService(req.query);
  if (serviceResult.error) {
    return res.status(500).json(
      getControllerResult_NEW("Error al obtener electivos", serviceResult)
    );
  }

  return res.status(200).json(
    getControllerResult_NEW("Electivos encontrados con éxito", serviceResult)
  );
}

export async function getElectivosSinAprobar(req, res) {
  const serviceResult = await getElectivosSinAprobarFromService();
  if (serviceResult.error) {
    return res.status(500).json(
      getControllerResult_NEW("Error al obtener electivos", serviceResult)
    );
  }
  return res.status(200).json(
    getControllerResult_NEW("Electivos encontrados con éxito", serviceResult)
  );
}

/* ===========================
   CREAR ELECTIVO (HELPER)
=========================== */
const createElectivoHelper = async (req, res, estadoNuevo) => {
  if (!req?.body) {
    return res.status(400).json(
      getControllerResult_NEW("Datos no proporcionados", null)
    );
  }

  if (req.body.nombre) {
    req.body.nombre = fullNameProcessor(req.body.nombre);
  }

  req.body.estado = estadoNuevo;
  req.body.usuariosId = req.user.id;

  let result = createValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(
      getControllerResult_NEW(result.error.message, null)
    );
  }

  result = integrityValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(
      getControllerResult_NEW(result.error.message, null)
    );
  }

  result = dateCreationValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(
      getControllerResult_NEW(result.error.message, null)
    );
  }

  const serviceResult = await createElectivoFromService(req.body);
  if (serviceResult.error) {
    return res.status(500).json(
      getControllerResult_NEW("Error interno del servidor", serviceResult)
    );
  }

  if (serviceResult.length <= 0) {
    return res.status(401).json(
      getControllerResult_NEW("Error al crear electivo", serviceResult)
    );
  }

  return res.status(200).json(
    getControllerResult_NEW("Electivo creado con éxito", serviceResult)
  );
};

export async function createElectivoProfesor(req, res) {
  if (req.body?.estado) {
    return res.status(400).json(
      getControllerResult_NEW("No se puede autoasignar un estado", null)
    );
  }
  return await createElectivoHelper(req, res, ESTADOS_VALIDOS.PENDIENTE);
}

export async function createElectivoJefeDeCarrera(req, res) {
  return await createElectivoHelper(req, res, ESTADOS_VALIDOS.APROBADO);
}

/* ===========================
   OBTENER ELECTIVO POR ID
=========================== */
export async function getElectivoById(req, res) {
  const { id } = req.params;

  const validationResult = idValidation.validate({ id });
  if (validationResult.error) {
    return res.status(400).json(
      getControllerResult_NEW(validationResult.error.message, null)
    );
  }

  const serviceResult = await getElectivoByIdFromService(id);
  if (serviceResult.error) {
    return res.status(500).json(
      getControllerResult_NEW(serviceResult.details, serviceResult)
    );
  }

  return res.status(200).json(
    getControllerResult_NEW(serviceResult.details, serviceResult)
  );
}

/* ===========================
   ACTUALIZAR ELECTIVO
=========================== */
export async function updateElectivo(req, res) {
  try {
    const { id } = req.params;

    const validationResult = idValidation.validate({ id });
    if (validationResult.error) {
      return res.status(400).json(
        getControllerResult_NEW(validationResult.error.message, null)
      );
    }

    let { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json(
        getControllerResult_NEW(error.message, null)
      );
    }

    error = integrityValidation.validate(req.body).error;
    if (error) {
      return res.status(400).json(
        getControllerResult_NEW(error.message, null)
      );
    }

    if (req.body.nombre) {
      req.body.nombre = fullNameProcessor(req.body.nombre);
    }

    if ((req.user.role || req.user.rol) !== CAREER_HEAD_ROLE) {
      req.body.estado = AWAITING;
    }

    const serviceResult = await updateElectivoFromService(
      id,
      req.body,
      req.user.carrera
    );

    if (serviceResult.error) {
      return res.status(500).json(
        getControllerResult_NEW("Error interno del servidor", serviceResult)
      );
    }

    return res.status(200).json(
      getControllerResult_NEW("Electivo actualizado con éxito", serviceResult)
    );

  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(
      getControllerResult_NEW("Error al actualizar electivo", null)
    );
  }
}

/* ===========================
   CAMBIAR ESTADO
=========================== */
const changeElectivoEstado = async (req, res, estado) => {
  try {
    if (!ARRAY_ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json(
        getControllerResult_NEW(
          `Estados válidos: ${ARRAY_ESTADOS_VALIDOS.join(", ")}`,
          null
        )
      );
    }

    const { id } = req.params;
    const validationResult = idValidation.validate({ id });
    if (validationResult.error) {
      return res.status(400).json(
        getControllerResult_NEW(validationResult.error.message, null)
      );
    }

    const serviceResult = await changeElectivoEstadoFromService(
      id,
      estado,
      req.user.carrera
    );

    return res.status(200).json(
      getControllerResult_NEW(`Electivo ${estado.toLowerCase()} con éxito`, serviceResult)
    );

  } catch (error) {
    return res.status(500).json(
      getControllerResult_NEW("Error al modificar electivo", null)
    );
  }
};

export const approveElectivo = (req, res) =>
  changeElectivoEstado(req, res, ESTADOS_VALIDOS.APROBADO);

export const rejectElectivo = (req, res) =>
  changeElectivoEstado(req, res, ESTADOS_VALIDOS.RECHAZADO);

/* ===========================
   ELIMINAR ELECTIVO
=========================== */
export async function deleteElectivo(req, res) {
  try {
    const { id } = req.params;

    const validationResult = idValidation.validate({ id });
    if (validationResult.error) {
      return res.status(400).json(
        getControllerResult_NEW(validationResult.error.message, null)
      );
    }

    const serviceResult = await deleteElectivoFromService(
      id,
      req.user.id,
      req.user.role || req.user.rol
    );

    return res.status(200).json(
      getControllerResult_NEW(serviceResult.details, serviceResult)
    );

  } catch (error) {
    return res.status(500).json(
      getControllerResult_NEW("Error al eliminar electivo", null)
    );
  }
}

/* ===========================
   UTILIDADES
=========================== */
export const getElectivoName = async (id) => {
  try {
    const electivo = await RAW_getElectivoById(id);
    return electivo?.nombre || "Electivo desconocido";
  } catch {
    return "Electivo desconocido";
  }
};

export const getAllElectivoNames = async (req, res) => {
  const electivos = await RAW_getAllApprovedElectivos();
  const nombres = electivos.map(
    e => `${e.id}. ${String(e.nombre).toUpperCase()}`
  );
  return res.status(200).json({ lista: nombres });
};
