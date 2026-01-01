"use strict";

import User from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { EXMAPLE_EMAIL_1, EXMAPLE_EMAIL_2, EXMAPLE_EMAIL_3, EXMAPLE_EMAIL_4, EXMAPLE_EMAIL_5, EXMAPLE_EMAIL_6 } from "./configEnv.js";
import { careerRepository } from "../service/carrera.service.js";
import { electivoRepository } from "../service/electivo.service.js";
import { userRepository } from "../service/user.service.js";
import { CAREER_HEAD_ROLE, STUDENT_ROLE, TEACHER_ROLE } from "../constants/user.constants.js";


export const getCarrerasPorDefecto = async () => {
  return [
    careerRepository.create("IECI", "INGENIERÍA DE EJECUCIÓN EN COMPUTACIÓN E INFORMÁTICA"),
    careerRepository.create("ICINF", "INGENIERÍA CIVIL INFORMÁTICA"),
    careerRepository.create("ICE", "INGENIERÍA CIVIL ELÉCTRICA"),
    careerRepository.create("IEEE", "INGENIERÍA DE EJECUCIÓN EN ELECTRÓNICA"),
  ];
};

export const getUsuariosPorDefecto = async () => {
  return [
    userRepository.create({
      fullname: "ROGER VENEGAS", 
      username: "rogandven", 
      rut: "7807713-1", 
      email: "rogervenegas@ubiobio.cl", 
      password: await encryptPassword("roger123"), 
      role: CAREER_HEAD_ROLE, 
      generation: "2021-1",
      creditos: "200", 
      carreraId: 1
    }),
  ]
}

export const createCarreras = async () => {
  const count = await careerRepository.count();
  if (count > 0) {
    return;
  }
  try {
    await careerRepository.save(getCarrerasPorDefecto());
    console.log("Carreras creadas con éxito");
  } catch (error){
    console.error(error);
    return;
  }
}

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    try {
      await userRepository.save(getUsuariosPorDefecto());
      console.log("Carreras creadas con éxito");
    } catch (error){
      console.error(error);
      return;
    }
    
  } catch (error) {
    console.error("Error al crear usuarios base: ", error);
    process.exit(1);
  }
}

export async function createElectivos() {
    try {
    const electivoRepo = AppDataSource.getRepository(ElectivoEntity);
    const count = await electivoRepo.count();

    if (count === 0) {

      await electivoRepo.save(electivosIniciales);
      console.log("Electivos insertados correctamente.");
    }
  } catch (error) {
    console.error("Error al insertar electivos:", error);
  }
}
