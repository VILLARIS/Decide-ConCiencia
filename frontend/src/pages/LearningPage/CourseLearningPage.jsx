import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Circle,
  Download,
  FileText,
  HelpCircle,
  ListVideo,
  Lock,
  NotebookPen,
  PlayCircle,
} from 'lucide-react'
import StudentShell from './StudentShell.jsx'
import { RequireDemoSession } from '../../demo/DemoAuthContext'
import { useDemoPurchases } from '../../demo/demoPurchaseStore'
import { normalizeCourseId } from '../../demo/demoCatalog'
import {
  LESSON_STATUS,
  findLesson,
  getCompletedModulesCount,
  getCourseLessons,
  getCourseProgress,
  getLearningCourse,
  getLessonNeighbours,
  getResumeLesson,
} from '../../demo/demoLearningCourse'
import './CourseLearningPage.css'

/*
  Vista de estudio de un curso inscrito: /mi-aprendizaje/:courseId
  (y /mi-aprendizaje/:courseId/leccion/:lessonId para abrir una leccion suelta).

  REGLAS
  - Sin sesion demo -> RequireDemoSession devuelve al acceso.
  - Sin inscripcion -> se vuelve a la ficha publica del curso (/cursos/:courseId),
    porque el contenido no es suyo todavia.
  - El temario, los materiales y el progreso salen de demoLearningCourse.js.
    Aqui no se escribe contenido a mano.

  MODO DEMO: el video no se reproduce (no hay archivo), el progreso no se
  guarda y las notas viven en memoria mientras dura la sesion del navegador.
*/

const TABS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'material', label: 'Material de apoyo' },
  { id: 'notas', label: 'Notas' },
]

/* ---------- Piezas ---------- */

function LearningHeader({ course, onBack }) {
  return (
    <header className="course-head">
      <button className="course-head__back" type="button" onClick={onBack}>
        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
        Volver a mis cursos
      </button>

      <h1 className="course-head__title">{course.title}</h1>

      <p className="course-head__description">{course.description}</p>

      <ul className="course-head__meta">
        <li>{course.duration}</li>
        <li>{course.level}</li>
        <li>{course.modality}</li>
      </ul>
    </header>
  )
}

function ProgressPanel({ course, lesson, nextLesson, progress }) {
  const completedModules = getCompletedModulesCount(course)

  return (
    <div className="course-aside__block">
      <h2 className="course-aside__title">Tu progreso</h2>

      <p className="course-aside__progress-value">{progress}%</p>

      <span className="progress-track progress-track--thin">
        <span className="progress-track__fill" style={{ width: `${progress}%` }} />
      </span>

      <p className="course-aside__progress-note">
        {completedModules} de {course.modules.length} módulos completados
      </p>

      <div className="course-aside__lesson">
        <p className="course-aside__label">Lección actual</p>
        <p className="course-aside__lesson-title">{lesson.title}</p>
      </div>

      <div className="course-aside__lesson">
        <p className="course-aside__label">Siguiente lección</p>
        {nextLesson ? (
          <p className="course-aside__lesson-title">{nextLesson.title}</p>
        ) : (
          <p className="course-aside__lesson-muted">Eres la última lección del curso</p>
        )}
      </div>
    </div>
  )
}

function MaterialsPanel({ course, lesson }) {
  /* Materiales de la leccion primero; si no tiene, los generales del curso. */
  const items = (lesson.materials.length > 0 ? lesson.materials : course.courseMaterials).slice(
    0,
    3,
  )

  return (
    <div className="course-aside__block">
      <h2 className="course-aside__title">Materiales</h2>

      <ul className="material-list">
        {items.map((material) => (
          <li className="material-list__item" key={material.id}>
            <FileText size={16} strokeWidth={2} aria-hidden="true" />
            <span className="material-list__body">
              <span className="material-list__name">{material.title}</span>
              <span className="material-list__meta">{material.meta}</span>
            </span>
            <Download size={15} strokeWidth={2} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function HelpPanel() {
  return (
    <div className="course-aside__block course-aside__block--help">
      <HelpCircle size={18} strokeWidth={2} aria-hidden="true" />
      <div>
        <h2 className="course-aside__title">¿Necesitas ayuda?</h2>
        <p className="course-aside__help-text">
          Escribe a la doctora dentro del curso y te responde en 24 horas.
        </p>
      </div>
    </div>
  )
}

function Curriculum({ course, lesson, onSelect }) {
  return (
    <nav className="curriculum" aria-label="Contenido del curso">
      <h2 className="curriculum__title">Contenido del curso</h2>

      <ul className="curriculum__modules">
        {course.modules.map((module, moduleIndex) => {
          const isOpen = module.lessons.some((item) => item.id === lesson.id)

          return (
            <li className="curriculum__module" key={module.id}>
              <div className="curriculum__module-head" aria-current={isOpen ? 'true' : undefined}>
                <span className="curriculum__module-index">
                  Módulo {moduleIndex + 1}
                </span>
                <span className="curriculum__module-title">{module.title}</span>
                <ChevronDown
                  className={`curriculum__chevron${isOpen ? ' is-open' : ''}`}
                  size={16}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </div>

              {/* El módulo con la lección activa es el único que se despliega. */}
              {isOpen ? (
                <ul className="curriculum__lessons">
                  {module.lessons.map((item) => {
                    const isActive = item.id === lesson.id

                    return (
                      <li key={item.id}>
                        <button
                          className={`curriculum__lesson${
                            isActive ? ' curriculum__lesson--active' : ''
                          }`}
                          type="button"
                          onClick={() => onSelect(item.id)}
                          aria-current={isActive ? 'true' : undefined}
                        >
                          <span
                            className={`curriculum__status curriculum__status--${item.status}`}
                            aria-hidden="true"
                          >
                            {item.status === LESSON_STATUS.completed ? (
                              <Check size={13} strokeWidth={3} />
                            ) : item.status === LESSON_STATUS.inProgress ? (
                              <PlayCircle size={13} strokeWidth={2.4} />
                            ) : (
                              <Circle size={11} strokeWidth={2.2} />
                            )}
                          </span>

                          <span className="curriculum__lesson-body">
                            <span className="curriculum__lesson-title">{item.title}</span>
                            <span className="curriculum__lesson-meta">
                              {item.duration}
                              {item.type === 'lectura' ? ' · Lectura' : ''}
                              {item.type === 'evaluacion' ? ' · Evaluación' : ''}
                            </span>
                          </span>

                          {item.status === LESSON_STATUS.completed ? (
                            <span className="visually-hidden">Completada</span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function VideoStage({ lesson }) {
  const hasVideo = typeof lesson.videoUrl === 'string' && lesson.videoUrl.length > 0

  return (
    <div className="lesson-stage">
      <div className="video">
        {hasVideo ? (
          <video
            className="video__media"
            src={lesson.videoUrl}
            controls
            preload="metadata"
          />
        ) : (
          /* Sin archivo real en la demo: se muestra el marco 16:9 con la
             estructura lista para recibir el video del backend. */
          <div className="video__placeholder" role="img" aria-label="Video de la lección">
            <PlayCircle size={52} strokeWidth={1.5} aria-hidden="true" />
            <p className="video__placeholder-title">{lesson.title}</p>
            <p className="video__placeholder-note">
              Vista de demostración: el video se incrustará aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function LessonNavigation({ previous, next, onSelect }) {
  return (
    <nav className="lesson-nav" aria-label="Navegación entre lecciones">
      {previous ? (
        <button className="btn btn--ghost lesson-nav__btn" type="button" onClick={() => onSelect(previous.id)}>
          <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
          Anterior
        </button>
      ) : (
        <span />
      )}

      {next ? (
        <button className="btn btn--primary lesson-nav__btn" type="button" onClick={() => onSelect(next.id)}>
          Siguiente
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      ) : (
        <span />
      )}
    </nav>
  )
}

function SummaryTab({ lesson, course }) {
  const module = course.modules.find((item) => item.lessons.some((one) => one.id === lesson.id))

  return (
    <div className="lesson-tab">
      {module ? <p className="lesson-tab__eyebrow">{module.title}</p> : null}

      {lesson.summary.map((paragraph) => (
        <p className="lesson-tab__paragraph" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </div>
  )
}

function MaterialTab({ lesson, course }) {
  const items = lesson.materials.length > 0 ? lesson.materials : course.courseMaterials

  if (items.length === 0) {
    return (
      <div className="lesson-tab">
        <p className="lesson-tab__paragraph">
          Esta lección no tiene material de apoyo descargable.
        </p>
      </div>
    )
  }

  return (
    <div className="lesson-tab">
      <ul className="material-list material-list--wide">
        {items.map((material) => (
          <li className="material-list__item" key={material.id}>
            <FileText size={16} strokeWidth={2} aria-hidden="true" />
            <span className="material-list__body">
              <span className="material-list__name">{material.title}</span>
              <span className="material-list__meta">{material.meta}</span>
            </span>
            <Download size={15} strokeWidth={2} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/*
  La nota se monta con key={lesson.id}: al cambiar de leccion el componente se
  vuelve a crear y parte del texto de esa leccion, sin efectos ni sincronizacion.
  En la demo el estado es local (se pierde al recargar); en produccion las
  notas se guardarian por leccion y alumna en el backend.
*/
function NotesTab({ lesson }) {
  const [value, setValue] = useState(lesson.notes ?? '')
  const [saved, setSaved] = useState(false)

  return (
    <div className="lesson-tab">
      <label className="notes__label" htmlFor="lesson-notes">
        <NotebookPen size={16} strokeWidth={2} aria-hidden="true" />
        Tus notas de esta lección
      </label>

      <textarea
        id="lesson-notes"
        className="notes__field"
        rows={6}
        value={value}
        placeholder="Escribe lo que quieras recordar de esta lección…"
        onChange={(event) => {
          setValue(event.target.value)
          setSaved(false)
        }}
      />

      <div className="notes__actions">
        <button className="btn btn--primary notes__save" type="button" onClick={() => setSaved(true)}>
          Guardar nota
        </button>

        <span className="notes__status" role="status">
          {saved ? 'Nota guardada (demo)' : ''}
        </span>
      </div>
    </div>
  )
}

/*
  Las pestañas tambien son de la leccion: se montan con key={lesson.id}, asi que
  al cambiar de leccion se vuelve al resumen sin efecto sincronizador.
*/
function LessonTabs({ lesson, course }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  return (
    <section className="lesson-detail">
      <div className="lesson-tabs" role="tablist" aria-label="Detalle de la lección">
        {TABS.map((tab) => (
          <button
            className={`lesson-tab-btn${
              activeTab === tab.id ? ' lesson-tab-btn--active' : ''
            }`}
            key={tab.id}
            type="button"
            role="tab"
            id={`lesson-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`lesson-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="lesson-tabpanel"
        role="tabpanel"
        id={`lesson-panel-${activeTab}`}
        aria-labelledby={`lesson-tab-${activeTab}`}
      >
        {activeTab === 'resumen' ? <SummaryTab lesson={lesson} course={course} /> : null}
        {activeTab === 'material' ? <MaterialTab lesson={lesson} course={course} /> : null}
        {activeTab === 'notas' ? <NotesTab lesson={lesson} /> : null}
      </div>
    </section>
  )
}

/* ---------- Página ---------- */

function CourseLearningView() {
  const { courseId: rawCourseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { hasEnrollment } = useDemoPurchases()

  /*
    La URL puede traer id o slug. Se normaliza UNA vez y ese mismo valor se usa
    para buscar el contenido y para hasEnrollment, de modo que la inscripcion que
    guardo la compra y el courseId de la ruta son siempre comparables.
  */
  const courseId = useMemo(() => normalizeCourseId(rawCourseId), [rawCourseId])
  const course = useMemo(() => getLearningCourse(courseId), [courseId])

  /*
    Sin inscripcion no se muestra el contenido: se vuelve a la ficha publica
    del curso. Comprar es lo que da acceso; entrar a la URL no.
  */
  if (!hasEnrollment(courseId)) {
    return <Navigate to={`/cursos/${courseId}`} replace />
  }

  if (!course) {
    /* Inscrito en un curso que todavia no tiene contenido de estudio. */
    return (
      <StudentShell>
        <div className="course-empty">
          <Lock size={22} strokeWidth={1.8} aria-hidden="true" />
          <h1 className="course-empty__title">Contenido en preparación</h1>
          <p className="course-empty__text">
            Este curso todavía no tiene lecciones publicadas en la demostración.
          </p>
          <Link className="btn btn--ghost" to="/mi-aprendizaje">
            Volver a mis cursos
          </Link>
        </div>
      </StudentShell>
    )
  }

  const lessons = getCourseLessons(course)
  const requested = lessonId ? findLesson(course, lessonId) : null
  const lesson = requested ?? getResumeLesson(course)
  const { previous, next } = getLessonNeighbours(course, lesson.id)
  const progress = getCourseProgress(course)

  function goToLesson(nextLessonId) {
    navigate(`/mi-aprendizaje/${course.id}/leccion/${nextLessonId}`)
  }

  return (
    <StudentShell>
      <LearningHeader
        course={course}
        onBack={() => navigate('/mi-aprendizaje')}
      />

      <div className="course-layout">
        {/* ---------- Izquierda: contenido del curso ---------- */}
        <div className="course-layout__aside course-layout__aside--left">
          <Curriculum course={course} lesson={lesson} onSelect={goToLesson} />
        </div>

        {/* ---------- Centro: la lección ---------- */}
        <div className="course-layout__main">
          <div className="lesson-head">
            <p className="lesson-head__eyebrow">
              <ListVideo size={14} strokeWidth={2.2} aria-hidden="true" />
              {course.title}
            </p>

            <h2 className="lesson-head__title">{lesson.title}</h2>

            <p className="lesson-head__meta">
              {lesson.duration}
              {lesson.status === LESSON_STATUS.completed ? ' · Completada' : ''}
              {lesson.status === LESSON_STATUS.inProgress ? ' · En progreso' : ''}
            </p>
          </div>

          <VideoStage lesson={lesson} />

          <LessonNavigation previous={previous} next={next} onSelect={goToLesson} />

          <LessonTabs key={lesson.id} lesson={lesson} course={course} />

          <p className="course-layout__counter">
            Lección {lessons.findIndex((item) => item.id === lesson.id) + 1} de {lessons.length}
          </p>
        </div>

        {/* ---------- Derecha: progreso y apoyo ---------- */}
        <aside className="course-layout__aside course-layout__aside--right">
          <ProgressPanel course={course} lesson={lesson} nextLesson={next} progress={progress} />
          <MaterialsPanel course={course} lesson={lesson} />
          <HelpPanel />
        </aside>
      </div>
    </StudentShell>
  )
}

export default function CourseLearningPage() {
  return (
    <RequireDemoSession>
      <CourseLearningView />
    </RequireDemoSession>
  )
}

export { CourseLearningView }