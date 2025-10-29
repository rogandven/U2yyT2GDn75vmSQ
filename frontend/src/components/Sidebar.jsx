import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import DUSidebarBody from "./DUComponents/Sidebar/DUSidebarBody.jsx";
// import "@styles/Sidebar.css";

const Sidebar = ({PageContent}) => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <DUSidebarBody PageContent={PageContent} logoutSubmit={logoutSubmit}></DUSidebarBody>
    </div>
  );
};

export default Sidebar;
