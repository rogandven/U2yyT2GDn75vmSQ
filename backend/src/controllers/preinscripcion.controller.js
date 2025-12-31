"use strict";
import { getPreinscripciones as s_getPreinscripciones } from "../service/electivo.service.js";
import { getPreinscripcionById as s_getPreinscripcionById } from "../service/electivo.service.js";
import { createPreinscripcion as s_createPreinscripcion } from "../service/electivo.service.js";
import { updatePreinscripcion as s_updatePreinscripcion } from "../service/electivo.service.js";
import { deletePreinscripcion as s_deletePreinscripcion } from "../service/electivo.service.js";



export async function getPreinscripciones(req, res) {
    try {
        const electivos = await s_getPreinscripciones();
        if (electivos.length <= 0) {
            return res.status(204).json({message: "No hay electivos para mostrar", electivos: null});
        }
        return res.status(200).json({message: "¡Preinscripciones encontrados con éxito!", electivos: electivos});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivos: null});
    }
}

export async function getPreinscripcionById(req, res) {
    try {
        const electivo = await s_getPreinscripcionById(req.params.id);
        if (!electivo) {
            return res.status(404).json({message: "Preinscripcion no encontrado", electivo: null});
        }
        return res.status(200).json({message: "¡Preinscripcion encontrado con éxito!", electivo: electivo});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Error interno del servidor", electivos: null});
    }
}

export async function createPreinscripcion(req, res) {
    try {
        const electivo = await s_createPreinscripcion(req.body);
        return res.status(201).json({message: "Preinscripcion creado con éxito", electivo: electivo});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", electivo: null});
    }
}

export async function updatePreinscripcion(req, res) {
    try {
        const result = await s_updatePreinscripcion(req.params.id, req.body);
        return res.status(201).json({message: "Preinscripcion actualizado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}

export async function deletePreinscripcion(req, res) {
    try {
        const result = await s_deletePreinscripcion(req.params.id);
        return res.status(201).json({message: "Preinscripcion eliminado con éxito", result: result});
    } catch (error) {
        return res.status(500).json({message: "Error interno del servidor", result: null});
    }
}