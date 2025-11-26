export const getErrorMessage = (error) => {
    if (!error) {
        return UNKNOWN_ERROR;
    }
    return error.message ? error.message : UNKNOWN_ERROR; 
}

export const getResultLength = (result) => {
    const BASE_CASE = 0;
    if (!result) {
        return BASE_CASE;
    }
    try {
        const resultLength = Number(result.length());
        if (isNaN(resultLength)) {
            return BASE_CASE;
        }
        return resultLength;
    } catch (error) {
        return BASE_CASE;
    }
}

export const parseErrorCode = (errorCode) => {
    if (!errorCode) {
        return 500;
    }
    if (typeof errorCode !== "number" || isNaN(errorCode)) {
        return 500;
    }
    return Math.abs(Math.round(errorCode));
}

export const createResponseBlueprint = (error, errorCode, data, details, length) => {
    return {
        error: Boolean(error),
        errorCode: parseErrorCode(errorCode),
        data: Object(data),
        details: String(details),
        length: parseInt(length)
    };
}