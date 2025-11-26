export const BASE_CASE = 500;
export const MIN_ERROR_CODE = 100;
export const MAX_ERROR_CODE = 600;

export const getErrorMessage = (error) => {
    if (!error) {
        return UNKNOWN_ERROR;
    }
    return error.message ? error.message : UNKNOWN_ERROR; 
}

export const getResultLength = (result) => {
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

/*
export const parseErrorCode = (errorCode) => {
    if (!errorCode) {
        return BASE_CASE;
    }
    if (typeof errorCode !== "number" || isNaN(errorCode)) {
        return BASE_CASE;
    }
    if (errorCode < MIN_ERROR_CODE || errorCode > MAX_ERROR_CODE) {
        return BASE_CASE;
    }
    return Math.abs(Math.round(errorCode));
} */

export const getServiceResult = (error, data, details, length) => {
    return {
        error: Boolean(error),
        data: Object(data),
        details: String(details),
        length: parseInt(length)
    };
}