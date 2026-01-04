import { useState } from "react";
import {getSolicitudesAlumno,getSolicitudesJefe} from "@services/solicitud.service.js";

const useGetSolicitudes = (isJefe = false) => {
  const [solicitudes, setSolicitudes] = useState([]); 

  const fetchSolicitudes = async () => {
    const response = isJefe
      ? await getSolicitudesJefe()
      : await getSolicitudesAlumno();
      
    if (response.data) {
      setSolicitudes(response.data); 
    } else {
      setSolicitudes([]); 
    }
  };

  return { solicitudes, fetchSolicitudes };
};

export default useGetSolicitudes;
