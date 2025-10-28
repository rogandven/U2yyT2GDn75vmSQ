"use strict";

import Clase from "@entity/clase.entity.js";
import { AppDataSource } from "@config/configDb.js";
import { findClaseById_electivo, updateClaseById_Electivo } from "@services/clase.service.js";
import { assignationValidation } from "@validations/clase.validation";


export async function asignarClase(req, res) {
  try {
    
    const claseRepository = AppDataSource.getRepository(Clase);
    const { sala,horario,fecha_inicio_clases} = req.body;
    const { error } = assignationValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existingHorario = await claseRepository.findOne({
      where: { horario },
    });
    if (existingHorario)
      return res.status(409).json({ message: "Horaio ya registrado." });

    const existingSala = await claseRepository.findOne({ where: { sala } });
    if (existingSala)
      return res.status(409).json({ message: "Sala ya registrado." });


    
    const newClase = claseRepository.create({
      sala,
      horario,
      fecha_inicio_clases
    });
    await claseRepository.save(newClase);

    res
      .status(201)
      .json({ message: "Horario registrado exitosamente!", data: dataClase });
  } catch (error) {
    console.error("Error en auth.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar el curso" });
  }
}

export function getPublicClass(req, res) {
  handleSuccess(res, 200, "Clases obtenidas exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getClases(req, res) {
  const clase = req.clase;
  // console.log(user);
  // console.log(JSON.stringify(user));
  const additionalData = await findClaseById_electivo((clase && Clase.id_electivo) || "");
  if (!additionalData) {
    return handleErrorClient(res, 400, "Clase no encontrado");
  }

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${clase.id_electivo}! Este es tu clase. Solo tú puedes verlo.`,
    userData: clase,
    additionalData: additionalData
  });
}

export async function patchClase(req, res) {
  const claseId = req.clase.sub; 
  const { sala, horario, fecha_inicio_clases } = req.body;

  if (!sala && !horario && !fecha_inicio_clases) {
    return handleErrorClient(res, 400, "Debes proporcionar al menos un campo para actualizar.");
  }

  try {
    const updatedClase = await updateClaseById_Electivo(claseId, { sala, horario, fecha_inicio_clases });
    handleSuccess(res, 200, "Clase actualizada exitosamente", updatedClase);
  } catch (error) {
    handleErrorClient(res, 500, "Error al actualizar la clase.", error.message);
  }
}


export async function deleteClase(req, res) {
  const claseId = req.clase.sub; 
  console.log(claseId);
  try {
    await deleteUserById(userId);
    handleSuccess(res, 200, "Clase eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar la clase", error.message);
  }
}

