import { getControllerResult } from "../../controllers/utils/utils.controller.js";

export const getMiddlewareResponse = (message) => {
    if ((!message) || (typeof(message) !== "string")) {
        message = "Datos inválidos";
    }
    return {
        message: String(message),
        serviceResponse: null
    }
}

export const getTrueMiddlewareResponse = (message, serviceResponse) => {
    return getControllerResult(message, serviceResponse);
}