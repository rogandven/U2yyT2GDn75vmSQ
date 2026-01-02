import { useGetCarrera } from "@hooks/carreras/useGetCarrera.jsx";
import useCreateCarrera from "@hooks/carreras/useCreateCarrera.jsx";
import editCarrera from "@hooks/carreras/useUpdateCarrera.jsx"; 
import deleteCarrera from "@hooks/carreras/useDeleteCarrera.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { DUCarreraTable } from "../components/DUComponents/Table/DUCarreraTable.jsx";
import { isAdmin } from "../services/admin.service.js";
import { DUPageBrowser } from "../components/DUComponents/DUPageBrowser.jsx";
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

    const POSTS_PER_PAGE = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const lastPostIndex  = currentPage * POSTS_PER_PAGE;
    const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
    const currentPageContent = (Array.isArray(carreras?.data) && carreras?.data.slice(firstPostIndex, lastPostIndex)) || [];
    const pageAmount = Math.abs(Math.ceil((Array.isArray(carreras?.data) && carreras?.data?.length) / POSTS_PER_PAGE)) || 0;
    return (
        <div className="timetable-page">
            {esAdmininstardor && (<button className="create btn btn-primary ml-3 mt-3 mb-0" onClick={() => handleCreateCarrera()}>Crear Carrera</button>)}
            <DUCarreraTable data={currentPageContent || []} handleEditCarrera={handleEditCarrera} handleDeleteCarrera={handleDeleteCarrera} />
            <DUPageBrowser currentPageNumber={currentPage} setCurrentPageNumber={setCurrentPage} pageAmount={pageAmount}></DUPageBrowser>
        </div>

    );
};

export default Carreras;