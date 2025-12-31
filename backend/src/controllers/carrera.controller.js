"use strict";
import { getCarreras as s_getCarreras } from "../service/carrera.service.js";
import { getCarreraById as s_getCarreraById } from "../service/carrera.service.js";
import { createCarrera as s_createCarrera } from "../service/carrera.service.js";
import { updateCarrera as s_updateCarrera } from "../service/carrera.service.js";
import { deleteCarrera as s_deleteCarrera } from "../service/carrera.service.js";



export async function getCarreras(req, res) {
    try {
        const carreras = await s_getCarreras();
        if (carreras.length <= 0) {
            return res.status(204).json({message: "No hay carreras para mostrar", carreras: null});
        }
        return res.status(200).json({message: "¡Carreras encontradas con éxito!", carreras: carreras});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", carreras: null});
    }
}

export async function getCarreraById(req, res) {
    try {
        const carreras = await s_getCarreraById(req.params.id);
        if (carreras.length <= 0) {
            return res.status(204).json({message: "No hay carreras para mostrar", carreras: null});
        }
        return res.status(200).json({message: "¡Carreras encontradas con éxito!", carreras: carreras});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", carreras: null});
    }
}

export async function createCarrera(req, res) {
    try {
        const carrera = await s_createCarrera(req.body);
        return res.status(201).json({message: "Carrera creada con éxito", carrera: carrera});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", carrera: null});
    }
}

export async function updateCarrera(req, res) {
    try {
        const result = await s_updateCarrera(req.params.id, req.body);
        return res.status(201).json({message: "Carrera actualizada con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}

export async function deleteCarrera(req, res) {
    try {
        const result = await s_deleteCarrera(req.params.id);
        return res.status(201).json({message: "Carrera eliminada con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}