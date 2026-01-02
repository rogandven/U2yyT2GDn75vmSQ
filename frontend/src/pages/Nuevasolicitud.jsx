"use strict";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useGetElectivos } from "@hooks/electivos/useGetElectivos.jsx";
import { useCreateSolicitud } from "@hooks/solicitudes/usecreateSolicitud.jsx";

const NuevaSolicitud = () => {
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [electivoId, setElectivoId] = useState("");

  const { electivos, fetchElectivos } = useGetElectivos();
  const { createSolicitud } = useCreateSolicitud();

  useEffect(() => {
    fetchElectivos(); 
  }, []);

  const handleSubmit = async () => {
    if (!tipo || !motivo) {
      return Swal.fire("Error", "Complete todos los campos", "error");
    }

    if (tipo === "inscripcion_asignatura" && !electivoId) {
      return Swal.fire("Error", "Debe seleccionar un electivo", "error");
    }

    const payload = {
      tipo,
      motivo,
      id_electivo: tipo === "inscripcion_asignatura" ? electivoId : null
    };

    const response = await createSolicitud(payload);

    if (response?.status === 201) {
      Swal.fire("Éxito", "Solicitud enviada correctamente", "success");
      setTipo("");
      setMotivo("");
      setElectivoId("");
    }
  };

  return (
    <div className="users-page">
      <div className="solicitud-tabla-wrapper">
        <div className="m-3 p-4 rounded-box border border-base-content/5 bg-base-100">

          <label className="label">Tipo de solicitud</label>
          <select
            className="select select-bordered w-full"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Seleccione tipo</option>
            <option value="inscripcion_asignatura">Inscripción de asignatura</option>
            <option value="mas_creditos">Solicitud de más créditos</option>
          </select>

          <label className="label mt-4">Motivo</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          {tipo === "inscripcion_asignatura" && (
            <>
              <label className="label mt-4">Electivo</label>
              <select
                className="select select-bordered w-full"
                value={electivoId}
                onChange={(e) => setElectivoId(e.target.value)}
              >
                <option value="">Seleccione electivo</option>
                {electivos.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </select>
            </>
          )}

          <button className="btn btn-primary mt-6" onClick={handleSubmit}>
            Enviar solicitud
          </button>

        </div>
      </div>
    </div>
  );
};

export default NuevaSolicitud;
