/*
  Datos del area administrativa (modo demostracion).

  Es la unica fuente para el panel de la doctora: metricas, cursos,
  estudiantes, ventas, evaluaciones y certificados. Ningun componente repite
  estos objetos.

  MODO DEMO: cifras y personas ficticias, sin backend. Sirven para ver el
  panel con volumen realista; no representan datos reales de la plataforma.

  PLAN PROFESIONAL
  ----------------
  Aqui solo hay gestion: cursos, estudiantes, ventas basicas, contenido,
  evaluaciones y certificados. Sin graficas, tendencias, comparaciones ni
  reportes: eso es del Plan Integral. Ver ADMIN_PLAN al final del archivo.
*/

import { DEMO_CATALOG } from './demoCatalog'

/* Identifica que alcance tiene este panel. */
export const ADMIN_PLAN = {
  name: 'Profesional',
  description: 'Gestión de la plataforma sin analítica avanzada.',
}

/* ---------- Metricas del panel ---------- */

/*
  Solo cuatro, a proposito. Se muestran tal cual: en el panel no se calcula
  nada, porque un porcentaje derivado de datos ficticios no informa de nada.
  Cuando exista backend, estas cifras Vendran de la API.
*/
export const DEMO_ADMIN_STATS = [
  { id: 'sales-month', label: 'Ventas este mes', value: 'S/ 1,490', hint: '12 ventas' },
  { id: 'sales-total', label: 'Ventas totales', value: 'S/ 6,850', hint: 'Desde el inicio' },
  { id: 'students', label: 'Estudiantes', value: '24', hint: '21 activos' },
  { id: 'courses', label: 'Cursos publicados', value: '4', hint: '1 en borrador' },
]

/* ---------- Estados disponibles ---------- */

export const COURSE_STATUS = {
  published: 'Publicado',
  draft: 'Borrador',
}

export const SALE_STATUS = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
  refunded: 'Reembolsado',
}

export const STUDENT_STATUS = {
  active: 'Activo',
  inactive: 'Inactivo',
}

/* ---------- Cursos ---------- */

/*
  Los ids coinciden con DEMO_CATALOG (ver demoCatalog.js): asi una venta o un
  certificado siempre apuntan a un curso real del catalogo. Se anaden campos
  de gestion (portada, estado, inscritos, actualizado) que el catalogo publico
  no necesita.
*/
export const DEMO_ADMIN_COURSES = [
  {
    id: 'bioquimica-aplicada-a-la-nutricion',
    title: 'Bioquímica aplicada a la Nutrición',
    shortDescription: 'Fundamentos de bioquímica con enfoque aplicado a la nutrición.',
    category: 'Fundamentos',
    level: 'Intermedio',
    duration: '8 semanas · 40 horas',
    price: 149,
    previousPrice: 199,
    currency: 'S/',
    status: COURSE_STATUS.published,
    hasCertificate: true,
    hasEvaluation: true,
    students: 14,
    updatedAt: '28 Sep 2026',
    /* Tono de la portada: la ficha usa el color, no una imagen pesada. */
    tone: 'sky',
  },
  {
    id: 'nutricion-clinica-aplicada',
    title: 'Nutrición clínica aplicada',
    shortDescription: 'Aplicación clínica de la nutrición en consulta y seguimiento.',
    category: 'Clínica',
    level: 'Avanzado',
    duration: '10 semanas · 35 horas',
    price: 179,
    previousPrice: 229,
    currency: 'S/',
    status: COURSE_STATUS.published,
    hasCertificate: true,
    hasEvaluation: true,
    students: 8,
    updatedAt: '22 Sep 2026',
    tone: 'sage',
  },
  {
    id: 'metabolismo-de-carbohidratos',
    title: 'Metabolismo de carbohidratos',
    shortDescription: 'Vías metabólicas de carbohidratos y su impacto nutricional.',
    category: 'Fundamentos',
    level: 'Intermedio',
    duration: '6 semanas · 25 horas',
    price: 129,
    previousPrice: 129,
    currency: 'S/',
    status: COURSE_STATUS.published,
    hasCertificate: false,
    hasEvaluation: true,
    students: 5,
    updatedAt: '18 Sep 2026',
    tone: 'sky',
  },
  {
    id: 'fisiologia-digestiva',
    title: 'Fisiología digestiva',
    shortDescription: 'Aparato digestivo, absorción y tolerancia alimentaria.',
    category: 'Fundamentos',
    level: 'Inicial',
    duration: '5 semanas · 18 horas',
    price: 99,
    previousPrice: 99,
    currency: 'S/',
    status: COURSE_STATUS.published,
    hasCertificate: true,
    hasEvaluation: false,
    students: 3,
    updatedAt: '12 Sep 2026',
    tone: 'mist',
  },
  {
    id: 'nutricion-materna',
    title: 'Nutrición materna e infantil',
    shortDescription: 'Bases de nutrición en embarazo, lactancia e infancia.',
    category: 'Clínica',
    level: 'Intermedio',
    duration: '7 semanas · 24 horas',
    price: 0,
    previousPrice: 0,
    currency: 'S/',
    status: COURSE_STATUS.draft,
    hasCertificate: true,
    hasEvaluation: false,
    students: 0,
    updatedAt: '30 Sep 2026',
    tone: 'mist',
  },
]

/* ---------- Estudiantes ---------- */

export const DEMO_ADMIN_STUDENTS = [
  {
    id: 'demo-student',
    name: 'Andrea Ramos',
    email: 'demo@yulia.test',
    registeredAt: '28 Sep 2026',
    status: STUDENT_STATUS.active,
    /* Compras: mismo modelo de una compra = un curso. */
    purchases: [
      { id: 'SAL-1041', courseId: 'metabolismo-de-carbohidratos', amount: 129, date: '28 Sep 2026' },
      { id: 'SAL-1038', courseId: 'fisiologia-digestiva', amount: 99, date: '20 Sep 2026' },
    ],
  },
  {
    id: 'st-02',
    name: 'María López',
    email: 'maria.lopez@ejemplo.com',
    registeredAt: '21 Sep 2026',
    status: STUDENT_STATUS.active,
    purchases: [
      { id: 'SAL-1040', courseId: 'nutricion-clinica-aplicada', amount: 179, date: '29 Sep 2026' },
      { id: 'SAL-1012', courseId: 'bioquimica-aplicada-a-la-nutricion', amount: 149, date: '02 Sep 2026' },
    ],
  },
  {
    id: 'st-03',
    name: 'Carla Mendoza',
    email: 'carla.mendoza@ejemplo.com',
    registeredAt: '15 Sep 2026',
    status: STUDENT_STATUS.active,
    purchases: [
      { id: 'SAL-1035', courseId: 'bioquimica-aplicada-a-la-nutricion', amount: 149, date: '24 Sep 2026' },
    ],
  },
  {
    id: 'st-04',
    name: 'Rosa Gutiérrez',
    email: 'rosa.gutierrez@ejemplo.com',
    registeredAt: '09 Sep 2026',
    status: STUDENT_STATUS.active,
    purchases: [
      { id: 'SAL-1030', courseId: 'nutricion-clinica-aplicada', amount: 179, date: '20 Sep 2026' },
    ],
  },
  {
    id: 'st-05',
    name: 'Juliana Paredes',
    email: 'juliana.paredes@ejemplo.com',
    registeredAt: '02 Sep 2026',
    status: STUDENT_STATUS.inactive,
    purchases: [
      { id: 'SAL-1021', courseId: 'metabolismo-de-carbohidratos', amount: 129, date: '12 Sep 2026' },
    ],
  },
  {
    id: 'st-06',
    name: 'Sofía Cárdenas',
    email: 'sofia.cardenas@ejemplo.com',
    registeredAt: '28 Ago 2026',
    status: STUDENT_STATUS.active,
    purchases: [
      { id: 'SAL-1015', courseId: 'fisiologia-digestiva', amount: 99, date: '05 Sep 2026' },
      { id: 'SAL-1008', courseId: 'bioquimica-aplicada-a-la-nutricion', amount: 149, date: '01 Sep 2026' },
    ],
  },
]

/* ---------- Ventas ---------- */

/*
  Los importes salen de courseId + la compra, no se escriben a mano: si cambia
  el precio de un curso, el historico mantiene lo que realmente se cobro.
*/
export const DEMO_ADMIN_SALES = [
  {
    id: 'SAL-1041',
    studentId: 'demo-student',
    courseId: 'metabolismo-de-carbohidratos',
    date: '30 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1040',
    studentId: 'st-02',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    date: '29 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1039',
    studentId: 'st-03',
    courseId: 'nutricion-clinica-aplicada',
    date: '28 Sep 2026',
    status: SALE_STATUS.pending,
  },
  {
    id: 'SAL-1038',
    studentId: 'st-04',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    date: '27 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1037',
    studentId: 'st-05',
    courseId: 'metabolismo-de-carbohidratos',
    date: '25 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1036',
    studentId: 'st-06',
    courseId: 'fisiologia-digestiva',
    date: '22 Sep 2026',
    status: SALE_STATUS.rejected,
  },
  {
    id: 'SAL-1035',
    studentId: 'st-02',
    courseId: 'nutricion-clinica-aplicada',
    date: '18 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1034',
    studentId: 'st-03',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    date: '14 Sep 2026',
    status: SALE_STATUS.refunded,
  },
  {
    id: 'SAL-1033',
    studentId: 'st-04',
    courseId: 'fisiologia-digestiva',
    date: '10 Sep 2026',
    status: SALE_STATUS.approved,
  },
  {
    id: 'SAL-1032',
    studentId: 'st-06',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    date: '04 Sep 2026',
    status: SALE_STATUS.approved,
  },
]

/* ---------- Evaluaciones ---------- */

/*
  Solo gestion: que evaluaciones existen y cuantas preguntas tienen. No se
  guardan respuestas ni resultados de estudiantes (eso es del Plan Integral).
*/
export const DEMO_ADMIN_EVALUATIONS = [
  {
    id: 'eval-01',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    name: 'Evaluación final · Módulo 6',
    questions: 8,
    status: 'Publicada',
  },
  {
    id: 'eval-02',
    courseId: 'bioquimica-aplicada-a-la-nutricion',
    name: 'Evaluación · Metabolismo intermediario',
    questions: 5,
    status: 'Publicada',
  },
  {
    id: 'eval-03',
    courseId: 'nutricion-clinica-aplicada',
    name: 'Evaluación final · Interpretación de casos',
    questions: 6,
    status: 'Borrador',
  },
  {
    id: 'eval-04',
    courseId: 'metabolismo-de-carbohidratos',
    name: 'Evaluación · Vías de la glucólisis',
    questions: 4,
    status: 'Publicada',
  },
]

/* ---------- Certificados emitidos ---------- */

export const DEMO_ADMIN_CERTIFICATES = [
  {
    id: 'cert-01',
    studentId: 'st-05',
    courseId: 'fisiologia-digestiva',
    issuedAt: '01 Sep 2026',
    status: 'Emitido',
  },
  {
    id: 'cert-02',
    studentId: 'st-06',
    courseId: 'fisiologia-digestiva',
    issuedAt: '01 Sep 2026',
    status: 'Emitido',
  },
  {
    id: 'cert-03',
    studentId: 'st-03',
    courseId: 'metabolismo-de-carbohidratos',
    issuedAt: '28 Ago 2026',
    status: 'Emitido',
  },
]

/* ---------- Configuracion de la plataforma ---------- */

export const DEMO_PLATFORM = {
  name: 'Yulia',
  slogan: 'Decide ConCiencia',
  email: 'admin@yulia.test',
  plan: ADMIN_PLAN.name,
}

/* ========================================================================
   HELPERS
   No logica de negocio: solo Vinculos entre los datos de arriba para que los
   componentes no crucen ids a mano. En el backend esto vanish: cada pantalla
   recibirá su propia respuesta ya armada.
   ======================================================================== */

export function getAdminCourse(courseId) {
  return DEMO_ADMIN_COURSES.find((course) => course.id === courseId) ?? null
}

/* El precio real de un curso, para las ventas historicas. */
export function getCoursePrice(courseId) {
  const adminCourse = getAdminCourse(courseId)
  if (adminCourse) return adminCourse.price

  const catalogCourse = DEMO_CATALOG.find((course) => course.id === courseId)
  return catalogCourse?.price ?? 0
}

export function getCurrency(courseId) {
  const adminCourse = getAdminCourse(courseId)
  if (adminCourse) return adminCourse.currency

  return DEMO_CATALOG.find((course) => course.id === courseId)?.currency ?? 'S/'
}

/* Formato de importe: "S/149". */
export function formatAmount(courseId, amount) {
  return `${getCurrency(courseId)}${amount}`
}

export function getStudent(studentId) {
  return DEMO_ADMIN_STUDENTS.find((student) => student.id === studentId) ?? null
}

export function getStudentName(studentId) {
  return getStudent(studentId)?.name ?? 'Estudiante'
}

export function getCourseTitle(courseId) {
  return getAdminCourse(courseId)?.title ?? 'Curso'
}

export function getStudentCourses(studentId) {
  return getStudent(studentId)?.purchases ?? []
}

/* Ventas de un estudiante, para su ficha. */
export function getStudentSales(studentId) {
  return DEMO_ADMIN_SALES.filter((sale) => sale.studentId === studentId)
}

/* Contador de courses por estado, para el listado. */
export function countCoursesByStatus(status) {
  return DEMO_ADMIN_COURSES.filter((course) => course.status === status).length
}

export function getEvaluationsForCourse(courseId) {
  return DEMO_ADMIN_EVALUATIONS.filter((evaluation) => evaluation.courseId === courseId)
}
