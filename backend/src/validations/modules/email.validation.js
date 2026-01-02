/*
import { VALID_EMAIL_DOMAINS } from "../../constants/user.constants.js";

export const emailDomainValidationFunction = (value, helpers) => {
    for (const domain in VALID_EMAIL_DOMAINS) {
        if (value.endsWith && value.endsWith(VALID_EMAIL_DOMAINS[domain])) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes dominios: ${VALID_EMAIL_DOMAINS.join(", ")}`);
}*/

"use strict";

import Joi from "joi";
import { VALID_EMAIL_DOMAINS } from "../../constants/user.constants.js";

export const emailDomainValidationFunction = (value, helpers) => {
    for (const domain of Object.values(VALID_EMAIL_DOMAINS)) {
        if (value.endsWith(domain)) {
            return value;
        }
    }

    return helpers.message(
        `Solo se permiten los siguientes dominios: ${Object.values(VALID_EMAIL_DOMAINS).join(", ")}`
    );
};

export const emailValidation = Joi.string()
    .email()
    .custom(emailDomainValidationFunction)
    .messages({
        "string.email": "Correo electrónico inválido",
        "string.empty": "El correo es obligatorio",
    });
