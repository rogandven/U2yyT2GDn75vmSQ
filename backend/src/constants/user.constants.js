export const MIN_FULLNAME = 3;
export const MAX_FULLNAME = 500;
export const FULLNAME_REGEX = /^[A-ZÁÉÍÓÚ ]*$/;

export const GENERATION_REGEX = /[0-9]*\-[1-2]/;

export const TEACHER_ROLE = 'PROFESOR';
export const STUDENT_ROLE = 'ESTUDIANTE';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const CAREER_HEAD_ROLE = 'JEFE_DE_CARRERA';
export const VALID_ROLES = [TEACHER_ROLE, STUDENT_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
export const VALID_ADMIN_ROLES = [TEACHER_ROLE, ADMIN_ROLE, CAREER_HEAD_ROLE];
export const VALID_SUPERADMIN_ROLES = [ADMIN_ROLE, CAREER_HEAD_ROLE];
export const MINECRAFT = "Minecraft";

export const VALID_EMAIL_DOMAINS = ['@ubiobio.cl', '@alumnos.ubiobio.cl', '@gmail.com'];
export const MIN_CREDITOS = 0;
export const MAX_CREDITOS = 10000;

export const MIN_DATE_LENGTH = 1;
export const MAX_DATE_LENGTH = 200;

export const caseConverter = (string) => {
    if (!string || typeof(string) !== "string" || (string = string.trim()).length <= 1) {
        return "Error";
    }
    return (String(string).substring(0, 1).toUpperCase())  + (String(string).substring(1).toLowerCase());
}

export const fullnameRegexMessageGenerator = (pronoun, name) => {
    if (!name || typeof(name) !== "string" || (name = name.trim()).length <= 0) {
        name = "campo";
    }
    if (!pronoun || typeof(pronoun) !== "string" || (pronoun = pronoun.trim()).length <= 0) {
        pronoun = "el";
    }
    pronoun = caseConverter(pronoun);
    name = String(name).toLowerCase();
    return `${pronoun} ${name} solo puede tener letras y espacios`;
}