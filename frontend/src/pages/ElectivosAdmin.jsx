

"use strict";
import "@styles/electivos.css";
import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos";
import { useCreateElectivo } from "@hooks/electivos/useCreateElectivo";
import { useEditElectivo } from "@hooks/electivos/useEditElectivo";
import { useDeleteElectivo } from "@hooks/electivos/useDeleteElectivo";

const ElectivosAdmin = () => {
  const { electivos, fetchElectivos } = useGetElectivos();
  const { handleCreateElectivo } = useCreateElectivo(fetchElectivos);
  const { handleEditElectivo } = useEditElectivo(fetchElectivos);
  const { handleDeleteElectivo } = useDeleteElectivo(fetchElectivos);
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

  return (
    <div className="users-page">
      <h2>Gestión de Electivos</h2>
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
      <div className="solicitud-button-container">
        <button className="solicitud-addbtn" onClick={handleCreateElectivo}>
          <FaClipboardList style={{ marginRight: "8px" }} size={20} />
          Registrar nuevo electivo
        </button>
      </div>
      <div className="solicitud-tabla-wrapper">
        <table className="solicitud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cupos</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Área</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(electivosFiltrados) &&
            electivosFiltrados.length > 0 ? (
              electivosFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.cupos}</td>
                  <td>{e.apertura}</td>
                  <td>{e.cierre}</td>
                  <td>{e.area}</td>
                  <td style={{ maxWidth: "260px" }}>{e.descripcion}</td>
                  <td>
                    <button className="edit" onClick={() => handleEditElectivo(e)}>
                      Editar
                    </button>
                    <button className="delete" onClick={() => handleDeleteElectivo(e.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay electivos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElectivosAdmin;
