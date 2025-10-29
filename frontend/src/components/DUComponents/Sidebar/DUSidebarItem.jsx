import { NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { DEFAULT_ICON_MARGIN_STYLES } from "../../../../constants/TailwindConstants.jsx";
const nullLogOut = () => {
    return false;
}

export const DUSidebarItem = ({label, destination, icon, logoutSubmit}) => {
    console.log(icon);
    return (
        <li>
            <NavLink to={destination} onClick={logoutSubmit ? logoutSubmit : nullLogOut}>
            <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex flex-row align-middle items-center" data-tip={label}>
                {icon}
                <span className={"is-drawer-close:hidden " + DEFAULT_ICON_MARGIN_STYLES}>{label}</span>
            </button>
            </NavLink>
        </li>
    )
}

export default DUSidebarItem;