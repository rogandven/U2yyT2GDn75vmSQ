import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io'
import { getUserRole, ADMIN_ROLE } from '@services/admin.service.js';

export const DUUserTable = (usuarios, handleDeleteUser, handleEditUser) => {
    const coalesceData = (data) => {
        if (data === null || data === "null" || data === undefined || data === "undefined") {
            return "";
        }
        return data;
    }
    return Array.isArray(usuarios) && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Apodo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Generación</th>
                <th>Carrera</th>
                <th>Créditos</th>
                {getUserRole() === ADMIN_ROLE && (<th>Acciones</th>)}
            </tr>
            </thead>
            <tbody>
            {/* row 1 */}
            {usuarios.map((usuario, _index) => {
                return (
                <tr key={usuario?.id || usuario?.email || _index}>
                    <td>{coalesceData(String(usuario && usuario.rut)) || "N/A"}</td>
                    <td>{(coalesceData(String(usuario && usuario.fullname)) || "N/A")}</td>
                    <td>{coalesceData(String(usuario && usuario.username)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.email)) || "N/A"}</td>
                    <td>
                        <div className="badge badge-primary">
                            {coalesceData(String(usuario && usuario.role).toUpperCase().replaceAll("_", " ")) || "usuario"}
                        </div>
                    </td>
                    <td>
                        <div className="badge badge-secondary">
                            {coalesceData(String(usuario && usuario.generation)) || "N/A"}
                        </div>
                    </td>
                    <td>
                        <div className="badge badge-accent">
                            {(() => {
                                const c = usuario?.carrera;
                                if (!c) return "N/A";
                                if (typeof c === 'string') return coalesceData(c);
                                // object case, try common fields
                                return coalesceData(String(c.nombre || c.nombre_carrera || c.id || JSON.stringify(c)));
                            })()}
                        </div>
                    </td>
                    <td>{Number(usuario.creditos)}</td>
                    {getUserRole() === ADMIN_ROLE && (
                    <td>
                        <button className="btn btn-primary m-1" onClick={() => {handleEditUser(usuario.id, usuario)}}><IoMdSettings></IoMdSettings></button>
                        <button className="btn btn-secondary m-1" onClick={() => {handleDeleteUser(usuario.id, usuario)}}><MdDelete></MdDelete></button>
                    </td>
                    )}
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay usuarios para mostrar</div>);
}