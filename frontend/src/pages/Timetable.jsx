import "@styles/timeTable.css";
import { useGetTimetable } from "@hooks/timetable/useGetTimetable.jsx";
import useCreateTimetable from "@hooks/timetable/useCreateTimetable.jsx";
import editTimetable from "@hooks/timetable/useUpdateTimetable.jsx"; 
import deleteTimetable from "@hooks/timetable/useDeleteTimetable.jsx";
import { useEffect } from "react";
import { useState } from "react";

const Timetable = () => {
    const mostrarHorarios = (data) => {
        if (Array.isArray(data) && data.length > 0) {
            return data.map((Timetable) => (
                        <tr key={"Timetable-"+Timetable.id_horario}>
                            <td>{Timetable.id_horario}</td>
                            <td>{Timetable.id_electivo}</td>
                            <td>{Timetable.hora_inicio}</td>
                            <td>{Timetable.hora_termino}</td>
                            <td>{Timetable.sala}</td>
                            <td>{Timetable.dia}</td>
                            <td>
                                <button onClick={() => handleEditTimetable(Timetable.id_horario, Timetable)}>Editar</button>
                                <button onClick={() => handleDeleteTimetable(Timetable.id_horario)}>Eliminar</button>
                            </td>
                        </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan="7">No hay horarios disponibles.</td>
                </tr>
            )
        }
    }

    const [horarioData, setHorarioData] = useState([]);
    // console.log(horarioData);
    // console.log(setHorarioData);

    // console.log(useGetTimetable);
    // const [horarioData, setHorarioData] = useState([]);
    /* console.log(useGetTimetable);
    console.log(typeof(useGetTimetable));
    try {
        console.log(JSON.stringify(useGetTimetable));
    } catch (error) {
        console.error("Error al convertir useGetTimetable a JSON:", error);
    } */



    const [timetables, fetchTimetable] = useGetTimetable(horarioData, setHorarioData);
    /* console.log(timetables);
    console.log(typeof(timetables));
    try {
        console.log(JSON.stringify(timetables));
    } catch (error) {
        console.error("Error al convertir timetables a JSON:", error);
    }
    console.log(fetchTimetable);
    console.log(typeof(fetchTimetable));
    try {
        console.log(JSON.stringify(fetchTimetable));
    } catch (error) {
        console.error("Error al convertir fetchTimetable a JSON:", error);
    } */

    const { handleCreateTimetable } = useCreateTimetable(fetchTimetable);
    const { handleEditTimetable } = editTimetable(fetchTimetable);
    const { handleDeleteTimetable } = deleteTimetable(fetchTimetable);
    /* console.log(fetchTimetable);
    console.log(typeof(fetchTimetable));
    try {
        console.log(JSON.stringify(fetchTimetable));
    } catch (error) {
        console.error("Error al convertir fetchTimetable a JSON:", error);
    } */
    

    useEffect(() => {
        if (typeof(fetchTimetable) === 'function') {
            fetchTimetable();
        }
    }, []);

    return (
        <div className="timetable-page">
            <h2>Lista de horarios</h2>
            <button className="create" onClick={() => handleCreateTimetable(Timetable.hora_inicio,Timetable.hora_termino,Timetable.sala,Timetable.dia)}>Crear Horario</button>
            <table className="timetable-table">
                <thead>
                     <tr>
                        <th>ID</th>
                        <th>codigo electivo</th>
                        <th>Hora de Inicio</th>
                        <th>Hora de Término</th>
                        <th>Sala</th>
                        <th>Día</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mostrarHorarios(timetables.data)}
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;