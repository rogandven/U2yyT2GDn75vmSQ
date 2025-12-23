"use strict";

import { APPROVED, AWAITING } from "../constants/inscripcion.constants.js";
import { createInscripcion, getInscripcion, getInscripciones, inscripcionAlreadyExists, isInvalidInscripcion } from "../service/inscripcion.service.js";
import { userExists as _userExists } from "../service/utils/utils.inscription.service.js";
import { createValidation, integrityValidation } from "../validations/inscripcion.validation.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { validationFunctionHelper } from "./utils/utils.controller.js";

/*
private_createInscripcion;
private_updateInscripcion;
private_deleteInscripcion;

private_approveInscripcion;
private_rejectInscripcion;

public_getInscripcion;
public_getInscripcionesByUser;

public_createInscripcion;
public_updateInscripcion;
public_deleteInscripcion;
*/ 

const getGenericResult = (data, message) => {
    return {data, message};
}

const getGenericError = (res) => {
    return res.status(500).json({data: null, message: "Error interno del servidor"});
}

const invalidResult = (result) => {
    return (!result || !result.data || !result.data.length);
}

export const private_getInscripciones = async (req, res) => {
    try {
        const result = await getInscripciones();
        if (invalidResult(result) || result.data.length <= 0) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_getInscripcionesByUser = async (req, res) => {
    const idValidationResult = idValidation.validate(req.params);
    if (idValidationResult.error) {
        return res.status(400).json(getGenericResult(null, idValidationResult.error.message));
    }
    const userExists = await _userExists(req.params.id);
    if (!userExists) {
        return res.status(404).json(getGenericResult(null, "Usuario no encontrado"));
    }

    try {
        let result = await getInscripciones();
        if (invalidResult(result)) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        result.data = result.data.filter((inscripcion) => {
            return inscripcion.id_usuario === req.params.id;
        });
        if (result.data.length <= 0) {
            return res.status(204).json(result);
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}   

export const private_getInscripcion = async (req, res) => {
    const idValidationResult = idValidation.validate(req.params);
    if (idValidationResult.error) {
        return res.status(400).json(getGenericResult(null, idValidationResult.error.message));
    }

    try {
        let result = await getInscripcion(req.params.id);
        if (!result || (await isInvalidInscripcion(result.data))) {
            return res.status(404).json(getGenericResult(null, "Inscripción no encontrada"));
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_getInscripcionesSinAprobar = async (req, res) => {
    try {
        let result = await getInscripciones();
        if (invalidResult(result)) {
            result.message = "No hay inscripciones para mostrar";
            return res.status(204).json(result);
        }
        result.data = result.data.filter((inscripcion) => {
            return inscripcion.estado === AWAITING;
        });
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

export const private_createInscripcion = async (req, res) => {
    try {
        req.body.estado = APPROVED;

        const validationResult = validationFunctionHelper([integrityValidation, createValidation], req.body);
        if (validationResult) {
            return res.status(400).json(getGenericResult(null, validationResult));
        }
        if (await isInvalidInscripcion(req.body)) {
            return res.status(404).json(getGenericResult(null, "Usuario o electivo no encontrado"));
        }
        if (await inscripcionAlreadyExists(null, req.body.id_usuario, req.body.id_electivo)) {
            return res.status(409).json(getGenericResult(null, "Ya existe esta inscripción"));
        }
        const inscripcionCreada = await createInscripcion(req.body);
        if (inscripcionCreada.data) {
            return res.status(200).json(inscripcionCreada);
        }
        return res.status(500).json(inscripcionCreada);
    } catch (error) {
        console.error(error);
        return getGenericError(res);
    }
}

/*
export async function private_getInscripcionesByUser(req, res) {
    const result = idValidation.validate({id: req.params && req.params.id})
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
    const inscripciones = await getInscripcionesSinAprobarFromService();
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

const validationFunctionHelper = (array, body) => {
    let _error = null;
    if (!Array.isArray(array || null) || !body) {
        return "Datos no proporcionados";
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i] && array[i].validate) {
            _error = (array[i].validate(body)).error;
            if (_error) {
                return String(_error.message);
            }
        }
    }
    return null;
}

const updateInscriptionHelper = async (inscripcion, res, id) => {
    try {
        let validationResult = validationFunctionHelper([integrityValidation, updateValidation], inscripcion);
        if (validationResult) {
            return res.status(400).json(getControllerResult(validationResult, null));
        }
        const updateResult = await updateInscripcionFromService(inscripcion, id);
        if (updateResult.length >= 1) {
            return res.status(200).json(getControllerResult(updateResult.details, updateResult.data));
        } else {
            return res.status(500).json(getControllerResult(updateResult.details, updateResult.data));
        }
    } catch (error) {
        return res.status(500).json(getControllerResult("Error interno del servidor", null));
    }
}

const validateBasicUpdateRequirements = (req) => {
    if (!req.params || !req.params.id) {
        return "ID no proporcionado";
    } 
    if (!req.body) {
        return "Datos no proporcionados";
    } 
    let validationResult = idValidation.validate({id: req.params.id});
    if (validationResult.error) {
        return String(validationResult.error.message);
    }
    return null;
}

export async function public_updateInscripcion(req, res) {
    if (req.body && req.body.id_usuario) {
        return res.status(401).json(getControllerResult("No se puede cambiar la inscripción de otro usuario"));
    }
    if (req.body && req.body.estado) {
        return res.status(401).json(getControllerResult("No se puede autoasignar un estado"));
    }
    req.body.estado = AWAITING;
    req.body.id_usuario = req.user.id;
    return await private_updateInscripcion(req, res);
}

export async function private_updateInscripcion(req, res) {
    const basicValidationResult = validateBasicUpdateRequirements(req);
    if (basicValidationResult) {
        return res.status(400).json(getControllerResult(basicValidationResult, null));
    }
    const inscripcionToUpdate = await alternateGetInscripcionFromService(req.params.id);
    if (inscripcionToUpdate.error) {
        return res.status(500).json(getControllerResult(inscripcionToUpdate.message, inscripcionToUpdate.inscripcion));
    }
    if (!inscripcionToUpdate.inscripcion) {
        return res.status(404).json(getControllerResult(inscripcionToUpdate.message, inscripcionToUpdate.inscripcion));
    }
    const parsedInscripcion = inscripcionToUpdate.inscripcion;
    console.log(parsedInscripcion);
    Object.assign(parsedInscripcion, req.body);

    const copies = await findCopyEdit(req.params.id, parsedInscripcion.id_usuario, parsedInscripcion.id_electivo);
    if (copies.length > 0) {
        return res.status(401).json(getControllerResult("Ya existe esta inscripción", copies));
    }

    const updateResult = await updateInscripcionFromService(parsedInscripcion, req.params.id);
    if (updateResult.error) {
        return res.status(500).json(getControllerResult("Error interno del servidor", null));
    }
    if (updateResult.length <= 0) {
        return res.status(400).json(getControllerResult(updateResult.details, null));
    }
    return res.status(200).json(getControllerResult(updateResult.details, updateResult));
}

const deleteInscriptionHelper = async (id, deleteFunction, res) => {
    const result = await deleteFunction(id);
    console.log(result);
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
    return await deleteInscriptionHelper(id, deleteInscripcionFromService, res);
}

export async function public_deleteInscripcion(req, res) {
    const id = req.params.id || null;
    const validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
        return res.status(400).json(getControllerResult(validationResult.error.message || "Datos inválidos", null));
    }
    return await deleteInscriptionHelper(id, public_deleteInscripcionFromService,res);
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
    const result = await getInscripcionFromService(id, null, false);
    const { data, details, error, length } = result;
    if (error) {
        return res.status(500).json(getControllerResult(details, data));
    }
    if (length <= 0 || !data) {
        return res.status(400).json(getControllerResult(details, data));
    }
    if (data.estado === status) {
        return res.status(400).json(getControllerResult(`La inscripción ${id} ya está ${newStatus.toLowerCase().replaceAll("_", " ")}`));
    }
    const newBody = { estado: newStatus };
    req.body = newBody;
    return await private_updateInscripcion(req, res);
}


export async function private_approveInscripcion(req, res) {
    return await changeInscriptionStatusHelper(req, res, APPROVED);
}

export async function private_rejectInscripcion(req, res) {
    console.log(req.params.id);
    return await changeInscriptionStatusHelper(req, res, REJECTED);
}
*/