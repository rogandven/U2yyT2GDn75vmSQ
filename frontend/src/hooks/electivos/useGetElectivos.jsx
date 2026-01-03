import { useState } from 'react';
import { getElectivos } from '@services/electivo.service.js';

export const useGetElectivos = () => {
    const [electivos, setElectivos] = useState({ data: [] });

    const fetchElectivos = async () => {
        try {
            const response = await getElectivos();
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