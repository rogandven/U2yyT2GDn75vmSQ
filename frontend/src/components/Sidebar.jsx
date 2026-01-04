import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import DUSidebarBody from "./DUComponents/Sidebar/DUSidebarBody.jsx";
import { getUserRole, isAdminOrProfesor, isJefeDeCarrera2, canCrudCareers as s_canCrudCareers } from "../services/admin.service.js";
// import "@styles/Sidebar.css";

const Sidebar = ({PageContent}) => {
  const navigate = useNavigate();

  const userRole = getUserRole();
  const isAdmin = isAdminOrProfesor(userRole);
  const canCrudCareers = s_canCrudCareers(userRole);

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
      <DUSidebarBody PageContent={PageContent} logoutSubmit={logoutSubmit} isAdmin={isAdmin} canCrudCareers={canCrudCareers}></DUSidebarBody>
    </div>
  );
};

export default Sidebar;
