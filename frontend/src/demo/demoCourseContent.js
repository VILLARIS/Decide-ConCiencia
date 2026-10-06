/*
  Contenido de los cursos: modulos y lecciones (modo demostracion).

  MODELO
  ------
  El contenido cuelga del curso, pero vive aqui separado de DEMO_ADMIN_COURSES
  porque son datos de otra naturaleza: la ficha del curso es lo que se ve en la
  web, el contenido es lo que se edita. El proveedor (DemoCourseContentProvider)
  los une por courseId, igual que hara la API cuando exista.

    course
      modules[]                 -> courseContent.js: DEMO_COURSE_CONTENT
        id
        title
        order
        lessons[]
          id
          title
          type                    video | text | file | evaluation
          status                  draft | published
          order
          videoUrl                (video)
          duration                (video, opcional)
          videoProvider           (video, proveedor previsto)
          textContent             (text, markdown sencillo)
          file                    (file, metadata: name, size, ext)
          evaluation              (evaluation, name + questions[])

  El campo `order` es el espejo de la posicion en el array. Los componentes
  ordenan moviendo elementos del array y el proveedor vuelve a calcular `order`
  al guardar, para que el backend reciba un orden explicito y no dependa de uno
  implicito.

  MODO DEMO
  ---------
  Sin backend. El contenido se guarda en memoria: sobrevive mientras no se
  recargue la pagina. Dos limites que el propio modelo deja explicitos y que la
  interfaz dice al usuario, porque fingir lo contrario seria mentir:

  - VIDEO: solo se guarda la URL y los datos del proveedor. No hay subida a
    hosting. La estructura ya tiene `videoProvider` para que integrar Vimeo,
    Bunny Stream o Cloudflare Stream sea cambiar un valor, no rehacer el modelo.
  - ARCHIVO: solo se guardan nombre, tamano y extension. El binario no se sube
    a ningun sitio. Por eso el campo se llama `file` y no `fileUrl`.

  Con backend, estas dos piezas pasan a ser la respuesta de la API y este
  archivo desaparece: el modelo ya tiene los mismos campos.
*/

/* ---------- Tipos de leccion ---------- */

/*
  Cuatro tipos, y solo cuatro. El tipo decide que campos se piden al crear o
  editar una leccion; cambiarlo despues vacia lo que no aplique, asi que la
  interfaz avisa cuando se hace.
*/
export const LESSON_TYPES = {
  video: 'video',
  text: 'text',
  file: 'file',
  evaluation: 'evaluation',
}

/* Orden en el que se muestran: el habitual primero, el excepcional al final. */
export const LESSON_TYPE_ORDER = [
  LESSON_TYPES.video,
  LESSON_TYPES.text,
  LESSON_TYPES.file,
  LESSON_TYPES.evaluation,
]

export const LESSON_TYPE_LABELS = {
  [LESSON_TYPES.video]: 'Video',
  [LESSON_TYPES.text]: 'Texto',
  [LESSON_TYPES.file]: 'PDF / material',
  [LESSON_TYPES.evaluation]: 'Evaluación',
}

/*
  Texto corto para la fila compacta de la lista. Es distinto del label a
  proposito: la columna estrecha necesita "Video", el formulario necesita
  "PDF / material descargable".
*/
export const LESSON_TYPE_SHORT_LABELS = {
  [LESSON_TYPES.video]: 'Video',
  [LESSON_TYPES.text]: 'Texto',
  [LESSON_TYPES.file]: 'PDF',
  [LESSON_TYPES.evaluation]: 'Evaluación',
}

/* ---------- Estado de la leccion ---------- */

/*
  Una leccion se puede preparar y publicar mas tarde, igual que un curso. Sin
  esto habria que publicar el curso entero para poder corregir una leccion.
*/
export const LESSON_STATUS = {
  draft: 'draft',
  published: 'published',
}

export const LESSON_STATUS_LABELS = {
  [LESSON_STATUS.draft]: 'Borrador',
  [LESSON_STATUS.published]: 'Publicada',
}

/* ---------- Proveedores de video previstos ---------- */

/*
  Ninguno esta integrado. Se listan para dejar la integracion preparada: cuando
  haya backend, elegir uno cambia el flujo de "pegar una URL" a "subir un
  archivo" sin tocar el modelo ni el editor.
*/
export const VIDEO_PROVIDERS = [
  { id: 'vimeo', label: 'Vimeo' },
  { id: 'bunny', label: 'Bunny Stream' },
  { id: 'cloudflare', label: 'Cloudflare Stream' },
]

/* ---------- Extensiones de material descargable ---------- */

/*
  PDF primero porque es lo que mas se usa; el resto se acepta porque en la
  practica llegan apuntes en Word o presentaciones. El filtro es del input
  file, no una validacion de seguridad: el backend tendra que validar de verdad.
*/
export const DOWNLOADABLE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx']

/* ========================================================================
   FACTORIES
   Cada una nace con todos los campos de su tipo y valores por defecto, para
   que el editor nunca trabaje con undefined. Asi se evita el clásico
   `lesson.videoUrl &&` por todas partes.
   ======================================================================== */

/* Contador de modulo: los ids son legibles y se pueden citar en un comentario. */
let contentSequence = 0

function nextId(prefix) {
  contentSequence += 1
  return `${prefix}-${contentSequence.toString(36)}`
}

/*
  Id de contenido para una entidad que todavia no existe en el listado, por
  ejemplo un curso que se esta creando. Se exporta porque el editor lo necesita:
  sin el, dos cursos nuevos seguidos compartirian temario.
*/
export function createContentId(prefix = 'id') {
  return nextId(prefix)
}

/* ---------- Preguntas de evaluacion ---------- */

export function createQuestion({ text = '', options = [], correctOptionId = null } = {}) {
  /* Dos opciones por defecto: es el minimo de una opcion multiple con sentido. */
  const initialOptions = options.length > 0 ? options : [createQuestionOption(), createQuestionOption()]

  return {
    id: nextId('qst'),
    text,
    options: initialOptions,
    correctOptionId: correctOptionId ?? initialOptions[0]?.id ?? null,
  }
}

export function createQuestionOption({ text = '' } = {}) {
  return { id: nextId('opt'), text }
}

/* ---------- Evaluacion ---------- */

export function createEvaluation({ name = '', questions = [] } = {}) {
  return {
    name,
    questions,
    /* Sin analitica: no hay porcentaje de acierto ni historial. Eso es del
       Plan Integral y no tiene cabida en el modelo de contenido. */
  }
}

/* ---------- Archivo (solo metadata) ---------- */

export function createFileMeta({ name = '', size = 0, ext = '' } = {}) {
  return {
    name,
    size,
    ext,
    /* Marca explicita: este archivo no esta subido a ningun servidor. */
    storage: 'demo-metadata-only',
  }
}

/* ---------- Lecciones ---------- */

export function createLesson({ title = '', type = LESSON_TYPES.video, ...rest } = {}) {
  /* Base comun a todos los tipos. Los valores por defecto van primero y el resto
     del objeto encima: asi createLesson({ title, videoUrl }) respeta el videoUrl
     en vez de descartarlo en silencio, que es como se perdia contenido al
     construir el contenido de la demo. normalizeLesson se encarga despues de
     vaciar lo que no corresponde al tipo. */
  const lesson = {
    id: nextId('les'),
    title,
    type,
    status: LESSON_STATUS.draft,
    order: 0,
    /* Campos especificos del tipo. Empiezan vacios y solo se rellenan si
       corresponden; el editor no los muestra. */
    videoUrl: '',
    duration: '',
    videoProvider: '',
    textContent: '',
    file: null,
    evaluation: createEvaluation(),
    ...rest,
  }

  return normalizeLesson(lesson, type)
}

/*
  Deja una leccion con la forma de su tipo: si es de video, el campo de texto
  va vacio, y al reves. Cambiar de tipo no debe arrastrar contenido que ya no
  aplica, ni romper el editor al leer campos que no existen.
*/
export function normalizeLesson(lesson, type = lesson.type) {
  const base = {
    ...lesson,
    type,
    videoUrl: type === LESSON_TYPES.video ? (lesson.videoUrl ?? '') : '',
    duration: type === LESSON_TYPES.video ? (lesson.duration ?? '') : '',
    videoProvider: type === LESSON_TYPES.video ? (lesson.videoProvider ?? '') : '',
    textContent: type === LESSON_TYPES.text ? (lesson.textContent ?? '') : '',
    file: type === LESSON_TYPES.file ? (lesson.file ?? null) : null,
    evaluation:
      type === LESSON_TYPES.evaluation
        ? (lesson.evaluation ?? createEvaluation())
        : createEvaluation(),
  }

  return base
}

/* ---------- Modulos ---------- */

export function createModule({ title = '', lessons = [] } = {}) {
  return {
    id: nextId('mod'),
    title,
    order: 0,
    /* El map envuelve a normalizeLesson en una flecha a proposito: pasando la
       funcion directamente, el indice de posicion entraria como `type` y las
       lecciones perderian su contenido al crear el modulo. */
    lessons: lessons.map((lesson) => normalizeLesson(lesson)),
  }
}

/* ========================================================================
   HELPERS PUROS
   Sin estado: reciben datos y devuelven datos. Asi se pueden comprobar sin
   montar React.
   ======================================================================== */

/* Recalcula `order` de modulos y lecciones segun su posicion real. */
export function normalizeContent(modules = []) {
  return modules.map((module, moduleIndex) => ({
    ...module,
    order: moduleIndex,
    lessons: (module.lessons ?? []).map((lesson, lessonIndex) => ({
      ...lesson,
      order: lessonIndex,
    })),
  }))
}

/* Un curso sin contenido es un curso recien creado, no un error. */
export function emptyContent() {
  return []
}

export function countLessons(modules = []) {
  return modules.reduce((total, module) => total + module.lessons.length, 0)
}

export function countPublishedLessons(modules = []) {
  return modules.reduce(
    (total, module) =>
      total + module.lessons.filter((lesson) => lesson.status === LESSON_STATUS.published).length,
    0,
  )
}

/*
  Mueve un elemento dentro de un array. Devuelve un array nuevo; si el destino
  queda fuera de rango devuelve el original, para que los botones de subir y
  bajar en los extremos no rompan nada.
*/
export function moveItem(items, fromIndex, direction) {
  const toIndex = fromIndex + direction

  if (fromIndex < 0 || fromIndex >= items.length) return items
  if (toIndex < 0 || toIndex >= items.length) return items

  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)

  return next
}

export function canMove(index, length, direction) {
  const target = index + direction
  return index >= 0 && index < length && target >= 0 && target < length
}

/*
  Texto de apoyo de cada tipo en la lista compacta. Es la unica funcion que
  necesita conocer los cuatro formatos: el resto de la interfaz pregunta al
  modelo, no a los componentes.
*/
export function getLessonSummary(lesson) {
  switch (lesson.type) {
    case LESSON_TYPES.video:
      /* Sin duracion, se dice que es opcional. */
      return lesson.duration || 'Video enlazado por URL'

    case LESSON_TYPES.text:
      return 'Lectura'

    case LESSON_TYPES.file:
      return lesson.file?.name || 'Sin archivo'

    case LESSON_TYPES.evaluation:
      return `${lesson.evaluation?.questions?.length ?? 0} ${
        lesson.evaluation?.questions?.length === 1 ? 'pregunta' : 'preguntas'
      }`

    default:
      return ''
  }
}

/* Un nombre de leccion sin titulo ocupa su sitio con un texto util. */
export function getLessonTitle(lesson) {
  return lesson.title?.trim() || 'Lección sin título'
}

/* ---------- Tamano de archivo ---------- */

export function formatFileSize(bytes) {
  const size = Number(bytes)

  if (!Number.isFinite(size) || size <= 0) return '—'

  /* Solo tres unidades: mas precision no ayuda a decidir nada. */
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileExtension(name) {
  const parts = String(name ?? '').split('.')

  return parts.length > 1 ? `.${parts.pop().toLowerCase()}` : ''
}

/* ---------- Validacion por tipo ---------- */

/*
  Cada tipo pide lo suyo y nada mas. Devuelve un string vacio cuando todo esta
  bien, para poder hacer `if (error)`.
*/
export function validateLesson(lesson) {
  if (!lesson.title?.trim()) return 'Escribe el título de la lección.'

  switch (lesson.type) {
    case LESSON_TYPES.video: {
      if (!lesson.videoUrl?.trim()) return 'Añade la URL del video.'

      const isWebUrl = /^https?:\/\/\S+$/i.test(lesson.videoUrl.trim())
      if (!isWebUrl) return 'La URL del video debe empezar por http:// o https://'

      if (lesson.duration?.trim() && !isValidDuration(lesson.duration.trim())) {
        return 'La duración debe ser un tiempo como 12:40 o 1:02:03.'
      }

      return ''
    }

    case LESSON_TYPES.text: {
      if (!lesson.textContent?.trim()) return 'Escribe el contenido de la lectura.'
      return ''
    }

    case LESSON_TYPES.file: {
      if (!lesson.file?.name) return 'Selecciona un archivo.'
      return ''
    }

    case LESSON_TYPES.evaluation: {
      if (!lesson.evaluation?.name?.trim()) return 'Escribe el nombre de la evaluación.'

      const questions = lesson.evaluation?.questions ?? []
      if (questions.length === 0) return 'Añade al menos una pregunta.'

      for (const question of questions) {
        if (!question.text.trim()) return 'Todas las preguntas necesitan su texto.'

        const withText = question.options.filter((option) => option.text.trim())
        if (withText.length < 2) return 'Cada pregunta necesita al menos dos opciones.'

        /* La respuesta correcta tiene que ser una opcion que exista, no un
           indice viejo: si se borro una opcion, el indice apuntaria a otra. */
        if (!question.options.some((option) => option.id === question.correctOptionId)) {
          return 'Marca la respuesta correcta de cada pregunta.'
        }
      }

      return ''
    }

    default:
      return ''
  }
}

/* 12, 12:40 o 1:02:03. Sin horas sueltas con decimales. */
export function isValidDuration(value) {
  return /^\d{1,2}(:\d{2}){0,2}$/.test(String(value ?? '').trim())
}

/* ========================================================================
   CONTENIDO INICIAL DE LA DEMO
   Tres cursos con contenido real y uno sin nada, para que el editor se vea
   con volumen y el estado vacio tambien se vea.
   ======================================================================== */

export const DEMO_COURSE_CONTENT = {
  /* ---- Bioquimica: los cuatro tipos, para comprobar la lista compacta ---- */
  'bioquimica-aplicada-a-la-nutricion': [
    {
      id: 'mod-bioq-1',
      title: 'Fundamentos del metabolismo',
      order: 0,
      lessons: [
        {
          id: 'les-bioq-1-1',
          title: 'Presentación del curso',
          type: LESSON_TYPES.video,
          status: LESSON_STATUS.published,
          order: 0,
          videoUrl: 'https://vimeo.com/000000000',
          duration: '12:40',
          videoProvider: 'vimeo',
          textContent: '',
          file: null,
          evaluation: createEvaluation(),
        },
        {
          id: 'les-bioq-1-2',
          title: 'Cómo leer un esquema metabólico',
          type: LESSON_TYPES.text,
          status: LESSON_STATUS.published,
          order: 1,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: [
            '## Antes de empezar',
            'Un esquema metabólico no es un dibujo: es un mapa de candidatos. Esta leccion explica como recorrerlo.',
            '',
            '## Los tres pasos',
            '- **Identifica el sustrato**: de donde parte la reaccion.',
            '- **Sigue la flecha**: cada flecha es una enzima, no un concepto.',
            '- **Comprueba el balance**: lo que entra tiene que salir de otro lado.',
            '',
            '## Un aviso',
            'Si unavia esta leccion y no entiendes las flechas, conviene volver al modulo de bioquimica basica. No es un problema de esfuerzo, es de orden de estudio.',
            '',
            'Mas informacion en la [guia de macronutrientes](../recursos/guia).',
          ].join('\n'),
          file: null,
          evaluation: createEvaluation(),
        },
        {
          id: 'les-bioq-1-3',
          title: 'Guía de macronutrientes',
          type: LESSON_TYPES.file,
          status: LESSON_STATUS.published,
          order: 2,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: '',
          file: createFileMeta({
            name: 'guia-macronutrientes.pdf',
            size: 486_233,
            ext: '.pdf',
          }),
          evaluation: createEvaluation(),
        },
      ],
    },
    {
      id: 'mod-bioq-2',
      title: 'Enzimas y regulacion',
      order: 1,
      lessons: [
        {
          id: 'les-bioq-2-1',
          title: 'Cinética enzimática en veinte minutos',
          type: LESSON_TYPES.video,
          status: LESSON_STATUS.draft,
          order: 0,
          videoUrl: 'https://example.com/video/cineticas',
          duration: '18:05',
          videoProvider: 'bunny',
          textContent: '',
          file: null,
          evaluation: createEvaluation(),
        },
        {
          id: 'les-bioq-2-2',
          title: 'Evaluación · Enzimas y regulación',
          type: LESSON_TYPES.evaluation,
          status: LESSON_STATUS.draft,
          order: 1,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: '',
          file: null,
          evaluation: {
            name: 'Evaluación · Enzimas y regulación',
            questions: [
              {
                id: 'qst-bioq-1',
                text: '¿Qué representa Km en la cinética enzimática?',
                options: [
                  { id: 'opt-bioq-1', text: 'La concentración de sustrato a la mitad de la velocidad máxima' },
                  { id: 'opt-bioq-2', text: 'La velocidad máxima de la reacción' },
                  { id: 'opt-bioq-3', text: 'La energía de activación del complejo enzima-sustrato' },
                ],
                correctOptionId: 'opt-bioq-1',
              },
              {
                id: 'qst-bioq-2',
                text: '¿Qué efecto tiene un inhibidor no competitivo?',
                options: [
                  { id: 'opt-bioq-4', text: 'Aumenta la Km sin cambiar la Vmax' },
                  { id: 'opt-bioq-5', text: 'Aumenta la Vmax sin cambiar la Km' },
                  { id: 'opt-bioq-6', text: 'Reduce la Vmax sin cambiar la Km' },
                ],
                correctOptionId: 'opt-bioq-6',
              },
            ],
          },
        },
      ],
    },
  ],

  /* ---- Nutricion clinica: el modulo mas absurdo de la demo ---- */
  'nutricion-clinica-aplicada': [
    {
      id: 'mod-nutri-1',
      title: 'Valoracion clinica',
      order: 0,
      lessons: [
        {
          id: 'les-nutri-1-1',
          title: 'Valoración nutricional inicial',
          type: LESSON_TYPES.video,
          status: LESSON_STATUS.published,
          order: 0,
          videoUrl: 'https://example.com/video/valoracion',
          duration: '24:00',
          videoProvider: 'cloudflare',
          textContent: '',
          file: null,
          evaluation: createEvaluation(),
        },
        {
          id: 'les-nutri-1-2',
          title: 'Evaluación final · Interpretación de casos',
          type: LESSON_TYPES.evaluation,
          status: LESSON_STATUS.draft,
          order: 1,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: '',
          file: null,
          evaluation: {
            name: 'Evaluación final · Interpretación de casos',
            questions: [
              {
                id: 'qst-nutri-1',
                text: 'Ante un paciente con albúmina baja, la primera pregunta es:',
                options: [
                  { id: 'opt-nutri-1', text: '¿Está ingiriendo suficiente proteína?' },
                  { id: 'opt-nutri-2', text: '¿Tiene inflammation aguda o crónica?' },
                  { id: 'opt-nutri-3', text: '¿Cuánto ejercicio hace?' },
                ],
                correctOptionId: 'opt-nutri-2',
              },
            ],
          },
        },
      ],
    },
  ],

  /* ---- Metabolismo: solo lectura y un material ---- */
  'metabolismo-de-carbohidratos': [
    {
      id: 'mod-metab-1',
      title: 'Vias de la glucolisis',
      order: 0,
      lessons: [
        {
          id: 'les-metab-1-1',
          title: 'Las diez reacciones de la glucólisis',
          type: LESSON_TYPES.text,
          status: LESSON_STATUS.published,
          order: 0,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: [
            '## Idea central',
            'La glucólisis convierte una glucosa en dos piruvatos, con una ganancia neta de **dos ATP**.',
            '',
            '## Lo que hay que saber',
            '- La **hexokinasa** consume ATP: es el primer cuello de botella.',
            '- La **piruvato quinasa** tambien consume ATP y es irreversible.',
            '- Las dos irreversibles son las que se regulan.',
            '',
            '## Diagrama',
            'El diagrama completo esta en el material descargable de esta leccion.',
          ].join('\n'),
          file: null,
          evaluation: createEvaluation(),
        },
        {
          id: 'les-metab-1-2',
          title: 'Diagrama de la glucólisis',
          type: LESSON_TYPES.file,
          status: LESSON_STATUS.published,
          order: 1,
          videoUrl: '',
          duration: '',
          videoProvider: '',
          textContent: '',
          file: createFileMeta({
            name: 'diagrama-glucolisis.pdf',
            size: 921_744,
            ext: '.pdf',
          }),
          evaluation: createEvaluation(),
        },
      ],
    },
  ],

  /* fisiologia-digestiva no aparece: a proposito, para ver el estado vacio. */
}
