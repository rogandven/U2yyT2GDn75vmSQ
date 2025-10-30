"use strict";
import { DataSource } from "typeorm"
import { DATABASE, DB_USERNAME, DB_PORT, HOST, PASSWORD } from "./configEnv.js";
import UserEntity from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import PreinscripcionEntity from "../entity/preinscripcion.entity.js";
import { InscripcionEntity } from "../entity/inscripcion.entity.js";

// Configuración de la conexión a la base de datos
export const AppDataSource = new DataSource({
    type: "postgres",
    host: `${HOST}`,
    port: `${DB_PORT}`,
    username: `${DB_USERNAME}`,
    password: `${PASSWORD}`,
    database: `${DATABASE}`,
    entities: [UserEntity, ElectivoEntity, PreinscripcionEntity, InscripcionEntity],
    synchronize: true,
    logging: true,
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