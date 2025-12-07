"use strict";
import { getInscripcionesByUserFromService, getInscripcionesSinAprobarFromService, getInscripcionesFromService } from "../service/inscripcion.service.js";
import { findValidation } from "../validations/modules/id.validation.js";
import { getControllerResult } from "./utils/utils.controller.js";

export async function getInscripcionesByUser(req, res) {
    const result = findValidation.validate(req.query);
    if (result.error) {
        const message1 = result.error.message ? result.error.message : "ID inválido";
        return res.status(400).json(getControllerResult(message1, null));
    }
    const inscripciones = await getInscripcionesByUserFromService(req.query.id);
    const message2 = inscripciones.details ? inscripciones.details : "Error al obtener inscripciones";
    if (inscripciones.error) {
        return res.status(500).json(getControllerResult(message2, inscripciones));
    }
    if (inscripciones.length <= 0) {
        return res.status(204).json(getControllerResult(message2, inscripciones));
    }
    return res.status(200).json(getControllerResult(message2, inscripciones));
}