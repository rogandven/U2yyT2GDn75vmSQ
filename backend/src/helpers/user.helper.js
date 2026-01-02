import { CAREER_HEAD_ROLE, ADMIN_ROLE, TEACHER_ROLE, STUDENT_ROLE } from "../constants/user.constants.js";

export const allowedTampering = {
  CARREER_HEAD: [CAREER_HEAD_ROLE, ADMIN_ROLE, TEACHER_ROLE, STUDENT_ROLE],
  ADMIN: [CAREER_HEAD_ROLE, ADMIN_ROLE, TEACHER_ROLE, STUDENT_ROLE],
  TEACHER: [TEACHER_ROLE, STUDENT_ROLE],
  STUDENT: []
};

export const getAllowedRolesToTamper = (role) => {
  if (!role || (typeof(role) !== "string")) {
    return allowedTampering.STUDENT;
  } else if (role === CAREER_HEAD_ROLE) {
    return allowedTampering.CARREER_HEAD;
  } else if (role === ADMIN_ROLE) {
    return allowedTampering.ADMIN;
  } else if (role === TEACHER_ROLE) {
    return allowedTampering.TEACHER;
  } else {
    return allowedTampering.STUDENT;
  }
} 