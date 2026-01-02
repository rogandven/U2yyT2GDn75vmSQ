// import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";
import { DUUserTable } from "../components/DUComponents/Table/DUUserTable.jsx";
import useCreateUser from "../hooks/users/useCreateUser.jsx";
import useGetProfile from "@hooks/profile/useGetProfile.jsx";
import { getUserRole, isJefeDeCarrera, ADMIN_ROLE } from "@services/admin.service.js";

const Users = () => {
  const { users, fetchUsers, setUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const { handleCreateUser } = useCreateUser(fetchUsers);
  const { fetchProfile } = useGetProfile();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    (async () => {
      const profile = await fetchProfile();
      const data = await fetchUsers();
      try {
        const role = getUserRole();
        if (isJefeDeCarrera(role) && profile) {
          const profileCareerId = profile?.id_carrera || profile?.carrera?.id || null;
          const anyCareerInfo = (data || []).some((u) => u?.id_carrera || u?.carrera);
          if (!profileCareerId && !anyCareerInfo) {
            setUsers(data || []);
            return;
          }
          const filtered = (data || []).filter((u) => {
            if (profileCareerId != null) return u?.id_carrera === profileCareerId;
            if (u?.carrera && profile?.carrera) {
              const a = String(u.carrera?.nombre || u.carrera).toUpperCase();
              const b = String(profile.carrera?.nombre || profile.carrera).toUpperCase();
              return a === b;
            }
            return false;
          });
          setUsers(filtered);
        }
      } catch (error) {
        
      }
    })();
  }, []);

  return (
    <div className="users-page">
      {getUserRole() === ADMIN_ROLE && (
        <button className="btn btn-primary m-3 mb-0" onClick={handleCreateUser}>Crear Usuario</button>
      )}
      <div className="users-table">
        {DUUserTable(users, handleDeleteUser, handleEditUser)}
      </div>
    </div>
  );
};

export default Users;
