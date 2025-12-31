"use strict";
import { updateCarreraById_Carrera } from "../services/carrera.service.js";
import { career } from "../validations/carrera.validation.js";
export async function createCarrera(req,res){
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