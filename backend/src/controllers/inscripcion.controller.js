"use strict";
import { getInscripcionesByUserFromService, getInscripcionesSinAprobarFromService, getInscripcionesFromService, createInscripcionFromService } from "../service/inscripcion.service.js";
import { findValidation } from "../validations/modules/id.validation.js";
import { getControllerResult } from "./utils/utils.controller.js";
import { createValidation, integrityValidation } from "../validations/inscripcion.validation.js";
import { APPROVED, AWAITING } from "../constants/inscripcion.constants.js";

export async function private_getInscripcionesByUser(req, res) {
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

export async function public_getInscripcionesByUser(req, res) {
    const newReqQuery = {id: (Number(req.user.id) || null)};
    if (!newReqQuery.id) {
        return res.status(500).json(getControllerResult("No se pudo procesar el ID", null));
    }
    req.query = newReqQuery;
    return await getInscripcionesByUser(req, res);
}

export async function private_getInscripcionesSinAprobar(req, res) {
    const result = findValidation.validate(req.query);
    if (result.error) {
        const message1 = result.error.message ? result.error.message : "ID inválido";
        return res.status(400).json(getControllerResult(message1, null));
    }
    const inscripciones = await getInscripcionesSinAprobarFromService(req.query.id);
    const message2 = inscripciones.details ? inscripciones.details : "Error al obtener inscripciones";
    if (inscripciones.error) {
        return res.status(500).json(getControllerResult(message2, inscripciones));
    }
    if (inscripciones.length <= 0) {
        return res.status(204).json(getControllerResult(message2, inscripciones));
    }
    return res.status(200).json(getControllerResult(message2, inscripciones));
}

export async function private_getInscripciones(req, res) {
    const inscripciones = await getInscripcionesFromService();
    const message2 = inscripciones.details ? inscripciones.details : "Error al obtener inscripciones";
    if (inscripciones.error) {
        return res.status(500).json(getControllerResult(message2, inscripciones));
    }
    if (inscripciones.length <= 0) {
        return res.status(204).json(getControllerResult(message2, inscripciones));
    }
    return res.status(200).json(getControllerResult(message2, inscripciones));
}

const createInscripcionHelper = async (req, res) => {
    let result = createValidation.validate(req.body);
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message, null));
    }
    result = integrityValidation.validate(req.body);
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message, null));
    }
    const serviceResult = await createInscripcionFromService(req.body);
    if (serviceResult.error) {
        return res.status(500).json(getControllerResult(serviceResult.details || "Error desconocido", serviceResult));
    }
    if (serviceResult.length <= 0) {
        serviceResult.error = true;
        return res.status(400).json(getControllerResult(serviceResult.details || "Error desconocido", serviceResult));
    }
    return res.status(201).json(getControllerResult(serviceResult.details, serviceResult));
}


export async function private_createInscripcion(req, res) {
    if (!req.body) {
        return res.status(400).json(getControllerResult("Datos no proporcionados", null));
    }
    if (req.body.estado) {
        return res.status(400).json(getControllerResult("Intento de establecer un estado arbitrariamente", null));
    }
    req.body.estado = APPROVED;
    return createInscripcionHelper(req, res);
}

export async function public_createInscripcion(req, res) {
    if (!req.body) {
        return res.status(400).json(getControllerResult("Datos no proporcionados", null));
    }
    if (req.body.estado) {
        return res.status(400).json(getControllerResult("Intento de establecer un estado arbitrariamente", null));
    }    
    if (req.body.id_usuario) {
        return res.status(400).json(getControllerResult("Intento de inscribirle un electivo a un usuario externo", null));
    }
    req.body.estado = AWAITING;
    req.body.id_usuario = req.user.id;
    return createInscripcionHelper(req, res);
}
