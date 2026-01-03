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
    if (!role) {
        throw Error("Función mal llamada");
    }
    // console.log("¿Es administrador el usuario?: " + String(Boolean(VALID_ADMIN_ROLES.includes(String(role)))));
    // console.log("Rol: " + JSON.stringify(role));
    return VALID_ADMIN_ROLES.includes(String(role));
}
export const isJefeDeCarrera = () => {
    const userRole = getUserRole();
    // console.log(userRole);
    const result = (userRole && (userRole === CAREER_HEAD_ROLE)) || false;
    // console.log(result);
    return result;
}