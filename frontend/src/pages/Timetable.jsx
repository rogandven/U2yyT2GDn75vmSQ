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
import { isAdminOrProfesor } from "../services/admin.service.js";
//import { isJefeDeCarrera } from "../services/admin.service.js";

const Timetable = () => {
    const isAdmin = isAdminOrProfesor();
    //const isJefe = isJefeDeCarrera();

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
        </div>
    );
};

export default Timetable;