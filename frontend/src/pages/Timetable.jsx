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
import { DUPageBrowser } from "../components/DUComponents/DUPageBrowser.jsx";

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

    const POSTS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const lastPostIndex  = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = (Array.isArray(timetables?.data) && timetables?.data.slice(firstPostIndex, lastPostIndex)) || [];
    const pageAmount = Math.abs(Math.ceil((Array.isArray(timetables?.data) && timetables?.data?.length) / POSTS_PER_PAGE)) || 0;

    return (
        <div className="timetable-page">
            {isAdmin && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateTimetable(electivoNames)}>Crear Horario</button>)}
            <DUHorarioTable data={currentPageContent || []} handleEditTimetable={handleEditTimetable} handleDeleteTimetable={handleDeleteTimetable} />
            <DUPageBrowser setCurrentPageNumber={setCurrentPage} currentPageNumber={currentPage} pageAmount={pageAmount}></DUPageBrowser>
        </div>
    );
};

export default Timetable;