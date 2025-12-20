"use strict";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation, updateValidation } from "../validations/electivo.validation.js";
import { aprobarElectivoById_Electivo, rechazarElectivoById_Electivo } from "../services/aprobar.service.js";

export async function createElectivo(req, res) {
  try {
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const { nombre, profesor, cupos, creditos, descripcion } = req.body;
    const { error } = createValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const newElectivo = ElectivoEntityRepository.create({
      nombre,
      profesor,
      cupos,
      creditos,
      descripcion
    });
    await ElectivoEntityRepository.save(newElectivo);



    res
      .status(201)
      .json({ message: "Electivo registrado exitosamente!", data: newElectivo });
  } catch (error) {
    return res.status(400).json({message: "Error al crear electivo", data: error})
  }
}

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
    // Obtener el repositorio de electivos y buscar un electivo por ID
    const ElectivoEntityRepository = AppDataSource.getRepository(ElectivoEntity);
    const { id } = req.params;
    const { nombre, profesor, cupos, creditos, descripcion } = req.body;
    const { error } = updateValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
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
  }
}
/*"use strict" ;
import Electivo from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js"; */

export async function getElectivos(req, res) {
  try {
   
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
    const electivos = await electivoRepository.find();
    if (electivos.length <= 0) {
      return res.status(204).json({ message: "No hay electivos para mostrar.", data: null});
    }

    res.status(200).json({ message: "Electivos encontrados: ", data: electivos });
    } catch (error) {
    console.error("Error en electivo.controller.js -> getElectivos(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}
export async function createElectivo2(req, res) {
  try {
  
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
    const { nombre, descripcion, creditos } = req.body;
   
    const newElectivo = electivoRepository.create({
      nombre,
      descripcion,
        creditos,
    });
   
    await electivoRepository.save(newElectivo);
    res.status(201).json({ message: "Electivo creado exitosamente.", data: newElectivo });
  } catch (error) {
    console.error("Error en electivo.controller.js -> createElectivo(): ", error);
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

    // Eliminar el electivo de la base de datos
    await ElectivoEntityRepository.remove(electivos);

    res.status(200).json({ message: "Electivo eliminado exitosamente." });
  } catch (error) {
    console.error("Error en electivo.controller.js -> deleteElectivoById(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getElectivos2(req, res) {
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
export async function deleteElectivo(req, res) {
  try {
   
    const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
    const { id } = req.params;
    const electivo = await electivoRepository.findOne({ where: { id } });
 
    if (!electivo) {
      return res.status(404).json({ message: "Electivo no encontrado." });
    }

    await electivoRepository.remove(electivo);
    res.status(200).json({ message: "Electivo eliminado exitosamente." });
  } catch (error) {
    console.error("Error en electivo.controller.js -> deleteElectivoById(): ", error
    );
    res.status(500).json({ message: "Error interno del servidor." });
  }
  
}

export async function updateElectivo(req, res) {
    try {
      
        const electivoRepository = AppDataSource.getRepository(ElectivoEntity);
        const { id } = req.params;
        const { nombre, descripcion, creditos } = req.body;
        const electivo = await electivoRepository.findOne({ where: { id } });
      
        if (!electivo) {
            return res.status(404).json({ message: "Electivo no encontrado." });
        }
      
        electivo.nombre = nombre || electivo.nombre;
        electivo.descripcion = descripcion || electivo.descripcion;
        electivo.creditos = creditos || electivo.creditos;
      
        await electivoRepository.save(electivo);
        res.status(200).json({ message: "Electivo actualizado exitosamente.", data: electivo });
    } catch (error) {
        console.error("Error en electivo.controller.js -> updateElectivoById(): ", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

const cambiarEstadoHelper = async (funcion, texto, req, res) => {
    let code = 500;
    try {
        const { id } = req.params;
        
        const resultado = await funcion(id);
        code = resultado.code || 200;
        res.status(code).json({ message: `Electivo ${texto} exitosamente.`, data: (resultado.result || null) });
    } catch (error) {
        code = error.code ? error.code : 500;
        console.log(code);
        console.error("Error en electivo.controller.js -> updateElectivoById(): ", error);
        res.status(code).json({ message: "Error interno del servidor." });
    }
}

export async function aprobarElectivo(req, res) {
  return await cambiarEstadoHelper(aprobarElectivoById_Electivo, "aprobado", req, res);
}

export async function rechazarElectivo(req, res) {
  return await cambiarEstadoHelper(rechazarElectivoById_Electivo, "rechazado", req, res);
}

/*
"use strict";

import { AppDataSource } from "../config/configDb.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import {
  createValidation,
  updateValidation,
} from "../validations/electivo.validation.js";

const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

const AREAS_PERMITIDAS = [
  "Desarrollo de Software",
  "Bases de Datos y Sistemas de Información",
  "Ciencias de la Computación",
  "Inteligencia Artificial y Ciencia de Datos",
  "Redes y Telecomunicaciones",
  "Ciberseguridad",
  "Ingeniería de Software y Gestión TI",
  "Sistemas Operativos e Infraestructura",
  "Desarrollo Móvil e Interfaces",
  "Innovación y Habilidades Blandas"
];

export async function getElectivos(req, res) {
  try {
    const { filtro, area, apertura, cierre } = req.query;

    let query = electivoRepo.createQueryBuilder("electivo");

    if (filtro) {
      query = query.andWhere(
        "(electivo.nombre ILIKE :filtro OR electivo.descripcion ILIKE :filtro)",
        { filtro: `%${filtro}%` }
      );
    }

    if (area) query = query.andWhere("electivo.area ILIKE :area", { area });
    if (apertura)
      query = query.andWhere("DATE(electivo.apertura) = :apertura", {
        apertura,
      });
    if (cierre)
      query = query.andWhere("DATE(electivo.cierre) = :cierre", { cierre });

    const resultados = await query.getMany();

    res.status(200).json({
      message: "Electivos obtenidos correctamente",
      data: resultados,
    });
  } catch (error) {
    console.error("Error al listar electivos:", error);
    res.status(500).json({ message: "Error al listar electivos" });
  }
}

export async function createElectivo(req, res) {
  try {
    const { error } = createValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    if (!AREAS_PERMITIDAS.includes(req.body.area)) {
      return res.status(400).json({
        message: "Área no permitida. Debe seleccionar un área válida.",
      });
    }

    const nuevoElectivo = electivoRepo.create(req.body);
    await electivoRepo.save(nuevoElectivo);

    res.status(201).json({
      message: "Electivo creado correctamente",
      data: nuevoElectivo,
    });
  } catch (error) {
    console.error("Error al crear electivo:", error);
    res.status(500).json({ message: "Error al crear electivo" });
  }
};

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

export async function updateElectivo(req, res) {
  try {
    const { id } = req.params;
    const electivo = await electivoRepo.findOneBy({ id });

    if (!electivo)
      return res.status(404).json({ message: "Electivo no encontrado" });

    const { error } = updateValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    if (req.body.area && !AREAS_PERMITIDAS.includes(req.body.area)) {
      return res.status(400).json({
        message: "Área no permitida. Debe seleccionar un área válida.",
      });
    }

    Object.assign(electivo, req.body);
    await electivoRepo.save(electivo);

    res.status(200).json({
      message: "Electivo actualizado correctamente",
      data: electivo,
    });
  } catch (error) {
    console.error("Error al actualizar electivo:", error);
    res.status(500).json({ message: "Error al actualizar electivo" });
  }
}

export async function deleteElectivo(req, res) {
  try {
    const { id } = req.params;
    const electivo = await electivoRepo.findOneBy({ id });

    if (!electivo)
      return res.status(404).json({ message: "Electivo no encontrado" });

    await electivoRepo.remove(electivo);

    res.status(200).json({ message: "Electivo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar electivo:", error);
    res.status(500).json({ message: "Error al eliminar electivo" });
  }
}
*/
