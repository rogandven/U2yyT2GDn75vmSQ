export const MIN_FULLNAME = 3;
export const MAX_FULLNAME = 500;
export const FULLNAME_REGEX = /^[A-ZÁÉÍÓÚ ]*$/;

export const GENERATION_REGEX = /[1-9]*-[1-2]/;

export const TEACHER_ROLE = 'PROFESOR';
export const STUDENT_ROLE = 'ESTUDIANTE';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const CAREER_HEAD_ROLE = 'JEFE_DE_CARRERA';
export const VALID_ROLES = [TEACHER_ROLE, STUDENT_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
export const VALID_ADMIN_ROLES = [TEACHER_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];

export const VALID_EMAIL_DOMAINS = ['ubiobio.cl', 'alumnos.ubiobio.cl', 'gmail.com'];