
export const ROLES = {
  ADMIN: 'admin',
  DIVISION: 'jefe division de estudios',
  ACADEMICO: 'jefe departamento academico',
  RESIDENTE: 'residente',
  ALUMNO: 'alumno',
  ASESOR_INTERNO: 'asesor interno',
};

export const ROLE_ROUTES = {
  LOGIN: '/login',
  REGISTRO: '/registro',
  UNAUTHORIZED: '/unauthorized',
  [ROLES.ADMIN]: '/admin',
  [ROLES.DIVISION]: '/jefe-division',
  [ROLES.ACADEMICO]: '/jefe-departamento-aca',
  [ROLES.RESIDENTE]: '/residente',
  [ROLES.ALUMNO]: '/residente',
  [ROLES.ASESOR_INTERNO]: '/asesorInterno',
};

// Rutas que no requieren login
export const PUBLIC_ROUTES = ['/', '/login', '/registro'];