import { FileText, HelpCircle, Paperclip, Video } from 'lucide-react'
import { renderRichText } from './lessonRichText'
import { LESSON_TYPES, formatFileSize } from '../../demo/demoCourseContent'
import './AdminArea.css'

/*
  Vista de la leccion tal como la ve el estudiante.

  Se usa en dos sitios: dentro del drawer como "vista previa" y como panel de
  solo lectura. Es la misma pieza, para que la doctora vea exactamente lo que
  se guarda y no una aproximacion.

  Lo que NO hace, a proposito:
  - No reproduce el video. Sin proveedor de video integrado no hay un embed que
    sea real; se muestra la referencia, no un reproductor fingido.
  - No descarga el archivo. En la demo solo existen los datos del archivo, asi
    que el boton lo dice en vez de fallar en silencio.
  - No enseña la respuesta correcta de una evaluación. Eso es de la
    corrección, no del alumno.
*/

/* Icono por tipo: es la primera senal de la fila y de la vista. */
const TYPE_ICONS = {
  [LESSON_TYPES.video]: Video,
  [LESSON_TYPES.text]: FileText,
  [LESSON_TYPES.file]: Paperclip,
  [LESSON_TYPES.evaluation]: HelpCircle,
}

export function LessonTypeIcon({ type, size = 16, className = '' }) {
  const Icon = TYPE_ICONS[type] ?? FileText

  return <Icon className={className} size={size} strokeWidth={2} aria-hidden="true" />
}

/* ---------- Video ---------- */

function VideoPreview({ lesson }) {
  return (
    <div className="admin-preview__video">
      {/* Marco de reproductor sin reproductor. Un rectangulo vacio seria un
          bug, asi que se dice que es lo que es. */}
      <div className="admin-preview__video-frame">
        <LessonTypeIcon type={LESSON_TYPES.video} size={26} />
        <span className="admin-preview__video-frame-text">
          {lesson.duration ? `Video · ${lesson.duration}` : 'Video'}
        </span>
      </div>

      <dl className="admin-preview__facts">
        <div>
          <dt>URL</dt>
          <dd className="admin-preview__url">{lesson.videoUrl}</dd>
        </div>

        {lesson.videoProvider ? (
          <div>
            <dt>Proveedor previsto</dt>
            <dd>{lesson.videoProvider}</dd>
          </div>
        ) : null}
      </dl>

      <p className="admin-preview__disclaimer">
        En la demostración el video no se reproduce: solo se guarda la URL. La
        reproducción llega al integrar un proveedor de video.
      </p>
    </div>
  )
}

/* ---------- Texto ---------- */

function TextPreview({ lesson }) {
  const { html, isEmpty } = renderRichText(lesson.textContent)

  if (isEmpty) {
    return <p className="admin-preview__empty">Esta lectura todavía no tiene contenido.</p>
  }

  /* El HTML viene de renderRichText, que escapa el texto antes de convertirlo y
     solo admite un conjunto cerrado de etiquetas. Ver el comentario de ese
     archivo antes de tocar esta linea. */
  return <div className="admin-preview__text" dangerouslySetInnerHTML={{ __html: html }} />
}

/* ---------- Archivo ---------- */

function FilePreview({ lesson }) {
  const file = lesson.file

  if (!file?.name) {
    return <p className="admin-preview__empty">No hay archivo.</p>
  }

  return (
    <div className="admin-preview__file">
      <span className="admin-preview__file-icon" aria-hidden="true">
        {file.ext.replace('.', '').toUpperCase() || 'ARCHIVO'}
      </span>

      <div>
        <p className="admin-preview__file-name">{file.name}</p>
        <p className="admin-preview__file-meta">
          {formatFileSize(file.size)} · {file.ext || 'sin extensión'}
        </p>
      </div>
    </div>
  )
}

/* ---------- Evaluacion ---------- */

function EvaluationPreview({ lesson }) {
  const evaluation = lesson.evaluation
  const questions = evaluation?.questions ?? []

  if (!evaluation?.name || questions.length === 0) {
    return <p className="admin-preview__empty">Esta evaluación todavía no tiene preguntas.</p>
  }

  return (
    <div className="admin-preview__evaluation">
      <p className="admin-preview__evaluation-name">{evaluation.name}</p>
      <p className="admin-preview__evaluation-count">
        {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'} · opción múltiple
      </p>

      <ol className="admin-preview__questions">
        {questions.map((question, index) => (
          <li className="admin-preview__question" key={question.id}>
            <p className="admin-preview__question-text">
              <span className="admin-preview__question-index">{index + 1}</span>
              {question.text}
            </p>

            <ul className="admin-preview__options">
              {question.options.map((option) => (
                <li className="admin-preview__option" key={option.id}>
                  {option.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="admin-preview__disclaimer">
        Las respuestas correctas no se muestran en la vista del estudiante. La
        corrección y el resultado son del Plan Integral.
      </p>
    </div>
  )
}

/* ---------- Vista completa ---------- */

export default function AdminLessonPreview({ lesson }) {
  if (!lesson) return null

  return (
    <div className="admin-preview">
      <header className="admin-preview__head">
        <span className="admin-preview__type">
          <LessonTypeIcon type={lesson.type} size={15} />
        </span>
        <h3 className="admin-preview__title">{lesson.title || 'Lección sin título'}</h3>
      </header>

      <div className="admin-preview__body">
        {lesson.type === LESSON_TYPES.video ? <VideoPreview lesson={lesson} /> : null}
        {lesson.type === LESSON_TYPES.text ? <TextPreview lesson={lesson} /> : null}
        {lesson.type === LESSON_TYPES.file ? <FilePreview lesson={lesson} /> : null}
        {lesson.type === LESSON_TYPES.evaluation ? <EvaluationPreview lesson={lesson} /> : null}
      </div>
    </div>
  )
}
