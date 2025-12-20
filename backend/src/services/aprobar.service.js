import { AppDataSource } from "../config/configDb.js";
import ElectivoEntity from "../entity/electivo.entity.js";
// import electivoRepository from "../controllers/electivo.controller.js";
import { ESTADOS_VALIDOS } from "../constants/electivo.constants.js";

const electivoRepository = AppDataSource.getRepository(ElectivoEntity);

export async function createElectivo(data) {
  const newElectivo = electivoRepositoryRepository.create({
    nombre,
    profesor,
    descripcion,
    cupos,
    creditos,
    estado,
  });

  return await electivoRepository.save(newElectivo);
}

export async function findAllElectivos() {
  return await electivoRepository.find();
}

export async function findElectivoById_electivo(id_electivo) {
  return await electivoRepository.findOneBy({ id_electivo });
}

export async function updateElectivoById_Electivo(id_electivo, updateData) {
  const Electivo = await electivoRepository.findOneBy({ id_electivo });
  console.log(Electivo);

  if (!Electivo) {
    throw new Error("Usuario no encontrado");
  }

  Object.assign(Electivo, updateData);

  return await electivoRepository.save(Electivo);
}

export async function deleteElectivoById_Electivo(id_electivo) {
  console.log(id_electivo);
  const Electivo = await electivoRepository.findOneBy({ id_electivo });

  if (!Electivo) {
    throw new Error("Electivo no encontrado");
  }
  // console.log(user);
  // await userRepository.delete(user);
  await electivoRepository.delete({ id_electivo: Electivo.id_electivo });
}

const formatEstado = (estado) => {
  if (!estado || (typeof(estado) !== "string") || estado.length <= 0) {
    return "Estado desconocido";
  }
  return estado.toLowerCase().replace('_', ' ').trim();
} 

const cambiarEstadoHelper = async (id_electivo, nuevoEstado) => {
  const nuevoEstadoParseado = String(nuevoEstado);
  const Electivo = await electivoRepository.findOneBy({ id: id_electivo });
  if (!Electivo) {
    throw Error("Electivo no encontrado", {code: 404});
  }
  if (Electivo.estado === nuevoEstadoParseado) {
    throw Error(`El electivo ya está ${formatEstado(nuevoEstadoParseado)}`, {code: 400});
  }
  Object.assign(Electivo, {estado: nuevoEstadoParseado});
  try {
    return {
      result: await electivoRepository.save(Electivo),
      code: 200
    };
  } catch (error) {
    console.error(error);
    throw Error("Error al conectar con la base de datos", {code: 500});
  }
}

export async function aprobarElectivoById_Electivo(id_electivo) {
  return await cambiarEstadoHelper(id_electivo, ESTADOS_VALIDOS.APROBADO);
}

export async function rechazarElectivoById_Electivo(id_electivo) {
  return await cambiarEstadoHelper(id_electivo, ESTADOS_VALIDOS.RECHAZADO);
}