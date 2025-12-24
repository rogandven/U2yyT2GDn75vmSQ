export const TEACHER_ROLE = 'PROFESOR';
export const STUDENT_ROLE = 'ESTUDIANTE';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const CAREER_HEAD_ROLE = 'JEFE_DE_CARRERA';

export const getAllowedRoles = () => {
    return [TEACHER_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
}