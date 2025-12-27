import { useState } from 'react';
import { getUserRole, isAdminOrProfesor } from '../../services/admin.service.js';
import { private_getInscripciones, public_getInscripcionesByUser } from '../../services/inscripcion.service.js';
// import { JEFE_DE_CARRERA } from '../../constants/InscripcionConstants.jsx';
export const useGetInscripciones = () => { 
    const [inscripciones, setInscripciones] = useState([]);
    
    const fetchInscripciones = async () => {
        const BASE_CASE = [];
        let data = BASE_CASE;
        try {
            if (getUserRole().toUpperCase() === JEFE_DE_CARRERA.toUpperCase() || isAdminOrProfesor()) {
                data = await private_getInscripciones();
            } else {
                data = await public_getInscripcionesByUser();
            }
            setInscripciones(data);
        } catch (error) {
            console.error("Error consiguiendo inscripciones:", error);
            setInscripciones(BASE_CASE);
        }
    };

    return { inscripciones, setInscripciones, fetchInscripciones };
}

export default useGetInscripciones;