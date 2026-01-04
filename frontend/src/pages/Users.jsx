// import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";
import { DUUserTable } from "../components/DUComponents/Table/DUUserTable.jsx";
import useCreateUser from "../hooks/users/useCreateUser.jsx";
import useGetProfile from "@hooks/profile/useGetProfile.jsx";
import { getUserRole, isJefeDeCarrera, ADMIN_ROLE } from "@services/admin.service.js";
import { DUPageBrowser } from "../components/DUComponents/DUPageBrowser.jsx";
import { useState } from "react";
import useGetCarreraNames from "../hooks/carreras/useGetCarreraNames.jsx";
import { CAN_DO_CRUD_ON_USERS, CAN_VIEW_USERS } from "../admin/permissions.admin.js";
import { getUserCareerId } from "../services/admin.service.js";

const Users = () => {
  const { users, fetchUsers, setUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const { handleCreateUser } = useCreateUser(fetchUsers);
  const { fetchProfile } = useGetProfile();

  const { carreraNames, fetchCarreraNames } = useGetCarreraNames();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    (async () => {
      const profile = await fetchProfile();
      const data = await fetchUsers();
      await fetchCarreraNames();
    })();
  }, []);

  const POSTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const lastPostIndex  = currentPage * POSTS_PER_PAGE;
  const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;

  const currentPageContent = (Array.isArray(users) && users.slice(firstPostIndex, lastPostIndex)) || [];
  const pageAmount = Math.abs(Math.ceil((Array.isArray(users) && users.length) / POSTS_PER_PAGE)) || 0;

  console.log(carreraNames);

  return (
    <div className="users-page">
      {getUserRole() === ADMIN_ROLE && (
        <button className="btn btn-primary m-3 mb-0" onClick={() => {handleCreateUser(fetchUsers, carreraNames)}}>Crear Usuario</button>
      )}
      <div className="users-table">
        {DUUserTable(currentPageContent, handleDeleteUser, handleEditUser, carreraNames)}
        <DUPageBrowser setCurrentPageNumber={setCurrentPage} currentPageNumber={currentPage} pageAmount={pageAmount}></DUPageBrowser>
      </div>
    </div>
  );
};

export default Users;
