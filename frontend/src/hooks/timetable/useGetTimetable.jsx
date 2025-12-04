// import { useState } from "react";
import { getTimetables } from "@services/horario.service.js";

export const useGetTimetable = (horarioData, setHorarioData) => {
    const fetchHorario = async () => {
        try {
            const data = await getTimetables();
            console.log('Datos de horario obtenidos:', data);
            /* console.log('Tipo de datos de horario obtenidos:', typeof data);
            try {
                console.log('Datos de horario obtenidos (stringified):', JSON.stringify(data));
            } catch (error) {
                console.error('Error al convertir los datos de horario a JSON:', error);
            } */
            setHorarioData(data);
        } catch (error) {
            console.error('Error al conseguir la clase data:', error);
        } 
    };


    return [horarioData, fetchHorario];
};

export default useGetTimetable;