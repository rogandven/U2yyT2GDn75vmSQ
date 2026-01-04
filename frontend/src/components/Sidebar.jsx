import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import DUSidebarBody from "./DUComponents/Sidebar/DUSidebarBody.jsx";
import { getUserRole, isAdminOrProfesor, isJefeDeCarrera2, canCrudCareers as s_canCrudCareers, canMakeRequests as s_canMakeRequests } from "../services/admin.service.js";
import { canMakeRequests } from "../services/admin.service.js";
import { STUDENT_ROLE, TEACHER_ROLE } from "../constants/PermissionsConstants.jsx";
// import "@styles/Sidebar.css";

const Sidebar = ({PageContent}) => {
  const navigate = useNavigate();

  const userRole = getUserRole();
  const isAdmin = isAdminOrProfesor(userRole);
  const canCrudCareers = s_canCrudCareers(userRole);
  const isStudent = (userRole === STUDENT_ROLE);
  console.log(isStudent);

  console.log(canCrudCareers);

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      // console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <DUSidebarBody PageContent={PageContent} logoutSubmit={logoutSubmit} isAdmin={isAdmin} canCrudCareers={canCrudCareers} canMakeRequests={canMakeRequests} isStudent={isStudent}></DUSidebarBody>
    </div>
  );
};

export default Sidebar;
