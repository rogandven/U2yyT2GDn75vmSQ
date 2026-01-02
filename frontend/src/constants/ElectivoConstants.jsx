/*
export const CANTIDAD_MAXIMA_DE_CREDITOS = 7;
export const CANTIDAD_MAXIMA_DE_CUPOS = 60;
export const JEFE_DE_CARRERA = 'jefe_de_carrera';
export const ELECTIVO_APROBADO = 'aprobado';
export const ELECTIVO_RECHAZADO = 'rechazado';


export const AREAS_PERMITIDAS = [
  "Desarrollo de Software",
  "Bases de Datos y Sistemas de Información",
  "Ciencias de la Computación",
  "Inteligencia Artificial y Ciencia de Datos",
  "Redes y Telecomunicaciones",
  "Ciberseguridad",
  "Ingeniería de Software y Gestión TI",
  "Sistemas Operativos e Infraestructura",
  "Desarrollo Móvil e Interfaces",
  "Innovación y Habilidades Blandas"
];

const getAllowedAreasInUppercase = () => {
  const array = [];
  for (let i = 0; i < AREAS_PERMITIDAS.length; i++) {
    array.push(String(AREAS_PERMITIDAS[i].toUpperCase().trim()));
  }
  return array;
}

export const AREAS_PERMITIDAS_EN_MAYUSCULA = getAllowedAreasInUppercase();

export const ESTADOS_VALIDOS = {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado',
    RECHAZADO: 'rechazado',
    ACTIVO: 'activo',
    INACTIVO: 'inactivo'
};*/

export const CANTIDAD_MAXIMA_DE_CREDITOS = 7;
export const CANTIDAD_MAXIMA_DE_CUPOS = 60;

export const JEFE_DE_CARRERA = 'JEFE_DE_CARRERA';
export const PROFESOR = 'PROFESOR';
export const ESTUDIANTE = 'ESTUDIANTE';

export const ELECTIVO_APROBADO = 'APROBADO';
export const ELECTIVO_RECHAZADO = 'RECHAZADO';
export const ELECTIVO_PENDIENTE = 'PENDIENTE';

export const AREAS_PERMITIDAS = [
  "Desarrollo de Software",
  "Bases de Datos y Sistemas de Información",
  "Ciencias de la Computación",
  "Inteligencia Artificial y Ciencia de Datos",
  "Redes y Telecomunicaciones",
  "Ciberseguridad",
  "Ingeniería de Software y Gestión TI",
  "Sistemas Operativos e Infraestructura",
  "Desarrollo Móvil e Interfaces",
  "Innovación y Habilidades Blandas"
];

export const AREAS_PERMITIDAS_EN_MAYUSCULA =
  AREAS_PERMITIDAS.map(a => a.toUpperCase().trim());

export const ESTADOS_VALIDOS = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
};


export const PRERREQUISITOS_POSIBLES = [
  "Programación I",
  "Programación II",
  "Estructura de Datos",
  "Bases de Datos",
  "Ingeniería de Software",
  "Sistemas Operativos"
];

export const MAX_PRERREQUISITOS = 2;
