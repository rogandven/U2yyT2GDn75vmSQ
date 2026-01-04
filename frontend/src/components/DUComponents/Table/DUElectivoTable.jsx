/*
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { parse_AAAA_MM_DD } from '../../../utils/parseDate.jsx';
import { DUCareerSplitter } from './DUCareerSplitter.jsx';
import { TiInfoLarge } from 'react-icons/ti';

import { ImCheckmark } from 'react-icons/im';
import { TiTimes } from 'react-icons/ti';
import { BsClockFill } from 'react-icons/bs';
import { IoMdSettings } from 'react-icons/io';
import { FiUserPlus } from 'react-icons/fi'
import { ESTADOS_VALIDOS } from '../../../constants/ElectivoConstants.jsx';
// import { isAdminOrProfesor } from '../../../services/admin.service.js';
// import { isJefeDeCarrera } from '../../../services/admin.service.js';

const mustBeDisplayed = (electivo, isAdmin) => {
  console.log(isAdmin);
  return isAdmin || (electivo.estado && (electivo.estado === ESTADOS_VALIDOS.APROBADO));
}
const estadoConverter = (estado) => {
  if (estado === ESTADOS_VALIDOS.APROBADO) {
    return (<ImCheckmark></ImCheckmark>)
  } else if (estado === ESTADOS_VALIDOS.RECHAZADO) {
    return (<TiTimes></TiTimes>)
  } else {
    return (<BsClockFill></BsClockFill>)
  }
}

export const DUElectivoTable = ({electivosFiltrados, mostrarDescripcion, handleEditElectivo, handleDeleteElectivo, handleApproveElectivo, handleRejectElectivo, handleCreateInscripcion_PUBLIC, isAdmin, isJefe}) => {
export const DUElectivoTable = ({electivosFiltrados, mostrarDescripcion, handleEditElectivo, handleDeleteElectivo, handleApproveElectivo, handleRejectElectivo, handleCreateInscripcion_PUBLIC, isAdmin, isJefe, carreraNames}) => {
    console.log(isAdmin);  
  /* const coalesceData = (data) => {
        if (data === null || data === "null" || data === undefined || data === "undefined") {
            return "";
        }
        return data;
    } 
    let numero = 1;
    return Array.isArray(electivosFiltrados) && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Cupos</th>
                <th>Crédito</th>
                <th>Área</th>
                <th>Apertura</th>
                <th>Cierre</th>
                <th>Profesor</th>
                <th>Carreras</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Plazo de renovación</th>
                <th>Acciones</th>                
            </tr>
            </thead>
            <tbody>
            {console.log("ELECTIVOS FILTRADOS: " + JSON.stringify(electivosFiltrados))}
            {electivosFiltrados.map((electivo) => {
                return (((electivo && mustBeDisplayed(electivo, isAdmin)))) && (
                <tr key={"ELECTIVO" + String(numero)}>
                    <th>{numero++}</th>
                    <td>{electivo.nombre || "N/A"}</td>
                    <td>{`${Number(electivo.inscritos || 0)} / ${Number(electivo.cupos || 0)}`}</td>
                    <td>{(electivo.creditos_requeridos || 0)}</td>
                    <td>{electivo.area || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.apertura, "-") || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.cierre, "-") || "N/A"}</td>
                    <td>{electivo.nombre_profesor || electivo.id_profesor || "N/A"}</td>
                    <td>{DUCareerSplitter(electivo.carreras) || "N/A"}</td>
                    <td style={{maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={electivo.estado === ESTADOS_VALIDOS.RECHAZADO ? (electivo.motivo || "") : ""}>
                      {electivo.estado === ESTADOS_VALIDOS.RECHAZADO ? (electivo.motivo || "") : ""}
                    </td>
                    <td>{electivo.plazo_renovacion || "N/A"}</td>
                    <td>{estadoConverter(electivo.estado)}</td>
                    <td>{electivo.estado === ESTADOS_VALIDOS.RECHAZADO && electivo.motivo_rechazo ? electivo.motivo_rechazo : "-"}</td>
                    <td>
                      {isAdmin && (<button className="btn btn-primary m-1" onClick={() => {handleEditElectivo(electivo.id, electivo, isAdmin)}}><IoMdSettings></IoMdSettings></button>)}
                      {isAdmin && (<button className="btn btn-secondary m-1" onClick={() => {handleDeleteElectivo(electivo.id, isAdmin)}}><MdDelete></MdDelete></button>)}
                      {(<button className="btn btn-accent m-1" onClick={() => {mostrarDescripcion(electivo.nombre, electivo.descripcion)}}><TiInfoLarge/></button>)}
                      {isJefe && (<button className="btn btn-success m-1" onClick={() => {handleApproveElectivo(electivo.id, true, isJefe)}}><ImCheckmark/></button>)}
                      {isJefe && (<button className="btn btn-error m-1" onClick={() => {handleRejectElectivo(isAdmin, isJefe, electivo.id)}}><TiTimes/></button>)}
                      {!isAdmin && (<button className='btn btn-info m-1' onClick={() => {handleCreateInscripcion_PUBLIC(electivo.id, isAdmin)}}><FiUserPlus /></button>)}
                    </td>
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay electivos para mostrar</div>);
}*/

//
import { MdDelete } from "react-icons/md";
import { parse_AAAA_MM_DD } from "../../../utils/parseDate.jsx";
import { DUCareerSplitter } from "./DUCareerSplitter.jsx";
import { TiInfoLarge } from "react-icons/ti";

import { ImCheckmark } from "react-icons/im";
import { TiTimes } from "react-icons/ti";
import { BsClockFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";

import { ESTADOS_VALIDOS } from "../../../constants/ElectivoConstants.jsx";

const mustBeDisplayed = (electivo, isAdmin) => {
  return (
    isAdmin ||
    (electivo.estado && electivo.estado === ESTADOS_VALIDOS.APROBADO)
  );
};

const estadoConverter = (estado) => {
  if (estado === ESTADOS_VALIDOS.APROBADO) {
    return <ImCheckmark />;
  } else if (estado === ESTADOS_VALIDOS.RECHAZADO) {
    return <TiTimes />;
  } else {
    return <BsClockFill />;
  }
};

export const DUElectivoTable = ({
  electivosFiltrados,
  mostrarDescripcion,
  handleEditElectivo,
  handleDeleteElectivo,
  handleApproveElectivo,
  handleRejectElectivo,
  handleCreateInscripcion_PUBLIC,
  isAdmin,
  isJefe,
  misInscripciones,
  carreraNames,
  canCrudElectivos
}) => {
  let numero = 1;


  // console.log(carreraNames);

  const alumnoYaInscrito = (idElectivo) => {
    return misInscripciones.some(
      (i) => Number(i.id_electivo) === Number(idElectivo)
    );
  };

  return (
    Array.isArray(electivosFiltrados) && (
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Cupos</th>
              <th>Créditos Requeridos</th>
              <th>Área</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Profesor</th>
              <th>Carreras</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {electivosFiltrados.map((electivo) => {
              return (
                electivo &&
                mustBeDisplayed(electivo, isAdmin) && (
                  <tr key={"ELECTIVO" + String(numero)}>
                    <th>{numero++}</th>
                    <td>{electivo.nombre || "N/A"}</td>
                    <td>
                      {`${Number(electivo.inscritos || 0)} / ${Number(
                        electivo.cupos || 0
                      )}`}
                    </td>
                    <td>{electivo.creditos_requeridos || 0}</td>
                    <td>{electivo.area || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.apertura, "-") || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.cierre, "-") || "N/A"}</td>
                    <td>
                      {electivo.nombre_profesor ||
                        electivo.id_profesor ||
                        "N/A"}
                    </td>
                    <td>{DUCareerSplitter(electivo.carreras) || "N/A"}</td>
                    <td>{estadoConverter(electivo.estado)}</td>
                    <td>
                      {canCrudElectivos && (
                        <button
                          className="btn btn-primary m-1"
                          onClick={() =>
                            handleEditElectivo(
                              electivo.id,
                              electivo,
                              carreraNames
                            )
                          }
                        >
                          <IoMdSettings />
                        </button>
                      )}

                      {canCrudElectivos && (
                        <button
                          className="btn btn-secondary m-1"
                          onClick={() =>
                            handleDeleteElectivo(electivo.id, isAdmin)
                          }
                        >
                          <MdDelete />
                        </button>
                      )}

                      <button
                        className="btn btn-accent m-1"
                        onClick={() =>
                          mostrarDescripcion(
                            electivo.nombre,
                            electivo.descripcion
                          )
                        }
                      >
                        <TiInfoLarge />
                      </button>

                      {isJefe &&
                        electivo.estado === ESTADOS_VALIDOS.PENDIENTE && (
                          <>
                            <button
                              className="btn btn-success m-1"
                              onClick={() =>
                                handleApproveElectivo(
                                  electivo.id,
                                  null,
                                  true,
                                  isJefe
                                )
                              }
                            >
                              <ImCheckmark />
                            </button>

                            <button
                              className="btn btn-error m-1"
                              onClick={() =>
                                handleRejectElectivo(
                                  electivo.id,
                                  null,
                                  false,
                                  isJefe
                                )
                              }
                            >
                              <TiTimes />
                            </button>
                          </>
                        )}

                      {!isAdmin && !alumnoYaInscrito(electivo.id) && (
                        <button
                          className="btn btn-info m-1"
                          onClick={() =>
                            handleCreateInscripcion_PUBLIC(
                              electivo.id,
                              isAdmin
                            )
                          }
                        >
                          <FiUserPlus />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );
};



/*
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { parse_AAAA_MM_DD } from '../../../utils/parseDate.jsx';
import { DUCareerSplitter } from './DUCareerSplitter.jsx';
import { TiInfoLarge } from 'react-icons/ti';

import { ImCheckmark } from 'react-icons/im';
import { TiTimes } from 'react-icons/ti';
import { BsClockFill } from 'react-icons/bs';
import { IoMdSettings } from 'react-icons/io';
import { FiUserPlus } from 'react-icons/fi';

import { ESTADOS_VALIDOS } from '../../../constants/ElectivoConstants.jsx';

const mustBeDisplayed = (electivo, isAdmin) => {
  return isAdmin || (electivo.estado && electivo.estado === ESTADOS_VALIDOS.APROBADO);
};

const estadoConverter = (estado) => {
  if (estado === ESTADOS_VALIDOS.APROBADO) {
    return <ImCheckmark />;
  } else if (estado === ESTADOS_VALIDOS.RECHAZADO) {
    return <TiTimes />;
  } else {
    return <BsClockFill />;
  }
};

export const DUElectivoTable = ({
  electivosFiltrados,
  mostrarDescripcion,
  handleEditElectivo,
  handleDeleteElectivo,
  handleApproveElectivo,
  handleRejectElectivo,
  handleCreateInscripcion_PUBLIC,
  isAdmin,
  isJefe,
  misInscripciones
}) => {

  const yaInscrito = (idElectivo) => {
    return Array.isArray(misInscripciones) &&
      misInscripciones.some(
        (inscripcion) => inscripcion.id_electivo === idElectivo
      );
  };

  let numero = 1;

  return Array.isArray(electivosFiltrados) && (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Cupos</th>
            <th>Créditos Requeridos</th>
            <th>Área</th>
            <th>Apertura</th>
            <th>Cierre</th>
            <th>Profesor</th>
            <th>Carreras</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {electivosFiltrados.map((electivo) => {
            return (electivo && mustBeDisplayed(electivo, isAdmin)) && (
              <tr key={"ELECTIVO" + String(numero)}>
                <th>{numero++}</th>
                <td>{electivo.nombre || "N/A"}</td>
                <td>{`${Number(electivo.inscritos || 0)} / ${Number(electivo.cupos || 0)}`}</td>
                <td>{electivo.creditos_requeridos || 0}</td>
                <td>{electivo.area || "N/A"}</td>
                <td>{parse_AAAA_MM_DD(electivo.apertura, "-") || "N/A"}</td>
                <td>{parse_AAAA_MM_DD(electivo.cierre, "-") || "N/A"}</td>
                <td>{electivo.nombre_profesor || electivo.id_profesor || "N/A"}</td>
                <td>{DUCareerSplitter(electivo.carreras) || "N/A"}</td>
                <td>{estadoConverter(electivo.estado)}</td>
                <td>

                  {isAdmin && (
                    <button className="btn btn-primary m-1"
                      onClick={() => handleEditElectivo(electivo.id, electivo, isAdmin)}>
                      <IoMdSettings />
                    </button>
                  )}

                  {isAdmin && (
                    <button className="btn btn-secondary m-1"
                      onClick={() => handleDeleteElectivo(electivo.id, isAdmin)}>
                      <MdDelete />
                    </button>
                  )}

                  <button className="btn btn-accent m-1"
                    onClick={() => mostrarDescripcion(electivo.nombre, electivo.descripcion)}>
                    <TiInfoLarge />
                  </button>

                  {isJefe && (
                    <button className="btn btn-success m-1"
                      onClick={() => handleApproveElectivo(electivo.id, true, isJefe)}>
                      <ImCheckmark />
                    </button>
                  )}

                  {isJefe && (
                    <button className="btn btn-error m-1"
                      onClick={() => handleRejectElectivo(electivo.id, false, isJefe)}>
                      <TiTimes />
                    </button>
                  )}

                  {!isAdmin && !yaInscrito(electivo.id) && (
                    <button className="btn btn-info m-1"
                      onClick={() => handleCreateInscripcion_PUBLIC(electivo.id, isAdmin)}>
                      <FiUserPlus />
                    </button>
                  )}

                  {!isAdmin && yaInscrito(electivo.id) && (
                    <span className="badge badge-success m-1">
                      Ya inscrito
                    </span>
                  )}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) || (<div>No hay electivos para mostrar</div>);
};
*/