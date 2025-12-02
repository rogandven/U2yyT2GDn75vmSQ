
"use strict";

import {
  createValidation,
  updateValidation,
} from "../validations/electivo.validation.js";
import { getElectivosFromService, createElectivoFromService, getElectivoByIdFromService, updateElectivoFromService, deleteElectivoFromService } from "../service/electivo.service.js";
import { getControllerResult } from "./utils/utils.controller.js";

export async function getElectivos(req, res) {
  // TODO ADD VALIDATION
  const serviceResult = await getElectivosFromService(req.query);
  // TODO ADD ERROR HANDLING
  return res.status(200).json(getControllerResult("foo", serviceResult));
}

export async function createElectivo(req, res) {
    // TODO REDO VALIDATION
    const { error } = createValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    } 
    // TODO ADD ERROR HANDLING
    const serviceResult = await createElectivoFromService(req.body);
    return res.status(200).json(getControllerResult("foo", serviceResult));
};

export async function getElectivoById(req, res) {
    // TODO ADD ID VALIDATION
    const { id } = req.params;
    // TODO ADD ERROR HANDLING
    const serviceResult = getElectivoByIdFromService(id);
    return res.status(200).json(getControllerResult("foo", serviceResult));
}

export async function updateElectivo(req, res) {
  try {
    // TODO ADD ID VALIDATION
    const { id } = req.params;
    
    // TODO REDO VALIDATION
    const { error } = updateValidation.validate(req.body);
    if (error) {
      return res.status(400).json(getControllerResult(error.message ? error.message : "Datos inválidos", null));
    }

    const serviceResult = await updateElectivoFromService(id);
    // TODO ADD ERROR HANDLING
    return res.status(200).json(getControllerResult("foo", serviceResult));
  } catch (error) {
    console.error("Error al actualizar electivo", error);
    return res.status(500).json(getControllerResult("Error al actualizar electivo", null));
  }
}

export async function deleteElectivo(req, res) {
  try {
    // TODO ADD ID VALIDATION
    const { id } = req.params;
    
    const serviceResult = deleteElectivoFromService(id);
    // TODO ADD ERROR HANDLING
    return res.status(200).json(getControllerResult("foo", serviceResult));
  } catch (error) {
    console.error("Error al eliminar electivo", error);
    return res.status(500).json(getControllerResult("Error al eliminar electivo", null));
  }
}

