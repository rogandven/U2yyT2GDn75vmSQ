import { getCarreraNames } from "@services/carrera.service.js";
import { useState } from "react";
export const useGetCarreraNames = () => { 
    const [carreraNames, setCarreraNames] = useState([]);

    const fetchCarreraNames = async () => {
        try {
            const data = await getCarreraNames();
            setCarreraNames(data);
        } catch (error) {
            console.error('Error al conseguir la carrera data:', error);
        } 
    };


    return { carreraNames, fetchCarreraNames };
};

export default useGetCarreraNames;