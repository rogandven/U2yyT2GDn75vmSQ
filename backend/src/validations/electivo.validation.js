
"use strict";
import Joi from "joi";
import { timeValidationFunction } from "./modules/timestamp.validation.js";
import { FULLNAME_REGEX, MAX_DATE_LENGTH, MIN_DATE_LENGTH } from "../constants/user.constants.js";
import { MIN_FULLNAME, MAX_FULLNAME } from "../constants/user.constants.js";
import { fullnameRegexMessageGenerator } from "../constants/user.constants.js";
import { MAX_CUPOS, MAX_INSCRITOS, MIN_CUPOS, MIN_INSCRITOS } from "../constants/electivo.constants.js";

// TODO TODO TODO TODO
export const getElectivosIntegrityValidation = Joi.object({
  filtro: Joi.string().pattern(FULLNAME_REGEX).min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base":"El filtro debe ser un string",
    "string.min": `El filtro debe ser de ${MIN_FULLNAME} caracteres o más`,
    "string.max": `El filtro debe ser de ${MAX_FULLNAME} caracteres o menos`,
    "string.pattern.base": fullnameRegexMessageGenerator('El', 'filtro'),
  }),
  area: Joi.string().pattern(FULLNAME_REGEX).min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base":"El área debe ser un string",
    "string.min": `El área debe ser de ${MIN_FULLNAME} caracteres o más`,
    "string.max": `El área debe ser de ${MAX_FULLNAME} caracteres o menos`,
    "string.pattern.base": fullnameRegexMessageGenerator('El', 'área'),
  }),
  apertura: Joi.string().min(MIN_DATE_LENGTH).max(MAX_DATE_LENGTH).custom(timeValidationFunction).messages({
    "string.base":"La fecha de apertura debe ser un string",
    "string.empty": "La fecha de apertura no puede ser vacía",
    "string.min": "La fecha de apertura no puede ser vacía",
    "string.max": `La fecha de apertura ser de menos de ${MAX_DATE_LENGTH}`,       
  }),
  cierre: Joi.string().custom(timeValidationFunction).messages({
    "string.base":"La fecha de cierre debe ser un string",
    "string.empty": "La fecha de cierre no puede ser vacía",
    "string.min": "La fecha de cierre no puede ser vacía",
    "string.max": `La fecha de cierre ser de menos de ${MAX_DATE_LENGTH}`,     
  }),
});

export const integrityValidation = Joi.object({
  nombre: Joi.string().min(MIN_FULLNAME).max(MAX_FULLNAME).messages({
    "string.base": "El nombre debe ser una string",
    "string.empty": "El nombre del electivo es obligatorio.",
    "string.min": `El nombre debe tener al menos ${MIN_FULLNAME} caracteres.`,
    "string.max": `El nombre no puede superar los ${MAX_FULLNAME} caracteres.`,
  }),
  cupos: Joi.number().integer().min(MIN_CUPOS).max(MAX_CUPOS).messages({
      "number.base": "El campo 'cupos' debe ser un número.",
      "number.min": `Debe haber al menos ${MIN_CUPOS} cupo disponible.`,
  }),
  inscritos: Joi.number().integer().min(MIN_INSCRITOS).max(MAX_INSCRITOS).default(0).messages({
    "number.base": "El campo 'inscritos' debe ser un número.",
    "number.min": "El número de inscritos no puede ser negativo.",
  }),
  apertura: Joi.date().messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "No se puede establecer una fecha de apertura que ya ha pasado.",
    }),
  cierre: Joi.date()
    .greater(Joi.ref("apertura"))
    .messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
    }),
  area: Joi.string()
    .min(MIN_FULLNAME)
    .max(MAX_FULLNAME)
    .required()
    .messages({
      "string.empty": "El área del electivo es obligatoria.",
      "string.min": `El área debe tener al menos ${MIN_FULLNAME} caracteres.`,
      "string.max": `El área no puede exceder los ${MAX_FULLNAME} caracteres.`,
      "any.required": "Debe ingresar el área del electivo.",
    }),
  descripcion: Joi.string()
    .min(MIN_FULLNAME)
    .max(MAX_FULLNAME)
    .messages({
      "string.empty": "La descripción es obligatoria.",
      "string.min": `La descripción debe tener al menos ${MIN_FULLNAME} caracteres.`,
      "string.max": `La descripción no puede superar los ${MAX_FULLNAME} caracteres.`,
    }),
  aprobado: Joi.boolean().messages({
      "boolean.base":"El estado debe ser un booleano",
  }),
});


export const createValidation = Joi.object({
  nombre: Joi.any().required().messages({
    "any.required": "El nombre es obligatorio",
  }),
  cupos: Joi.any().required().messages({
    "any.required": "Los cupos son obligatorios",
  }),
  apertura: Joi.any().required().messages({
    "any.required": "La fecha de apertura es obligatoria",
  }),
  cierre: Joi.any().required().messages({
    "any.required": "La fecha de cierre es obligatoria",
  }),
  area: Joi.any().required().messages({
    "any.required": "El área es obligatoria",
  }),
  descripcion: Joi.any().required().messages({
    "any.required": "La descripción es obligatoria",
  }),
  aprobado: Joi.any().required().messages({
    "any.required": "El estado es obligatorio",
  }),
}).unknown(false).messages({
    "any.unknown": "No se permiten campos adicionales"
});

export const updateValidation = Joi.object({
  nombre: Joi.any(),
  cupos: Joi.any(),
  apertura: Joi.any(),
  cierre: Joi.any(),
  area: Joi.any(),
  descripcion: Joi.any()
}).min(1).messages({
  "object.min":"Debe proporcionar un campo para actualizar",
  "any.min":"Debe proporcionar un campo para actualizar",
});

export const dateCreationValidation = Joi.object({
  apertura: Joi.date().min(Date.now()).messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "La fecha de apertura especificada ya pasó",
    }),
  cierre: Joi.date().min(Date.now()).messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
      "date.min": "La fecha de cierre especificada ya pasó",
    }),
});

/*
export const createValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.empty": "El nombre del electivo es obligatorio.",
      "string.min": "El nombre debe tener al menos 3 caracteres.",
      "string.max": "El nombre no puede superar los 255 caracteres.",
      "any.required": "Debe ingresar el nombre del electivo.",
    }),

  cupos: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "El campo 'cupos' debe ser un número.",
      "number.min": "Debe haber al menos 1 cupo disponible.",
      "any.required": "El campo 'cupos' es obligatorio.",
    }),

  inscritos: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      "number.base": "El campo 'inscritos' debe ser un número.",
      "number.min": "El número de inscritos no puede ser negativo.",
    }),

  apertura: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
      "any.required": "Debe ingresar una fecha de apertura.",
    }),

  cierre: Joi.date()
    .greater(Joi.ref("apertura"))
    .required()
    .messages({
      "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
      "date.greater": "La fecha de cierre debe ser posterior a la de apertura.",
      "any.required": "Debe ingresar una fecha de cierre.",
    }),

  area: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "El área del electivo es obligatoria.",
      "string.min": "El área debe tener al menos 3 caracteres.",
      "string.max": "El área no puede exceder los 100 caracteres.",
      "any.required": "Debe ingresar el área del electivo.",
    }),

  descripcion: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción es obligatoria.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción no puede superar los 500 caracteres.",
      "any.required": "Debe ingresar una descripción para el electivo.",
    }),
});

export const updateValidation = Joi.object({
  nombre: Joi.string().min(3).max(255).messages({
    "string.min": "El nombre debe tener al menos 3 caracteres.",
    "string.max": "El nombre no puede superar los 255 caracteres.",
  }),

  cupos: Joi.number().integer().min(1).messages({
    "number.base": "El campo 'cupos' debe ser un número.",
    "number.min": "Debe haber al menos 1 cupo disponible.",
  }),

  inscritos: Joi.number().integer().min(0).messages({
    "number.base": "El campo 'inscritos' debe ser un número.",
    "number.min": "El número de inscritos no puede ser negativo.",
  }),

  apertura: Joi.date().messages({
    "date.base": "La fecha de apertura debe tener un formato válido (AAAA-MM-DD).",
  }),

  cierre: Joi.date().greater(Joi.ref("apertura")).messages({
    "date.base": "La fecha de cierre debe tener un formato válido (AAAA-MM-DD).",
    "date.greater": "La fecha de cierre debe ser posterior a la de apertura.",
  }),

  area: Joi.string().min(3).max(100).messages({
    "string.min": "El área debe tener al menos 3 caracteres.",
    "string.max": "El área no puede exceder los 100 caracteres.",
  }),

  descripcion: Joi.string().min(10).max(500).messages({
    "string.min": "La descripción debe tener al menos 10 caracteres.",
    "string.max": "La descripción no puede superar los 500 caracteres.",
  }),
})
  .min(1)
  .messages({
    "object.min": "Debe proporcionar al menos un campo para actualizar.",
  });
*/

/*
export const createValidation_OLD = Joi.object({
    nombre: Joi.string().min(1).max(50).required().messages({
      "any.required": "El nombre del electivo es obligatorio",
      "string.base": "El nombre del electivo debe ser una cadena",
      "string.min": "El nombre del electivo no debe estar vacio",
      "string.max": "El nombre del electivo no puede exceder los 50 caracteres",
      "string.empty": "El nombre del electivo no debe estar vacio",
    }),

    profesor: Joi.string().min(1).max(50).messages({
      "any.required": "El nombre del profesor es obligatorio",
      "string.base": "El nombre del profesor debe ser una cadena",
      "string.min": "El nombre del profesor no debe estar vacio",
      "string.max": "El nombre del profesor no puede exceder los 50 caracteres",
      "string.empty": "El nombre del profesor no debe estar vacio",
    }),
    descripcion: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.base": "La descripcion debe ser una cadena",
        "string.max": "La descripcion no debe tener mas de 50 caracteres",
        "string.min": "La descripcion no puede estar vacia",
        "string.empty": "La descripcion no puede estar vacia",
        "any.required": "La descripcion es obligatoria",
      }),

    cupos: Joi.number().integer().min(1).max(100).messages({
      "any.required": "Los cupos son obligatorios",
      "number.base": "Los cupos deben ser un número",
      "number.min": "Los cupos deben ser al menos 1",
      "number.max": "Los cupos no pueden exceder 100",
    }),

    creditos: Joi.number().integer().min(2).max(8).required().messages({
      "any.required": "Los creditos son obligatorios",
      "number.base": "Los creditos deben ser un numero",
      "number.min": "Los creditos deben ser al menos 2",
      "number.max": "Los creditos no pueden exceder 8",
    }),
  });
  
export const updateValidation_OLD = Joi.object({
    nombre: Joi.string().min(1).max(50).required().messages({
      "any.required": "El nombre del electivo es obligatorio",
      "string.base": "El nombre del electivo debe ser una cadena",
      "string.min": "El nombre del electivo no debe estar vacio",
      "string.max": "El nombre del electivo no puede exceder los 50 caracteres",
      "string.empty": "El nombre del electivo no debe estar vacio",
    }),

    profesor: Joi.string().min(1).max(50).messages({
      "any.required": "El nombre del profesor es obligatorio",
      "string.base": "El nombre del profesor debe ser una cadena",
      "string.min": "El nombre del profesor no debe estar vacio",
      "string.max": "El nombre del profesor no puede exceder los 50 caracteres",
      "string.empty": "El nombre del profesor no debe estar vacio",
    }),
    descripcion: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        "string.base": "La descripcion debe ser una cadena",
        "string.max": "La descripcion no debe tener mas de 50 caracteres",
        "string.min": "La descripcion no puede estar vacia",
        "string.empty": "La descripcion no puede estar vacia",
        "any.required": "La descripcion es obligatoria",
      }),

    cupos: Joi.number().integer().min(1).max(100).messages({
      "any.required": "Los cupos son obligatorios",
      "number.base": "Los cupos deben ser un número",
      "number.min": "Los cupos deben ser al menos 1",
      "number.max": "Los cupos no pueden exceder 100",
    }),

    creditos: Joi.number().integer().min(2).max(8).required().messages({
      "any.required": "Los creditos son obligatorios",
      "number.base": "Los creditos deben ser un numero",
      "number.min": "Los creditos deben ser al menos 2",
      "number.max": "Los creditos no pueden exceder 8",
    })
  });

export default createValidation;
*/