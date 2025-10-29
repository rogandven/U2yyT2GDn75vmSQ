import DUSidebarItem from "./DUSidebarItem";
import { DEFAULT_ICON_MARGIN_STYLES } from "../../../../constants/TailwindConstants.jsx";

import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

export const DUSidebarBody = ({ PageContent, logoutSubmit }) => {
    return (
        <div className="drawer drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            {PageContent}
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
                <DUSidebarItem 
                    label={"Inicio"} 
                    destination={"/home"} 
                    icon={<FaHome className={DEFAULT_ICON_MARGIN_STYLES}></FaHome>} 
                    logoutSubmit={undefined}>
                </DUSidebarItem>

                <DUSidebarItem 
                    label={"Usuarios"} 
                    destination={"/users"} 
                    icon={<FaUsers className={DEFAULT_ICON_MARGIN_STYLES}></FaUsers>} 
                    logoutSubmit={undefined}>
                </DUSidebarItem>

                <DUSidebarItem 
                    label={"Perfil"} 
                    destination={"/profile"} 
                    icon={<CgProfile className={DEFAULT_ICON_MARGIN_STYLES}></CgProfile>} 
                    logoutSubmit={undefined}>
                </DUSidebarItem>

                <DUSidebarItem 
                    label={"Cerrar Sesión"} 
                    destination={"/logout"} 
                    icon={<FaSignOutAlt className={DEFAULT_ICON_MARGIN_STYLES}></FaSignOutAlt>} 
                    logoutSubmit={logoutSubmit}>
                </DUSidebarItem>                                    
            </ul>

            {/* button to open/close drawer */}
            <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
                <label htmlFor="my-drawer-4" className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                </label>
            </div>

            </div>
        </div>
        </div>
    );
}

export default DUSidebarBody;