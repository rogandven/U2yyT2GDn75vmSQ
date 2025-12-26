import { IoMdSettings } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import { NamePlusIcon } from './utils/NamePlusIcon.jsx';
import { GiGraduateCap } from 'react-icons/gi';
import { isAdminOrProfesor } from '../../../services/admin.service.js';
import { isJefeDeCarrera } from '../../../services/admin.service.js';

const isAdmin = isAdminOrProfesor();
const isJefe = isJefeDeCarrera();

const mostrarHorarios = (data, handleEditTimetable, handleDeleteTimetable) => {
  if (Array.isArray(data) && data.length > 0) {
      return data.map((Timetable) => (
                  <tr key={"Timetable-"+Timetable.id_horario}>
                      <td>{Timetable.id_horario}</td>
                      <td>{(NamePlusIcon((Timetable.nombre_electivo || Timetable.id_electivo), (<GiGraduateCap className='mr-1'></GiGraduateCap>)))}</td>
                      <td>{Timetable.hora_inicio}</td>
                      <td>{Timetable.hora_termino}</td>
                      <td>
                        <div className="badge badge-primary">
                          {Timetable.sala}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-secondary">
                          {String(Timetable.dia).toUpperCase()}
                        </div>
                      </td>
                      {isAdmin && (
                      <td>
                      <button className="btn btn-primary m-1" onClick={() => {handleEditTimetable(Timetable.id_horario, Timetable)}}><IoMdSettings></IoMdSettings></button>
                      <button className="btn btn-secondary m-1" onClick={() => {handleDeleteTimetable(Timetable.id_horario)}}><MdDelete></MdDelete></button>
                      </td>
                      )}
                  </tr>
      ));
  } else {
      return (
          <tr>
              <td colSpan="7">No hay horarios disponibles.</td>
          </tr>
      )
  }
}

export const DUHorarioTable = ({data, handleEditTimetable, handleDeleteTimetable}) => {
    /* const coalesceData = (data) => {
        if (data === null || data === "null" || data === undefined || data === "undefined") {
            return "";
        }
        return data;
    } */
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th></th>
                <th>Electivo</th>
                <th>Hora Inicio</th>
                <th>Hora Término</th>
                <th>Sala</th>
                <th>Día</th>
                {isAdmin && (<th>Acciones</th>)}             
            </tr>
            </thead>
            <tbody>
              {mostrarHorarios(data, handleEditTimetable, handleDeleteTimetable)}
            </tbody>
        </table>
        </div>
    ); 
}