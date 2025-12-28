const throwErrorIfAPIUrlNotFound = () => {
    const API_URL = import.meta.env.API_URL || import.meta.env.VITE_API_URL;
    if (!API_URL) {
        throw new Error("Error al importar variables de entorno");
    }
    return String(API_URL);
}


export const API_URL = throwErrorIfAPIUrlNotFound();

