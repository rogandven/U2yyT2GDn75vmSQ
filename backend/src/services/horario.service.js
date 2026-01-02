import { AppDataSource } from "../config/configDb.js";
import HorarioEntity from "../entity/horario.entity.js";
import { HORARIO_NO_ENCONTRADO } from "../constants/horarioConstants.js";
import bcrypt from "bcrypt";

const horarioRepository = AppDataSource.getRepository(HorarioEntity);

const isTaken = (horaInicioNueva, horaTerminoNueva, horaInicioAntigua, horaTerminoAntigua) => {
  const _horaInicioNueva = String(horaInicioNueva).toUpperCase();
  const _horaTerminoNueva = String(horaTerminoNueva).toUpperCase();
  const _horaInicioAntigua = String(horaInicioAntigua).toUpperCase();
  const _horaTerminoAntigua = String(horaTerminoAntigua).toUpperCase();

  const condicion1 = _horaInicioNueva.localeCompare(_horaInicioAntigua) >= 0;
  const condicion2 = _horaInicioNueva.localeCompare(_horaTerminoAntigua) <= 0;
  const condicion3 = condicion1 && condicion2;
  const condicion4 = _horaTerminoNueva.localeCompare(_horaInicioAntigua) >= 0;
  const condicion5 = _horaTerminoNueva.localeCompare(_horaTerminoAntigua) <= 0;
  const condicion6 = condicion4 && condicion5;

  return condicion3 || condicion6;
}

export async function getConflictingHorarios(hora_inicio, hora_termino, sala, dia) {
  try {
    const availableHorarios = await horarioRepository.find();
    if (!availableHorarios) {
      return [];
    }
    const conflictingHorarios = availableHorarios.filter((horario) => {
      if (String(horario.dia).toUpperCase() !== String(dia).toUpperCase()) {
        return false;
      }
      if (String(horario.sala).toUpperCase() !== String(sala).toUpperCase()) {
        return false;
      }
      return isTaken(hora_inicio, hora_termino, horario.hora_inicio, horario.hora_termino);
    });

    return conflictingHorarios;
  } catch (error) {
    console.error("Error al comparar los horarios: ", error);
    return [{}];
  }
}

export async function createHorario(id_electivo, hora_inicio, hora_termino, sala, dia) {
  try {
    if (!id_electivo || !hora_inicio || !hora_inicio || !sala || !dia) {
      throw Error("Función mal llamada", {id_electivo, hora_inicio, hora_termino, sala, dia})
    }
    const newHorario = horarioRepository.create({
      id_electivo: Number(id_electivo),
      hora_inicio,
      hora_termino,
      sala,
      dia 
    });
    await horarioRepository.save(newHorario);
    return newHorario;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getHorario(id_horario) {
  try {
    return await horarioRepository.findOne({where: {id_horario: id_horario}, relations: {electivo: true}});
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateHorarioById_Electivo(horario) {
  try {
    if (!horario) {
      throw new Error("Función mal llamada");
    }
    return {data: await horarioRepository.save(horario), message: "Horario actualizado con éxito", error: null};
  } catch (error) {
    return {data: null, message: "Error al actualizar horario", error: error};
  }
}

export async function findAllHorarios() {
  return await horarioRepository.find({relations: {electivo: true}});
}

export async function deleteHorarioById_Electivo(id_horario) {
  // console.log(id_electivo);
  try {
    const horario = await horarioRepository.findOne({where: { id_horario: id_horario },relations: {electivo: true}});

    if (!horario) {
      return {
        result: null,
        message: HORARIO_NO_ENCONTRADO
      }
    }
    // // console.log(user);
    // await userRepository.delete(user);
    return {
      result: (await horarioRepository.delete({id_horario: horario.id_horario})), 
      message: "¡Horario eliminado exitosamente!"
    };
  } catch (error) {
    console.error(error);
    return {
      result: null,
      message: "Error al eliminar el horario"
    };
  }
}

export const isFirstHorario = async (id_electivo) => {
  try {
    const cantidad = Number(await horarioRepository.count({where: {id_electivo: Number(id_electivo)}}));
    // console.log(cantidad);
    return cantidad < 1;
  } catch (error) {
    return false;
  }
}

/*
export async function createHorario(data) {
  const newClase = claseRepository.create({
    sala,
    horario,
    fecha_inicio_clases
  });
  return await claseRepository.save(newClase);
}

export async function findAllHorarios() {
  return await horarioRepository.find();
}

export async function findClaseById_electivo(id_electivo) {
  return await horarioRepository.findOneBy({ id_electivo });
}

export async function updateHorarioById_Electivo(id_horario, updateData) {
  const horario = await horarioRepository.findOneBy({ id_horario } );
  // console.log(clase);

  if (!horario) {
    throw new Error("Horario no encontrado");
  }


  Object.assign(horario, updateData);

  return await horarioRepository.save(horario);
}

export async function deleteHorarioById_Electivo(id_horario) {
  // console.log(id_electivo);
  const horario = await horarioRepository.findOneBy({  id_horario });

  if (!horario) {
    throw new Error("Horario no encontrado");
  }
  // // console.log(user);
  // await userRepository.delete(user);
  await horarioRepository.delete({id_horario: horario.id_horario});
}
*/