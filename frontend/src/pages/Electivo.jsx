import "@styles/users.css";
import GetElectivos from "@hooks/users/GetElectivos.jsx";
import DeleteElectivo from "@hooks/users/DeleteElectivo.jsx";
import EditElectivo from "@hooks/users/EditElectivo.jsx";
import { useEffect } from "react";

const Electivo = () => {
  const { electivos, fetchElectivos } = GetElectivos();
  const { handleDeleteElectivos } = DeleteElectivo(fetchElectivos);
  const { handleEditElectivos } = EditElectivo(fetchElectivos);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchElectivos();
  }, []);

  return (
    <div className="electivos-page">
      <h2>Lista de Electivos</h2>
      <table className="electivos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Profesor</th>
            <th>Descripcion</th>
            <th>Cupos</th>
            <th>Creditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(electivos) && electivos.length > 0 ? (
            electivos.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.profesor}</td>
                <td>{user.descripcion}</td>
                <td>{user.cupos}</td>
                <td>{user.creditos}</td>
                <td>
                  <button className="edit" onClick={() => handleEditElectivos(user.id, user)}>Editar</button>
                  <button className="delete" onClick={() => handleDeleteElectivos(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay electivos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Electivo;
