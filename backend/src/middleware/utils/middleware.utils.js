import { getControllerResult_NEW } from "../../controllers/utils/utils.controller.js";

export const getMiddlewareResponse = (message) => {
    if ((!message) || (typeof(message) !== "string")) {
        message = "Datos inválidos";
    }
    return {
        message: String(message),
        data: null
    }
}

export const getTrueMiddlewareResponse = (message, serviceResponse) => {
    return getControllerResult_NEW(message, serviceResponse);
}