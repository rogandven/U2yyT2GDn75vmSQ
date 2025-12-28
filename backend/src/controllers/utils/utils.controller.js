export const getControllerResult_OLD = (details, serviceResult) => {
    return {
        message: String(details),
        serviceResult: serviceResult
    };
}

export const getControllerResult_NEW = (details, serviceResult) => {
    const object = {
        message: String(details),
    };
    Object.assign(object, serviceResult);
    return object;
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

export const validationFunctionHelper = (array, data) => {
    if (!(Array.isArray(array)) || !data) {
        return String("Datos inválidos"); // para que funcione el IntelliSense, jajajaja
    }
    let current = null;
    for (let i = 0; i < array.length; i++) {
        if (!(array[i].validate)) {
            continue;
        }      
        current = array[i].validate(data);
        if (current.error && current.error.message) {
            return String(current.error.message);
        }
    }
    return null;
}

export const processCarrera = (carrera) => {
    try {
        if (carrera && typeof(carrera) === "string") {
            return carrera.toUpperCase().trim().replaceAll(" ", "");
        } 
        return undefined;
    } catch (error) {
        return undefined;
    }

}

export const processRole = (role) => {
    if (!role || typeof(role) !== "string") {
        return undefined;
    }
    return role.toUpperCase().trim().replaceAll(" ", "_");
}