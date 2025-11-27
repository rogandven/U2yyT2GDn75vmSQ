export const getControllerResult = (details, serviceResult) => {
    return {
        message: String(details),
        serviceResult: serviceResult
    };
}