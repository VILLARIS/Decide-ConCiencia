import { useId, useRef, useState } from 'react'
import {
  Bold,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import AdminLessonPreview, { LessonTypeIcon } from './AdminLessonPreview'
import { countWords } from './lessonRichText'
import { useOverlayDismiss } from './useOverlayDismiss'
import {
  DOWNLOADABLE_EXTENSIONS,
  LESSON_STATUS,
  LESSON_STATUS_LABELS,
  LESSON_TYPE_LABELS,
  LESSON_TYPE_ORDER,
  LESSON_TYPES,
  VIDEO_PROVIDERS,
  createFileMeta,
  createLesson,
  createQuestion,
  createQuestionOption,
  formatFileSize,
  getFileExtension,
  normalizeLesson,
  validateLesson,
} from '../../demo/demoCourseContent'
import './AdminArea.css'

/*
  Drawer de edicion de una leccion.

  Editar una leccion ocurre aqui, no en la lista. La lista muestra filas
  compactas con el titulo y un dato de apoyo; abrir una leccion no debe
  empujar el resto del temario ni convertir el editor en una pagina de veinte
  campos abiertos.

  Panel lateral y no modal centrado: una lectura con texto, o una evaluacion
  con cinco preguntas, necesita ancho. En movil pasa a ocupar la pantalla
  entera y el formulario va a una columna (ver AdminArea.css).

  El componente controla su propio estado y entrega la leccion terminada con
  onSave. No toca el temario: de eso se encarga la pantalla del editor.
*/

const TYPE_HINTS = {
  [LESSON_TYPES.video]: 'Enlaza un video ya alojado. La subida directa llega con el proveedor.',
  [LESSON_TYPES.text]: 'Una lectura con negritas, listas, subtitulos y enlaces.',
  [LESSON_TYPES.file]: 'Un PDF o material que el estudiante descarga.',
  [LESSON_TYPES.evaluation]: 'Preguntas de opcion multiple. Sin resultados ni analitica.',
}

/* ---------- Campos por tipo ---------- */

function VideoFields({ lesson, setField, error }) {
  const providerId = useId()

  return (
    <div className="admin-fields">
      <label className="admin-field">
        <span className="admin-field__label">URL del video</span>
        <input
          className="admin-input"
          type="url"
          value={lesson.videoUrl}
          onChange={(event) => setField('videoUrl', event.target.value)}
          placeholder="https://..."
          aria-invalid={Boolean(error)}
        />
      </label>

      <div className="admin-field-row">
        <label className="admin-field">
          <span className="admin-field__label">Duración (opcional)</span>
          <input
            className="admin-input"
            type="text"
            value={lesson.duration}
            onChange={(event) => setField('duration', event.target.value)}
            placeholder="12:40"
          />
        </label>

        <label className="admin-field">
          <span className="admin-field__label" id={providerId}>
            Proveedor previsto
          </span>
          <select
            className="admin-input"
            value={lesson.videoProvider}
            onChange={(event) => setField('videoProvider', event.target.value)}
            aria-describedby={providerId}
          >
            <option value="">Sin especificar</option>
            {VIDEO_PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/*
        Boton visible, sin accion de subida.

        Se muestra para dejar claro cual sera el flujo cuando haya proveedor, y
        no finge: avisa de que todavia no se puede subir. Cuando exista backend,
        este bloque se sustituye por el input de archivo y el flujo pasa a ser
        subir -> progreso -> listo, sin tocar el modelo.
      */}
      <div className="admin-upload-hint">
        <button className="admin-btn" type="button" disabled>
          <Upload size={15} strokeWidth={2} aria-hidden="true" />
          Agregar video
        </button>
        <p className="admin-upload-hint__text">
          La subida de archivos todavía no está disponible: por ahora se usa la URL. Se
          podrá integrar con Vimeo, Bunny Stream o Cloudflare Stream.
        </p>
      </div>
    </div>
  )
}

/* ---------- Texto ---------- */

/* Barra de formato: inserta marcas de markdown en el cursor. */
function TextFields({ lesson, setField }) {
  const textareaRef = useRef(null)

  /*
    Inserta el formato rodeando la seleccion. Si no hay seleccion, solo pone la
    marca: es el comportamiento de un editor de texto normal, y se acepta que
    el cursor no quede dentro de las marcas.
  */
  const applyFormat = (format) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const selected = value.slice(selectionStart, selectionEnd)
    const next = `${value.slice(0, selectionStart)}${format}${selected}${format}${value.slice(
      selectionEnd,
    )}`

    setField('textContent', next)

    /* El textarea es controlado, asi que hay que devolverle el foco y la
       seleccion a mano. */
    requestAnimationFrame(() => {
      textarea.focus()
      const caret = selectionStart + format.length
      textarea.setSelectionRange(caret, caret + selected.length)
    })
  }

  /* El enlace necesita URL, asi que va aparte de los tres formatos de golpe. */
  const applyLink = () => {
    const url = window.prompt('URL del enlace (http o https)')
    if (!url) return

    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value } = textarea
    const selected = value.slice(selectionStart, selectionEnd) || 'texto del enlace'
    const link = `[${selected}](${url.trim()})`

    setField('textContent', `${value.slice(0, selectionStart)}${link}${value.slice(selectionEnd)}`)
  }

  return (
    <div className="admin-fields">
      <div className="admin-field">
        <span className="admin-field__label">Contenido de la lectura</span>

        <div className="admin-texteditor">
          <div className="admin-texteditor__bar">
            <button
              className="admin-texteditor__btn"
              type="button"
              onClick={() => applyFormat('**')}
              title="Negrita"
              aria-label="Negrita"
            >
              <Bold size={14} strokeWidth={2.4} aria-hidden="true" />
            </button>

            <button
              className="admin-texteditor__btn"
              type="button"
              onClick={() => applyFormat('*')}
              title="Cursiva"
              aria-label="Cursiva"
            >
              <Italic size={14} strokeWidth={2.4} aria-hidden="true" />
            </button>

            <button
              className="admin-texteditor__btn"
              type="button"
              onClick={() => applyFormat('\n## ')}
              title="Subtitulo"
              aria-label="Subtitulo"
            >
              <Heading2 size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <button
              className="admin-texteditor__btn"
              type="button"
              onClick={() => applyFormat('\n- ')}
              title="Lista"
              aria-label="Lista"
            >
              <List size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <button
              className="admin-texteditor__btn"
              type="button"
              onClick={applyLink}
              title="Enlace"
              aria-label="Enlace"
            >
              <Link2 size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <span className="admin-texteditor__count">
              {countWords(lesson.textContent)} palabras
            </span>
          </div>

          <textarea
            className="admin-texteditor__area"
            ref={textareaRef}
            rows={12}
            value={lesson.textContent}
            onChange={(event) => setField('textContent', event.target.value)}
            placeholder={'Un parrafo de introduccion.\n\n## Un subtitulo\n- Un punto de lista\n- Otro punto'}
          />
        </div>

        <p className="admin-texteditor__hint">
          Negrita con **doble asterisco**, subtitulos con ## y enlaces como
          [texto](https://destino). Se ve igual en la vista previa.
        </p>
      </div>
    </div>
  )
}

/* ---------- Archivo ---------- */

function FileFields({ lesson, setField, error }) {
  const fileInputRef = useRef(null)

  /*
    Solo se leen nombre y tamaño. El archivo no se sube a ningun sitio: el
    backend de archivos no existe, y fingir que si seria hacer que la doctora
    creyera que sus materiales estan guardados.
  */
  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setField(
      'file',
      createFileMeta({ name: file.name, size: file.size, ext: getFileExtension(file.name) }),
    )
  }

  const clearFile = () => {
    setField('file', null)

    /* El input conserva el archivo elegido; sin esto, volver a marcar el
       mismo nombre no dispararia onChange. */
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const accept = DOWNLOADABLE_EXTENSIONS.join(',')

  return (
    <div className="admin-fields">
      <div className="admin-field">
        <span className="admin-field__label">Archivo</span>

        {lesson.file?.name ? (
          <div className="admin-file">
            <span className="admin-file__icon" aria-hidden="true">
              {(lesson.file.ext || '').replace('.', '').toUpperCase() || 'ARCHIVO'}
            </span>

            <div className="admin-file__copy">
              <p className="admin-file__name">{lesson.file.name}</p>
              <p className="admin-file__meta">
                {formatFileSize(lesson.file.size)} · {lesson.file.ext || 'sin extensión'}
              </p>
            </div>

            <div className="admin-file__actions">
              <button
                className="admin-btn admin-btn--sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Reemplazar
              </button>

              <button
                className="admin-iconbtn"
                type="button"
                onClick={clearFile}
                aria-label={`Eliminar ${lesson.file.name}`}
                title="Eliminar archivo"
              >
                <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-file admin-file--empty">
            <button
              className="admin-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} strokeWidth={2} aria-hidden="true" />
              Seleccionar archivo
            </button>

            <p className="admin-file__hint">
              {DOWNLOADABLE_EXTENSIONS.join(', ')} · un archivo por lección
            </p>
          </div>
        )}

        <input
          className="admin-file__input"
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
        />

        {error ? <p className="admin-field__error">{error}</p> : null}
      </div>

      <p className="admin-note admin-note--tight">
        En la demostración solo se guardan el nombre y el tamaño del archivo: no se sube
        ningún archivo a un servidor.
      </p>
    </div>
  )
}

/* ---------- Evaluacion ---------- */

function QuestionEditor({ question, index, onChange, onRemove }) {
  const setQuestionField = (field, value) => onChange({ ...question, [field]: value })

  const setOptionText = (optionId, text) => {
    onChange({
      ...question,
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, text } : option,
      ),
    })
  }

  /* Cada opcion lleva un boton de radio: es la forma de marcar la correcta sin
    recurrir a un desplegable con "¿cual es?". */
  const markCorrect = (optionId) => setQuestionField('correctOptionId', optionId)

  const addOption = () => {
    onChange({ ...question, options: [...question.options, createQuestionOption()] })
  }

  /* No se baja de dos: una opcion multiple con una sola opcion no es una
     pregunta. */
  const canRemoveOption = question.options.length > 2

  const removeOption = (optionId) => {
    const options = question.options.filter((option) => option.id !== optionId)

    onChange({
      ...question,
      options,
      /* Si se borro la correcta, la primera opcion pasa a serlo. */
      correctOptionId:
        question.correctOptionId === optionId ? (options[0]?.id ?? null) : question.correctOptionId,
    })
  }

  return (
    <fieldset className="admin-question">
      <legend className="admin-question__legend">Pregunta {index + 1}</legend>

      <div className="admin-question__head">
        <input
          className="admin-input admin-input--inline"
          type="text"
          value={question.text}
          onChange={(event) => setQuestionField('text', event.target.value)}
          placeholder="Texto de la pregunta"
        />

        <button
          className="admin-iconbtn"
          type="button"
          onClick={onRemove}
          aria-label={`Eliminar pregunta ${index + 1}`}
          title="Eliminar pregunta"
        >
          <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <ul className="admin-options">
        {question.options.map((option) => {
          const isCorrect = question.correctOptionId === option.id

          return (
            <li className="admin-option" key={option.id}>
              <label className="admin-option__correct" title="Marcar como respuesta correcta">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={isCorrect}
                  onChange={() => markCorrect(option.id)}
                />
                <span className="admin-visually-hidden">Respuesta correcta</span>
              </label>

              <input
                className="admin-input admin-input--inline"
                type="text"
                value={option.text}
                onChange={(event) => setOptionText(option.id, event.target.value)}
                placeholder="Opción"
                aria-invalid={isCorrect}
              />

              <button
                className="admin-iconbtn"
                type="button"
                onClick={() => removeOption(option.id)}
                disabled={!canRemoveOption}
                aria-label={`Eliminar opción ${index + 1}`}
                title={
                  canRemoveOption ? 'Eliminar opción' : 'Una pregunta necesita dos opciones'
                }
              >
                <X size={15} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>

      <button className="admin-btn admin-btn--sm" type="button" onClick={addOption}>
        <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
        Añadir opción
      </button>
    </fieldset>
  )
}

function EvaluationFields({ lesson, setEvaluation, error }) {
  const evaluation = lesson.evaluation
  const questions = evaluation.questions

  const setQuestion = (questionId, nextQuestion) => {
    setEvaluation({
      ...evaluation,
      questions: questions.map((question) =>
        question.id === questionId ? nextQuestion : question,
      ),
    })
  }

  const addQuestion = () => setEvaluation({ ...evaluation, questions: [...questions, createQuestion()] })

  const removeQuestion = (questionId) => {
    setEvaluation({ ...evaluation, questions: questions.filter((q) => q.id !== questionId) })
  }

  return (
    <div className="admin-fields">
      <label className="admin-field">
        <span className="admin-field__label">Nombre de la evaluación</span>
        <input
          className="admin-input"
          type="text"
          value={evaluation.name}
          onChange={(event) => setEvaluation({ ...evaluation, name: event.target.value })}
          placeholder="Evaluación · Módulo 1"
        />
      </label>

      <div className="admin-field">
        <div className="admin-field__labelrow">
          <span className="admin-field__label">Preguntas</span>
          <span className="admin-field__hint">
            {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}
          </span>
        </div>

        {questions.length > 0 ? (
          <div className="admin-questions">
            {questions.map((question, index) => (
              <QuestionEditor
                question={question}
                index={index}
                key={question.id}
                onChange={(next) => setQuestion(question.id, next)}
                onRemove={() => removeQuestion(question.id)}
              />
            ))}
          </div>
        ) : (
          <p className="admin-panel__empty admin-panel__empty--tight">
            Esta evaluación no tiene preguntas.
          </p>
        )}

        <button className="admin-btn admin-btn--sm" type="button" onClick={addQuestion}>
          <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
          Añadir pregunta
        </button>

        {error ? <p className="admin-field__error">{error}</p> : null}
      </div>
    </div>
  )
}

/* ---------- Selector de tipo ---------- */

function TypePicker({ value, onChange }) {
  return (
    <div className="admin-types" role="radiogroup" aria-label="Tipo de contenido">
      {LESSON_TYPE_ORDER.map((type) => {
        const isActive = type === value

        return (
          <button
            className={`admin-type${isActive ? ' admin-type--active' : ''}`}
            key={type}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(type)}
          >
            <LessonTypeIcon type={type} size={16} />
            <span>{LESSON_TYPE_LABELS[type]}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ========================================================================
   Drawer
   ======================================================================== */

export default function AdminLessonDrawer({ open, lesson, type, onClose, onSave }) {
  /*
    Se trabaja sobre una copia: cancelar tiene que descartar los cambios, y no
    se puede conseguir editando el temario directamente.

    `type` es opcional y solo afecta a una leccion nueva: la abre ya con ese tipo
    elegido. Sirve para entrar por la evaluacion sin obligar a pasar por el
    selector de tipo cuando ya se sabe de donde se viene.
  */
  const [draft, setDraft] = useState(() => lesson ?? createLesson({ type }))
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const titleId = useId()
  const panelRef = useRef(null)

  /* Escape cierra y el fondo deja de desplazarse. */
  useOverlayDismiss(open, onClose)

  if (!open) return null

  const isNew = !lesson

  const setField = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }))
  const setEvaluation = (evaluation) => setDraft((prev) => ({ ...prev, evaluation }))

  /* Cambiar de tipo reencuadra la leccion: vacia lo que ya no aplica. */
  const changeType = (type) => {
    setDraft((prev) => normalizeLesson({ ...prev, type }, type))
    setError('')
  }

  const toggleStatus = () => {
    setDraft((prev) => ({
      ...prev,
      status: prev.status === LESSON_STATUS.published ? LESSON_STATUS.draft : LESSON_STATUS.published,
    }))
  }

  const handleSave = () => {
    const validationError = validateLesson(draft)

    if (validationError) {
      setError(validationError)
      return
    }

    onSave(draft)
  }

  const typeFields = {
    [LESSON_TYPES.video]: <VideoFields lesson={draft} setField={setField} />,
    [LESSON_TYPES.text]: <TextFields lesson={draft} setField={setField} />,
    [LESSON_TYPES.file]: <FileFields lesson={draft} setField={setField} error={error} />,
    [LESSON_TYPES.evaluation]: (
      <EvaluationFields lesson={draft} setEvaluation={setEvaluation} error={error} />
    ),
  }

  return (
    <div className="admin-drawer-layer">
      <button
        className="admin-drawer__scrim"
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <aside
        className="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
      >
        <header className="admin-drawer__head">
          <div>
            <p className="admin-drawer__eyebrow">
              {isNew ? 'Nueva lección' : 'Editar lección'}
            </p>
            <h2 className="admin-drawer__title" id={titleId}>
              {draft.title?.trim() || 'Sin título'}
            </h2>
          </div>

          <button
            className="admin-iconbtn"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="admin-drawer__body">
          {/* ---------- Comunes ---------- */}
          <div className="admin-fields">
            <label className="admin-field">
              <span className="admin-field__label">Título de la lección</span>
              <input
                className="admin-input"
                type="text"
                value={draft.title}
                onChange={(event) => setField('title', event.target.value)}
                placeholder="Introducción al metabolismo"
              />
            </label>

            <div className="admin-field">
              <span className="admin-field__label">Tipo de contenido</span>
              <TypePicker value={draft.type} onChange={changeType} />
              <p className="admin-field__hint">{TYPE_HINTS[draft.type]}</p>
            </div>

            <div className="admin-field">
              <span className="admin-field__label">Estado</span>
              <div className="admin-statusrow">
                <span
                  className={`admin-badge admin-badge--${
                    draft.status === LESSON_STATUS.published ? 'published' : 'draft'
                  }`}
                >
                  {LESSON_STATUS_LABELS[draft.status]}
                </span>

                <button className="admin-btn admin-btn--sm" type="button" onClick={toggleStatus}>
                  {draft.status === LESSON_STATUS.published ? 'Pasar a borrador' : 'Publicar lección'}
                </button>

                <span className="admin-field__hint">
                  Una lección en borrador no aparece en el temario del estudiante.
                </span>
              </div>
            </div>
          </div>

          {/* ---------- Campos del tipo ---------- */}
          <div className="admin-drawer__section">{typeFields[draft.type]}</div>

          {error && draft.type !== LESSON_TYPES.file && draft.type !== LESSON_TYPES.evaluation ? (
            <p className="admin-alert admin-alert--error" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        {/* La vista previa va antes del pie: el pie es la ultima fila del panel
            y con la previsualizacion abierta tiene que seguir en el borde
            inferior, no en medio. */}
        {showPreview ? (
          <div className="admin-drawer__preview">
            <p className="admin-drawer__preview-label">Así la verá el estudiante</p>
            <AdminLessonPreview lesson={draft} />
          </div>
        ) : null}

        <footer className="admin-drawer__foot">
          <button
            className="admin-btn admin-btn--sm"
            type="button"
            onClick={() => setShowPreview((visible) => !visible)}
            aria-pressed={showPreview}
          >
            <Eye size={15} strokeWidth={2} aria-hidden="true" />
            {showPreview ? 'Ocultar vista previa' : 'Vista previa'}
          </button>

          <div className="admin-drawer__foot-actions">
            <button className="admin-btn" type="button" onClick={onClose}>
              Cancelar
            </button>

            <button className="admin-btn admin-btn--primary" type="button" onClick={handleSave}>
              {isNew ? 'Crear lección' : 'Guardar lección'}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}
