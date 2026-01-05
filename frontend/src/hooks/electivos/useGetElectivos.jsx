import { useState } from 'react';
import { getElectivos } from '@services/electivo.service.js';
import { TEACHER_ROLE } from '../../../../backend/src/constants/user.constants';
import { getElectivosProfesor } from '../../services/electivo.service';
import { getUserRole } from '../../services/admin.service';

export const useGetElectivos = () => {
    const [electivos, setElectivos] = useState({ data: [] });

    const fetchElectivos = async () => {
        try {
            const userRole = getUserRole();
            let response = null;
            if (userRole !== TEACHER_ROLE) {
                response = await getElectivos();
            } else {
                response = await getElectivosProfesor();
            }
            // `getElectivos` returns an object like { data: [...], status, message }
            // Keep the full response object so callers can access .data, .status, .message
            setElectivos(response || { data: [] });
        } catch (error) {
            // console.error("Error consiguiendo electivos:", error);
            setElectivos({ data: [] });
        }
    };

    return { electivos, setElectivos, fetchElectivos };
}

export default useGetElectivos;