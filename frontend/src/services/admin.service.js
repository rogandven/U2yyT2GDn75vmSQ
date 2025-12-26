export const TEACHER_ROLE = 'PROFESOR';
export const STUDENT_ROLE = 'ESTUDIANTE';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const CAREER_HEAD_ROLE = 'JEFE_DE_CARRERA';

export const getAllowedRoles = () => {
    return [TEACHER_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
}

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
    console.log(userRole);
    const ALLOWED_ROLES = getAllowedRoles();
    for (let i = 0; i < ALLOWED_ROLES.length; i++) {
        if (ALLOWED_ROLES[i] === userRole) {
            return true;
        }
    }
    return false;
}