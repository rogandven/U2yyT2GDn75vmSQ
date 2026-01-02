import { useGetCarrera } from "@hooks/carreras/useGetCarrera.jsx";
import useCreateCarrera from "@hooks/carreras/useCreateCarrera.jsx";
import editCarrera from "@hooks/carreras/useUpdateCarrera.jsx"; 
import deleteCarrera from "@hooks/carreras/useDeleteCarrera.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { DUCarreraTable } from "../components/DUComponents/Table/DUCarreraTable.jsx";
import { isAdmin } from "../services/admin.service.js";
//import { isJefeDeCarrera } from "../services/admin.service.js";

const Carreras = () => {
    const esAdmininstardor = isAdmin();
    //const isJefe = isJefeDeCarrera();

    const [carreraData, setCarreraData] = useState([]);

    const [carreras, fetchCarrera] = useGetCarrera(carreraData, setCarreraData);

    const { handleCreateCarrera } = useCreateCarrera(fetchCarrera);
    const { handleEditCarrera } = editCarrera(fetchCarrera);
    const { handleDeleteCarrera } = deleteCarrera(fetchCarrera);


    useEffect(() => {
        if (typeof(fetchCarrera) === 'function') {
            fetchCarrera();
        }
    }, []);

    return (
        <div className="timetable-page">
            {esAdmininstardor && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateCarrera()}>Crear Carrera</button>)}
            <DUCarreraTable data={carreras?.data || []} handleEditCarrera={handleEditCarrera} handleDeleteCarrera={handleDeleteCarrera} />
        </div>
    );
};

export default Carreras;