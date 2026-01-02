// import "@styles/timeTable.css";
import { useGetTimetable } from "@hooks/timetable/useGetTimetable.jsx";
import useCreateTimetable from "@hooks/timetable/useCreateTimetable.jsx";
import editTimetable from "@hooks/timetable/useUpdateTimetable.jsx"; 
import deleteTimetable from "@hooks/timetable/useDeleteTimetable.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { SearchBar } from "../components/DUComponents/SearchBar/SearchBar.jsx";
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
    const [buscar, setBuscar] = useState("");




    useEffect(() => {
        if (typeof(fetchTimetable) === 'function') {
            fetchTimetable();
        }
        if (typeof(fetchElectivoNames) === 'function') {
            fetchElectivoNames();
        }
    }, []);

    const limpiarFiltros = () => {
        setBuscar("");
    };

    const electivosEncontrados = horarioData.data?.filter((e) => {
    const coincideTexto =
      e.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(buscar.toLowerCase());
    /*const coincideArea =
      !filtroArea || e.area.toLowerCase() === filtroArea.toLowerCase();*/
    return coincideTexto;
  });
    const POSTS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const lastPostIndex  = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = (Array.isArray(timetables?.data) && timetables?.data.slice(firstPostIndex, lastPostIndex)) || [];
    const pageAmount = Math.abs(Math.ceil((Array.isArray(timetables?.data) && timetables?.data?.length) / POSTS_PER_PAGE)) || 0;

    return (
        <div className="timetable-page">
            {isAdmin && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateTimetable(electivoNames)}>Crear Horario</button>)}
            <SearchBar 
                      customClassName={"busqueda-filtro-input ml-3"} 
                      placeholder={"Buscar por nombre o descripción..."} 
                      value={buscar} 
                      onChange={(e) => setBuscar(e.target.value)}>
            </SearchBar>
             {(buscar ) && (
          <button className="solicitud-limpiar-btn btn ml-5" onClick={limpiarFiltros}>
            Limpiar
          </button>
        )}
            <div className="timetable2-page">
                <DUHorarioTable data={timetables?.data || []} electivosEncontrados={electivosEncontrados} handleEditTimetable={handleEditTimetable} handleDeleteTimetable={handleDeleteTimetable} />
            </div>
            <DUHorarioTable data={currentPageContent || []} handleEditTimetable={handleEditTimetable} handleDeleteTimetable={handleDeleteTimetable} />
            <DUPageBrowser setCurrentPageNumber={setCurrentPage} currentPageNumber={currentPage} pageAmount={pageAmount}></DUPageBrowser>
        </div>
    );
};

export default Timetable;