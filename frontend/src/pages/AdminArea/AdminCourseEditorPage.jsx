import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Check, ExternalLink, FileCheck2, Plus, X } from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminEmptyState,
  AdminPageHeader,
  AdminSection,
  AdminTabPanel,
  AdminTabs,
  CourseCover,
} from './AdminParts'
import AdminCurriculum from './AdminCurriculum'
import AdminLessonDrawer from './AdminLessonDrawer'
import AdminLessonPreview from './AdminLessonPreview'
import { useOverlayDismiss } from './useOverlayDismiss'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import { COURSE_STATUS, getAdminCourse } from '../../demo/demoAdminData'
import { LESSON_TYPES, createContentId } from '../../demo/demoCourseContent'
import {
  appendLesson,
  appendModule,
  replaceLesson,
  useDemoCourseContent,
} from '../../demo/demoCourseContentStore'
import './AdminArea.css'

/*
  Editor de curso (Plan Profesional).

  Cuatro pestañas, y cada una responde a una pregunta distinta:

  - INFORMACION: de que es el curso. Ficha, precio y portada.
  - CONTENIDO: que tiene. Modulos y lecciones, en AdminCurriculum.
  - EVALUACION: como se comprueba. Las lecciones de tipo evaluacion, que en el
    temario quedan mezcladas entre videos y textos.
  - PUBLICACION: si esta listo para salir. Estado y resumen de lo que falta.

  Antes la ficha y el temario compartian pantalla con el mismo peso. El temario
  es lo que crece, y al llegar a veinte lecciones empujaba los datos basicos
  fuera de la vista: se editaba el titulo con la mitad del formulario doblado
  debajo. Con pestañas, cada seccion se abre sola y el guardado esta siempre a
  la vista en el encabezado.

  El boton de guardar vive en el encabezado de la pagina, no dentro de una
  pestana: si estuviera en Publicacion, cambiar de pestana para guardar seria
  un paso extra en cada guardado.

  CONTENIDO
  ---------
  El temario no vive en el estado de esta pagina, sino en el provider de
  contenido (DemoCourseContentProvider). Se hidrata al abrir el curso y se
  guarda al pulsar "Guardar cambios": asi, guardar y volver a abrir el curso
  conserva el temario en lugar de devolver un formulario vacio.

  Guardado.
  ---------
  En modo demo el temario se guarda en el provider de contenido y la ficha no se
  persiste. Avisa de eso en pantalla y deja que la doctora se vaya cuando quiera,
  en vez de expulsarla al listado: un mensaje de guardado que aparece y se
  lleva la pagina consigo mismo no dice nada.

  Confirmar al guardar tampoco harian falta: guardar es lo que se espera de un
  boton de guardar. El dialogo se reserva para borrar y para publicar, que si
  cambian lo que ve el estudiante.
*/

const LEVELS = ['Inicial', 'Intermedio', 'Avanzado']
const CATEGORIES = ['Fundamentos', 'Clínica', 'Práctica']

/* Los tres tonos de portada que ya usan los cursos del catalogo. */
const COVER_TONES = [
  { id: 'sky', label: 'Azul' },
  { id: 'sage', label: 'Verde' },
  { id: 'mist', label: 'Violeta' },
]

const TABS = [
  { id: 'informacion', label: 'Información' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'evaluacion', label: 'Evaluación' },
  { id: 'publicacion', label: 'Publicación' },
]

/* Un curso nuevo empieza sin modulos: la pantalla vacia dice que se añada el
   primero, que es mas claro que un modulo en blanco sin nombre. */
function formFromCourse(course) {
  if (!course) {
    return {
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: CATEGORIES[0],
      level: LEVELS[0],
      duration: '',
      price: '',
      previousPrice: '',
      tone: 'sky',
      status: COURSE_STATUS.draft,
      hasCertificate: false,
    }
  }

  return {
    title: course.title,
    shortDescription: course.shortDescription,
    fullDescription: '',
    category: course.category,
    level: course.level,
    duration: course.duration,
    price: String(course.price),
    previousPrice: String(course.previousPrice ?? ''),
    tone: course.tone ?? 'sky',
    status: course.status,
    hasCertificate: course.hasCertificate,
  }
}

/*
  Clave de contenido del curso.

  Un curso existente usa su id. Uno nuevo todavia no lo tiene, asi que se genera
  uno para esta sesion: con una clave fija, el temario del curso nuevo anterior
  apareceria al crear el siguiente, y eso si seria una perdida de contenido.
*/
function useCourseContentKey(course) {
  return useState(() => course?.id ?? createContentId('curso'))[0]
}

/* Una evaluacion es una leccion mas, pero de tipo evaluacion: se localizan con
   el mismo recorrido que usa el temario para no recorrerlo dos veces. */
function findEvaluations(modules) {
  return modules.flatMap((module) =>
    (module.lessons ?? [])
      .filter((lesson) => lesson.type === LESSON_TYPES.evaluation)
      .map((lesson) => ({ moduleId: module.id, moduleTitle: module.title, lesson })),
  )
}

function CourseEditorView({ course }) {
  const { getCourseContent, saveCourseContent } = useDemoCourseContent()
  const [searchParams] = useSearchParams()
  const isNew = !course
  const courseKey = useCourseContentKey(course)

  const [form, setForm] = useState(() => formFromCourse(course))

  /*
    Se puede llegar a una pestaña concreta desde otra pantalla (?tab=evaluacion,
    desde /admin/evaluaciones). Si el valor no es una pestaña real, se empieza
    por Informacion en lugar de dejar la pantalla en blanco.
  */
  const [tab, setTab] = useState(() => {
    const requested = searchParams.get('tab')

    return TABS.some((item) => item.id === requested) ? requested : TABS[0].id
  })

  /*
    El temario se hidrata al abrir el curso. useState con inicializador perezoso
    lo hace una vez: en cuanto guardamos, el estado de la pagina ya no manda.
    Volver a abrir la ruta monta el componente de nuevo y vuelve a leer del
    provider.
  */
  const [modules, setModules] = useState(() => getCourseContent(courseKey))

  /* Leccion en edicion: { moduleId, lesson, type } o null si esta cerrado.
     `lesson` es null cuando es nueva: el drawer crea el borrador y asi sabe, sin
     un segundo campo, que tiene que decir "Crear leccion" y no "Guardar". */
  const [lessonEditor, setLessonEditor] = useState(null)
  const [previewLesson, setPreviewLesson] = useState(null)

  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  /* ---------- Lecciones ---------- */

  /* Añadir abre el drawer con una leccion en blanco ya tipada; no deja una fila
     vacia en la lista. */
  const handleAddLesson = useCallback((moduleId) => {
    setLessonEditor({ moduleId, lesson: null })
  }, [])

  /* La misma entrada desde la pestaña de evaluacion: el drawer se abre ya en
     tipo evaluacion para no elegirlo otra vez. */
  const handleAddEvaluation = useCallback((moduleId) => {
    setLessonEditor({ moduleId, lesson: null, type: LESSON_TYPES.evaluation })
  }, [])

  const handleEditLesson = useCallback((moduleId, lesson) => {
    setLessonEditor({ moduleId, lesson })
  }, [])

  /* El drawer entrega la leccion terminada: se inserta o se reemplaza, segun
     venga de una nueva o de una edicion. */
  const handleSaveLesson = (lesson) => {
    const { moduleId, lesson: original } = lessonEditor

    setModules((prev) =>
      original
        ? replaceLesson(prev, moduleId, original.id, lesson)
        : appendLesson(prev, moduleId, lesson),
    )

    setLessonEditor(null)
    setFeedback('Lección guardada. Pulsa «Guardar cambios» para conservarla en el curso.')
  }

  const handlePreviewLesson = useCallback((lesson) => setPreviewLesson(lesson), [])

  /* useCallback para que el efecto de cierre no se reenganche en cada render. */
  const closePreview = useCallback(() => setPreviewLesson(null), [])

  useOverlayDismiss(previewLesson !== null, closePreview)

  const handleAddModule = useCallback(() => {
    setModules((prev) => appendModule(prev))
  }, [])

  /* ---------- Validacion y guardado ---------- */

  const validate = () => {
    if (!form.title.trim()) return 'Escribe el título del curso.'
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      return 'El precio debe ser un número igual o mayor que cero.'
    }
    return ''
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      setFeedback('')
      return
    }

    /* Aqui entraria la API del curso. En demo el temario se guarda en el
       provider y el resto de la ficha no se persiste. */
    saveCourseContent(courseKey, modules)

    setError('')
    setFeedback(
      isNew
        ? 'Temario guardado en la demostración. La ficha del curso todavía no se persiste, así que este curso no aparecerá en el listado.'
        : 'Cambios guardados en la demostración. El temario se conserva en memoria, no de forma permanente.',
    )
  }

  /* El estado de la pantalla cambia al cambiar de pestaña: un error de
     validación debe seguir viéndose aunque se vaya a Informacion. */
  const showNotice = error || feedback

  const evaluations = findEvaluations(modules)
  const lessonCount = modules.reduce((total, module) => total + (module.lessons?.length ?? 0), 0)

  const checklist = [
    {
      id: 'titulo',
      label: 'Título del curso',
      done: Boolean(form.title.trim()),
      hint: 'Es lo primero que ve el estudiante.',
    },
    {
      id: 'descripcion',
      label: 'Descripción breve',
      done: Boolean(form.shortDescription.trim()),
      hint: 'Una o dos frases en la tarjeta del catálogo.',
    },
    {
      id: 'precio',
      label: 'Precio válido',
      done: Number.isFinite(Number(form.price)) && Number(form.price) >= 0,
      hint: form.hasCertificate ? 'Entrega certificado al completarlo.' : 'Sin coste para el estudiante.',
    },
    {
      id: 'contenido',
      label: 'Contenido del curso',
      done: lessonCount > 0,
      hint:
        lessonCount === 0
          ? 'Añade al menos una lección.'
          : `${lessonCount} lecciones en ${modules.length} módulos.`,
    },
  ]

  return (
    <AdminShell>
<AdminPageHeader
          title={isNew ? 'Crear nuevo curso' : 'Editar curso'}
          subtitle={
            isNew
              ? 'Define la ficha y organiza el contenido del curso.'
              : 'Ajusta la ficha, el temario y las lecciones de este curso.'
          }
          eyebrow={isNew ? 'Nuevo curso' : 'Contenido'}
          icon={BookOpen}
        meta={
          <>
            <AdminBadge status={form.status}>{form.status}</AdminBadge>
            <span className="admin-pagehead__fact">
              {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}
            </span>
            <span className="admin-pagehead__fact">
              {lessonCount} {lessonCount === 1 ? 'lección' : 'lecciones'}
            </span>
          </>
        }
        actions={
          <>
            <Link className="admin-btn" to="/admin/cursos">
              <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
              Volver a cursos
            </Link>

            {/* El boton vive en el encabezado y apunta al formulario con el
                atributo `form`: guardar esta disponible desde cualquier
                pestaña sin duplicar el boton dentro de una de ellas. */}
            <button
              className="admin-btn admin-btn--primary"
              type="submit"
              form="admin-course-form"
            >
              <Check size={16} strokeWidth={2.2} aria-hidden="true" />
              {isNew ? 'Crear curso' : 'Guardar cambios'}
            </button>
          </>
        }
      />

      {/* ---------- Avisos: fuera de las pestanas, siempre visibles ---------- */}
      {showNotice ? (
        <p className={`admin-alert admin-alert--notice${error ? ' admin-alert--error' : ' admin-alert--ok'}`}>
          {error || feedback}
        </p>
      ) : null}

      <AdminTabs
        tabs={TABS.map((item) =>
          item.id === 'contenido'
            ? { ...item, count: lessonCount }
            : item.id === 'evaluacion'
              ? { ...item, count: evaluations.length }
              : item,
        )}
        active={tab}
        onChange={setTab}
      />

      <form id="admin-course-form" onSubmit={handleSubmit} noValidate>
        {/* ---------- Informacion ---------- */}
        <AdminTabPanel id="informacion" active={tab === 'informacion'}>
          <div className="admin-editor">
            <div className="admin-editor__main">
              <AdminSection title="Datos del curso">
                <div className="admin-form">
                  <label className="admin-field">
                    <span className="admin-field__label">Título</span>
                    <input
                      className="admin-input"
                      type="text"
                      value={form.title}
                      onChange={(event) => setField('title', event.target.value)}
                      placeholder="Ej. Nutrición clínica aplicada"
                    />
                  </label>

                  <label className="admin-field">
                    <span className="admin-field__label">Descripción breve</span>
                    <textarea
                      className="admin-input admin-input--area"
                      rows={3}
                      value={form.shortDescription}
                      onChange={(event) => setField('shortDescription', event.target.value)}
                      placeholder="De qué trata el curso, en una o dos frases."
                    />
                  </label>

                  <label className="admin-field">
                    <span className="admin-field__label">Descripción completa</span>
                    <textarea
                      className="admin-input admin-input--area"
                      rows={6}
                      value={form.fullDescription}
                      onChange={(event) => setField('fullDescription', event.target.value)}
                      placeholder="Qué va a aprender la estudiante, para quién es y cómo se organiza."
                    />
                    <span className="admin-field__hint">
                      Se muestra en la ficha del curso, debajo de la descripción breve.
                    </span>
                  </label>

                  <div className="admin-field-row">
                    <label className="admin-field">
                      <span className="admin-field__label">Categoría</span>
                      <select
                        className="admin-input"
                        value={form.category}
                        onChange={(event) => setField('category', event.target.value)}
                      >
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="admin-field">
                      <span className="admin-field__label">Nivel</span>
                      <select
                        className="admin-input"
                        value={form.level}
                        onChange={(event) => setField('level', event.target.value)}
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="admin-field-row">
                    <label className="admin-field">
                      <span className="admin-field__label">Duración</span>
                      <input
                        className="admin-input"
                        type="text"
                        value={form.duration}
                        onChange={(event) => setField('duration', event.target.value)}
                        placeholder="Ej. 8 semanas · 40 horas"
                      />
                    </label>

                    <label className="admin-field">
                      <span className="admin-field__label">Precio (S/)</span>
                      <input
                        className="admin-input"
                        type="number"
                        min="0"
                        step="1"
                        value={form.price}
                        onChange={(event) => setField('price', event.target.value)}
                        placeholder="149"
                      />
                    </label>
                  </div>

                  <label className="admin-field">
                    <span className="admin-field__label">Precio anterior (S/)</span>
                    <input
                      className="admin-input"
                      type="number"
                      min="0"
                      step="1"
                      value={form.previousPrice}
                      onChange={(event) => setField('previousPrice', event.target.value)}
                      placeholder="199"
                    />
                    <span className="admin-field__hint">
                      Déjalo vacío si el curso no tiene descuento.
                    </span>
                  </label>

                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={form.hasCertificate}
                      onChange={(event) => setField('hasCertificate', event.target.checked)}
                    />
                    <span>El curso entrega certificado</span>
                  </label>
                </div>
              </AdminSection>
            </div>

            {/* ---------- Portada ---------- */}
            <aside className="admin-editor__side">
              <AdminSection
                title="Portada"
                subtitle="Color de la tarjeta del curso."
              >
                <div className="admin-coverpick">
                  <CourseCover courseId={course?.id} tone={form.tone} size="lg" />
                </div>

                <div className="admin-tonepicker" role="radiogroup" aria-label="Tono de portada">
                  {COVER_TONES.map((tone) => (
                    <button
                      className={`admin-tone${form.tone === tone.id ? ' admin-tone--active' : ''}`}
                      key={tone.id}
                      type="button"
                      role="radio"
                      aria-checked={form.tone === tone.id}
                      onClick={() => setField('tone', tone.id)}
                    >
                      <span className={`admin-tone__dot admin-tone__dot--${tone.id}`} />
                      {tone.label}
                    </button>
                  ))}
                </div>

                <p className="admin-note admin-note--tight">
                  En esta versión la portada es una pieza de color con las iniciales del
                  curso, no una imagen.
                </p>
              </AdminSection>
            </aside>
          </div>
        </AdminTabPanel>

        {/* ---------- Contenido ---------- */}
        <AdminTabPanel id="contenido" active={tab === 'contenido'}>
          <AdminSection
            title="Contenido del curso"
            subtitle="Cada lección es un video, un texto, un material o una evaluación."
          >
            <AdminCurriculum
              modules={modules}
              onChange={setModules}
              onAddModule={handleAddModule}
              onAddLesson={handleAddLesson}
              onEditLesson={handleEditLesson}
              onPreviewLesson={handlePreviewLesson}
            />
          </AdminSection>
        </AdminTabPanel>

        {/* ---------- Evaluacion ---------- */}
        <AdminTabPanel id="evaluacion" active={tab === 'evaluacion'}>
          <AdminSection
            title="Evaluaciones"
            subtitle="Las evaluaciones son lecciones de tipo evaluación, y viven dentro del temario."
          >
            {evaluations.length === 0 ? (
              <AdminEmptyState
                icon={FileCheck2}
                title="Este curso todavía no tiene evaluaciones"
                description={
                  modules.length > 0
                    ? 'Añade una al módulo que quieras abajo: aparecerá en el temario, junto al resto del contenido.'
                    : 'Primero crea un módulo en la pestaña Contenido: las evaluaciones siempre viven dentro de un módulo.'
                }
                action={
                  modules.length > 0 ? null : (
                    <button className="admin-btn" type="button" onClick={() => setTab('contenido')}>
                      Ir al contenido
                    </button>
                  )
                }
              />
            ) : null}

            {evaluations.length > 0 ? (
              <ul className="admin-evals">
                {evaluations.map(({ moduleId, moduleTitle, lesson }) => (
                  <li className="admin-eval" key={lesson.id}>
                    <div className="admin-eval__body">
                      <p className="admin-eval__title">
                        {lesson.evaluation?.name?.trim() || lesson.title || 'Evaluación sin nombre'}
                      </p>
                      <p className="admin-eval__meta">
                        {moduleTitle} · {lesson.evaluation?.questions?.length ?? 0}{' '}
                        {lesson.evaluation?.questions?.length === 1 ? 'pregunta' : 'preguntas'}
                      </p>
                    </div>

                    <div className="admin-eval__actions">
                      <AdminBadge status={lesson.status}>{lesson.status}</AdminBadge>

                      <button
                        className="admin-btn admin-btn--sm"
                        type="button"
                        onClick={() => handleEditLesson(moduleId, lesson)}
                      >
                        Editar
                      </button>

                      <button
                        className="admin-iconbtn"
                        type="button"
                        onClick={() => handlePreviewLesson(lesson)}
                        aria-label={`Ver la evaluación ${lesson.title}`}
                        title="Ver como la verá la estudiante"
                      >
                        <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Una evaluacion vive dentro de un modulo, asi que el boton de
                anadir aparece en cada modulo y no suelto por aqui. */}
            {modules.length > 0 ? (
              <ul className="admin-evals admin-evals--add">
                {modules.map((module) => (
                  <li className="admin-eval admin-eval--add" key={`add-${module.id}`}>
                    <span className="admin-eval__body">
                      <span className="admin-eval__title">Añadir evaluación en «{module.title}»</span>
                      <span className="admin-eval__meta">
                        Se crea en borrador y la puedes publicar desde la lección.
                      </span>
                    </span>

                    <button
                      className="admin-btn admin-btn--sm"
                      type="button"
                      onClick={() => handleAddEvaluation(module.id)}
                    >
                      <Plus size={13} strokeWidth={2.2} aria-hidden="true" />
                      Añadir
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </AdminSection>
        </AdminTabPanel>

        {/* ---------- Publicacion ---------- */}
        <AdminTabPanel id="publicacion" active={tab === 'publicacion'}>
          <div className="admin-editor">
            <div className="admin-editor__main">
              <AdminSection
                title="Estado del curso"
                subtitle="Un curso en borrador no aparece en la web."
              >
                <div className="admin-form">
                  <label className="admin-field">
                    <span className="admin-field__label">Estado</span>
                    <select
                      className="admin-input"
                      value={form.status}
                      onChange={(event) => setField('status', event.target.value)}
                    >
                      <option value={COURSE_STATUS.draft}>{COURSE_STATUS.draft}</option>
                      <option value={COURSE_STATUS.published}>{COURSE_STATUS.published}</option>
                    </select>
                  </label>

                  <p className="admin-note admin-note--tight">
                    {form.status === COURSE_STATUS.published
                      ? 'El curso está publicado: su ficha pública es visible para cualquiera que entre por el catálogo.'
                      : 'El curso está en borrador. Se puede preparar entero sin que nadie lo vea.'}
                  </p>

                  {form.status === COURSE_STATUS.published && course ? (
                    <Link className="admin-btn" to={`/cursos/${course.id}`}>
                      <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
                      Ver la ficha pública
                    </Link>
                  ) : null}
                </div>
              </AdminSection>

              <AdminSection
                title="Resumen antes de publicar"
                subtitle="Lo que la estudiante se va a encontrar."
              >
                <ul className="admin-checklist">
                  {checklist.map((item) => (
                    <li className="admin-checklist__item" key={item.id}>
                      <span
                        className={`admin-checklist__mark${item.done ? ' admin-checklist__mark--ok' : ''}`}
                        aria-hidden="true"
                      >
                        {item.done ? <Check size={12} strokeWidth={3} /> : null}
                      </span>

                      <span className="admin-checklist__copy">
                        <span className="admin-checklist__label">{item.label}</span>
                        <span className="admin-checklist__hint">{item.hint}</span>
                      </span>

                      <span className="admin-checklist__state">
                        {item.done ? 'Listo' : 'Pendiente'}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="admin-note admin-note--tight">
                  Pulsa «Guardar cambios» en el encabezado para conservar los cambios de esta
                  demostración.
                </p>
              </AdminSection>
            </div>

            <aside className="admin-editor__side">
              <AdminSection title="Resumen del temario">
                <dl className="admin-deflist">
                  <div className="admin-deflist__row">
                    <dt className="admin-deflist__term">Módulos</dt>
                    <dd className="admin-deflist__desc">{modules.length}</dd>
                  </div>

                  <div className="admin-deflist__row">
                    <dt className="admin-deflist__term">Lecciones</dt>
                    <dd className="admin-deflist__desc">{lessonCount}</dd>
                  </div>

                  <div className="admin-deflist__row">
                    <dt className="admin-deflist__term">Evaluaciones</dt>
                    <dd className="admin-deflist__desc">{evaluations.length}</dd>
                  </div>

                  <div className="admin-deflist__row">
                    <dt className="admin-deflist__term">Certificado</dt>
                    <dd className="admin-deflist__desc">
                      {form.hasCertificate ? 'Sí' : 'No'}
                    </dd>
                  </div>
                </dl>
              </AdminSection>
            </aside>
          </div>
        </AdminTabPanel>
      </form>

      {/* ---------- Drawer de leccion ----------
          Va fuera del <form> a proposito: sus botones son type="button" para no
          disparar el guardado del curso, y asi queda claro que guardar una
          leccion y guardar el curso son dos cosas distintas. */}
      {lessonEditor ? (
        <AdminLessonDrawer
          /* La key remonta el drawer al cambiar de leccion: si no, el borrador
             del guardado anterior se quedaria pegado a la siguiente. */
          key={`${lessonEditor.moduleId}-${lessonEditor.lesson?.id ?? 'nueva'}`}
          open
          lesson={lessonEditor.lesson}
          type={lessonEditor.type}
          onClose={() => setLessonEditor(null)}
          onSave={handleSaveLesson}
        />
      ) : null}

      {/* ---------- Vista previa de una leccion ---------- */}
      {previewLesson ? (
        <div className="admin-dialog-layer">
          <button
            className="admin-drawer__scrim"
            type="button"
            aria-label="Cerrar"
            onClick={closePreview}
          />

          <div
            className="admin-dialog admin-dialog--wide"
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa de la lección"
          >
            <div className="admin-dialog__head">
              <h2 className="admin-dialog__title">Vista previa</h2>

              <button
                className="admin-iconbtn"
                type="button"
                onClick={closePreview}
                aria-label="Cerrar"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="admin-dialog__body">
              <AdminLessonPreview lesson={previewLesson} />
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  )
}

export default function AdminCourseEditorPage() {
  const { id } = useParams()
  const course = id ? getAdminCourse(id) : null

  /* Un id que no existe se trata como curso nuevo: la pantalla de edicion
     nunca debe romperse por una URL antigua. */
  if (id && !course) {
    return (
      <RequireAdminSession>
        <CourseEditorView course={null} />
      </RequireAdminSession>
    )
  }

  return (
    <RequireAdminSession>
      <CourseEditorView course={course} />
    </RequireAdminSession>
  )
}