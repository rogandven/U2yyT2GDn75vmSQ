import { useState } from 'react';
import { getElectivos } from '@services/electivo.service.js';

export const GetElectivo = () => { 
    const [electivos, setElectivos] = useState([]);
    
    const fetchElectivos = async () => {
        try {
            const data = await getElectivos();
            dataLogged(data);
            setElectivos(data);
        } catch (error) {
            console.error("Error consiguiendo electivos:", error);
        }
    };
    
    const dataLogged = (data) => {
        try {
            const { nombre } = JSON.parse(sessionStorage.getItem("electivo"));
            for (let i = 0; i < data.length; i++) {
                if(data[i].nombre === nombre) {
                    data.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error procesando datos de electivo:", error);
        }
    }

    return { electivos, setElectivos, fetchElectivos };
}

export default GetElectivo;