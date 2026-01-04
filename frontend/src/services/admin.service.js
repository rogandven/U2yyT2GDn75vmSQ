import { CAN_DO_CRUD_ON_USERS, CAN_VIEW_USERS } from "../admin/permissions.admin.jsx";

export const TEACHER_ROLE = 'PROFESOR';
export const STUDENT_ROLE = 'ESTUDIANTE';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const CAREER_HEAD_ROLE = 'JEFE_DE_CARRERA';

export const VALID_ROLES = [TEACHER_ROLE, STUDENT_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
export const VALID_ADMIN_ROLES = [TEACHER_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
export const VALID_SUPERADMIN_ROLES = [ADMIN_ROLE, CAREER_HEAD_ROLE];

export const getAllowedRoles = () => {
    return VALID_ADMIN_ROLES;
}

export const getUserCareerId = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('usuario'));
        console.log("USER: " + JSON.stringify(user));
        const carreraId = user?.id_carrera || -1;
        return carreraId;
    } catch (error) {
        return -1;
    }
}
 
export const getUserRole = () => {
   try {
        const user = JSON.parse(sessionStorage.getItem('usuario'));
        const rol = String(user?.rol) || STUDENT_ROLE;
        // console.log("ROL ACTUAL: " + rol);
        return rol;
    } catch (error) {
        console.error(error);
        return STUDENT_ROLE;
    }
}

export const isAdmin = () => {
    const userRole = getUserRole();
    // console.log(userRole);
    const result = (userRole && (userRole === ADMIN_ROLE)) || false;
    // console.log(result);
    return result;
}

export const isAdminOrProfesor = (role) => {
    return VALID_ADMIN_ROLES.includes(String(role));
}
export const isJefeDeCarrera = () => {
    const userRole = getUserRole();
    // console.log(userRole);
    const result = (userRole && (userRole === CAREER_HEAD_ROLE)) || false;
    // console.log(result);
    return result;
}

export const getUserRole2 = () => {
    try {
        const user = JSON.parse(sessionStorage.getItem('usuario'));
        const rol = String(user?.rol) || STUDENT_ROLE;
        // console.log("ROL ACTUAL: " + rol);
        return rol;
    } catch (error) {
        // console.error(error);
        return STUDENT_ROLE;
    }
}

export const isAdminOrProfesor2 = (role) => {
    return VALID_ADMIN_ROLES.includes(String(role));
}

export const isJefeDeCarrera2 = (role) => {
    return CAREER_HEAD_ROLE === String(role);
}

export const isStudent = (role) => {
    return STUDENT_ROLE === String(role);
}

export const canViewUsers = (role) => {
    return CAN_VIEW_USERS.includes(String(role));
}

export const canCrudUsers = (role) => {
    return CAN_DO_CRUD_ON_USERS.includes(String(role));
} 

/*
export const getAllowedRoles = () => {
    return VALID_ADMIN_ROLES;
}
*/
/*
export const getUserRole = () => {
    const user = sessionStorage.getItem('usuario') || null;

    let parsedUser = null;
    let role = STUDENT_ROLE;
    try {
        parsedUser = JSON.parse(user || {});
        if (parsedUser && parsedUser.rol) {
            role = String(parsedUser.rol);
        }
    } catch (error) {}

    return role.toUpperCase();
}

export const isAdminOrProfesor = () => {
    const userRole = getUserRole();
    for (let i = 0; i < VALID_ADMIN_ROLES.length; i++) {
        if (VALID_ADMIN_ROLES[i] === userRole) {
            return true;
        }
    }
    return false;
}

export const isJefeDeCarrera = () => {
    const userRole = getUserRole();
    // console.log(userRole);
    const result = (userRole && (userRole === CAREER_HEAD_ROLE)) || false;
    // console.log(result);
    return result;
} */ 