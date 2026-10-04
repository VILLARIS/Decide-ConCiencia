/*
  Catalogo de cursos con precios (modo demostracion).

  Es la unica fuente de verdad para "que curso compro, por cuanto y con que
  datos de presentacion". La usan el detalle de curso, el checkout y el area
  de estudiante.

  PRECIOS
  -------
  - previousPrice: precio anterior cuando hay descuento. Si es igual a price,
    no se muestra tachado.
  - El descuento nunca se calcula en la interfaz: viaja ya resuelto desde el
    backend (en produccion, catalogo real + reglas de precio del servidor).
*/

export const DEMO_CATALOG = [
  {
    id: 'bioquimica-aplicada-a-la-nutricion',
    slug: 'bioquimica-aplicada-a-la-nutricion',
    title: 'Bioquímica aplicada a la Nutrición',
    category: 'Fundamentos',
    level: 'Intermedio',
    duration: '8 semanas · 40 horas',
    modality: 'Modalidad en línea',
    certificate: 'Certificado de finalización',
    access: 'Acceso por 12 meses',
    currency: 'S/',
    price: 149,
    previousPrice: 199,
    discountLabel: '25% de descuento',
    tone: 'sky',
    /* Solo uno es el curso con ficha publica completa en esta demo. */
    purchasable: true,
    /* Los demas tienen precio para poder comprar cualquier id, pero su ficha
       (/cursos/:slug) todavia no existe: el detalle es del curso destacado. */
    hasDetailPage: true,
  },
  {
    id: 'metabolismo-de-carbohidratos',
    slug: 'metabolismo-de-carbohidratos',
    title: 'Metabolismo de carbohidratos',
    category: 'Fundamentos',
    level: 'Intermedio',
    duration: '6 semanas · 25 horas',
    modality: 'Modalidad en línea',
    certificate: 'Certificado de finalización',
    access: 'Acceso por 12 meses',
    currency: 'S/',
    price: 129,
    previousPrice: 129,
    discountLabel: '',
    tone: 'sage',
    purchasable: true,
    hasDetailPage: false,
  },
  {
    id: 'nutricion-clinica-aplicada',
    slug: 'nutricion-clinica-aplicada',
    title: 'Nutrición clínica aplicada',
    category: 'Clínica',
    level: 'Avanzado',
    duration: '10 semanas · 35 horas',
    modality: 'Modalidad en línea',
    certificate: 'Certificado de finalización',
    access: 'Acceso por 12 meses',
    currency: 'S/',
    price: 179,
    previousPrice: 229,
    discountLabel: '22% de descuento',
    tone: 'sky',
    purchasable: true,
    hasDetailPage: false,
  },
  {
    id: 'fisiologia-digestiva',
    slug: 'fisiologia-digestiva',
    title: 'Fisiología digestiva',
    category: 'Fundamentos',
    level: 'Inicial',
    duration: '5 semanas · 18 horas',
    modality: 'Modalidad en línea',
    certificate: 'Certificado de finalización',
    access: 'Acceso por 12 meses',
    currency: 'S/',
    price: 99,
    previousPrice: 99,
    discountLabel: '',
    tone: 'mist',
    purchasable: true,
    hasDetailPage: false,
  },
]

export function getCourseById(courseId) {
  return DEMO_CATALOG.find((course) => course.id === courseId) ?? null
}

/*
  Normaliza el identificador de un curso.

  En el catalogo id y slug son el mismo texto, pero la URL puede llegar con
  cualquiera de los dos (por ejemplo /cursos/bioquimica-aplicada-a-la-nutricion).
  Esta funcion devuelve SIEMPRE el id canonico del catalogo, que es el que se
  guarda en la compra y en la inscripcion. Asi purchase.courseId, enrollment.
  courseId y el :courseId de la ruta son comparables con === y hasEnrollment()
  no falla por una diferencia de formato.
*/
export function normalizeCourseId(value) {
  if (typeof value !== 'string' || value.length === 0) return ''

  const course = DEMO_CATALOG.find((item) => item.id === value || item.slug === value)
  return course ? course.id : value
}

/* Precio final: el que se cobra hoy. */
export function getFinalPrice(course) {
  return course.price
}

/* Descuento absoluto en la moneda del curso (0 si no hay). */
export function getDiscountAmount(course) {
  return Math.max(0, course.previousPrice - course.price)
}

export function hasDiscount(course) {
  return getDiscountAmount(course) > 0
}

/* Formato de importe: "S/149", sin espacio, igual que la ficha del curso. */
export function formatPrice(course, amount) {
  return `${course.currency}${amount}`
}

/* Texto del boton de pago: "Pagar S/149". */
export function formatPayLabel(course) {
  return `Pagar ${course.currency}${getFinalPrice(course)}`
}