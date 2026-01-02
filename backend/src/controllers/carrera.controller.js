"use strict";
import { handleErrorClient } from "../handlers/response.handlers.js";
import { createCarrera,deleteCarreraById_Carrera,findAllCarreras,getCarrera, updateCarreraById_Carrera } from "../services/carrera.service.js";
import { careerValidationFunction } from "../validations/carrera.validation.js";
import { handleSuccess,handleErrorServer } from "../handlers/response.handlers.js";

export async function createCarreras(req,res){
    try{
        let newCarrera=null;
        if(!req.body || !req.params){
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        
        const { sigla,nombre } = req.body;

        //let result=careerValidationFunction

         if (newCarrera = await createCarrera(sigla,nombre)) {
            return res.status(201).json({ message: "Carrera registrado exitosamente!", data: newCarrera });
        } else {
              return res.status(500).json({message: "Error al registrar carrera"});
        }
        
    }catch(error){
        console.error("Error en carrera.controller.js -> register(): ", error);
    return res.status(500).json({ message: "Error al registrar la carrera" });
    }
}

export async function getCarreras(req,res) {
    const carreraData= await findAllCarreras();
    if(!carreraData){
        return handleErrorClient(res,400,"horarios no encontrados");
    }

    //await getCarrera(carreraData);
      return handleSuccess(res, 200, "Horarios obtenidos exitosamente", carreraData);
}

export async function patchCarrera(req,res) {
    try{
        if (!req || !req.params || !req.body) {
            return res.status(400).json({message: "Datos no proporcionados"});
        }
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ message: "El ID de la carrera es obligatoria" });
        }

        const carreraToUpdate = await getCarrera(id);
            if (!carreraToUpdate) {
              return handleErrorClient(res, 404, "Carrera no encontrada");
            }
            Object.assign(carreraToUpdate, req.body);

        const updatedCarrera = await updateCarreraById_Carrera(req.body,id);
        if (!(updatedCarrera.data)) {
        if (!(updatedCarrera.error)) {
            return handleErrorClient(res, 500, updatedCarrera.message);
        }
            return handleErrorClient(res, 400, updatedCarrera.message);
        }
         return handleSuccess(res, 200, "¡Carrera actualizado con éxito!", updatedCarrera.data);

    
        
    }catch(error){
        return handleErrorServer(res, 500, "Error interno del servidor", error);
    }
}

export async function deleteCarrera(req, res) {
  try {  
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "El ID de la carrera es obligatorio" });
    }


    const result = await deleteCarreraById_Carrera(id);
    if (result && result.result && result.result.affected >= 1) {
      return handleSuccess(res, 200, "Carrera eliminada exitosamente", result);
    }
    if (result.message === HORARIO_NO_ENCONTRADO) {
      return handleErrorClient(res, 404, result.message, result.result);
    }
    return handleErrorClient(res, 400, result.message, result.result);
  } catch (error) {
    return handleErrorServer(res, 500, "Error al eliminar la Carrera", error.message);
  }
}