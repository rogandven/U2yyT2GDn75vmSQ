"use strict";

import { useState } from "react";

export const SolicitudForm = ({
  electivos,
  onSubmit
}) => {
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [idElectivo, setIdElectivo] = useState("");
  const [creditos, setCreditos] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tipo) return;

    if (tipo === "inscripcion_asignatura" && !idElectivo) {
      return alert("Debe seleccionar un electivo");
    }

    if (tipo === "mas_creditos" && !creditos) {
      return alert("Debe ingresar créditos");
    }

    onSubmit({
      tipo,
      motivo,
      id_electivo: tipo === "inscripcion_asignatura" ? Number(idElectivo) : null,
      creditos_solicitados: tipo === "mas_creditos" ? Number(creditos) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 p-4 shadow">

      
      <label className="label">Tipo de solicitud</label>
      <select
        className="select select-bordered"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="">Seleccione tipo</option>
        <option value="inscripcion_asignatura">Inscripción de asignatura</option>
        <option value="mas_creditos">Solicitud de más créditos</option>
      </select>

      <label className="label mt-3">Motivo</label>
      <textarea
        className="textarea textarea-bordered"
        placeholder="Motivo de la solicitud"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />


      {tipo === "inscripcion_asignatura" && (
        <>
          <label className="label mt-3">Electivo</label>
          <select
            className="select select-bordered"
            value={idElectivo}
            onChange={(e) => setIdElectivo(e.target.value)}
          >
            <option value="">Seleccione un electivo</option>
            {electivos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </>
      )}

      {tipo === "mas_creditos" && (
        <>
          <label className="label mt-3">Créditos solicitados</label>
          <input
            type="number"
            min="1"
            className="input input-bordered"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
          />
        </>
      )}

      <button className="btn btn-primary mt-5">
        Enviar solicitud
      </button>
    </form>
  );
};

export default SolicitudForm;
