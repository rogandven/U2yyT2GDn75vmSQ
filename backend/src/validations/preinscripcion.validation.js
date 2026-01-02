/* id_inscripcion: {
    type: "int",
},
fecha_hora: {
    type: "timestamp",
},
estado: {
    type: String,
},
id_usuario: {
    type: USER_ID_TYPE,
    nullable: false,
},
id_electivo: {
    type: ELECTIVO_ID_TYPE,
}, */

/*
"use strict";
import Joi from "joi";
import { idValidationFunction } from "./modules/id.validation.js";
import { MAX_DATE_LENGTH, MIN_DATE_LENGTH } from "../constants/user.constants.js";
import { timestampValidationFunction } from "./modules/timestamp.validation.js";
import { MAX_STATUS, MIN_STATUS } from "../constants/inscripcion.constants.js";
import { inscriptionStatusValidationFunction } from "./modules/inscripcion.status.validation.js";

export const integrityValidation = Joi.object({
    id_inscripcion: Joi.any().custom(idValidationFunction),
    fecha_hora: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timestampValidationFunction).messages({
        "string.base":"La fecha debe estar en formato string",
        "string.min":"La fecha no puede ser vacía",
        "string.max":`La fecha no puede ser de más de ${MAX_DATE_LENGTH} caracteres`,
    }),
    estado: Joi.string().min(MIN_STATUS).max(MAX_STATUS).custom(inscriptionStatusValidationFunction).messages({
        "string.base":"El estado debe estar en formato string",
        "string.min":"El estado no puede ser vacío",
        "string.max":`El estado no puede ser de más de ${MAX_STATUS} caracteres`,
    }),
    id_usuario: Joi.any().custom(idValidationFunction),
    id_electivo: Joi.any().custom(idValidationFunction),
});

export const createValidation = Joi.object({
    estado: Joi.any().required().messages({
        "any.required": "El estado es obligatorio",
    }),
    id_usuario: Joi.any().required().messages({
        "any.required": "El ID del usuario es obligatorio",
    }),
    id_electivo: Joi.any().required().messages({
        "any.required": "El ID de la instancia es obligatorio",
    }),
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
});

export const updateValidation = Joi.object({
    estado: Joi.any(),
    fecha_hora: Joi.any(),
    id_usuario: Joi.any(),
    id_electivo: Joi.any(),
}).unknown(false).min(1).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
    "object.min": "Debe proporcionar un campo para actualizar",
});

export const findValidation = Joi.object({
    id_inscripcion: Joi.any().required().custom(idValidationFunction)
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales",
    "object.unknown": "No se permiten campos adicionales",
    "any.required": "El ID es obligatorio",
});

export const warningValidation = Joi.object({
    id_electivo: Joi.number().required(),
}).unknown(false);*/

"use strict";
import Joi from "joi";

const ESTADOS_PREINSCRIPCION = ["PENDIENTE", "APROBADA", "RECHAZADA"];

export const preinscripcionIntegrityValidation = Joi.object({
  id: Joi.number().integer().min(1),
  estado: Joi.string().valid(...ESTADOS_PREINSCRIPCION).messages({
    "string.base": "El estado debe ser texto.",
    "any.only": `El estado debe ser uno de: ${ESTADOS_PREINSCRIPCION.join(", ")}`,
  }),
  id_usuario: Joi.number().integer().min(1),
  id_electivo: Joi.number().integer().min(1),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });

//crear preinscripción: el alumno manda el id_electivo.
//el backend pone usuario desde req.user y estado por defecto.
export const createPreinscripcionValidation = Joi.object({
  id_electivo: Joi.number().integer().min(1).required().messages({
    "any.required": "El id_electivo es obligatorio.",
    "number.base": "El id_electivo debe ser un número.",
  }),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });

//si después agregas aprobación/rechazo de preinscripción:
export const updatePreinscripcionEstadoValidation = Joi.object({
  estado: Joi.string().valid(...ESTADOS_PREINSCRIPCION).required().messages({
    "any.required": "El estado es obligatorio.",
    "any.only": `El estado debe ser uno de: ${ESTADOS_PREINSCRIPCION.join(", ")}`,
  }),
})
  .unknown(false)
  .messages({ "object.unknown": "No se permiten campos adicionales" });
