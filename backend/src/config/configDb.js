"use strict";

import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD, DB_HOST } from "./configEnv.js";

import { UsuarioEntity } from "../entity/usuario.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { ElectivoCarreraEntity } from "../entity/electivoCarrera.entity.js";
import { PreinscripcionEntity } from "../entity/preinscripcion.entity.js";
import { HorarioEntity } from "../entity/horario.entity.js";

// Configuración de la conexión a la base de datos
export const AppDataSource = new DataSource({
    type: "postgres",
    host: `${DB_HOST || HOST}`,
    port: `${DB_PORT || PORT}`,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: [UsuarioEntity,
        CarreraEntity,
        ElectivoEntity,
        ElectivoCarreraEntity,
        PreinscripcionEntity,
        HorarioEntity],
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

import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD, DB_HOST } from "./configEnv.js";

import { UsuarioEntity } from "../entity/usuario.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { ElectivoCarreraEntity } from "../entity/electivoCarrera.entity.js";
import { PreinscripcionEntity } from "../entity/preinscripcion.entity.js";
import { HorarioEntity } from "../entity/horario.entity.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST || HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [
        UsuarioEntity,
        CarreraEntity,
        ElectivoEntity,
        ElectivoCarreraEntity,
        PreinscripcionEntity,
        HorarioEntity
    ],
    synchronize: true, 
    logging: false,
});

export async function connectDB() {
    try {
        await AppDataSource.initialize();
        console.log("Conexión con la base de datos exitosa!");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        process.exit(1);
    }
}*/