import { AppDataSource } from "../config/configDb.js";
import HorarioEntity from "../entity/horario.entity.js";
import bcrypt from "bcrypt";

const horarioRepository = AppDataSource.getRepository(HorarioEntity);

export async function createHorario(data) {
  /*const newHorario = horarioRepository.create({
    id_electivo: data.id_electivo,
    sala,
    horario,
    fecha_inicio_clases
  });

  return await horarioRepository.save(newHorario);*/
}

export async function doHorariosExist(id_electivo, id_horario) {
  try {
    const horarios = await horarioRepository.find({where: { id_electivo: id_electivo }});
    const horariosParseados = horarios.filter(horario => {
      return horario.id_horario !== id_horario
    });
    console.log("HORARIOS EXISTENTES: " + horariosParseados.length);
    return horariosParseados.length > 0;
  } catch (error) {
    console.error(error);
    return true;
  }
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