"use strict";

import User from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { EXMAPLE_EMAIL_1, EXMAPLE_EMAIL_2, EXMAPLE_EMAIL_3, EXMAPLE_EMAIL_4, EXMAPLE_EMAIL_5, EXMAPLE_EMAIL_6 } from "./configEnv.js";
import { careerRepository } from "../service/carrera.service.js";
import { electivoRepository } from "../service/electivo.service.js";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

 
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
