"use strict";

import {
  approveElectivoValidation,
  createValidation,
  dateCreationValidation,
  integrityValidation,
  rejectElectivoValidation,
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
  RAW_getAllApprovedElectivos,
  RAW_getElectivosProfesor,
  RAW_getElectivosAprobadosProfesor
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
import { CAREER_HEAD_ROLE, TEACHER_ROLE } from "../constants/user.constants.js";

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

export async function getElectivosProfesor_NOWARNING(req, res) {
  const serviceResult = await RAW_getElectivosProfesor(req);
  // console.log(serviceResult);
  return res.status(200).json({data: serviceResult});
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

    req.body.estado = AWAITING;
    req.body.motivo = null;
    req.body.plazo_renovacion = null;

    const electivo = await RAW_getElectivoById(id);
    if (!electivo) {
      return res.status(404).json(getControllerResult_NEW("Electivo no encontrado", null));
    }

    const serviceResult = await updateElectivoFromService(
      id,
      req.body,
      electivo,
      req.user.id
    );

    if (serviceResult.error) {
      return res.status(500).json(
        getControllerResult_NEW("Error interno del servidor", serviceResult)
      );
    }

    if (serviceResult.length !== 1) {
      return res.status(400).json(getControllerResult_NEW(serviceResult.details, serviceResult));
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
    let validationResult = idValidation.validate({ id });
    if (validationResult.error) {
      return res.status(400).json(
        getControllerResult_NEW(validationResult.error.message, null)
      );
    }

    const electivo = await RAW_getElectivoById(id);
    if (!electivo) {
      return res.status(404).json(getControllerResult_NEW("Electivo no encontrado", null));
    }
    if (req.user.id_carrera !== electivo.carreraIdCarrera) {
      return res.status(401).json(getControllerResult_NEW("No pertenece a la carrera del electivo", null));
    }

    if (estado === ESTADOS_VALIDOS.APROBADO) {
      validationResult = approveElectivoValidation.validate(req.body);
      req.body.estado = ESTADOS_VALIDOS.APROBADO;
    } else {
      validationResult = rejectElectivoValidation.validate(req.body);
      req.body.estado = ESTADOS_VALIDOS.RECHAZADO;
    }

    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }

    validationResult = integrityValidation.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json(getControllerResult_NEW(validationResult.error.message, null));
    }

    const serviceResult = await changeElectivoEstadoFromService(req.body, electivo);

    if (!serviceResult.data || serviceResult.error) {
      return res.status(400).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }
    
    return res.status(200).json(
      getControllerResult_NEW(`Electivo ${estado.toLowerCase()} con éxito`, serviceResult)
    );

  } catch (error) {
    return res.status(500).json(
      getControllerResult_NEW("Error al modificar electivo", null)
    );
  }
};

export const approveElectivo = async (req, res) => {
  return await changeElectivoEstado(req, res, ESTADOS_VALIDOS.APROBADO);
}

export const rejectElectivo = async (req, res) => {
  if (req?.body?.motivo) {
    req.body.motivo = String(req.body.motivo).toUpperCase().trim();
  }
  return await changeElectivoEstado(req, res, ESTADOS_VALIDOS.RECHAZADO);
}

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
      req.user.role || req.user.rol,
      req.user.id_carrera
    );
    if (serviceResult.length !== 1) {
      return res.status(400).json(getControllerResult_NEW(serviceResult.details, serviceResult));
    }

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
  let electivos = null;
  if ((req.user.rol || req.user.role) === TEACHER_ROLE) {
    electivos = await RAW_getElectivosAprobadosProfesor(req);
  } else {
    electivos = await RAW_getAllApprovedElectivos();
  }
  const nombres = electivos.map(
    e => `${e.id}. ${String(e.nombre).toUpperCase()}`
  );
  return res.status(200).json({ lista: nombres });
};
