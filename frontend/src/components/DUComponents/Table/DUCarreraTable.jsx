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

import { isAdminOrProfesor } from '../../../services/admin.service.js';
import { isJefeDeCarrera } from '../../../services/admin.service.js';

const isAdmin = isAdminOrProfesor();
const isJefe = isJefeDeCarrera();

const mustBeDisplayed = (carrera) => {
  return isJefe || (carrera.estado && (carrera.estado === ESTADOS_VALIDOS.APROBADO));
}
/*
        <table className="solicitud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cupos</th>
              <th>Inscritos</th>
              <th>Área</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(carrerasFiltrados) && carrerasFiltrados.length > 0 ? (
              carrerasFiltrados.map((e) => (
                <tr key={e.id}>
                  <td>{e.nombre}</td>
                  <td>{e.cupos}</td>
                  <td>{e.inscritos}</td>
                  <td>{e.area}</td>
                  <td>{e.apertura}</td>
                  <td>{e.cierre}</td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      className="edit"
                      onClick={() => mostrarDescripcion(e.nombre, e.descripcion)}
                    >
                      Información
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No hay carreras disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
*/

const estadoConverter = (estado) => {
  if (estado === ESTADOS_VALIDOS.APROBADO) {
    return (<ImCheckmark></ImCheckmark>)
  } else if (estado === ESTADOS_VALIDOS.RECHAZADO) {
    return (<TiTimes></TiTimes>)
  } else {
    return (<BsClockFill></BsClockFill>)
  }
}

export const DUCarreraTable = ({carrerasFiltrados, mostrarDescripcion, handleEditElectivo, handleDeleteElectivo, handleApproveElectivo, handleRejectElectivo, handleCreateInscripcion_PUBLIC}) => {
    /* const coalesceData = (data) => {
        if (data === null || data === "null" || data === undefined || data === "undefined") {
            return "";
        }
        return data;
    } */
    let numero = 1;
    return Array.isArray(carrerasFiltrados) && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th></th>
                <th>Nombre</th>
                <th>Cupos</th>
                <th>Inscritos</th>
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
            {/* row 1 */}
            {carrerasFiltrados.map((carrera) => {
                return carrera && mustBeDisplayed(carrera) && (
                <tr key={"ELECTIVO" + String(numero)}>
                    <th>{numero++}</th>
                    <td>{carrera.nombre || "N/A"}</td>
                    <td>{carrera.cupos || "N/A"}</td>
                    <td>{carrera.inscritos || "N/A"}</td>
                    <td>{carrera.area || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(carrera.apertura, "-") || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(carrera.cierre, "-") || "N/A"}</td>
                    <td>{carrera.nombre_profesor || carrera.id_profesor || "N/A"}</td>
                    <td>{DUCareerSplitter(carrera.carreras) || "N/A"}</td>
                    <td>{estadoConverter(carrera.estado)}</td>
                    <td>
                      {isAdmin && (<button className="btn btn-primary m-1" onClick={() => {handleEditElectivo(carrera.id, carrera)}}><IoMdSettings></IoMdSettings></button>)}
                      {isAdmin && (<button className="btn btn-secondary m-1" onClick={() => {handleDeleteElectivo(carrera.id)}}><MdDelete></MdDelete></button>)}
                      {(<button className="btn btn-accent m-1" onClick={() => {mostrarDescripcion(carrera.nombre, carrera.descripcion)}}><TiInfoLarge/></button>)}
                      {isJefe && (<button className="btn btn-success m-1" onClick={() => {handleApproveElectivo(carrera.id, true)}}><ImCheckmark/></button>)}
                      {isJefe && (<button className="btn btn-error m-1" onClick={() => {handleRejectElectivo(carrera.id, false)}}><TiTimes/></button>)}
                      {!isAdmin && (<button className='btn btn-info m-1' onClick={() => {handleCreateInscripcion_PUBLIC(carrera.id)}}><FiUserPlus /></button>)}
                    </td>
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay carreras para mostrar</div>);
}