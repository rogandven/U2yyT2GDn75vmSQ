export const getControllerResult = (details, serviceResult) => {
    return {
        message: String(details),
        serviceResult: serviceResult
    };
}

export const fullNameProcessor = (string) => {
    const BASE_CASE = "";
    if (!string) {
        return BASE_CASE;
    }
    if (typeof(string) !== "string") {
        return BASE_CASE;
    }
    const newString = string.replace(/ {2,}/g, " ");
    return newString.trim().toUpperCase();
}

export const robustErrorMessage = (a, b) => {
    if (!b || (typeof(b) !== "string")) {
        throw Error("Datos no proporcionados correctamente");
    }
    if (!a) {
        return String(b);
    }
    return String(a);
}