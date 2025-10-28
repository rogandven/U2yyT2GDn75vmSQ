import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { NavLinkStyles, iconStyles, iconTextStyles, sidebarTitleNoColorStyles } from "@styles/TailwindStyles.jsx";
import { PROJECT_NAME } from "../constants/constants.jsx";
import { sidebarBackgroundStyles } from "../styles/TailwindStyles.jsx";
// import "@styles/Sidebar.css";

const Sidebar = () => {
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
    <div className={"sidebar" + sidebarBackgroundStyles}>
      <h2 className={sidebarTitleNoColorStyles}>{PROJECT_NAME}</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home" className={NavLinkStyles}>
              <FaHome className={iconStyles}/>
              <p className={iconTextStyles}>Inicio</p>
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users" className={NavLinkStyles}>
                <FaUsers className={iconStyles}/>
                <p className={iconTextStyles}>Usuarios</p>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile" className={NavLinkStyles}>
              <CgProfile className={iconStyles}/>
              <p className={iconTextStyles}>Perfil</p>
            </NavLink>
          </li>
          <li className=""/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit} className={NavLinkStyles}>
              <FaSignOutAlt className={iconStyles}/>
              <p className={iconTextStyles}>Cerrar Sesión</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
