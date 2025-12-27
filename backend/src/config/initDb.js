"use strict";

import User from "../entity/user.entity.js";
import ElectivoEntity from "../entity/electivo.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import { EXMAPLE_EMAIL_1, EXMAPLE_EMAIL_2, EXMAPLE_EMAIL_3, EXMAPLE_EMAIL_4, EXMAPLE_EMAIL_5, EXMAPLE_EMAIL_6, EXMAPLE_EMAIL_7 } from "./configEnv.js";

/*
if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
  console.log("Conexión con la base de datos inicializada correctamente (initBd).");
}
*/ 
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
      /* const electivosIniciales = [
        {
          nombre: "Desarrollo Web Avanzado",
          cupos: 30,
          inscritos: 22,
          apertura: "2025-03-01",
          cierre: "2025-03-15",
          area: "Desarrollo",
          descripcion:
            "Este electivo profundiza en frameworks modernos como React, Node y prácticas DevOps básicas.",
        },
        {
          nombre: "Investigación en Inteligencia Artificial",
          cupos: 25,
          inscritos: 20,
          apertura: "2025-04-10",
          cierre: "2025-04-30",
          area: "Investigación",
          descripcion:
            "En este electivo se revisan metodologías de investigación aplicadas al machine learning y deep learning.",
        },
        {
          nombre: "Comunicación y Liderazgo",
          cupos: 40,
          inscritos: 33,
          apertura: "2025-05-05",
          cierre: "2025-05-20",
          area: "Habilidades Sociales",
          descripcion:
            "El curso desarrolla habilidades interpersonales, trabajo en equipo y liderazgo efectivo.",
        },
        {
          nombre: "Bases de Datos NoSQL",
          cupos: 35,
          inscritos: 29,
          apertura: "2025-06-01",
          cierre: "2025-06-15",
          area: "Desarrollo",
          descripcion:
            "Se estudian bases de datos orientadas a documentos, columnas y grafos, con MongoDB y Neo4j como casos prácticos.",
        },
        {
          nombre: "Metodologías Ágiles en Proyectos de Software",
          cupos: 45,
          inscritos: 41,
          apertura: "2025-07-01",
          cierre: "2025-07-20",
          area: "Desarrollo",
          descripcion:
            "El curso aborda Scrum, Kanban y gestión ágil de equipos, aplicando herramientas colaborativas y control de versiones.",
        },
        {
          nombre: "Ética Profesional y Responsabilidad Social",
          cupos: 50,
          inscritos: 44,
          apertura: "2025-08-01",
          cierre: "2025-08-15",
          area: "Habilidades Sociales",
          descripcion:
            "Se analizan dilemas éticos en la profesión informática y el impacto de las decisiones tecnológicas en la sociedad.",
        },
        {
          nombre: "Minería de Datos Aplicada",
          cupos: 30,
          inscritos: 26,
          apertura: "2025-09-05",
          cierre: "2025-09-25",
          area: "Investigación",
          descripcion:
            "El electivo introduce técnicas de minería de datos, análisis predictivo y uso de herramientas como Weka y Python.",
        },
        {
          nombre: "Ciberseguridad y Protección de Datos",
          cupos: 25,
          inscritos: 18,
          apertura: "2025-10-01",
          cierre: "2025-10-20",
          area: "Investigación",
          descripcion:
            "Este curso enseña los fundamentos de la seguridad informática, análisis de vulnerabilidades y medidas de protección de datos.",
        },
        {
          nombre: "Diseño UX/UI para Aplicaciones Web",
          cupos: 40,
          inscritos: 35,
          apertura: "2025-11-01",
          cierre: "2025-11-20",
          area: "Desarrollo",
          descripcion:
            "Se estudian principios de diseño centrado en el usuario, accesibilidad y herramientas modernas para prototipado.",
        },
        {
          nombre: "Gestión del Estrés y Productividad Personal",
          cupos: 45,
          inscritos: 39,
          apertura: "2025-12-01",
          cierre: "2025-12-15",
          area: "Habilidades Sociales",
          descripcion:
            "El electivo entrega herramientas psicológicas y prácticas de mindfulness para mejorar la concentración y la eficiencia laboral.",
        },
      ]; */
        const electivosIniciales = [
            {
            nombre: "Desarrollo Web Avanzado",
            cupos: 30,
            inscritos: 22,
            semestre_minimo: "5 semestre",
            apertura: "2025-03-01",
            cierre: "2025-03-15",
            area: "Desarrollo",
            descripcion:
                "Este electivo profundiza en frameworks modernos como React, Node y prácticas DevOps básicas.",
            },
            {
            nombre: "Investigación en Inteligencia Artificial",
            cupos: 25,
            inscritos: 20,
            semestre_minimo: "4 semestre",
            apertura: "2025-04-10",
            cierre: "2025-04-30",
            area: "Investigación",
            descripcion:
                "En este electivo se revisan metodologías de investigación aplicadas al machine learning y deep learning.",
            },
            {
            nombre: "Comunicación y Liderazgo",
            cupos: 40,
            inscritos: 33,
            semestre_minimo: "3 semestre",
            apertura: "2025-05-05",
            cierre: "2025-05-20",
            area: "Habilidades Sociales",
            descripcion:
                "El curso desarrolla habilidades interpersonales, trabajo en equipo y liderazgo efectivo.",
            },
        ];
        // for (const electivo of electivosIniciales) {
            // console.log(JSON.stringify(electivo));
            /* await electivoRepo.save((
                electivoRepo.create(electivo)
            ));
            console.log(`Electivo '${electivo.nombre}' creado exitosamente.`); */
        // }

      await electivoRepo.save(electivosIniciales);
      console.log("Electivos insertados correctamente.");
    }
  } catch (error) {
    console.error("Error al insertar electivos:", error);
  }
}
