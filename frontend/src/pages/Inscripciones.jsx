"use strict"
import { useEffect, useState } from "react";
import GetMisInscripciones from "@hooks/Inscripciones/GetMisInscripciones.jsx";

const Inscripciones = () => {
  const { inscripciones, loading, error, fetchMisInscripciones } = GetMisInscripciones();
  
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    fetchMisInscripciones();
  }, [fetchMisInscripciones]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("");
  };

  const inscripcionesFiltradas = inscripciones.filter((insc) => {
    const coincideTexto =
      insc.electivo_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      insc.nombre_electivo?.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado =
      !filtroEstado || insc.estado === filtroEstado;
    
    return coincideTexto && coincideEstado;
  });

  if (loading) {
    return (
      <div className="inscripciones-page">
        <div className="loading">Cargando inscripciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inscripciones-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="inscripciones-page">
      <div className="inscripciones-header">
        <h2>Mis Inscripciones</h2>
        <div className="inscripciones-stats">
          <span>Total: {inscripciones.length} inscripciones</span>
        </div>
      </div>
      
      <div className="filtros-container">
        <input
          className="filtro-input"
          type="text"
          placeholder="Buscar por nombre de electivo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="filtro-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="activa">Activa</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelada">Cancelada</option>
          <option value="aprobada">Aprobada</option>
        </select>
        {(busqueda || filtroEstado) && (
          <button className="limpiar-btn" onClick={limpiarFiltros}>
            Limpiar
          </button>
        )}
      </div>

      <div className="tabla-wrapper">
        <table className="inscripciones-table">
          <thead>
            <tr>
              <th>Electivo</th>
              <th>Profesor</th>
              <th>Fecha de inscripción</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(inscripcionesFiltradas) && inscripcionesFiltradas.length > 0 ? (
              inscripcionesFiltradas.map((insc) => (
                <tr key={insc.id}>
                  <td>{insc.electivo_nombre || insc.nombre_electivo || "Electivo"}</td>
                  <td>{insc.profesor || "No asignado"}</td>
                  <td>{insc.fecha_inscripcion || insc.fecha}</td>
                  <td>
                    <span className={`estado-${insc.estado}`}>
                      {insc.estado}
                    </span>
                  </td>
                  <td>{insc.observaciones || "Sin observaciones"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  {inscripciones.length === 0 ? 
                    "No tienes inscripciones registradas" : 
                    "No hay inscripciones que coincidan con los filtros"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {inscripciones.length > 0 && (
        <div className="resumen-estados">
          <h3>Resumen de mis inscripciones</h3>
          <div className="estados-grid">
            <div className="estado-card activa">
              <span className="estado-count">
                {inscripciones.filter(i => i.estado === "activa").length}
              </span>
              <span className="estado-label">Activas</span>
            </div>
            <div className="estado-card pendiente">
              <span className="estado-count">
                {inscripciones.filter(i => i.estado === "pendiente").length}
              </span>
              <span className="estado-label">Pendientes</span>
            </div>
            <div className="estado-card aprobada">
              <span className="estado-count">
                {inscripciones.filter(i => i.estado === "aprobada").length}
              </span>
              <span className="estado-label">Aprobadas</span>
            </div>
            <div className="estado-card cancelada">
              <span className="estado-count">
                {inscripciones.filter(i => i.estado === "cancelada").length}
              </span>
              <span className="estado-label">Canceladas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscripciones;