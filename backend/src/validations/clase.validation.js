// Esquema de validación para el registro de usuarios
export const assignationValidation = Joi.object({
  sala: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.pattern.base":
        "La sala solo puede contener letras, números y guiones bajos.",
      "string.min": "La sala debe tener al menos 3 caracteres.",
      "string.max": "La sala  no puede exceder los 30 caracteres.",
      "string.empty": "La sala  es obligatoria.",
    }),
  horario: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.empty": "el horario no puede estar vacío.",
      "string.base": "el horario debe ser de tipo string.",
    }),
  fecha_inicio_clases: Joi.string()
    .email()
    .required()
    .min(7)
    .max(20)
    .messages({
      "string.min": "La fecha de inicio de clases debe tener al menos 7 caracteres.",
      "string.max": "La fecha de inicio de clases no puede exceder los 20 caracteres.",
      "string.empty": "La fecha de inicio de clases es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });
