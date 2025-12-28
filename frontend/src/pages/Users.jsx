// import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";
import { DUUserTable } from "../components/DUComponents/Table/DUUserTable.jsx";
import useCreateUser from "../hooks/users/useCreateUser.jsx";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const { handleCreateUser } = useCreateUser(fetchUsers);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <button className="btn btn-primary m-3 mb-0" onClick={handleCreateUser}>Crear Usuario</button>
      <div className="users-table">
        {DUUserTable(users, handleDeleteUser, handleEditUser)}
      </div>
    </div>
  );
};

export default Users;
