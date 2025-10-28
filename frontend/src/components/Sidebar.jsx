import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { PROJECT_NAME } from "../constants/constants.jsx";
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
    <div className={"sidebar"}>
      <h2 className={""}>{PROJECT_NAME}</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home" className={""}>
              <FaHome className={""}/>
              <p className={""}>Inicio</p>
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users" className={""}>
                <FaUsers className={""}/>
                <p className={""}>Usuarios</p>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile" className={""}>
              <CgProfile className={""}/>
              <p className={""}>Perfil</p>
            </NavLink>
          </li>
          <li className=""/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit} className={""}>
              <FaSignOutAlt className={""}/>
              <p className={""}>Cerrar Sesión</p>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
