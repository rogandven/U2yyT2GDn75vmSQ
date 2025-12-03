
"use strict";

import {
  createValidation,
  dateCreationValidation,
  integrityValidation,
  updateValidation,
} from "../validations/electivo.validation.js";
import { getElectivosFromService, createElectivoFromService, getElectivoByIdFromService, updateElectivoFromService, deleteElectivoFromService } from "../service/electivo.service.js";
import { getControllerResult } from "./utils/utils.controller.js";
import { getElectivosIntegrityValidation } from "../validations/electivo.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";

export async function getElectivos(req, res) {
  if (req.query && req.query.area && typeof(req.query.area) === "string") {
    req.query.area = String(req.query.area).toUpperCase();
  }
  if (req.query && req.query.filtro && typeof(req.query.filtro) === "string") {
    req.query.filtro = String(req.query.filtro).toUpperCase();
  }

  const { error } = getElectivosIntegrityValidation(req.query);
  if (error) {
    return res.status(400).json(getControllerResult(error.message, null));
  }

  const serviceResult = await getElectivosFromService(req.query);
  if (serviceResult.error) {
    return res.status(500).json(getControllerResult("Error al obtener electivos", serviceResult));
  }
  return res.status(200).json(getControllerResult("Electivos encontrados con éxito", serviceResult));
}

export async function createElectivo(req, res) {
    // TODO REDO VALIDATION
    let result = createValidation.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    } 
    result = integrityValidation.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }   
    result = dateCreationValidation.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: result.error.message });
    }           
    // TODO ADD ERROR HANDLING
    const serviceResult = await createElectivoFromService(req.body);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult("Error al crear electivo", serviceResult));
    }
    return res.status(200).json(getControllerResult("Electivo creado con éxito", serviceResult));
};

export async function getElectivoById(req, res) {
    const { id } = req.params;
    const validationResult = idValidation.validate(id);
    if (validationResult.error) {
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    const serviceResult = await getElectivoByIdFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult(serviceResult.message, serviceResult));
    }
    return res.status(200).json(getControllerResult(serviceResult.message, serviceResult));
}

export async function updateElectivo(req, res) {
  try {
    const { id } = req.params;
    const validationResult = idValidation.validate(id);
    if (validationResult.error) {
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    
    const { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json(getControllerResult(error.message ? error.message : "Datos inválidos", null));
    }

    const serviceResult = await updateElectivoFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult("Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
      serviceResult.error = true;
      return res.status(401).json(getControllerResult(serviceResult.details, serviceResult));
    }
    return res.status(200).json(getControllerResult("Electivo creado con éxito", serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult("Error al actualizar electivo", null));
  }
}

export async function deleteElectivo(req, res) {
  try {
    const { id } = req.params;
    const validationResult = idValidation.validate(id);
    if (validationResult.error) {
      return res.status(400).json(getControllerResult(validationResult.error.message, null));
    }
    
    const serviceResult = await deleteElectivoFromService(id);
    if (serviceResult.error) {
      return res.status(500).json(getControllerResult(serviceResult.message, serviceResult));
    }
    return res.status(200).json(getControllerResult(serviceResult.message, serviceResult));
  } catch (error) {
    console.error("Error al eliminar electivo", error);
    return res.status(500).json(getControllerResult("Error al eliminar electivo", null));
  }
}

