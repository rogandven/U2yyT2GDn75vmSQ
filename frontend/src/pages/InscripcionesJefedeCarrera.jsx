"use strict";
import "@styles/Inscripcion.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetInscripciones } from "@hooks/Inscripciones/useGetInscripciones.jsx";
import {  useGestionarInscripcion } from "@hooks/Inscripciones/useGestionarInscripciones.jsx";

const InscripcionesAdmin = () => {  
  const { Inscripciones, fetchMisInscripciones} = useGetInscripciones();
  const { handleGestionarInscripcion } = useGestionarInscripcion(fetchMisInscripciones);
  const [busqueda, setBusqueda] = useState("");
  const [filtroArea] = useState("");
  

  useEffect(() => {
    fetchMisInscripciones();
  }, [fetchMisInscripciones]);
  const normalizarTexto = (texto = "") =>
  texto
    .toLowerCase()                 
    .normalize("NFD")              
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, " ")          
    .trim();         

  const InscripcionesFiltrados = Inscripciones.filter((e) => {
  const textoBusqueda = normalizarTexto(busqueda);

  const coincideTexto =
    e.id.toString().includes(textoBusqueda) ||
    normalizarTexto(e.electivoNombre).includes(textoBusqueda);

  const coincideEstado =
    !filtroArea ||
    normalizarTexto(e.estado) === normalizarTexto(filtroArea);

  return coincideTexto && coincideEstado;
});

  return (
    <div className="users-page">
      <h2>Inscripciones</h2>
      <div className="solicitud-filtros-container">
        <input
          className="solicitud-filtro-input"
          type="text"
          placeholder="Buscar por id o electivo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      
      <div className="info-container">
        <p>Total de inscripciones: {Inscripciones.length}</p>
        <p>Mostrando: {InscripcionesFiltrados.length}</p>
      </div>

      <div className="solicitud-tabla-wrapper">
        <table className="solicitud-table">
          <thead>
            <tr>
              <th>id</th>
              <th>ID del electivo</th>
              <th>Electivo</th>
              <th>estado</th>
              <th>Detalle del estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(InscripcionesFiltrados) && InscripcionesFiltrados.length > 0 ? (
              InscripcionesFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.electivoId}</td>
                  <td>{e.electivoNombre}</td>
                  <td>{e.estado}</td>
                  <td>{e.estadoDetalle}</td>
                  <td style={{ textAlign: "center" }}>
                   <button className="Gestionar-btn" onClick={() => handleGestionarInscripcion(e.id)}>Gestionar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  {Inscripciones.length === 0 ? 
                    "No hay inscripciones disponibles" : 
                    "No hay inscripciones que coincidan con los filtros"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InscripcionesAdmin;
