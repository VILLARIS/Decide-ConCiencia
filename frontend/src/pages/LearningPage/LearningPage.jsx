import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  FlaskConical,
  GraduationCap,
  ListChecks,
  PlayCircle,
  Sparkles,
  Stethoscope,
  Target,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import StudentShell from './StudentShell'
import { RequireDemoSession } from '../../demo/DemoAuthContext'
import { useDemoAuth } from '../../demo/demoAuthStore'
import { useDemoPurchases } from '../../demo/demoPurchaseStore'
import { getCourseById, normalizeCourseId } from '../../demo/demoCatalog'
import {
  LESSON_STATUS,
  getCompletedModulesCount,
  getCourseLessons,
  getCourseProgress,
  getLearningCourse,
  getResumeLesson,
} from '../../demo/demoLearningCourse'
import {
  DEMO_ACTIVITY,
  DEMO_CERTIFICATES,
  DEMO_COURSES,
  DEMO_MAIN_COURSE,
  DEMO_OVERVIEW,
} from '../../demo/demoData'
import './LearningPage.css'

/*
  Mi Aprendizaje — MODO DEMO.

  Solo se ve con sesion demo activa. Los datos son ficticios y no hay backend:
  los botones no navegan ni guardan nada, y eso se indica con "(demo)".

  "Mis cursos" combina dos cosas: los cursos que ya traia la demo
  (DEMO_COURSES) y los que se compraron en el checkout, que llegan desde
  useDemoPurchases con 0% y estado "Inscrito". El curso destacado del hero se
  cuenta aparte, asi que el total no lo duplica.
*/

const COURSE_ICONS = {
  'metabolismo-de-carbohidratos': Flame,
  'nutricion-clinica-aplicada': Stethoscope,
  'fisiologia-digestiva': Activity,
  'bioquimica-aplicada-a-la-nutricion': FlaskConical,
}

function CourseGlyph({ id, title }) {
  const Icon = COURSE_ICONS[id] ?? BookOpen
  return <Icon size={19} strokeWidth={1.9} aria-hidden="true" title={title} />
}

/*
  Contenido de la fila: icono, titulo y progreso.

  Con studyHref (curso inscrito) es un enlace y asi toda la fila es clicable; sin
  es un div normal y la fila se abre con la flecha de la derecha. El marcado es
  el mismo en los dos casos, solo cambia la etiqueta.
*/
function CourseRowBody({ course, studyHref, isPurchased }) {
  const body = (
    <>
      <span
        className={`course-row__icon course-row__icon--${course.tone}`}
        aria-hidden="true"
      >
        <CourseGlyph id={course.id} title={course.title} />
      </span>

      <div className="course-row__body">
        <h3 className="course-row__title">{course.title}</h3>

        <p className="course-row__meta">
          {course.category} · {course.level}
        </p>

        <div className="course-row__progress">
          <span className="progress-track progress-track--thin">
            <span
              className="progress-track__fill"
              style={{ width: `${course.progress}%` }}
            />
          </span>
          <span className="course-row__percent">{course.progress}%</span>
        </div>
      </div>
    </>
  )

  if (!studyHref) return body

  return (
    <Link
      className={`course-row__link${isPurchased ? ' course-row__link--enrolled' : ''}`}
      to={studyHref}
      aria-label={`Estudiar ${course.title}`}
    >
      {body}
    </Link>
  )
}

/*
  CourseId de la vista de estudio: el del curso que se puede abrir, no el de la
  compra. Se comparan con el MISMO criterio en ambos lados:
  enrollment.courseId === courseId de la ruta.
*/
function getStudyCourseId(course) {
  if (!course) return null
  return normalizeCourseId(course.id)
}

/*
  Datos del hero "curso en curso".

  Si la alumna esta inscrita en un curso que ya tiene contenido de estudio, el
  hero muestra ESE curso (es el que se puede abrir). Si no, se mantiene el
  curso de la demo, que es solo informacion visual: sus botones no tienen
  destino real porque no hay inscripcion ni lecciones publicadas.

  La forma del objeto es la de DEMO_MAIN_COURSE, asi que el marcado del hero no
  cambia en absoluto.
*/
function buildHeroCourse(enrolledCourse, content) {
  const lessons = getCourseLessons(content)
  const lessonsCompleted = lessons.filter(
    (lesson) => lesson.status === LESSON_STATUS.completed,
  ).length
  const completedModules = getCompletedModulesCount(content)
  const resumeLesson = getResumeLesson(content)

  return {
    id: getStudyCourseId(enrolledCourse),
    title: content.title,
    instructor: content.instructor,
    status: lessonsCompleted > 0 ? 'En progreso' : 'Inscrito',
    progress: getCourseProgress(content),
    moduleCurrent: Math.min(completedModules + 1, content.modules.length),
    moduleTotal: content.modules.length,
    lessonsCompleted,
    lessonsTotal: lessons.length,
    nextLesson: resumeLesson?.title ?? 'Sin lecciones',
    /* Leccion de reanudacion: "Continuar curso" abre directamente en ella. */
    resumeLessonId: resumeLesson?.id ?? null,
  }
}

function LearningView() {
  const { user } = useDemoAuth()
  const { enrolledCourses } = useDemoPurchases()
  const navigate = useNavigate()
  const firstName = user?.firstName ?? 'Andrea'

  /* Cursos comprados que aun no estan en la lista de la demo. */
  const purchasedCourses = enrolledCourses.filter(
    (course) => !DEMO_COURSES.some((item) => item.id === course.id),
  )

  const myCourses = [...DEMO_COURSES, ...purchasedCourses]
  const coursesTotal = myCourses.length + 1

  /*
    Inscripciones reales, segun el store de compras. Esta es la unica fuente de
    verdad: una fila es "inscrita" si su courseId aparece aqui, y ese mismo
    courseId es el que comprueba hasEnrollment() en la vista de estudio.

    Se comparan ids normalizados (id o slug) para que comprar un curso que ya
    estaba en DEMO_COURSES lo deje igualmente como fila con acceso.
  */
  const enrolledIds = new Set(
    enrolledCourses.map((course) => getStudyCourseId(course)).filter(Boolean),
  )

  /*
    Curso al que abren los botones del hero: el primero inscrito que tenga
    contenido de estudio. Mientras no exista ninguno, el hero conserva el curso
    de la demo y sus botones siguen sin destino (no hay nada que abrir).
  */
  const enrolledWithContent = enrolledCourses.find(
    (course) => getLearningCourse(getStudyCourseId(course)) !== null,
  )
  const heroContent = enrolledWithContent
    ? getLearningCourse(getStudyCourseId(enrolledWithContent))
    : null
  const heroCourse = heroContent
    ? buildHeroCourse(enrolledWithContent, heroContent)
    : { ...DEMO_MAIN_COURSE, id: null, resumeLessonId: null }
  const canOpenHero = heroCourse.id !== null

  /* "Continuar curso": directo a la leccion de reanudacion si la hay. */
  function goToContinueCourse() {
    if (!heroCourse.resumeLessonId) {
      navigate(`/mi-aprendizaje/${heroCourse.id}`)
      return
    }

    navigate(`/mi-aprendizaje/${heroCourse.id}/leccion/${heroCourse.resumeLessonId}`)
  }

  /* "Ver temario": el curso con el modulo actual ya desplegado. */
  function goToCourseOutline() {
    navigate(`/mi-aprendizaje/${heroCourse.id}`)
  }

  return (
    <StudentShell>
      {/* ---------- Encabezado ---------- */}
      <header className="page-head" aria-labelledby="learning-title">
        <div className="page-head__inner">
          <div className="page-head__text">
            <p className="page-head__eyebrow">
              <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
              Área de estudiante
            </p>

            <h1 className="page-head__title" id="learning-title">
              Hola, <span className="page-head__title-accent">{firstName}</span>
            </h1>

            <p className="page-head__lead">
              Retoma donde lo dejaste y revisa tu avance. Todo lo que ves aquí es una
              demostración sin conexión con ningún servidor.
            </p>
          </div>

          <span className="page-head__motif" aria-hidden="true">
            <GraduationCap />
          </span>
        </div>
      </header>

      <div className="learning">
        <div className="learning__grid">
          {/* ---------- Columna principal ---------- */}
          <div className="learning__main">
            {/* Curso principal */}
            <section className="hero-course" aria-labelledby="main-course-title">
              <div className="hero-course__cover">
                <span className="hero-course__cover-icon">
                  <FlaskConical size={26} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="hero-course__cover-label">Curso en curso</span>
              </div>

              <div className="hero-course__body">
                <div className="hero-course__head">
                  <div>
                    <h2 className="hero-course__title" id="main-course-title">
                      {heroCourse.title}
                    </h2>
                    <p className="hero-course__instructor">
                      Con {heroCourse.instructor}
                    </p>
                  </div>

                  <span className="hero-course__status">{heroCourse.status}</span>
                </div>

                <div className="hero-course__progress">
                  <div className="hero-course__progress-head">
                    <span className="hero-course__progress-label">Tu progreso</span>
                    <span className="hero-course__progress-value">
                      {heroCourse.progress}%
                    </span>
                  </div>

                  <div
                    className="progress-track"
                    role="img"
                    aria-label={`Progreso del curso: ${heroCourse.progress}%`}
                  >
                    <span
                      className="progress-track__fill"
                      style={{ width: `${heroCourse.progress}%` }}
                    />
                  </div>
                </div>

                <dl className="hero-course__stats">
                  <div className="hero-course__stat">
                    <dt>
                      <ListChecks size={14} strokeWidth={2} aria-hidden="true" />
                      Módulo
                    </dt>
                    <dd>
                      {heroCourse.moduleCurrent} de {heroCourse.moduleTotal}
                    </dd>
                  </div>

                  <div className="hero-course__stat">
                    <dt>
                      <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
                      Clases
                    </dt>
                    <dd>
                      {heroCourse.lessonsCompleted} de{' '}
                      {heroCourse.lessonsTotal}
                    </dd>
                  </div>

                  <div className="hero-course__stat">
                    <dt>
                      <PlayCircle size={14} strokeWidth={2} aria-hidden="true" />
                      Siguiente clase
                    </dt>
                    <dd>{heroCourse.nextLesson}</dd>
                  </div>
                </dl>

                <div className="hero-course__actions">
                  {/* Continuar curso: abre el curso inscrito en la leccion de
                      reanudacion, o en su pagina si no hay leccion registrada. */}
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={goToContinueCourse}
                    disabled={!canOpenHero}
                    title={
                      canOpenHero
                        ? `Continuar ${heroCourse.title}`
                        : 'Compra un curso para poder estudiarlo'
                    }
                  >
                    <PlayCircle size={17} strokeWidth={2} aria-hidden="true" />
                    Continuar curso
                  </button>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={goToCourseOutline}
                    disabled={!canOpenHero}
                    title={
                      canOpenHero
                        ? `Ver el temario de ${heroCourse.title}`
                        : 'Compra un curso para poder ver su temario'
                    }
                  >
                    Ver temario
                  </button>
                </div>
              </div>
            </section>

            {/* Mis cursos */}
            <section className="courses" aria-labelledby="courses-title">
              <div className="courses__head">
                <h2 className="courses__title" id="courses-title">
                  Mis cursos
                </h2>
                <span className="courses__count">{coursesTotal} en total</span>
              </div>

              <ul className="courses__list">
                {myCourses.map((course) => {
                  /* Solo el curso destacado tiene ficha publica en esta demo;
                     el resto conserva el boton deshabilitado de siempre. */
                  const catalogCourse = getCourseById(course.id)
                  const isPurchased = Boolean(course.enrolled)
                  const hasDetailPage = catalogCourse?.hasDetailPage === true

                  /*
                    Id de la vista de estudio. Se normaliza con el catalogo para
                    que coincida con el courseId que guardo la inscripcion: si no,
                    hasEnrollment() daria false y la pagina devolveria a /cursos/:id.

                    Solo los cursos realmente inscritos abren el LMS. Los cursos de
                    la demo que no tienen inscripcion (DEMO_COURSES) conservan su
                    ficha publica: enlazarlos al LMS los devolveria alla mismo.
                  */
                  const studyCourseId = getStudyCourseId(course)
                  const isEnrolled = studyCourseId !== null && enrolledIds.has(studyCourseId)
                  const studyHref = isEnrolled ? `/mi-aprendizaje/${studyCourseId}` : null

                  return (
                    <li className="course-row" key={course.id}>
                      <CourseRowBody
                        course={course}
                        studyHref={studyHref}
                        isPurchased={isPurchased || isEnrolled}
                      />

                      <span
                        className={`course-row__status${
                          isPurchased || isEnrolled ? ' course-row__status--enrolled' : ''
                        }${
                          !isPurchased && !isEnrolled && course.progress === 0
                            ? ' course-row__status--idle'
                            : ''
                        }`}
                      >
                        {course.status}
                      </span>

                      {/* Inscrito: toda la fila y la flecha abren el curso. El resto
                          conserva la ficha publica o el boton deshabilitado de
                          siempre, porque no son contenido de esta demo. */}
                      {studyHref ? (
                        <Link
                          className="course-row__go course-row__go--link"
                          to={studyHref}
                          aria-label={`Estudiar ${course.title}`}
                        >
                          <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
                        </Link>
                      ) : hasDetailPage ? (
                        <Link
                          className="course-row__go course-row__go--link"
                          to={`/cursos/${catalogCourse.slug}`}
                          aria-label={`Ver ${course.title}`}
                        >
                          <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
                        </Link>
                      ) : (
                        <button
                          className="course-row__go"
                          type="button"
                          disabled
                          aria-label={`Abrir ${course.title} (demo, sin contenido)`}
                          title="Sin contenido en la demostración"
                        >
                          <ChevronRight size={17} strokeWidth={2.2} aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>

            <p className="learning__demo-note">
              Demostración: los cursos y el avance son ficticios y no se guardan en ningún
              servidor.
            </p>
          </div>

          {/* ---------- Resumen lateral ---------- */}
          <aside className="summary" aria-label="Resumen de tu progreso">
            <section className="panel panel--progress">
              <div className="panel__head">
                <h2 className="panel__title">Mi progreso general</h2>
              </div>

              <div className="ring" style={{ '--ring-value': `${DEMO_OVERVIEW.overallProgress * 3.6}deg` }}>
                <span className="ring__inner">{DEMO_OVERVIEW.overallProgress}%</span>
              </div>

              <p className="summary__goal">
                <Target size={15} strokeWidth={2} aria-hidden="true" />
                <span>
                  Siguiente objetivo: <strong>{DEMO_OVERVIEW.nextGoal}</strong>
                </span>
              </p>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Mis certificados</h2>
                <span className="panel__badge">{DEMO_OVERVIEW.certificatesCount}</span>
              </div>

              <div className="summary__cert">
                <span className="summary__cert-icon" aria-hidden="true">
                  <Award size={20} strokeWidth={1.9} />
                </span>

                <div>
                  <p className="summary__cert-title">
                    {DEMO_CERTIFICATES[0]?.title ?? 'Sin certificados'}
                  </p>
                  <p className="summary__cert-sub">
                    {DEMO_CERTIFICATES[0]?.hours} horas · demo
                  </p>
                </div>
              </div>

              <Link className="summary__link" to="/mis-certificados">
                Ver certificados
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2 className="panel__title">Actividad reciente</h2>
              </div>

              <ul className="timeline">
                {DEMO_ACTIVITY.map((item) => (
                  <li className="timeline__item" key={item.id}>
                    <span className="timeline__dot" aria-hidden="true" />
                    <div>
                      <p className="timeline__text">{item.text}</p>
                      <p className="timeline__when">{item.when}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </StudentShell>
  )
}

export default function LearningPage() {
  return (
    <RequireDemoSession>
      <LearningView />
    </RequireDemoSession>
  )
}