// import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";
import { DUUserTable } from "../components/DUComponents/Table/DUTable.jsx";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <div className="users-table">
        {DUUserTable(users, handleDeleteUser, handleEditUser)}
      </div>
    </div>
  );
};

export default Users;
