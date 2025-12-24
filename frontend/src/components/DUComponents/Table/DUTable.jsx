export const DUUserTable = (usuarios, handleDeleteUser, handleEditUser) => {
    const coalesceData = (data) => {
        if (data === null || data === "null") {
            return undefined;
        }
        return data;
    }

    let numero = 1;
    return Array.isArray(usuarios) && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 m-3 max-h-full">
        <table className="table">
            <thead>
            <tr>
                <th></th>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Apodo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Generación</th>
                <th>Carrera</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {/* row 1 */}
            {usuarios.map((usuario) => {
                return (
                <tr>
                    <th>{String(numero++)}</th>
                    <td>{coalesceData(String(usuario && usuario.rut)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.fullname)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.username)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.email)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.role).toUpperCase().replaceAll("_", " ")) || "usuario"}</td>
                    <td>{coalesceData(String(usuario && usuario.id_carrera)) || "N/A"}</td>
                    <td>{coalesceData(String(usuario && usuario.creditos)) || "N/A"}</td>
                    <td>
                        <button className="btn btn-primary m-1" onClick={() => {handleEditUser(usuario.id, usuario)}}>Editar</button>
                        <button className="btn btn-secondary m-1" onClick={() => {handleDeleteUser(usuario.id, usuario)}}>Eliminar</button>
                    </td>
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay usuarios para mostrar</div>);
}