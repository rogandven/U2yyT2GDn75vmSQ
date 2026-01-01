"use strict";
import { handleErrorClient } from "../handlers/response.handlers.js";
import { createCarrera,findAllCarreras,getCarrera, updateCarreraById_Carrera } from "../services/carrera.service.js";
import { career } from "../validations/carrera.validation.js";
export async function createCarreras(req,res){
    try{
        let newCarrera=null;
        if(!req.body || !req.params){
            return res.status(400).json({message: "Datos no proporcionados"});
        }

        
        const { sigla,nombre } = req.body;

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

        const updatedCarrera = await updateCarreraById_Carrera(updatedCarrera);
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