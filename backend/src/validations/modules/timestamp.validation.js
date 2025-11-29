export const timestampValidationHelper = (timestamp) => {
    try {
        if (!timestamp) {
            return false;
        }
        if (typeof(timestamp) !== "string") {
            return false;
        }
        timestamp = timestamp.split(".")[0];
        const result = Date.parse(timestamp, "yyyy-MM-dd HH:mm:ss");
        if (result === null || !result) {
            return false;
        }        
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}

export const timestampValidationFunction = (value, helpers) => {
    const result = timestampValidationHelper(value);
    if (!result) {
        return helpers.message('La fecha no es válida');
    }
    return true;
}