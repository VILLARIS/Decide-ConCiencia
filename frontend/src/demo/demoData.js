/*
  Fuente de datos unica del modo demostracion.

  Todo el contenido de esta demo vive aqui: la pagina de acceso, el navbar y
  las pantallas de estudiante leen de este archivo. Ninguna pagina duplica
  objetos.

  MODO DEMO: credencial ficticia, sin valor real. No hay backend, no hay
  validacion en servidor y esta comparacion NO es seguridad.
*/

/* ---------- Roles de la demo ---------- */

/*
  Hay dos perfiles y son independientes:

  - student: el area de estudiante (/mi-aprendizaje, checkout, perfil).
  - admin:   el panel de la doctora (/admin). Ella es la UNICA administradora:
             no hay equipos, permisos ni multiples cuentas de administracion.

  La carpeta /admin comprueba el rol con RequireAdminSession; no hay login
  aparte, solo la misma pantalla de Acceso que decide a donde va cada quien.
*/
export const DEMO_ROLES = {
  student: 'student',
  admin: 'admin',
}

/* ---------- Credenciales de acceso a la demo ---------- */

export const DEMO_STUDENT_LOGIN = {
  email: 'demo@yulia.test',
  password: 'Demo1234!',
}

/* Acceso de la doctora. Misma pantalla, credencial distinta. */
export const DEMO_ADMIN_LOGIN = {
  email: 'admin@yulia.test',
  password: 'Admin1234!',
}

/*
  Se mantiene DEMO_LOGIN como alias del acceso de estudiante porque el login,
  el navbar y la pagina de Acceso ya lo usan por ese nombre.
*/
export const DEMO_LOGIN = DEMO_STUDENT_LOGIN

/* ---------- Usuarios de sesion en memoria ---------- */

/* Los objetos de usuario NO contienen la contrasena: esa solo existe en
   DEMO_STUDENT_LOGIN y DEMO_ADMIN_LOGIN, que se usan unicamente para rellenar
   y comparar el formulario. */
export const DEMO_USER = {
  id: 'demo-student',
  firstName: 'Andrea',
  lastName: 'Ramos',
  email: 'demo@yulia.test',
  role: 'student',
}

/* La doctora administradora. */
export const DEMO_ADMIN_USER = {
  id: 'demo-admin',
  firstName: 'Yulia',
  lastName: '',
  email: 'admin@yulia.test',
  role: 'admin',
}

export const DEMO_AVATAR_ALT = 'Avatar de demostración para Andrea Ramos'

/* ---------- Curso principal en progreso ---------- */

/* El curso destacado de la web (bioquimica-aplicada-a-la-nutricion) NO esta en
   esta lista a proposito: es el curso que se compra en el flujo del checkout.
   Aqui viven solo los cursos que la estudiante ya tiene. */
export const DEMO_MAIN_COURSE = {
  id: 'metabolismo-de-carbohidratos',
  title: 'Metabolismo de carbohidratos',
  status: 'En progreso',
  instructor: 'Dra. Yulia',
  progress: 75,
  moduleCurrent: 4,
  moduleTotal: 6,
  lessonsCompleted: 12,
  lessonsTotal: 18,
  nextLesson: 'Regulación hormonal',
}

/* ---------- Mis cursos ---------- */

/* Esta lista se combina con los cursos comprados en el checkout: los que se
   compran alli se anaden al final con 0% y estado "Inscrito". */
export const DEMO_COURSES = [
  {
    id: 'nutricion-clinica-aplicada',
    title: 'Nutrición clínica aplicada',
    category: 'Clínica',
    level: 'Avanzado',
    progress: 40,
    status: 'En progreso',
    tone: 'sky',
  },
  {
    id: 'fisiologia-digestiva',
    title: 'Fisiología digestiva',
    category: 'Fundamentos',
    level: 'Inicial',
    progress: 100,
    status: 'Completado',
    tone: 'mist',
  },
]

/* ---------- Resumen lateral ---------- */

export const DEMO_OVERVIEW = {
  overallProgress: 72,
  nextGoal: 'Completar Módulo 5',
  certificatesCount: 1,
}

/* Hito de progreso del area de estudiante, para el resumen de certificados. */
export const DEMO_MILESTONE = {
  coursesCompleted: 1,
  coursesTotal: 3,
  pendingCourses: 2,
}

export const DEMO_ACTIVITY = [
  {
    id: 'act-1',
    text: 'Clase finalizada: Regulación hormonal',
    when: 'Ayer, 21:40',
  },
  {
    id: 'act-2',
    text: 'Módulo 3 completado con 4 de 4 clases',
    when: 'Hace 3 días',
  },
  {
    id: 'act-3',
    text: 'Certificado de Fisiología digestiva descargado',
    when: 'Hace 1 semana',
  },
]

/* ---------- Certificados ---------- */

/* Corresponde al curso completado de DEMO_COURSES (Fisiologia digestiva) y a
   la linea "Certificado de Fisiologia digestiva descargado" de la actividad. */
export const DEMO_CERTIFICATES = [
  {
    id: 'cert-demo-1',
    title: 'Fisiología digestiva',
    /* Fecha de demostracion, no corresponde a una fecha real de emision. */
    issuedAt: '01 de enero de 2026',
    issuedBy: 'Dra. Yulia',
    hours: 18,
    modules: 5,
    /* Indica que el curso se completo: alimenta el badge "Completado". */
    completed: true,
  },
]

/* ---------- Perfil ---------- */

export const DEMO_PROFILE = {
  firstName: 'Andrea',
  lastName: 'Ramos',
  email: 'demo@yulia.test',
  roleLabel: 'Estudiante',
  bio: 'Estudiante de Nutrición interesada en bioquímica aplicada y práctica clínica.',
  joinedAt: 'Enero de 2026 (fecha de demostración)',
}

