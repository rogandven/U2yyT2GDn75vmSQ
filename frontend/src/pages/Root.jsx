import { Outlet } from "react-router-dom";
// import "@styles/root.css";
import "@styles/global.css";
import { AuthProvider } from "@context/AuthContext";
import Sidebar from "../components/Sidebar";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const PageContent = (
      <div className="page-content">
        <Outlet />
      </div>
  );

  return (
    <div className="page-root">
      <Sidebar PageContent={PageContent}/>
    </div>
  );
}

export default Root;
