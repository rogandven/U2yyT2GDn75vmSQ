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