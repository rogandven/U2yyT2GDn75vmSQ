// import "@styles/timeTable.css";
import { useGetCarrera } from "@hooks/timetable/useGetCarrera.jsx";
import useCreateCarrera from "@hooks/timetable/useCreateCarrera.jsx";
import editCarrera from "@hooks/timetable/useUpdateCarrera.jsx"; 
import deleteCarrera from "@hooks/timetable/useDeleteCarrera.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { DUCarreraTable } from "../components/DUComponents/Table/DUCarreraTable.jsx";
import { useGetElectivoNames } from "../hooks/Inscripciones/useGetNames.jsx";
import { isAdminOrProfesor } from "../services/admin.service.js";
import { isJefeDeCarrera } from "../services/admin.service.js";

const Carreras = () => {
    const isAdmin = isAdminOrProfesor();
    const isJefe = isJefeDeCarrera();

    const [carreraData, setCarreraData] = useState([]);

    const [timetables, fetchCarrera] = useGetCarrera(carreraData, setCarreraData);

    const { handleCreateCarrera } = useCreateCarrera(fetchCarrera);
    const { handleEditCarrera } = editCarrera(fetchCarrera);
    const { handleDeleteCarrera } = deleteCarrera(fetchCarrera);

    const { electivoNames, fetchElectivoNames } = useGetElectivoNames();

    useEffect(() => {
        if (typeof(fetchCarrera) === 'function') {
            fetchCarrera();
        }
        if (typeof(fetchElectivoNames) === 'function') {
            fetchElectivoNames();
        }
    }, []);

    return (
        <div className="timetable-page">
            {isAdmin && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateCarrera(electivoNames)}>Crear Carrera</button>)}
            <DUCarreraTable data={carreraData || []} handleEditCarrera={handleEditCarrera} handleDeleteCarrera={handleDeleteCarrera} />
        </div>
    );
};

export default Carreras;