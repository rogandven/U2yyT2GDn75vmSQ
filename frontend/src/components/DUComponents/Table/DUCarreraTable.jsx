import { IoMdSettings } from 'react-icons/io';
import { MdDelete } from "react-icons/md";
import { getUserRole } from '../../../services/admin.service.js';
import { CAN_DO_CRUD_ON_CAREERS } from '../../../admin/permissions.admin.jsx';
//import { isJefeDeCarrera } from '../../../services/admin.service.js';

const userRole = getUserRole();
const puedeEditarCarreras = CAN_DO_CRUD_ON_CAREERS.includes(userRole);


const mostrarCarreras = (data, handleEditCarrera, handleDeleteCarrera) => {
  if (Array.isArray(data) && data.length > 0) {
      return data.map((Carrera) => (
                  <tr key={"Carrera-"+Carrera.id_carrera}>
                      
                      <td>{Carrera.sigla}</td>
                      <td>{Carrera.nombre}</td>
                      {puedeEditarCarreras && (
                      <td>
                      <button className="btn btn-primary m-1" onClick={() => {handleEditCarrera(Carrera.id_carrera, Carrera)}}><IoMdSettings></IoMdSettings></button>
                      <button className="btn btn-secondary m-1" onClick={() => {handleDeleteCarrera(Carrera.id_carrera)}}><MdDelete></MdDelete></button>
                      </td>
                      )}
                  </tr>
      ));
  } else {
      return (
          <tr>
              <td colSpan="7">No hay carreras disponibles.</td>
          </tr>
      )
  }
}

export const DUCarreraTable = ({data, handleEditCarrera, handleDeleteCarrera}) => {
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th>Sigla</th>
                <th>Nombre</th>
                {puedeEditarCarreras && (<th>Acciones</th>)}             
            </tr>
            </thead>
            <tbody>
            {mostrarCarreras(data, handleEditCarrera, handleDeleteCarrera)}
            </tbody>
        </table>
        </div>
    ); 
}