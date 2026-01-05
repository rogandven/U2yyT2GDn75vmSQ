import {createSolicitudService,getSolicitudesAlumnoService,getSolicitudesJefeService,aprobarSolicitudService,rechazarSolicitudService} from "../service/solicitud.service.js";
import {createSolicitudValidation,rechazarSolicitudValidation} from "../validations/solicitud.validation.js";
import { getControllerResult_NEW } from "./utils/utils.controller.js";
import { idValidation } from "../validations/modules/id.validation.js";
import { TIPOS_SOLICITUD } from "../constants/solicitud.constants.js";

export async function crearSolicitudAlumno(req, res) {
  if (req?.body?.tipo !== TIPOS_SOLICITUD.INSCRIPCION_ASIGNATURA) {
    delete req.body.id_electivo;
  }

  const { error } = createSolicitudValidation.validate(req.body);
  if (error) {
    return res.status(400).json(
      getControllerResult_NEW(error.message, null)
    );
  }
  const data = {
    tipo: req.body.tipo,
    id_electivo: req.body.id_electivo || null,
    creditos_solicitados: req.body.creditos_solicitados || null,
    motivo: req.body.motivo || null,
    id_estudiante: req.user.id,
  };

  const result = await createSolicitudService(data);

  if (result.error) {
    return res.status(400).json(
      getControllerResult_NEW(result.details, null)
    );
  }

  return res.status(201).json(
    getControllerResult_NEW("Solicitud creada correctamente", result)
  );
}



export async function listarSolicitudesAlumno(req, res) {
  const result = await getSolicitudesAlumnoService(req.user.id);
  return res.status(200).json(
    getControllerResult_NEW("Solicitudes del alumno", result)
  );
}

export async function listarSolicitudesJefe(req, res) {
  const result = await getSolicitudesJefeService();
  return res.status(200).json(
    getControllerResult_NEW("Solicitudes en espera", result)
  );
}

export async function aprobarSolicitud(req, res) {
  const { id } = req.params;
  const validation = idValidation.validate({ id });
  if (validation.error) {
    return res.status(400).json(getControllerResult_NEW(validation.error.message, null));
  }

  const result = await aprobarSolicitudService(id);
  return res.status(200).json(
    getControllerResult_NEW("Solicitud aceptada", result)
  );
}

export async function rechazarSolicitud(req, res) {
  const { error } = rechazarSolicitudValidation.validate(req.body);
  if (error) {
    return res.status(400).json(getControllerResult_NEW(error.message, null));
  }

  const result = await rechazarSolicitudService(
    req.params.id,
    req.body.motivo_rechazo
  );

  return res.status(200).json(
    getControllerResult_NEW("Solicitud rechazada", result)
  );
}
