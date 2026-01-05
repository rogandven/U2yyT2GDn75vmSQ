import { AppDataSource } from "../config/configDb.js";
import SolicitudEntity from "../entity/solicitud.entity.js";
import { ESTADOS_SOLICITUD, TIPOS_SOLICITUD, MAX_SOLICITUDES_POR_ALUMNO } from "../constants/solicitud.constants.js";
import { getServiceResult } from "./utils/utils.service.js";
import { inscribirAlumnoElectivo } from "./inscripcion.service.js";

const solicitudRepo = AppDataSource.getRepository(SolicitudEntity);

export async function createSolicitudService(data) {
  try {
    const totalSolicitudes = await solicitudRepo.count({
      where: { id_estudiante: data.id_estudiante },
    });

    if (totalSolicitudes >= MAX_SOLICITUDES_POR_ALUMNO) {
      return getServiceResult(true,null,`Solo se permiten ${MAX_SOLICITUDES_POR_ALUMNO} solicitudes por alumno`,0);
    }

    const solicitud = solicitudRepo.create(data);
    await solicitudRepo.save(solicitud);

    return getServiceResult(false, solicitud, "Solicitud creada", 1);
  } catch (error) {
    return getServiceResult(true, null, error.message, 0);
  }
}

export async function getSolicitudesAlumnoService(id_estudiante) {
  try {
    const solicitudes = await solicitudRepo.find({
      where: { id_estudiante },
      order: { fecha_creacion: "DESC" },
    });

    return getServiceResult(false, solicitudes, "Solicitudes alumno", solicitudes.length);
  } catch (error) {
    return getServiceResult(true, null, error.message, 0);
  }
}

export async function getSolicitudesJefeService() {
  try {
    const solicitudes = await solicitudRepo.find({
      where: { estado: ESTADOS_SOLICITUD.EN_ESPERA },
      order: { fecha_creacion: "ASC" },
    });

    return getServiceResult(false, solicitudes, "Solicitudes pendientes", solicitudes.length);
  } catch (error) {
    return getServiceResult(true, null, error.message, 0);
  }
}

export async function aprobarSolicitudService(id) {
  try {
    const solicitud = await solicitudRepo.findOneBy({ id });
    if (!solicitud) {
      return getServiceResult(false, null, "Solicitud no encontrada", 0);
    }
    if (solicitud.tipo === TIPOS_SOLICITUD.INSCRIPCION_ASIGNATURA) {
      await inscribirAlumnoElectivo(
        solicitud.id_estudiante,
        solicitud.id_electivo
      );
    }


    solicitud.estado = ESTADOS_SOLICITUD.ACEPTADA;
    await solicitudRepo.save(solicitud);

    return getServiceResult(false, solicitud, "Solicitud aceptada", 1);
  } catch (error) {
    return getServiceResult(true, null, error.message, 0);
  }
}

export async function rechazarSolicitudService(id, motivo_rechazo) {
  try {
    const solicitud = await solicitudRepo.findOneBy({ id });
    if (!solicitud) {
      return getServiceResult(false, null, "Solicitud no encontrada", 0);
    }

    solicitud.estado = ESTADOS_SOLICITUD.RECHAZADA;
    solicitud.motivo_rechazo = motivo_rechazo;

    await solicitudRepo.save(solicitud);

    return getServiceResult(false, solicitud, "Solicitud rechazada", 1);
  } catch (error) {
    return getServiceResult(true, null, error.message, 0);
  }
}
