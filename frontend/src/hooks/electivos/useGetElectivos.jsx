import { useState } from 'react';
import { getElectivos } from '@services/electivo.service.js';

export const useGetElectivos = () => { 
    const [electivos, setElectivos] = useState([]);
    
    const fetchElectivos = async () => {
        try {
            const data = await getElectivos();
            setElectivos(data);
        } catch (error) {
            // console.error("Error consiguiendo electivos:", error);
        }
    };

    return { electivos, setElectivos, fetchElectivos };
}

export default useGetElectivos;