export const DUUserTable = (usuarios, handleDeleteUser, handleEditUser) => {
    const coalesceData = (data) => {
        if (data === null || data === "null") {
            return undefined;
        }
        return data;
    }

    let numero = 1;
    return Array.isArray(usuarios) && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 max-w-11/12 m-3">
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
                    <td>{coalesceData(String(usuario && usuario.rut)) || "12345678-9"}</td>
                    <td>{coalesceData(String(usuario && usuario.fullname)) || "Juanito Pérez"}</td>
                    <td>{coalesceData(String(usuario && usuario.username)) || "juanitoperez21"}</td>
                    <td>{coalesceData(String(usuario && usuario.email)) || "juanitoperez@email.com"}</td>
                    <td>{coalesceData(String(usuario && usuario.role).toUpperCase().replaceAll("_", " ")) || "usuario"}</td>
                    <td>{coalesceData(String(usuario && usuario.id_carrera)) || "1"}</td>
                    <td>{coalesceData(String(usuario && usuario.creditos)) || "0"}</td>
                    <td>
                        <button class="btn btn-primary m-1" onClick={() => {handleEditUser(usuario.id, usuario)}}>Editar</button>
                        <button class="btn btn-secondary m-1" onClick={() => {handleDeleteUser(usuario.id, usuario)}}>Eliminar</button>
                    </td>
                </tr>     
                )           
            })}

            </tbody>
        </table>
        </div>
    ) || (<div>No hay usuarios para mostrar</div>);
}