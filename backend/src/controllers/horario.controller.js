"use strict";

import HorarioEntity from "../entity/horario.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
// import { findClaseById_electivo, updateHorarioById_Electivo, findAllHorarios, deleteHorarioById_Electivo } from "../services/horario.service.js";
import { assignationValidation, integrityValidation, updateValidation, validateHourBusiness, validateHourIntegrity } from "../validations/horario.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/response.handlers.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { electivoExists } from "../service/electivo.service.js";
import { createHorario, getConflictingHorarios } from "../services/horario.service.js";
import { getHorario, updateHorarioById_Electivo } from "../services/horario.service.js";

const isValidTimeFormat = (timeStr) => {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!regex.test(timeStr)) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

const timeValidationHelper = (hora_inicio, hora_termino) => {
  result = validateHourIntegrity(hora_inicio, "hora de inicio");
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
    result = timeValidationHelper(hora_inicio, hora_termino);
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
  const { hora_inicio, hora_termino, sala, dia } = req.body;
  
  let existingHorarioSala = await getConflictingHorarios(hora_inicio, hora_termino, sala, dia);
  existingHorarioSala = existingHorarioSala.filter((horario) => {
    return horario && (horario.id_horario !== id);
  });
  if (existingHorarioSala.length > 0) {
    return res.status(409).json({ message: "Horario y sala ya registrados.", conflicts: existingHorarioSala });
  }

  const updatedHorario = await updateHorarioById_Electivo(id, { hora_inicio, hora_termino, sala, dia });
  if (!(updatedHorario.data)) {
    if (!(updatedHorario.error)) {
      return handleErrorClient(res, 500, updatedHorario.message);
    }
    return handleErrorClient(res, 400, updatedHorario.message);
  }
  return handleSuccess(res, 200, "¡Horario actualizado con éxito!", updatedHorario.data);
}

export function getPublicClass(req, res) {
  handleSuccess(res, 200, "Horarios obtenidas exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getHorarios(req, res) {
  // const clase = req.clase;
  // // console.log(user);
  // // console.log(JSON.stringify(user));
  const horarioData = await findAllHorarios();
  if (!horarioData) {
    return handleErrorClient(res, 400, "Horarios no encontradas");
  }
  return handleSuccess(res, 200, "Horarios obtenidas exitosamente", horarioData);
}
  /* const additionalData = await findClaseById_electivo((clase && clase.id_electivo) || 0);
  if (!additionalData) {
    return handleErrorClient(res, 400, "Clase no encontrado");
  }
  */

  /* handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${clase.id_electivo}! Este es tu clase. Solo tú puedes verlo.`,
    userData: clase,
    additionalData: additionalData
  });
} */


export async function deleteHorario(req, res) {
  // const claseId = req.clase.sub;
  const horarioRepository= AppDataSource.getRepository(HorarioEntity); 
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "El ID del horario es obligatorio" });
  }
  // console.log(id);
  try {
    await deleteHorarioById_Electivo(id);
    handleSuccess(res, 200, "Horario eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar el horario", error.message);
  }
}



