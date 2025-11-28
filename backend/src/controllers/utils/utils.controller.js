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