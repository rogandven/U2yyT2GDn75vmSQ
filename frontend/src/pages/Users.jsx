// import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";
import { DUUserTable } from "../components/DUComponents/Table/DUUserTable.jsx";
import useCreateUser from "../hooks/users/useCreateUser.jsx";
import { DUPageBrowser } from "../components/DUComponents/DUPageBrowser.jsx";
import { useState } from "react";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const { handleCreateUser } = useCreateUser(fetchUsers);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  const POSTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const lastPostIndex  = currentPage * POSTS_PER_PAGE;
  const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;

  const currentPageContent = (Array.isArray(users) && users.slice(firstPostIndex, lastPostIndex)) || [];
  const pageAmount = Math.abs(Math.ceil((Array.isArray(users) && users.length) / POSTS_PER_PAGE)) || 0;


  return (
    <div className="users-page">
      <button className="btn btn-primary m-3 mb-0" onClick={handleCreateUser}>Crear Usuario</button>
      <div className="users-table">
        {DUUserTable(currentPageContent, handleDeleteUser, handleEditUser)}
        <DUPageBrowser setCurrentPageNumber={setCurrentPage} currentPageNumber={currentPage} pageAmount={pageAmount}></DUPageBrowser>
      </div>
    </div>
  );
};

export default Users;
