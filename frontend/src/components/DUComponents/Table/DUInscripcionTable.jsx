import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { parse_SQLDate } from '../../../utils/parseDate.jsx';
import { DUCareerSplitter } from './DUCareerSplitter.jsx';
import { TiInfoLarge } from 'react-icons/ti';
import { FaUser } from 'react-icons/fa'

import { ImCheckmark } from 'react-icons/im';
import { TiTimes } from 'react-icons/ti';
import { BsClockFill } from 'react-icons/bs';
import { IoMdSettings } from 'react-icons/io'

import { ESTADOS_VALIDOS } from '../../../constants/InscripcionConstants.jsx';
import { NamePlusIcon } from './utils/NamePlusIcon.jsx';
import { GiGraduateCap } from 'react-icons/gi';

export const DUInscripcionTable = ({inscripciones, handleEditInscripcion, handleDeleteInscripcion, handleChangeInscripcionStatus}) => {
    let numero = 1;
    const data = (inscripciones?.data?.data || []);
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th></th>
                <th>Usuario</th>   
                <th>Electivo</th>
                <th>Fecha</th>     
                <th>Estado</th>  
                <th>Acciones</th>   
            </tr>
            </thead>
            <tbody>
            {Array.isArray(data) && data.map((inscripcion) => {
            return inscripcion && (
                <tr key={String(inscripcion.id_inscripcion) + String(numero)}>
                <th>{numero++}</th>
                <td>{NamePlusIcon(inscripcion.nombre_usuario || inscripcion.id_usuario, (<FaUser className='mr-1'/>))}</td>
                <td>{NamePlusIcon(inscripcion.nombre_electivo || inscripcion.id_electivo, (<GiGraduateCap className='mr-1'></GiGraduateCap>))}</td>
                <td>{parse_SQLDate(inscripcion.fecha_hora)}</td>
                <td>
                    <div className="badge badge-primary">
                        {String(inscripcion.estado).toUpperCase().replaceAll("_", " ")}
                    </div>    
                </td>
                <td>
                    <button className="btn btn-primary m-1" onClick={() => {handleEditInscripcion(inscripcion.id_inscripcion, inscripcion)}}><IoMdSettings></IoMdSettings></button>
                    <button className="btn btn-secondary m-1" onClick={() => {handleDeleteInscripcion(inscripcion.id_inscripcion)}}><MdDelete></MdDelete></button>
                    <button className="btn btn-success m-1" onClick={() => {handleChangeInscripcionStatus(inscripcion.id_inscripcion, true)}}><ImCheckmark/></button>
                    <button className="btn btn-error m-1" onClick={() => {handleChangeInscripcionStatus(inscripcion.id_inscripcion, false)}}><TiTimes/></button>
                </td>
                </tr>  
            )})}
            </tbody>
        </table>
        </div>
    ) || (<div>No hay electivos para mostrar</div>);
}