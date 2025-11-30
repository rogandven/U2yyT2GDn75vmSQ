import { useState } from "react";
import { getTimetables } from "@services/horario.service.js";

const useGetTimetable = () => {
    const [horarioData, setHorarioData] = useState([]);

    const fetchHorario = async () => {
        try {
            const data = await getTimetables();
            setHorarioData(data);
        } catch (error) {
            console.error('Error al conseguir la clase data:', error);
        } 
    };

    return { horarioData, fetchHorario };
};

export default useGetTimetable;