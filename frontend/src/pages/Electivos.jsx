"use strict";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos.jsx";
import { DUElectivoTable } from "../components/DUComponents/Table/DUElectivoTable";

const Electivos = () => {
  const { electivos, fetchElectivos } = useGetElectivos();
  const [busqueda, setBusqueda] = useState("");
  const [filtroArea, setFiltroArea] = useState("");

  useEffect(() => {
    fetchElectivos();
  }, [fetchElectivos]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroArea("");
  };

  const electivosFiltrados = electivos.filter((e) => {
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

  return (
    <div className="users-page">
      <h2>Electivos disponibles</h2>
      <div className="solicitud-filtros-container">
        <input
          className="solicitud-filtro-input"
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="solicitud-filtro-select"
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
        >
          <option value="">Todas las áreas</option>
          <option value="Desarrollo de Software">Desarrollo de Software</option>
          <option value="Bases de Datos y Sistemas de Información">Bases de Datos y Sistemas de Información</option>
          <option value="Ciencias de la Computación">Ciencias de la Computación</option>
          <option value="Inteligencia Artificial y Ciencia de Datos">Inteligencia Artificial y Ciencia de Datos</option>
          <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
          <option value="Ciberseguridad">Ciberseguridad</option>
          <option value="Ingeniería de Software y Gestión TI">Ingeniería de Software y Gestión TI</option>
          <option value="Sistemas Operativos e Infraestructura">Sistemas Operativos e Infraestructura</option>
          <option value="Desarrollo Móvil e Interfaces">Desarrollo Móvil e Interfaces</option>
          <option value="Innovación y Habilidades Blandas">Innovación y Habilidades Blandas</option>
        </select>
        {(busqueda || filtroArea) && (
          <button className="solicitud-limpiar-btn" onClick={limpiarFiltros}>
            Limpiar
          </button>
        )}
      </div>
      <div className="solicitud-tabla-wrapper">
        <DUElectivoTable electivosFiltrados={electivosFiltrados} mostrarDescripcion={mostrarDescripcion}></DUElectivoTable>
      </div>
    </div>
  );
};

export default Electivos;