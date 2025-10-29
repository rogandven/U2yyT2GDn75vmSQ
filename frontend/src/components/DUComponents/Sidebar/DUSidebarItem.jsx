import { NavLink, useNavigate } from "react-router-dom";

const nullLogOut = () => {
    return false;
}

export const DUSidebarItem = ({label, destination, icon, logoutSubmit}) => {
    return (
        <li>
            <NavLink to={destination} onClick={logoutSubmit ? logoutSubmit : nullLogOut}>
            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                {icon}
                <span className="is-drawer-close:hidden">{label}</span>
            </button>
            </NavLink>
        </li>
    )
}

export default DUSidebarItem;