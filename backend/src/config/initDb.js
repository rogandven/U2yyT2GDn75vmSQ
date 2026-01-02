/*
"use strict";

import User from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { EXMAPLE_EMAIL_1, EXMAPLE_EMAIL_2, EXMAPLE_EMAIL_3, EXMAPLE_EMAIL_4, EXMAPLE_EMAIL_5, EXMAPLE_EMAIL_6, EXMAPLE_EMAIL_7 } from "./configEnv.js";


export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const count = await userRepository.count();
    if (count > 0) return;

    const users = [
      {
        fullname: "Roger Venegas".toUpperCase(),
        username: "rogandven",
        rut: "4825562-0",
        email: EXMAPLE_EMAIL_1,
        password: await encryptPassword("roger123"),
        role: "JEFE_DE_CARRERA",
        generation: "2023-1",
        carrera: "IECI",
        creditos: 0
      },
      {
        fullname: "Sebastián Pinto".toUpperCase(),
        username: "seba",
        rut: "22849268-K",
        email: EXMAPLE_EMAIL_2,
        password: await encryptPassword("seba123"),
        role: "PROFESOR",
        generation: "2023-1",
        carrera: "IECI",
        creditos: 0
      },
      {
        fullname: "Carlos Domínguez".toUpperCase(),
        username: "carmanolo",
        rut: "20924430-6",
        email: EXMAPLE_EMAIL_3,
        password: await encryptPassword("carlos123"),
        role: "ESTUDIANTE",
        generation: "2023-1",
        carrera: "IECI",
        creditos: 300
      },
      {
        fullname: "Rodrigo Alarcón".toUpperCase(),
        username: "rodriser12",
        rut: "8347186-7",
        email: EXMAPLE_EMAIL_4,
        password: await encryptPassword("rodri123"),
        role: "JEFE_DE_CARRERA",
        generation: "2023-1",
        carrera: "ICINF",
        creditos: 300
      },
      {
        fullname: "Fermín Millanao".toUpperCase(),
        username: "fermin23",
        rut: "16057069-5",
        email: EXMAPLE_EMAIL_5,
        password: await encryptPassword("fermin123"),
        role: "PROFESOR",
        generation: "2023-1",
        carrera: "ICINF",
        creditos: 0
      },
      {
        fullname: "Andrés Opazo".toUpperCase(),
        username: "andres123",
        rut: "4738683-7",
        email: EXMAPLE_EMAIL_6,
        password: await encryptPassword("andres123"),
        role: "ESTUDIANTE",
        generation: "2023-1",
        carrera: "ICINF",
        creditos: 0
      },
      {
        fullname: "Voger Renegas".toUpperCase(),
        username: "voger123",
        rut: "16117628-1",
        email: EXMAPLE_EMAIL_7,
        password: await encryptPassword("renegas123"),
        role: "ADMINISTRADOR",
        generation: "2023-1",
        carrera: "ICINF",
        creditos: 0
      },                
    ];

    console.log("Creando usuarios base...");

    for (const user of users) {
      await userRepository.save(userRepository.create(user));
      console.log(`Usuario '${user.username}' creado exitosamente.`);
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

*/

/*
"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UsuarioEntity } from "../entity/usuario.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import {
  EXMAPLE_EMAIL_1,
  EXMAPLE_EMAIL_2,
  EXMAPLE_EMAIL_3,
  EXMAPLE_EMAIL_4,
  EXMAPLE_EMAIL_5,
  EXMAPLE_EMAIL_6,
  EXMAPLE_EMAIL_7,
} from "./configEnv.js";


async function createCarreras() {
  const carreraRepo = AppDataSource.getRepository(CarreraEntity);

  const count = await carreraRepo.count();
  if (count > 0) {
    console.log("Carreras ya existen");
    return;
  }

  await carreraRepo.save([
    {
      sigla: "IECI",
      nombre: "Ingeniería de Ejecución en Computación e Informática",
    },
    {
      sigla: "ICINF",
      nombre: "Ingeniería Civil en Informática",
    },
  ]);

  console.log("Carreras creadas correctamente");
}

async function createUsers() {
  try {
    const userRepo = AppDataSource.getRepository(UsuarioEntity);
    const carreraRepo = AppDataSource.getRepository(CarreraEntity);

    const count = await userRepo.count();
    if (count > 0) {
      console.log("Usuarios ya existen");
      return;
    }

    const ieci = await carreraRepo.findOneBy({ sigla: "IECI" });
    const icinf = await carreraRepo.findOneBy({ sigla: "ICINF" });

    if (!ieci || !icinf) {
      throw new Error("Carreras no encontradas. Revise initDb.");
    }

    const users = [
      {
        nombre: "Roger Venegas",
        rut: "4825562-0",
        email: EXMAPLE_EMAIL_1,
        clave: await encryptPassword("roger123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Sebastián Pinto",
        rut: "22849268-K",
        email: EXMAPLE_EMAIL_2,
        clave: await encryptPassword("seba123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Carlos Domínguez",
        rut: "20924430-6",
        email: EXMAPLE_EMAIL_3,
        clave: await encryptPassword("carlos123"),
        rol: "ALUMNO",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 300,
      },
      {
        nombre: "Rodrigo Alarcón",
        rut: "8347186-7",
        email: EXMAPLE_EMAIL_4,
        clave: await encryptPassword("rodri123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Fermín Millanao",
        rut: "16057069-5",
        email: EXMAPLE_EMAIL_5,
        clave: await encryptPassword("fermin123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Andrés Opazo",
        rut: "4738683-7",
        email: EXMAPLE_EMAIL_6,
        clave: await encryptPassword("andres123"),
        rol: "ALUMNO",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Administrador Sistema",
        rut: "16117628-1",
        email: EXMAPLE_EMAIL_7,
        clave: await encryptPassword("admin123"),
        rol: "ADMINISTRADOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
    ];

    console.log("Creando usuarios base...");

    for (const user of users) {
      await userRepo.save(userRepo.create(user));
      console.log(`Usuario '${user.email}' creado`);
    }
  } catch (error) {
    console.error("Error al crear usuarios base:", error);
    process.exit(1);
  }
}

export async function initDb() {
  try {
    await createCarreras();
    await createUsers();
    console.log("Inicialización de la base de datos completada");
  } catch (error) {
    console.error("Error en initDb:", error);
  }
}
*/

/*
"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UsuarioEntity } from "../entity/usuario.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import {
  EXMAPLE_EMAIL_1,
  EXMAPLE_EMAIL_2,
  EXMAPLE_EMAIL_3,
  EXMAPLE_EMAIL_4,
  EXMAPLE_EMAIL_5,
  EXMAPLE_EMAIL_6,
  EXMAPLE_EMAIL_7,
} from "./configEnv.js";

export async function createCarreras() {
  const carreraRepo = AppDataSource.getRepository(CarreraEntity);

  const count = await carreraRepo.count();
  if (count > 0) {
    console.log("Carreras ya existen");
    return;
  }

  await carreraRepo.save([
    {
      sigla: "IECI",
      nombre: "Ingeniería de Ejecución en Computación e Informática",
    },
    {
      sigla: "ICINF",
      nombre: "Ingeniería Civil en Informática",
    },
  ]);

  console.log("Carreras creadas correctamente");
}

export async function createUsers() {
  try {
    const userRepo = AppDataSource.getRepository(UsuarioEntity);
    const carreraRepo = AppDataSource.getRepository(CarreraEntity);

    const count = await userRepo.count();
    if (count > 0) {
      console.log("Usuarios ya existen");
      return;
    }

    const ieci = await carreraRepo.findOneBy({ sigla: "IECI" });
    const icinf = await carreraRepo.findOneBy({ sigla: "ICINF" });

    if (!ieci || !icinf) {
      throw new Error("Carreras no encontradas. Revise initDb.");
    }

    const users = [
      {
        nombre: "Roger Venegas",
        rut: "4825562-0",
        email: EXMAPLE_EMAIL_1,
        clave: await encryptPassword("roger123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Sebastián Pinto",
        rut: "22849268-K",
        email: EXMAPLE_EMAIL_2,
        clave: await encryptPassword("seba123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Carlos Domínguez",
        rut: "20924430-6",
        email: EXMAPLE_EMAIL_3,
        clave: await encryptPassword("carlos123"),
        rol: "ALUMNO",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 300,
      },
      {
        nombre: "Rodrigo Alarcón",
        rut: "8347186-7",
        email: EXMAPLE_EMAIL_4,
        clave: await encryptPassword("rodri123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Fermín Millanao",
        rut: "16057069-5",
        email: EXMAPLE_EMAIL_5,
        clave: await encryptPassword("fermin123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Andrés Opazo",
        rut: "4738683-7",
        email: EXMAPLE_EMAIL_6,
        clave: await encryptPassword("andres123"),
        rol: "ALUMNO",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Administrador Sistema",
        rut: "16117628-1",
        email: EXMAPLE_EMAIL_7,
        clave: await encryptPassword("admin123"),
        rol: "ADMINISTRADOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
    ];

    console.log("Creando usuarios base...");

    for (const user of users) {
      await userRepo.save(userRepo.create(user));
      console.log(`Usuario '${user.email}' creado`);
    }
  } catch (error) {
    console.error("Error al crear usuarios base:", error);
    process.exit(1);
  }
}

export async function initDb() {
  try {
    await createCarreras();
    await createUsers();
    console.log("Inicialización de la base de datos completada");
  } catch (error) {
    console.error("Error en initDb:", error);
  }
}
*/

"use strict";

import { AppDataSource } from "../config/configDb.js";
import { UsuarioEntity } from "../entity/usuario.entity.js";
import { CarreraEntity } from "../entity/carrera.entity.js";
import { ElectivoEntity } from "../entity/electivo.entity.js";
import { ElectivoCarreraEntity } from "../entity/electivoCarrera.entity.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import {
  EXMAPLE_EMAIL_1,
  EXMAPLE_EMAIL_2,
  EXMAPLE_EMAIL_3,
  EXMAPLE_EMAIL_4,
  EXMAPLE_EMAIL_5,
  EXMAPLE_EMAIL_6,
  EXMAPLE_EMAIL_7,
} from "./configEnv.js";


export async function createCarreras() {
  const carreraRepo = AppDataSource.getRepository(CarreraEntity);

  const count = await carreraRepo.count();
  if (count > 0) {
    console.log("Carreras ya existen");
    return;
  }

  await carreraRepo.save([
    {
      sigla: "IECI",
      nombre: "Ingeniería de Ejecución en Computación e Informática",
    },
    {
      sigla: "ICINF",
      nombre: "Ingeniería Civil en Informática",
    },
  ]);

  console.log("Carreras creadas correctamente");
}

export async function createUsers() {
  try {
    const userRepo = AppDataSource.getRepository(UsuarioEntity);
    const carreraRepo = AppDataSource.getRepository(CarreraEntity);

    const count = await userRepo.count();
    if (count > 0) {
      console.log("Usuarios ya existen");
      return;
    }

    const ieci = await carreraRepo.findOneBy({ sigla: "IECI" });
    const icinf = await carreraRepo.findOneBy({ sigla: "ICINF" });

    if (!ieci || !icinf) {
      throw new Error("Carreras no encontradas. Revise initDb.");
    }

    const users = [
      {
        nombre: "Roger Venegas",
        rut: "4825562-0",
        email: EXMAPLE_EMAIL_1,
        clave: await encryptPassword("roger123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Sebastián Pinto",
        rut: "22849268-K",
        email: EXMAPLE_EMAIL_2,
        clave: await encryptPassword("seba123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 0,
      },
      {
        nombre: "Carlos Domínguez",
        rut: "20924430-6",
        email: EXMAPLE_EMAIL_3,
        clave: await encryptPassword("carlos123"),
        rol: "ESTUDIANTE",
        generacion: "2023-1",
        carrera: ieci,
        creditos: 300,
      },
      {
        nombre: "Rodrigo Alarcón",
        rut: "8347186-7",
        email: EXMAPLE_EMAIL_4,
        clave: await encryptPassword("rodri123"),
        rol: "JEFE_DE_CARRERA",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Fermín Millanao",
        rut: "16057069-5",
        email: EXMAPLE_EMAIL_5,
        clave: await encryptPassword("fermin123"),
        rol: "PROFESOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Andrés Opazo",
        rut: "4738683-7",
        email: EXMAPLE_EMAIL_6,
        clave: await encryptPassword("andres123"),
        rol: "ESTUDIANTE",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
      {
        nombre: "Administrador Sistema",
        rut: "16117628-1",
        email: EXMAPLE_EMAIL_7,
        clave: await encryptPassword("admin123"),
        rol: "ADMINISTRADOR",
        generacion: "2023-1",
        carrera: icinf,
        creditos: 0,
      },
    ];

    console.log("Creando usuarios base...");

    for (const user of users) {
      await userRepo.save(userRepo.create(user));
      console.log(`Usuario '${user.email}' creado`);
    }
  } catch (error) {
    console.error("Error al crear usuarios base:", error);
    process.exit(1);
  }
}

export async function createElectivos() {
  try {
    const electivoRepo = AppDataSource.getRepository(ElectivoEntity);

    const count = await electivoRepo.count();
    if (count > 0) {
      console.log("Electivos ya existen");
      return;
    }

    console.log("Creando electivos base...");

    const electivos = [
      {
        nombre_electivo: "Desarrollo Web Avanzado",
        descripcion: "React, Node.js y buenas prácticas backend",
        cupos: 30,
        prerequisitos_asignaturas: null,
        fecha_inicio: new Date("2025-03-01"),
        fecha_fin: new Date("2025-07-15"),
        area_electivo: "DESARROLLO",
        creditos_minimos_aprobados: 200,
        link_programa: null,
        estado: "APROBADO",
        motivo_rechazo: null,
      },
      {
        nombre_electivo: "Introducción a IA",
        descripcion: "Fundamentos de inteligencia artificial",
        cupos: 25,
        prerequisitos_asignaturas: null,
        fecha_inicio: new Date("2025-03-01"),
        fecha_fin: new Date("2025-07-15"),
        area_electivo: "INVESTIGACION",
        creditos_minimos_aprobados: 180,
        link_programa: null,
        estado: "APROBADO",
        motivo_rechazo: null,
      },
    ];

    for (const e of electivos) {
      await electivoRepo.save(electivoRepo.create(e));
      console.log(`Electivo '${e.nombre_electivo}' creado`);
    }

  } catch (error) {
    console.error("Error al crear electivos:", error);
  }
}

export async function initDb() {
  try {
    await createCarreras();
    await createUsers();
    await createElectivos();
    console.log("Inicialización de la base de datos completada");
  } catch (error) {
    console.error("Error en initDb:", error);
  }
}
