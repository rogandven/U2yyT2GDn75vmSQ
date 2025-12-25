"use strict";
import "@styles/Inscripcion.css";
import "@styles/electivos.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos.jsx";
import { useCreateInscripcion } from "@hooks/Inscripciones/useCreateInscripcion.jsx";

const Electivos = () => {
  const { electivos, fetchElectivos } = useGetElectivos();
  const { handleCreateInscripcion } = useCreateInscripcion(fetchElectivos);
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
          <option value="Desarrollo">Desarrollo</option>
          <option value="Investigación">Investigación</option>
          <option value="Habilidades Sociales">Habilidades Sociales</option>
        </select>
        {(busqueda || filtroArea) && (
          <button className="solicitud-limpiar-btn" onClick={limpiarFiltros}>
            Limpiar
          </button>
        )}
      </div>
      <div className="solicitud-tabla-wrapper">
        <table className="solicitud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cupos</th>
              <th>Inscritos</th>
              <th>Área</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Descripción</th>
               <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(electivosFiltrados) && electivosFiltrados.length > 0 ? (
              electivosFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.cupos}</td>
                  <td>{e.inscritos}</td>
                  <td>{e.area}</td>
                  <td>{e.apertura}</td>
                  <td>{e.cierre}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="edit"
                      onClick={() => mostrarDescripcion(e.nombre, e.descripcion)}
                    >
                      Información
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                  <button className="inscribir-btn"onClick={() => handleCreateInscripcion(e.id)}>Inscribirse</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No hay electivos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Electivos;