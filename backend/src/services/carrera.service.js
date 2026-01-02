import { AppDataSource } from "../config/configDb.js";
import { CARRERA_NO_ENCONTRADA } from "../constants/career.constants.js";
import { CAREER_HEAD_ROLE } from "../constants/user.constants.js";
import { carreraEntity } from "../entity/carrera.entity.js";
const carreraRepository = AppDataSource.getRepository(carreraEntity);
export async function getCarrera(id_carrera) {
  try {
    return await carreraRepository.findOne({where: {id_carrera: id_carrera}});
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createCarrera(sigla, nombre) {
  try {
    if (!sigla || !nombre) {
      throw Error("Función mal llamada", {sigla, nombre})
    }
    const newCarrera = carreraRepository.create({
      sigla,
      nombre,
    });
    await carreraRepository.save(newCarrera);
    return newCarrera;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateCarreraById_Carrera(carrera, id_carrera) {
  try {
    if (!carrera) {
      throw new Error("Función mal llamada");
    }
    console.log(carrera);
    console.log(id_carrera);
    return {data: await carreraRepository.update({id_carrera: id_carrera}, carrera), message: "Carrera actualizado con éxito", error: null};
  } catch (error) {
    return {data: null, message: "Error al actualizar carrera", error: error};
  }
}

export async function findAllCarreras() {
  return await carreraRepository.find();
}

export async function deleteCarreraById_Carrera(id_carrera) {
  try {
    const carrera = await carreraRepository.findOne({where: { id_carrera: id_carrera }});

    if (!carrera) {
      return {
        result: null,
        message: CARRERA_NO_ENCONTRADA
      }
    }
    return {
      result: (await carreraRepository.delete({id_carrera: carrera.id_carrera})), 
      message: "¡Carrera eliminado exitosamente!"
    };
  } catch (error) {
    console.error(error);
    return {
      result: null,
      message: "Error al eliminar la carrera"
    };
  }
}







