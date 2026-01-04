
export const ROLES = {
  ADMIN: 'admin',
  DIVISION: 'jefe division de estudios',
  ACADEMICO: 'jefe departamento academico',
  RESIDENTE: 'residente',
};

export const ROLE_ROUTES = {
  LOGIN: '/login',
  REGISTRO: '/registro',
  UNAUTHORIZED: '/unauthorized',
  [ROLES.ADMIN]: '/admin',
  [ROLES.DIVISION]: '/jefe-division',
  [ROLES.ACADEMICO]: '/jefe-departamento-aca',
  [ROLES.RESIDENTE]: '/residente',
};

// Rutas que no requieren login
export const PUBLIC_ROUTES = ['/', '/login', '/registro'];