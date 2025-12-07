"use strict";
import { getInscripcionesByUserFromService, getInscripcionesSinAprobarFromService, getInscripcionesFromService, createInscripcionFromService, updateInscripcionFromService, public_updateInscripcionFromService, deleteInscripcionFromService, public_deleteInscripcionFromService, getInscripcionFromService } from "../service/inscripcion.service.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { findValidation } from "../validations/inscripcion.validation.js";
import { getControllerResult } from "./utils/utils.controller.js";
import { createValidation, integrityValidation, updateValidation } from "../validations/inscripcion.validation.js";
import { APPROVED, AWAITING, REJECTED, VALID_STATUS_ARRAY } from "../constants/inscripcion.constants.js";

export async function private_getInscripcionesByUser(req, res) {
    const result = findValidation.validate(req.params);
    if (result.error) {
        const message1 = result.error.message ? result.error.message : "ID inválido";
        return res.status(400).json(getControllerResult(message1, null));
    }
    const inscripciones = await getInscripcionesByUserFromService(req.params.id);
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
    return await private_getInscripcionesByUser(req, res);
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

const updateInscriptionHelper = async (req, res, updateFunction) => {
    if (!updateFunction) {
        throw Error("Falta pasar la función como argumento");
    }
    let result = updateValidation(req.body);
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message ? result.error.message : "Datos faltantes"));
    }
    result = integrityValidation(req.body);
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message ? result.error.message : "Datos inválidos"));
    }
    const serviceResult = await updateFunction(req.params.id, req.body);
    if (serviceResult.error) {
        return res.status(500).json(getControllerResult(serviceResult.details || "Error interno del servidor", serviceResult));
    }
    if (serviceResult.length <= 0) {
        serviceResult.error = true;
        return res.status(400).json(getControllerResult(serviceResult.details || "Error al actualizar la inscripción", serviceResult));
    }
    return res.status(200).json(getControllerResult(serviceResult.details || "Inscripción actualizada con éxito", serviceResult));
}

export async function public_updateInscripcion(req, res) {
    if (req.body.id_usuario) {
        return res.status(401).json(getControllerResult("No se puede editar la inscripción de otro usuario", null));
    }
    if (req.body.estado) {
        return res.status(401).json(getControllerResult("No se puede cambiar un estado arbitrariamente", null));
    }
    let result = idValidation.validate({id: req.params.id});
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message || "ID inválido", null));
    }
    req.body.id_usuario = req.user.id;
    req.body.estado = AWAITING;
    return await updateInscriptionHelper(req, res, public_updateInscripcionFromService);
}

export async function private_updateInscripcion(req, res) {
    let result = idValidation.validate({id: req.params.id});
    if (result.error) {
        return res.status(400).json(getControllerResult(result.error.message || "ID inválido", null));
    }
    return await updateInscriptionHelper(req, res, updateInscripcionFromService);
}

const deleteInscriptionHelper = async (id, deleteFunction) => {
    const result = await deleteFunction(id);
    if (result.error) {
        return res.status(500).json(getControllerResult(result.details || "Error al eliminar inscripción", result));
    }
    if (result.length <= 0) {
        return res.status(400).json(getControllerResult(result.details, result));
    }
    return res.status(200).json(getControllerResult(result.details, result));
}

export async function private_deleteInscripcion(req, res) {
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    return await deleteInscriptionHelper(id, deleteInscripcionFromService);
}

export async function public_deleteInscripcion(req, res) {
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    return await deleteInscriptionHelper(id, public_deleteInscripcionFromService);
}

export async function public_getInscripcion(req, res) {
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    const inscripcion = await getInscripcionFromService(id, req.user.id, true);
    if (inscripcion.error) {
        return res.status(500).json(getControllerResult(inscripcion.details || "Error interno del servidor", inscripcion));
    }
    if (inscripcion.length <= 0) {
        return res.status(400).json(getControllerResult(inscripcion.details || "Mensaje desconocido", inscripcion));
    }
    return res.status(200).json(getControllerResult("Inscripción encontrada con éxito", inscripcion));
}

export async function private_getInscripcion(req, res) {
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    const inscripcion = await getInscripcionFromService(id, null, false);
    if (inscripcion.error) {
        return res.status(500).json(getControllerResult(inscripcion.details || "Error interno del servidor", inscripcion));
    }
    if (inscripcion.length <= 0) {
        return res.status(400).json(getControllerResult(inscripcion.details || "Mensaje desconocido", inscripcion));
    }
    return res.status(200).json(getControllerResult("Inscripción encontrada con éxito", inscripcion));
}

const changeInscriptionStatusHelper = async (req, res, status) => {
    const newStatus = String(status);
    if (!(VALID_STATUS_ARRAY.includes(status))) {
        return res.status(400).json(getControllerResult("Estado no válido", null));
    }
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    const { data, error, details, length } = await getInscripcionFromService(id, null, false);

    if (error) {
        return res.status(500).json(getControllerResult(details, data));
    }
    if (length <= 0 || !data) {
        return res.status(400).json(getControllerResult(details, data));
    }
    if (data.estado === status) {
        return res.status(400).json(getControllerResult(`La inscripción ${id} ya está ${newStatus.toLowerCase().replace("_", " ")}`));
    }
    const newBody = { estado: newStatus };
    req.body = newBody;
    return await private_updateInscripcion(req, res);
}


export async function private_approveInscripcion(req, res) {
    return await changeInscriptionStatusHelper(req, res, APPROVED);
}

export async function private_rejectInscripcion(req, res) {
    return await changeInscriptionStatusHelper(req, res, REJECTED);
}