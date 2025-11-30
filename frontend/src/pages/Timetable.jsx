import "@styles/timeTable.css";
import useGetTimetable from "@hooks/timetable/useGetTimetable.jsx";
import useCreateTimetable from "@hooks/timetable/useCreateTimetable.jsx";
import editTimetable from "@hooks/timetable/useUpdateTimetable.jsx"; 
import deleteTimetable from "@hooks/timetable/useDeleteTimetable.jsx";
import { useEffect } from "react";

const Timetable = () => {
    const { timetables, fetchTimetable } = useGetTimetable();
    const { handleCreateTimetable } = useCreateTimetable(fetchTimetable);
    const { handleEditTimetable } = editTimetable(fetchTimetable);
    const { handleDeleteTimetable } = deleteTimetable(fetchTimetable);

    useEffect(() => {
        fetchTimetable();
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
                    {Array.isArray(timetables) && timetables.length > 0? (
                        timetables.map((Timetable) => (
                        <tr key={"Timetable-"+Timetable.id}>
                            <td>{Timetable.id}</td>
                            <td>{Timetable.codigo_electivo}</td>
                            <td>{Timetable.hora_inicio}</td>
                            <td>{Timetable.hora_termino}</td>
                            <td>{Timetable.sala}</td>
                            <td>{Timetable.dia}</td>
                            <td>
                                <button onClick={() => handleEditTimetable(Timetable.id, Timetable)}>Editar</button>
                                <button onClick={() => handleDeleteTimetable(Timetable.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))
                    ) : (
                        <tr>
                            <td colSpan="7">No hay horarios disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;