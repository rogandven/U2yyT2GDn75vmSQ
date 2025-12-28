"use strict";
import { assignationValidation, integrityValidation, updateValidation, validateHourBusiness, validateHourIntegrity } from "../validations/horario.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { electivoExists } from "../service/electivo.service.js";
import { createHorario, findAllHorarios, getConflictingHorarios, deleteHorarioById_Electivo } from "../services/horario.service.js";
import { getHorario, updateHorarioById_Electivo } from "../services/horario.service.js";
import { HORARIO_NO_ENCONTRADO } from "../constants/horarioConstants.js";

const isValidTimeFormat = (timeStr) => {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!regex.test(timeStr)) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const timeValidationHelper = (hora_inicio, hora_termino) => {
  let result = validateHourIntegrity(hora_inicio, "hora de inicio");
  if (result) {
    return String(result);
  }
  result = validateHourIntegrity(hora_termino, "hora de termino");
  if (result) {
    return String(result);
  }
  result = validateHourBusiness(hora_inicio, hora_termino);
  if (result) {
    return String(result);
  }
  return null;
} 

const joiValidationHelper = (validationFunction, integrityFunction, body) => {
    let result = validationFunction.validate(body);
    if (result.error) {
      return String(result.error.message);
    }
    result=integrityFunction.validate(body);
    if (result.error) {
      return String(result.error.message);
    }
    return null;
}

const electivoExistanceCheckerHelper = async (id_electivo) => {
    const electivoReallyExists = (await electivoExists(id_electivo));

    if (electivoReallyExists === null) {
      return {message: String("Error interno del servidor"), status: 500};
    }
    if (electivoReallyExists === false) {
      return {message: String("Electivo no encontrado"), status: 400};
    }
    return null;
}

export async function asignarHorario(req, res) {
  try {
    let newHorario = null;
    if (!req.body || !req.params) {
      return res.status(400).json({ message: "Datos no proporcionados"});
    }
    if (req.body.dia) {
      req.body.dia = String(req.body.dia).toLowerCase().trim();
    }
    const { id_electivo } = req.params;
    let validationResult = idValidation.validate({id: id_electivo});
    if (validationResult.error) {
      return res.status(400).json({message: validationResult.error?.message || "ID inválido"});
    }
    validationResult = joiValidationHelper(assignationValidation, integrityValidation, req.body);
    if (validationResult) {
      return res.status(400).json({message: validationResult});
    }
    let result = timeValidationHelper(req.body.hora_inicio, req.body.hora_termino);
    if (result) {
      return res.status(400).json({ message: String(result) });
    } 
    const electivoReallyExists = await electivoExistanceCheckerHelper(id_electivo);
    if (electivoReallyExists) {
      return res.status(electivoReallyExists.status).json({message: electivoReallyExists.message});
    }

    const { hora_inicio, hora_termino, sala, dia } = req.body;

    const existingHorarioSala = await getConflictingHorarios(hora_inicio, hora_termino, sala, dia);
    if (existingHorarioSala.length > 0) {
      return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
    }
    
    if (await isFirstHorario(id_electivo)) {
      const chiefs = await EMAIL_getAllCareerChiefs(req.user.carrera || req.user.career);
      const electivo = await RAW_getElectivoById(id_electivo);
      const nombre = String(electivo?.nombre || "Electivo desconocido");

      chiefs.forEach((chief) => {
        sendMail(chief.email, "Confirmación", `El electivo ${nombre.toUpperCase()} va a ser impartido por ${String(req.user.fullname || req.user.username || "Profesor desconocido").toUpperCase()}. Por favor, revise el sistema.`);
      });
    }

    if (newHorario = await createHorario(id_electivo, hora_inicio, hora_termino, sala, dia)) {
      return res.status(201).json({ message: "Horario registrado exitosamente!", data: newHorario });
    } else {
      return res.status(500).json({message: "Error al registrar horario"});
    }
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar el horario" });
  }
}

export async function patchHorario(req, res) {
  try {
    if (!req || !req.params || !req.body) {
      return res.status(400).json({message: "Datos no proporcionados"});
    }
    const { id } = req.params;
    if(!id){
      return res.status(400).json({ message: "El ID del horario es obligatorio" });
    }
    let validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return res.status(400).json({message: validationResult.error?.message || "ID inválido"});
    }
    validationResult = joiValidationHelper(updateValidation, integrityValidation);
    if (validationResult) {
      return res.status(400).json({message: String(validationResult)});
    }

    const horarioToUpdate = await getHorario(id);
    if (!horarioToUpdate) {
      return handleErrorClient(res, 404, "Horario no encontrado");
    }
    Object.assign(horarioToUpdate, req.body);

    let result = timeValidationHelper(horarioToUpdate.hora_inicio, horarioToUpdate.hora_termino);
    if (result) {
      return res.status(400).json({ message: String(result) });
    } 

    let existingHorarioSala = await getConflictingHorarios(horarioToUpdate.hora_inicio, horarioToUpdate.hora_termino, horarioToUpdate.sala, horarioToUpdate.dia);
    existingHorarioSala = existingHorarioSala.filter((horario) => {
      return Number(horario.id_horario) !== Number(horarioToUpdate.id_horario);
    });
    
    if (existingHorarioSala.length > 0) {
      return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
    }
    const updatedHorario = await updateHorarioById_Electivo(horarioToUpdate);
    if (!(updatedHorario.data)) {
      if (!(updatedHorario.error)) {
        return handleErrorClient(res, 500, updatedHorario.message);
      }
      return handleErrorClient(res, 400, updatedHorario.message);
    }
    return handleSuccess(res, 200, "¡Horario actualizado con éxito!", updatedHorario.data);
  } catch (error) {
    return handleErrorServer(res, 500, "Error interno del servidor", error);
  }
}

export function getPublicClass(req, res) {
  handleSuccess(res, 200, "Horarios obtenidas exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getHorarios(req, res) {
  const horarioData = await findAllHorarios();
  if (!horarioData) {
    return handleErrorClient(res, 400, "Horarios no encontrados");
  }
  return handleSuccess(res, 200, "Horarios obtenidos exitosamente", horarioData);
}

export async function deleteHorario(req, res) {
  try {  
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "El ID del horario es obligatorio" });
    }
    let validationResult = idValidation.validate({id: id});
    if (validationResult.error) {
      return handleErrorClient(res, 400, validationResult.error.message);
    }


    const result = await deleteHorarioById_Electivo(id);
    if (result && result.result && result.result.affected >= 1) {
      return handleSuccess(res, 200, "Horario eliminado exitosamente", result);
    }
    if (result.message === HORARIO_NO_ENCONTRADO) {
      return handleErrorClient(res, 404, result.message, result.result);
    }
    return handleErrorClient(res, 400, result.message, result.result);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al eliminar el horario", error.message);
  }
}



