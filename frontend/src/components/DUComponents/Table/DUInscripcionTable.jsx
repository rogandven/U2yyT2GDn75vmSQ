import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { parse_SQLDate } from '../../../utils/parseDate.jsx';
import { DUCareerSplitter } from './DUCareerSplitter.jsx';
import { TiInfoLarge } from 'react-icons/ti';

import { ImCheckmark } from 'react-icons/im';
import { TiTimes } from 'react-icons/ti';
import { BsClockFill } from 'react-icons/bs';

import { ESTADOS_VALIDOS } from '../../../constants/InscripcionConstants.jsx';

export const DUInscripcionTable = ({inscripciones}) => {
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
                <td>{inscripcion.id_usuario}</td>
                <td>{inscripcion.id_electivo}</td>
                <td>{parse_SQLDate(inscripcion.fecha_hora)}</td>
                <td>
                    <div className="badge badge-primary">
                        {String(inscripcion.estado).toUpperCase().replaceAll("_", " ")}
                    </div>    
                </td>
                <td>
                    <button className="btn btn-primary m-1" onClick={() => {}}><FaEdit></FaEdit></button>
                    <button className="btn btn-secondary m-1" onClick={() => {}}><MdDelete></MdDelete></button>
                    <button className="btn btn-success m-1" onClick={() => {}}><ImCheckmark/></button>
                    <button className="btn btn-error m-1" onClick={() => {}}><TiTimes/></button>
                </td>
                </tr>  
            )})}
            </tbody>
        </table>
        </div>
    ) || (<div>No hay electivos para mostrar</div>);
}