/*
"use strict";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos.jsx";
import { DUElectivoTable } from "../components/DUComponents/Table/DUElectivoTable.jsx";
import { SearchBar } from "../components/DUComponents/SearchBar/SearchBar.jsx";
import { DUSelection } from "../components/DUComponents/DUSelection.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA, ESTADOS_VALIDOS } from "../constants/ElectivoConstants.jsx";
import useCreateElectivo from "../hooks/electivos/useCreateElectivo.jsx";
import useEditElectivo from "../hooks/electivos/useEditElectivo.jsx";
import useDeleteElectivo from "../hooks/electivos/useDeleteElectivo.jsx";
import useChangeElectivoStatus from "../hooks/electivos/useChangeElectivoStatus.jsx";
import { useCreateInscripcion_PUBLIC } from "../hooks/Inscripciones/useCreateInscripcion.jsx";
import { getUserRole } from "../services/admin.service.js";
import { isAdminOrProfesor, isJefeDeCarrera } from "../services/admin.service.js";

const Electivos = () => {
  const userRole = getUserRole();
  const isAdmin = isAdminOrProfesor(userRole);
  const isJefe = isJefeDeCarrera(userRole);

  const { electivos, fetchElectivos } = useGetElectivos();
  const { handleCreateElectivo } = useCreateElectivo(fetchElectivos);
  const { handleEditElectivo } = useEditElectivo(fetchElectivos);
  const { handleDeleteElectivo } = useDeleteElectivo(fetchElectivos);
  const { handleChangeElectivoStatus } = useChangeElectivoStatus(fetchElectivos);
  const { handleCreateInscripcion_PUBLIC } = useCreateInscripcion_PUBLIC();

  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  useEffect(() => {
    fetchElectivos();
  }, []);



  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroArea("");
  };

  const electivosFiltrados = electivos.data?.filter((e) => {
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
      theme: "dark",
    });
  };

  return (
    <div className="users-page">
      <div className="solicitud-filtros-container flex flex-row mt-3">
        {isAdmin && (<button className="btn btn-primary ml-3 mb-0" onClick={() => handleCreateElectivo(isAdmin, isJefe)}>Crear Electivo</button>)}
        <SearchBar 
          customClassName={"solicitud-filtro-input ml-3"} 
          placeholder={"Buscar por nombre o descripción..."} 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)}>
        </SearchBar>
        <DUSelection
          options={AREAS_PERMITIDAS_EN_MAYUSCULA}
          defaultValue={"Todas las áreas"}
          onChange={(e) => setFiltroArea(e.target.value)}
          className={'ml-3 w-48 truncate'}
        />
        {(busqueda || filtroArea) && (
          <button className="solicitud-limpiar-btn btn ml-5" onClick={limpiarFiltros}>
            Limpiar
          </button>
        )}
      </div>
      <div className="solicitud-tabla-wrapper">
        <DUElectivoTable electivosFiltrados={electivosFiltrados} mostrarDescripcion={mostrarDescripcion} handleEditElectivo={handleEditElectivo} handleDeleteElectivo={handleDeleteElectivo} handleApproveElectivo={handleChangeElectivoStatus} handleRejectElectivo={handleChangeElectivoStatus} handleCreateInscripcion_PUBLIC={handleCreateInscripcion_PUBLIC} isAdmin={isAdmin} isJefe={isJefe}></DUElectivoTable>
      </div>
    </div>
  );
};

export default Electivos;*/

"use strict";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos.jsx";
import { DUElectivoTable } from "../components/DUComponents/Table/DUElectivoTable.jsx";
import { SearchBar } from "../components/DUComponents/SearchBar/SearchBar.jsx";
import { DUSelection } from "../components/DUComponents/DUSelection.jsx";
import { AREAS_PERMITIDAS_EN_MAYUSCULA } from "../constants/ElectivoConstants.jsx";
import useCreateElectivo from "../hooks/electivos/useCreateElectivo.jsx";
import useEditElectivo from "../hooks/electivos/useEditElectivo.jsx";
import useDeleteElectivo from "../hooks/electivos/useDeleteElectivo.jsx";
import useChangeElectivoStatus from "../hooks/electivos/useChangeElectivoStatus.jsx";
import { useCreateInscripcion_PUBLIC } from "../hooks/Inscripciones/useCreateInscripcion.jsx";
import useGetInscripciones from "../hooks/Inscripciones/useGetInscripciones.jsx";
import { getUserRole } from "../services/admin.service.js";
import { isAdminOrProfesor, isJefeDeCarrera } from "../services/admin.service.js";

const Electivos = () => {
  const userRole = getUserRole();
  const isAdmin = isAdminOrProfesor(userRole);
  const isJefe = isJefeDeCarrera(userRole);

  const { electivos, fetchElectivos } = useGetElectivos();
  const { handleCreateElectivo } = useCreateElectivo(fetchElectivos);
  const { handleEditElectivo } = useEditElectivo(fetchElectivos);
  const { handleDeleteElectivo } = useDeleteElectivo(fetchElectivos);
  const { handleChangeElectivoStatus } = useChangeElectivoStatus(fetchElectivos);
  const { handleCreateInscripcion_PUBLIC } = useCreateInscripcion_PUBLIC();
  const { inscripciones, fetchInscripciones } = useGetInscripciones();

  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  useEffect(() => {
    fetchElectivos();
    fetchInscripciones(false); 
  }, []);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroArea("");
  };

  const electivosFiltrados = electivos.data?.filter((e) => {
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
      theme: "dark",
    });
  };

  return (
    <div className="users-page">
      <div className="solicitud-filtros-container flex flex-row mt-3">
        {isAdmin && (
          <button
            className="btn btn-primary ml-3 mb-0"
            onClick={() => handleCreateElectivo(isAdmin, isJefe)}
          >
            Crear Electivo
          </button>
        )}

        <SearchBar
          customClassName={"solicitud-filtro-input ml-3"}
          placeholder={"Buscar por nombre o descripción..."}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <DUSelection
          options={AREAS_PERMITIDAS_EN_MAYUSCULA}
          defaultValue={"Todas las áreas"}
          onChange={(e) => setFiltroArea(e.target.value)}
          className={"ml-3 w-48 truncate"}
        />

        {(busqueda || filtroArea) && (
          <button
            className="solicitud-limpiar-btn btn ml-5"
            onClick={limpiarFiltros}
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="solicitud-tabla-wrapper">
        <DUElectivoTable
          electivosFiltrados={electivosFiltrados}
          mostrarDescripcion={mostrarDescripcion}
          handleEditElectivo={handleEditElectivo}
          handleDeleteElectivo={handleDeleteElectivo}
          handleApproveElectivo={handleChangeElectivoStatus}
          handleRejectElectivo={handleChangeElectivoStatus}
          handleCreateInscripcion_PUBLIC={handleCreateInscripcion_PUBLIC}
          isAdmin={isAdmin}
          isJefe={isJefe}
          misInscripciones={inscripciones?.data?.data || []}
        />
      </div>
    </div>
  );
};

export default Electivos;
