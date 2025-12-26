"use strict";

import { useEffect } from "react";
import Swal from "sweetalert2";
// import { useGetInscripciones } from "@hooks/inscripciones/useGetInscripciones.jsx";
// import { DUInscripcionTable } from "../components/DUComponents/Table/DUInscripcionTable.jsx";
// import { SearchBar } from "../components/DUComponents/SearchBar/SearchBar.jsx";
import { DUSelection } from "../components/DUComponents/DUSelection.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../constants/InscripcionConstants.jsx";
import { DUInscripcionTable } from "../components/DUComponents/Table/DUInscripcionTable.jsx";
import useGetInscripciones from "../hooks/Inscripciones/useGetInscripciones.jsx";
import useCreateInscripcion from "../hooks/Inscripciones/useCreateInscripcion.jsx";
// import useCreateInscripcion from "../hooks/inscripciones/useCreateInscripcion.jsx";
import useEditInscripcion from "../hooks/Inscripciones/useEditInscripcion.jsx";
import useDeleteInscripcion from "../hooks/Inscripciones/useDeleteInscripcion.jsx";
import useChangeInscripcionStatus from "../hooks/inscripciones/useChangeInscripcionStatus.jsx";

import { useGetElectivoNames } from "../hooks/Inscripciones/useGetNames.jsx";
import { useGetUserNames } from "../hooks/Inscripciones/useGetNames.jsx";

const Inscripciones = () => {
  const { inscripciones, fetchInscripciones } = useGetInscripciones();
  const { handleCreateInscripcion } = useCreateInscripcion(fetchInscripciones);
  // const { inscripciones, fetchInscripciones } = useGetInscripciones();
  // const { handleCreateInscripcion } = useCreateInscripcion(fetchInscripciones);
  const { handleEditInscripcion } = useEditInscripcion(fetchInscripciones);
  const { handleDeleteInscripcion } = useDeleteInscripcion(fetchInscripciones);
  const { handleChangeInscripcionStatus } = useChangeInscripcionStatus(fetchInscripciones);

  const { electivoNames, fetchElectivoNames } = useGetElectivoNames();
  const { userNames, fetchUserNames } = useGetElectivoNames();

  // const [busqueda, setBusqueda] = useState("");
  // const [filtroArea, setFiltroArea] = useState("");

  useEffect(() => {
    fetchInscripciones();
  }, []);

  /* const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroArea("");
  }; */

  /* const inscripcionesFiltrados = inscripciones.data?.filter((e) => {
    const coincideTexto =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideArea =
      !filtroArea || e.area.toLowerCase() === filtroArea.toLowerCase();
    return coincideTexto && coincideArea;
  });

  const mostrarDescripcion = (nombre, descripcion) => {
    Swal.fire({
      title: `<h2 style="color:#2b2b2b;">${nombre}</h2>`,
      html: `
        <div style="
          background:#f9f9f9;
          border:1px solid #ccc;
          border-radius:10px;
          padding:15px;
          text-align:left;
          font-size:1rem;
          color:#333;
          max-height:300px;
          overflow-y:auto;
        ">
          ${descripcion}
        </div>
      `,
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#3085d6",
      width: 600,
    });
  };
  */
  return (
    <div className="users-page">
      <div className="solicitud-filtros-container flex flex-row mt-3">
        <button className="btn btn-primary ml-3 mb-0" onClick={handleCreateInscripcion}>Crear Inscripcion</button>
        {/* <DUSelection
          options={AREAS_PERMITIDAS_EN_MAYUSCULA}
          defaultValue={"Todas las áreas"}
          onChange={(e) => setFiltroArea(e.target.value)}
          className={'ml-3'}
        />*/}
        {/* (busqueda || filtroArea) && (
          <button className="solicitud-limpiar-btn btn ml-5" onClick={limpiarFiltros}>
            Limpiar
          </button>
        ) */}
      </div>
      <div className="solicitud-tabla-wrapper">
        <DUInscripcionTable inscripciones={inscripciones} handleEditInscripcion={handleEditInscripcion} handleDeleteInscripcion={handleDeleteInscripcion} handleChangeInscripcionStatus={handleChangeInscripcionStatus}></DUInscripcionTable>
      </div>
    </div>
  );
};

export default Inscripciones;