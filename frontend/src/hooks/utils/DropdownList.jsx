export const DropdownList = (className, data, label, id) => {
    return (
        <select className={`select ${className}`} id={id}>
            <option disabled selected>{label}</option>
            {Array.isArray(data) && data.map((name) => {
                return (
                    <option>{String(name)}</option>
                );
            })}
        </select>   
    );
}

export const StaticDropdownList = (data, label, id, className) => {
    return `
        <select class="select ${className}" id=${id}>
            <option disabled selected>${label}</option>
            ${Array.isArray(data) && data.map((element) => {
                return `<option>${String(element)}</option>`
            }).join(" ")}
        </select>
    `
}

const AREAS_PERMITIDAS = [
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