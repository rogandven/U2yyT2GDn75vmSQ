import { useState } from 'react';
import { getElectivos } from '@services/electivo.service.js';

export const useGetElectivos = () => {
    const [electivos, setElectivos] = useState([]);

    const fetchElectivos = async () => {
        try {
            const response = await getElectivos();
            // `getElectivos` returns an object like { data: [...], status, message }
            // Normalize to always set an array into state.
            const list = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
            setElectivos(list);
        } catch (error) {
            // console.error("Error consiguiendo electivos:", error);
            setElectivos([]);
        }
    };

    return { electivos, setElectivos, fetchElectivos };
}

export default useGetElectivos;