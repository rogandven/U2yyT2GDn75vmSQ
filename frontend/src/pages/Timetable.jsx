// import "@styles/timeTable.css";
import { useGetTimetable } from "@hooks/timetable/useGetTimetable.jsx";
import useCreateTimetable from "@hooks/timetable/useCreateTimetable.jsx";
import editTimetable from "@hooks/timetable/useUpdateTimetable.jsx"; 
import deleteTimetable from "@hooks/timetable/useDeleteTimetable.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { DUHorarioTable } from "../components/DUComponents/Table/DUHorarioTimeTable.jsx";
import { useGetElectivoNames } from "../hooks/Inscripciones/useGetNames.jsx";
import { getUserRole } from "../services/admin.service.js";
import { isAdminOrProfesor } from "../services/admin.service.js";
import { isJefeDeCarrera } from "../services/admin.service.js";

const Timetable = () => {
    const userRole = getUserRole();
    const isAdmin = isAdminOrProfesor(userRole);
    const isJefe = isJefeDeCarrera(userRole);

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
            {isAdmin && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateTimetable(electivoNames)}>Crear Horario</button>)}
            <DUHorarioTable data={timetables?.data || []} handleEditTimetable={handleEditTimetable} handleDeleteTimetable={handleDeleteTimetable} isAdmin={isAdmin} isJefe={isJefe}/>
        </div>
    );
};

export default Timetable;