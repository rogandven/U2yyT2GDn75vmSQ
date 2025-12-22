// import { useState } from "react";
import { getTimetables } from "@services/horario.service.js";
import Swal from "sweetalert2";

const parsearMensaje = (message) => {
    if (typeof message === 'string') {
        return String(message);
    }
    return "Error desconocido";
}

const fireError = async (message) => {
    await Swal.fire({
        title: "Error",
        text: parsearMensaje(message),
        icon: "error",
    });
}

const setFailureMessage = (setPlaceholder) => {
    setPlaceholder("No hay horarios disponibles.");
}

export const useGetTimetable = (horarioData, setHorarioData, setPlaceholder) => {
    const fetchHorario = async () => {
        try {
            const data = await getTimetables();
            // console.log('Datos de horario obtenidos:', data);
            const parsedData = (data && data.data) || [];
            if (Array.isArray(parsedData) && parsedData.length <= 0) {
                setFailureMessage(setPlaceholder);
                return;
            }
            /* console.log('Tipo de datos de horario obtenidos:', typeof data);
            try {
                console.log('Datos de horario obtenidos (stringified):', JSON.stringify(data));
            } catch (error) {
                console.error('Error al convertir los datos de horario a JSON:', error);
            } */
            setHorarioData(data);
        } catch (error) {
            setFailureMessage(setPlaceholder);
            fireError('No se pudieron obtener los datos de horario.');
            console.error('Error al conseguir la clase data:', error);
        } 
    };


    return [horarioData, fetchHorario];
};

export default useGetTimetable;