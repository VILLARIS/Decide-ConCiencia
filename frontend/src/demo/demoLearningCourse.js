/*
  Contenido del curso para el area de estudiante (modo demostracion).

  Es la fuente unica de lo que se ve al estudiar un curso: modulos, lecciones,
  resumen, material de apoyo y notas. La pagina CourseLearningPage no escribe
  ningun contenido a mano, solo lo lee de aqui.

  MODELO
  ------
  course
    id, titulo, descripcion, duracion, nivel, modalidad, instructor
    modules[]      -> modulos, en orden de estudio
      id, title, summary, lessons[]
        id, title, duration, type, status, videoUrl, poster
        summary    -> parrafos del resumen de la leccion
        materials[]-> material de apoyo de ESA leccion (no del curso)
        notes      -> nota inicial de la alumna (vacia en su mayoria)

  ESTADOS DE LECCION
  - 'completada'  ->checkmark verde en el temario.
  - 'en_progreso' -> se esta estudiando ahora.
  - 'no_iniciada' -> todavia no se abre.

  El progreso NO se guarda: se deriva de los estados de este archivo. En
  produccion, el progreso real vendra del backend junto al video y los
  materiales; aqui los datos son ficticios y fijos.
*/

export const LESSON_STATUS = {
  completed: 'completada',
  inProgress: 'en_progreso',
  notStarted: 'no_iniciada',
}

export const DEMO_LEARNING_COURSE = {
  id: 'bioquimica-aplicada-a-la-nutricion',
  title: 'Bioquímica aplicada a la Nutrición',
  description:
    'Une la bioquímica con la práctica clínica: cómo leer un análisis y convertirlo en una decisión nutricional razonada.',
  duration: '8 semanas · 40 horas',
  level: 'Intermedio',
  modality: 'Modalidad en línea',
  instructor: 'Dra. Yulia',
  tone: 'sky',

  /* Materiales del curso (columna derecha). Solo los 3 primeros se muestran. */
  courseMaterials: [
    {
      id: 'mat-guia',
      title: 'Guía de estudio del curso',
      meta: 'PDF · 24 páginas',
    },
    {
      id: 'mat-glosario',
      title: 'Glosario de metabolismo',
      meta: 'PDF · 8 páginas',
    },
    {
      id: 'mat-plantilla',
      title: 'Plantilla de casos clínicos',
      meta: 'Hoja de cálculo · 6 hojas',
    },
  ],

  modules: [
    {
      id: 'mod-1',
      title: 'Fundamentos de bioquímica',
      summary:
        'Estructura de las biomoléculas y cómo se relacionan con la nutrición.',
      lessons: [
        {
          id: 'lec-1-1',
          title: 'Introducción al curso',
          duration: '12 min',
          type: 'video',
          status: LESSON_STATUS.completed,
          videoUrl: '',
          summary: [
            'Qué vas a aprender en las ocho semanas del curso y cómo está organizado el temario.',
            'Por qué la bioquímica es la base de cualquier decisión clínica en nutrición.',
            'Cómo usar el material de apoyo de cada lección y el glosario del curso.',
          ],
          materials: [
            {
              id: 'mat-1-1',
              title: 'Programa completo del curso',
              meta: 'PDF · 4 páginas',
            },
          ],
          notes: '',
        },
        {
          id: 'lec-1-2',
          title: 'Biomoléculas y función',
          duration: '24 min',
          type: 'video',
          status: LESSON_STATUS.completed,
          videoUrl: '',
          summary: [
            'Carbohidratos, lípidos, proteínas y ácidos nucleicos: qué son y qué función cumplen.',
            'La relación entre cada biomolécula y los alimentos de la dieta habitual.',
            'Estructura de las enzimas: por qué el calor las desnaturaliza y el frío no.',
          ],
          materials: [
            {
              id: 'mat-1-2',
              title: 'Tabla de biomoléculas y alimentos',
              meta: 'PDF · 2 páginas',
            },
            {
              id: 'mat-1-3',
              title: 'Clase grabada (audio)',
              meta: 'Audio · 24 min',
            },
          ],
          notes: 'Repasar la tabla de enzimas antes de la evaluación del módulo 1.',
        },
        {
          id: 'lec-1-3',
          title: 'Cómo se lee un valor de laboratorio',
          duration: '18 min',
          type: 'lectura',
          status: LESSON_STATUS.completed,
          videoUrl: '',
          summary: [
            'Qué significa un resultado fuera de rango y por qué no siempre indica enfermedad.',
            'Valores de referencia y qué hacer con la analítica del paciente.',
          ],
          materials: [],
          notes: '',
        },
      ],
    },
    {
      id: 'mod-2',
      title: 'Metabolismo de carbohidratos',
      summary: 'Glucólisis, glucogenólisis y el papel del insulina en el metabolismo.',
      lessons: [
        {
          id: 'lec-2-1',
          title: 'Glucólisis paso a paso',
          duration: '26 min',
          type: 'video',
          status: LESSON_STATUS.completed,
          videoUrl: '',
          summary: [
            'Las diez reacciones de la glucólisis y dónde se produce el ATP.',
            'Papel de las enzimas limitantes y qué ocurre cuando falta oxígeno.',
            'Aplicación clínica: interpretación de una curva de glucosa.',
          ],
          materials: [
            {
              id: 'mat-2-1',
              title: 'Esquema de la glucólisis',
              meta: 'PDF · 1 página',
            },
          ],
          notes: '',
        },
        {
          id: 'lec-2-2',
          title: 'Insulina y glucagon',
          duration: '22 min',
          type: 'video',
          status: LESSON_STATUS.inProgress,
          videoUrl: '',
          summary: [
            'Insulina y glucagon: dos señales opuestas sobre el mismo metabolismo.',
            'Qué le pide el cuerpo al hígado y al músculo en ayunas y en el estado alimentado.',
            'Resistencia insulínica: earliest signs que se ven en la consulta.',
          ],
          materials: [
            {
              id: 'mat-2-2',
              title: 'Mapa hormonal del metabolismo',
              meta: 'PDF · 2 páginas',
            },
            {
              id: 'mat-2-3',
              title: 'Casos de resistencia insulínica',
              meta: 'PDF · 5 páginas',
            },
          ],
          notes: 'Anotar el esquema de regulación hormonal: sirve para el módulo 4.',
        },
        {
          id: 'lec-2-3',
          title: 'Evaluación del módulo 2',
          duration: '15 min',
          type: 'evaluacion',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'Diez preguntas tipo test sobre glucólisis y regulación hormonal.',
            'Dispones de dos intentos y el resultado se muestra al terminar.',
          ],
          materials: [],
          notes: '',
        },
        {
          id: 'lec-2-4',
          title: 'Casos clínicos del módulo',
          duration: '28 min',
          type: 'video',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'Tres casos reales de consulta con distinta tolerancia a la glucosa.',
            'Qué preguntar en la anamnesis y qué análisis de laboratorio pedir.',
          ],
          materials: [],
          notes: '',
        },
      ],
    },
    {
      id: 'mod-3',
      title: 'Metabolismo de lípidos y proteínas',
      summary: 'Lipoproteínas, oxidación de ácidos grasos y equilibrio proteico.',
      lessons: [
        {
          id: 'lec-3-1',
          title: 'Lipoproteínas y transporte',
          duration: '20 min',
          type: 'video',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'VLDL, LDL y HDL: qué transportan y por qué se miden en el análisis.',
            'Colesterol y triglicéridos: lectura conjunta de ambos valores.',
          ],
          materials: [],
          notes: '',
        },
        {
          id: 'lec-3-2',
          title: 'Oxidación de ácidos grasos',
          duration: '24 min',
          type: 'video',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'La beta-oxidación, el ciclo de Krebs y la producción de energía por minuto.',
            'Cetonosis: cuándo aparece y qué significa desde el punto de vista nutricional.',
          ],
          materials: [
            {
              id: 'mat-3-2',
              title: 'Ruta de oxidación de lípidos',
              meta: 'PDF · 2 páginas',
            },
          ],
          notes: '',
        },
        {
          id: 'lec-3-3',
          title: 'Equilibrio proteico',
          duration: '19 min',
          type: 'lectura',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'Aminoácidos esenciales y turnos proteicos (anabolismo y catabolismo).',
            'Cómo estimar la necesidad proteica según el objetivo del paciente.',
          ],
          materials: [],
          notes: '',
        },
      ],
    },
    {
      id: 'mod-4',
      title: 'Integración clínica',
      summary: 'Cómo se conecta todo el metabolismo en la consulta del día a día.',
      lessons: [
        {
          id: 'lec-4-1',
          title: 'Lectura integrada de un caso',
          duration: '30 min',
          type: 'video',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'Un caso completo: analítica, interpretación y propuesta nutricional razonada.',
            'Cómo justificar una recomendación con la bioquímica y no con la costumbre.',
          ],
          materials: [],
          notes: '',
        },
        {
          id: 'lec-4-2',
          title: 'Material de cierre y paso a paso',
          duration: '16 min',
          type: 'lectura',
          status: LESSON_STATUS.notStarted,
          videoUrl: '',
          summary: [
            'Checklist final para llevar a tu consulta y guía de repaso de los cuatro módulos.',
            'Qué sigue después del curso: lecturas, cursos y seguimiento del plan.',
          ],
          materials: [],
          notes: '',
        },
      ],
    },
  ],
}

/* ---------- Consultas sobre el contenido ---------- */

/*
  El id de este curso es el MISMO id/slug del catalogo (demoCatalog.js), que es
  el que se guarda en la compra y en la inscripcion. Ahi no hay una segunda
  referencia: un curso es una sola cosa con un solo identificador.
*/
export function getLearningCourse(courseId) {
  if (DEMO_LEARNING_COURSE.id !== courseId) return null
  return DEMO_LEARNING_COURSE
}

/* Lista plana de lecciones en orden de estudio, cada una con su modulo. */
export function getCourseLessons(course) {
  if (!course) return []

  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
    })),
  )
}

export function findLesson(course, lessonId) {
  return getCourseLessons(course).find((lesson) => lesson.id === lessonId) ?? null
}

/* Vecindad: la leccion anterior y la siguiente del recorrido completo. */
export function getLessonNeighbours(course, lessonId) {
  const lessons = getCourseLessons(course)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)

  if (index === -1) return { previous: null, next: null, index: -1 }

  return {
    previous: index > 0 ? lessons[index - 1] : null,
    next: index < lessons.length - 1 ? lessons[index + 1] : null,
    index,
  }
}

/*
  La leccion que se abre al entrar: la primera sin terminar, o la primera si
  todo esta completo. Asi el alumno cae siempre donde tiene que continuar.
*/
export function getResumeLesson(course) {
  const lessons = getCourseLessons(course)
  if (lessons.length === 0) return null

  return lessons.find((lesson) => lesson.status !== LESSON_STATUS.completed) ?? lessons[0]
}

/* Progreso en porcentaje, derivado de los estados de las lecciones. */
export function getCourseProgress(course) {
  const lessons = getCourseLessons(course)
  if (lessons.length === 0) return 0

  const completed = lessons.filter((lesson) => lesson.status === LESSON_STATUS.completed)
  return Math.round((completed.length / lessons.length) * 100)
}

/* Recuento de módulos terminados. */
export function getCompletedModulesCount(course) {
  if (!course) return 0

  return course.modules.filter((module) =>
    module.lessons.every((lesson) => lesson.status === LESSON_STATUS.completed),
  ).length
}