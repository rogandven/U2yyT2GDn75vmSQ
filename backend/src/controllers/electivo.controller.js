
"use strict";

import {
  createValidation,
  dateCreationValidation,
  integrityValidation,
  updateValidation,
} from "../validations/electivo.validation.js";
import { getElectivosFromService, createElectivoFromService, getElectivoByIdFromService, updateElectivoFromService, deleteElectivoFromService, getElectivosSinAprobarFromService, changeElectivoEstadoFromService } from "../service/electivo.service.js";
import { getControllerResult } from "./utils/utils.controller.js";
import { getElectivosIntegrityValidation } from "../validations/electivo.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";
import { ARRAY_ESTADOS_VALIDOS } from "../entity/electivo.entity.js";

export async function getElectivos(req, res) {
  if (req.query && req.query.area && typeof(req.query.area) === "string") {
    req.query.area = String(req.query.area).toUpperCase();
  }
  if (req.query && req.query.filtro && typeof(req.query.filtro) === "string") {
    req.query.filtro = String(req.query.filtro).toUpperCase();
  }

  const { error } = getElectivosIntegrityValidation.validate(req.query);
  if (error) {
    return res.status(400).json(getControllerResult(error.message, null));
  }

  const serviceResult = await getElectivosFromService(req.query);
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult("Error al obtener electivos", serviceResult));
  }
  return res.status(200).json(getControllerResult("Electivos encontrados con éxito", serviceResult));
}

export async function getElectivosSinAprobar(req, res) {
  const serviceResult = await getElectivosSinAprobarFromService();
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult("Error al obtener electivos", serviceResult));
  }
  return res.status(200).json(getControllerResult("Electivos encontrados con éxito", serviceResult)); 
}


const createElectivoHelper = async (req, res, estado) => {
  if (!req || !req.body) {
    return res.status(400).json(getControllerResult("Datos no proporcionados", null));
  }

  req.body.estado = estado;

  let result = createValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  } 
  result = integrityValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }
  result = dateCreationValidation.validate(req.body);
  if (result.error) {
    return res.status(400).json(getControllerResult(result.error.message, null));
  }

  const serviceResult = await createElectivoFromService(req.body);
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult("Error interno del servidor", serviceResult));
  }
  if (serviceResult.length <= 0) {
    serviceResult.error = true;
    return res.status(401).json(getControllerResult("Error al crear electivo", serviceResult));
  }
  return res.status(200).json(getControllerResult("Electivo creado con éxito", serviceResult));
}

export async function createElectivoProfesor(req, res) {
  if (req && req.body && req.body.estado) {
    return res.status(400).json(getControllerResult("No se puede autoasignar un estado", null));
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
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    const serviceResult = await getElectivoByIdFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult(serviceResult.details, serviceResult));
}

export async function updateElectivo(req, res) {
  try {
    const { id } = req.params;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    
    const { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json(getControllerResult(error.message ? error.message : "Datos inválidos", null));
    }

    const serviceResult = await updateElectivoFromService(id, req.body);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult("Electivo actualizado con éxito", serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult("Error al actualizar electivo", null));
  }
}

const changeElectivoEstado = async (req, res, estado) => {
  try {
    if (!estado || !ARRAY_ESTADOS_VALIDOS.includes(estado)) {
      return getControllerResult(`Solo se permiten los siguientes estados: ${ARRAY_ESTADOS_VALIDOS.join(", ")}`, null);
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(getControllerResult("ID no proporcionado", null));
    }
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    const serviceResult = await changeElectivoEstadoFromService(id, estado);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult(`Electivo ${String(estado).toLowerCase()} con éxito`, serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult("Error al modificar electivo", null));
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
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    
    const serviceResult = await deleteElectivoFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult(serviceResult.details, serviceResult));
  } catch (error) {
    console.error("Error al eliminar electivo", error);
    return res.status(500).json(getControllerResult("Error al eliminar electivo", null));
  }
}

