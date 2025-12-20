"use strict";
import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD, DB_HOST } from "./configEnv.js";
// import ClaseEntity from "../entity/clase.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import InscripcionEntity from '../entity/inscripcion.entity.js';
import UserEntity from '../entity/user.entity.js';
import HorarioEntity from "../entity/horario.entity.js";
import PreinscriptionEntity from "../entity/preinscription.entity.js";

// Configuración de la conexión a la base de datos
export const AppDataSource = new DataSource({
    type: "postgres",
    host: `${DB_HOST || HOST}`,
    port: `${DB_PORT || PORT}`,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: [ElectivoEntity, InscripcionEntity, UserEntity, HorarioEntity, PreinscriptionEntity],
    synchronize: true,
    logging: false,
});

// Función para conectar a la base de datos
export async function connectDB() {
    try {
        // if (!AppDataSource.isInitialized()) {
            await AppDataSource.initialize();
            console.log("Conexión con la base de datos exitosa!");
        // } else {
            // throw Error("AppDataSource already initialized");
        // }
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
}

/*
"use strict";
import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD, DB_HOST } from "./configEnv.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import ClaseEntity from "../entity/clase.entity.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";
import UserEntity from "../entity/user.entity.js";
import PreinscriptionEntity from "../entity/preinscription.entity.js";

// import UserEntity from "../entity/user.entity.js";
// import ElectivoEntity from "../entity/electivo.entity.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: `${DB_HOST || HOST}`,
    port: `${DB_PORT || PORT}`,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: [ElectivoEntity, ClaseEntity, InscripcionEntity, UserEntity, PreinscriptionEntity],
    synchronize: true,
    logging: false,
});

export async function connectDB() {
  try {
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Conexión con la base de datos exitosa!");
    }
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
*/
/*
"use strict";
import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD, DB_HOST } from "./configEnv.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import HorarioEntity from "../entity/horario.entity.js";
import InscripcionEntity from "../entity/inscripcion.entity.js";
import UserEntity from "../entity/user.entity.js";
import PreinscriptionEntity from "../entity/preinscription.entity.js";

// Configuración de la conexión a la base de datos
export const AppDataSource = new DataSource({
    type: "postgres",
    host: `${DB_HOST || HOST}`,
    port: `${DB_PORT || PORT}`,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: [ElectivoEntity, HorarioEntity, InscripcionEntity, UserEntity, PreinscriptionEntity],
    synchronize: true,
    logging: false,
});

// Función para conectar a la base de datos
export async function connectDB() {
    try {
        await AppDataSource.initialize();
        console.log("=> Conexión con la base de datos exitosa!");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
}
*/