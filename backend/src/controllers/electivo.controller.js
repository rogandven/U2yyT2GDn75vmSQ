"use strict";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getElectivo(req, res) {
  try {
    // Obtener el repositorio de electivos y buscar todos los electivos
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const electivo = await ElectivoEntityRepository.find();

    res.status(200).json({ message: "Electivos encontrados: ", data: electivo});
  } catch (error) {
    console.error("Error en electivo.controller.js -> getUsers(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getElectivoById(req, res) {
  try {
    // Obtener el repositorio de electivos y buscar un electivo por ID
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const { id } = req.params;
    const electivos = await ElectivoEntityRepository.findOne({ where: { id } });

    // Si no se encuentra el electivo, devolver un error 404
    if (!electivos) {
      return res.status(404).json({ message: "Electivo no encontrado." });
    }

    res.status(200).json({ message: "Electivo encontrado: ", data: electivos });
  } catch (error) {
    console.error("Error en electivo.controller.js -> getUserById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function updateElectivoById(req, res) {
  try {
    // Obtener el repositorio de usuarios y buscar un usuario por ID
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const { id } = req.params;
    const { nombre, profesor, cupos, creditos, descripcion } = req.body;
    const electivos = await ElectivoEntityRepository.findOne({ where: { id } });

    // Si no se encuentra el electivo, devolver un error 404
    if (!electivos) {
      return res.status(404).json({ message: "Electivo no encontrado." });
    }

    // Validar que al menos uno de los campos a actualizar esté presente
    electivos.nombre = nombre || electivos.nombre;
    electivos.profesor = profesor || electivos.profesor;
    electivos.cupos = cupos || electivos.cupos;
    electivos.creditos = creditos || electivos.creditos;
    electivos.descripcion = descripcion || electivos.descripcion;

    // Guardar los cambios en la base de datos
    await ElectivoEntityRepository.save(electivos);

    res
      .status(200)
      .json({ message: "Electivo actualizado exitosamente.", data: electivos });
  } catch (error) {
    console.error("Error en electivo.controller.js -> updateElectivoById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function deleteElectivoById(req, res) {
  try {
    // Obtener el repositorio de electivos y buscar el electivo por ID
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const { id } = req.params;
    const electivos = await ElectivoEntityRepository.findOne({ where: { id } });

    // Si no se encuentra el electivo, devolver un error 404
    if (!electivos) {
      return res.status(404).json({ message: "Electivo no encontrado." });
    }

    // Eliminar el usuario de la base de datos
    await ElectivoEntityRepository.remove(user);

    res.status(200).json({ message: "Electivo eliminado exitosamente." });
  } catch (error) {
    console.error("Error en electivo.controller.js -> deleteElectivoById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getElectivos(req, res) {
  try {
    // Obtener el repositorio de electivos y buscar el perfil del electivo autenticado
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const electivosProfesor = req.electivos.profesor;
    const electivos = await ElectivoEntityRepository.findOne({ where: { profesor: electivosProfesor } });
    
    // Si no se encuentra el electivo, devolver un error 404
    if (!electivos) {
      return res.status(404).json({ message: "Electivo no encontrado." });
    }

    // Formatear la respuesta excluyendo la contraseña
    const formattedElectivo = {
      id: electivos.id,
      nombre: electivos.nombre,
      profesor: electivos.profesor,
      cupos: electivos.cupos,
      creditos: electivos.creditos
    };

    res.status(200).json({ message: "Electivo encontrado: ", data: formattedElectivo });
  } catch (error) {
    console.error("Error en electivo.controller -> getElectivo(): ", error);
    res.status(500).json({ message: "Error interno del servidor"})
  }
}
