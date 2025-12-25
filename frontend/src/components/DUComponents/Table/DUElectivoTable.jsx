import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { parse_AAAA_MM_DD } from '../../../utils/parseDate.jsx';
import { DUCareerSplitter } from './DUCareerSplitter.jsx';
import { TiInfoLarge } from 'react-icons/ti';

import { ImCheckmark } from 'react-icons/im';
import { TiTimes } from 'react-icons/ti'
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
            {Array.isArray(electivosFiltrados) && electivosFiltrados.length > 0 ? (
              electivosFiltrados.map((e) => (
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
                  No hay electivos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
*/

export const DUElectivoTable = ({electivosFiltrados, mostrarDescripcion, handleEditElectivo, handleDeleteElectivo, handleApproveElectivo, handleRejectElectivo}) => {
    /* const coalesceData = (data) => {
        if (data === null || data === "null" || data === undefined || data === "undefined") {
            return "";
        }
        return data;
    } */
    let numero = 1;
    return Array.isArray(electivosFiltrados) && (
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
                <th>Acciones</th>                
            </tr>
            </thead>
            <tbody>
            {/* row 1 */}
            {electivosFiltrados.map((electivo) => {
                return electivo && (
                <tr key={"ELECTIVO" + String(numero)}>
                    <th>{numero++}</th>
                    <td>{electivo.nombre || "N/A"}</td>
                    <td>{electivo.cupos || "N/A"}</td>
                    <td>{electivo.inscritos || "N/A"}</td>
                    <td>{electivo.area || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.apertura, "-") || "N/A"}</td>
                    <td>{parse_AAAA_MM_DD(electivo.cierre, "-") || "N/A"}</td>
                    <td>{electivo.id_profesor || "N/A"}</td>
                    <td>{DUCareerSplitter(electivo.carreras) || "N/A"}</td>
                    <td>
                      <button className="btn btn-primary m-1" onClick={() => {handleEditElectivo(electivo.id, electivo)}}><FaEdit></FaEdit></button>
                      <button className="btn btn-secondary m-1" onClick={() => {handleDeleteElectivo(electivo.id)}}><MdDelete></MdDelete></button>
                      <button className="btn btn-accent m-1" onClick={() => {mostrarDescripcion(electivo.nombre, electivo.descripcion)}}><TiInfoLarge/></button>
                      <button className="btn btn-success m-1" onClick={() => {handleApproveElectivo(electivo.id, true)}}><ImCheckmark/></button>
                      <button className="btn btn-error m-1" onClick={() => {handleRejectElectivo(electivo.id, false)}}><TiTimes/></button>
                    </td>
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay electivos para mostrar</div>);
}