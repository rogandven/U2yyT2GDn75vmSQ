// import "@styles/timeTable.css";
import { useGetTimetable } from "@hooks/timetable/useGetTimetable.jsx";
import useCreateTimetable from "@hooks/timetable/useCreateTimetable.jsx";
import editTimetable from "@hooks/timetable/useUpdateTimetable.jsx"; 
import deleteTimetable from "@hooks/timetable/useDeleteTimetable.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { DUHorarioTable } from "../components/DUComponents/Table/DUHorarioTimetable.jsx";
import { useGetElectivoNames } from "../hooks/Inscripciones/useGetNames.jsx";

const Timetable = () => {
    const [horarioData, setHorarioData] = useState([]);

    const [timetables, fetchTimetable] = useGetTimetable(horarioData, setHorarioData);

    const { handleCreateTimetable } = useCreateTimetable(fetchTimetable);
    const { handleEditTimetable } = editTimetable(fetchTimetable);
    const { handleDeleteTimetable } = deleteTimetable(fetchTimetable);

    const { electivoNames, fetchElectivoNames } = useGetElectivoNames();

    useEffect(() => {
        if (typeof(fetchTimetable) === 'function') {
            fetchTimetable();
        }
        if (typeof(fetchElectivoNames) === 'function') {
            fetchElectivoNames();
        }
    }, []);

    return (
        <div className="timetable-page">
            <button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateTimetable(electivoNames)}>Crear Horario</button>
            <DUHorarioTable data={timetables?.data || []} handleEditTimetable={handleEditTimetable} handleDeleteTimetable={handleDeleteTimetable} />
        </div>
    );
};

export default Timetable;