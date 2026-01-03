"use strict";

import { useEffect } from "react";
import { getUserRole, isJefeDeCarrera } from "@services/admin.service.js";
import useGetSolicitudes from "@hooks/solicitudes/useGetSolicitudes.jsx";
import useChangeSolicitudStatus from "@hooks/solicitudes/useChangeSolicitudStatus.jsx";
import { DUSolicitudTable } from "@components/DUComponents/Table/DUSolicitudTable.jsx";

const Solicitudes = () => {
  const userRole = getUserRole();
  const isJefe = isJefeDeCarrera(userRole);

  const { solicitudes, fetchSolicitudes } = useGetSolicitudes(isJefe);
  const { handleChangeSolicitudStatus } =
    useChangeSolicitudStatus(fetchSolicitudes);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <div className="users-page">
      <div className="solicitud-tabla-wrapper">
        <DUSolicitudTable
          solicitudes={solicitudes} 
          isJefe={isJefe}
          handleChangeSolicitudStatus={handleChangeSolicitudStatus}
        />
      </div>
    </div>
  );
};

export default Solicitudes;

