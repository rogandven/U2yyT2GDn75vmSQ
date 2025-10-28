import { Outlet } from "react-router-dom";
// import "@styles/root.css";
import { AuthProvider } from "@context/AuthContext";
import Sidebar from "../components/Sidebar";
import { sidebarContainerStyles } from "../styles/TailwindStyles.jsx";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className={" page-root " + sidebarContainerStyles }>
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
