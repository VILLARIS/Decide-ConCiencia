import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { LessonTypeIcon } from './AdminLessonPreview'
import AdminConfirm from './AdminConfirm'
import {
  LESSON_STATUS,
  LESSON_TYPE_SHORT_LABELS,
  canMoveLesson,
  canMoveModule,
  getLessonSummary,
  getLessonTitle,
  moveLesson,
  moveModule,
  removeLesson,
  removeModule,
  summarizeContent,
} from '../../demo/demoCourseContentStore'
import './AdminArea.css'

/*
  Temario del curso: modulos y lecciones.

  Dos niveles de detalle, y solo dos:

  1. MODULO: nombre editable en linea, numero de lecciones y sus acciones.
  2. LECCION: una fila compacta con icono, titulo, tipo y un dato de apoyo.

  Los campos de la leccion no viven aqui. Se abren en el drawer, porque cuatro
  lecciones abiertas a la vez son veinte inputs y un temario ilegible. Ese era
  el problema del editor anterior: la lista crecia con cada leccion y hacia
  imposible ver el curso entero.

  Reordenar con flechas y no con arrastrar: no hay libreria de drag and drop en
  el proyecto y no merece la pena traerla para dos listas. Las flechas ademas
  funcionan con teclado y con lector de pantalla, que el arrastre no.
*/

export default function AdminCurriculum({
  modules,
  onChange,
  onAddModule,
  onAddLesson,
  onEditLesson,
  onPreviewLesson,
}) {
  /* Lo unico que necesita memoria propia es la confirmacion pendiente: se
     guarda el objetivo en vez de disparar el borrado en el clic. */
  const [pendingDelete, setPendingDelete] = useState(null)

  const summary = summarizeContent(modules)

  /* ---------- Modulos ---------- */

  const setModuleTitle = (moduleId, title) => {
    onChange(
      modules.map((module) => (module.id === moduleId ? { ...module, title } : module)),
    )
  }

  const handleDeleteModule = (module) => {
    /* Un modulo con lecciones no se borra de un clic: confirmar siempre es mas
       barato que volver a escribir el temario. */
    setPendingDelete({
      kind: 'module',
      module,
      title: module.title || 'Módulo sin título',
      count: module.lessons.length,
    })
  }

  const handleDeleteLesson = (module, lesson) => {
    setPendingDelete({
      kind: 'lesson',
      module,
      lesson,
      title: getLessonTitle(lesson),
      count: 0,
    })
  }

  const confirmDelete = () => {
    if (!pendingDelete) return

    if (pendingDelete.kind === 'module') {
      onChange(removeModule(modules, pendingDelete.module.id))
    } else {
      onChange(removeLesson(modules, pendingDelete.module.id, pendingDelete.lesson.id))
    }

    setPendingDelete(null)
  }

  const deleteMessage = pendingDelete
    ? pendingDelete.kind === 'module'
      ? `Se eliminará "${pendingDelete.title}"${
          pendingDelete.count > 0
            ? ` y sus ${pendingDelete.count} ${
                pendingDelete.count === 1 ? 'lección' : 'lecciones'
              }`
            : ''
        }. Puedes volver a escribirlo, pero se pierde.`
      : `Se eliminará "${pendingDelete.title}".`
    : ''

  /* ---------- Lecciones ---------- */

  const handleMoveLesson = (module, lessonIndex, direction) => {
    onChange(moveLesson(modules, module.id, lessonIndex, direction))
  }

  const handleMoveModule = (moduleIndex, direction) => {
    onChange(moveModule(modules, moduleIndex, direction))
  }

  /* ---------- Vista ---------- */

  return (
    <div className="admin-curriculum">
      <div className="admin-curriculum__summary">
        <span>
          {summary.modules} {summary.modules === 1 ? 'módulo' : 'módulos'} · {summary.lessons}{' '}
          {summary.lessons === 1 ? 'lección' : 'lecciones'}
        </span>

        <span className="admin-curriculum__published">
          {summary.published} {summary.published === 1 ? 'publicada' : 'publicadas'}
        </span>

        <button className="admin-btn admin-btn--sm" type="button" onClick={onAddModule}>
          <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
          Añadir módulo
        </button>
      </div>

      {modules.length === 0 ? (
        <p className="admin-panel__empty">
          Este curso todavía no tiene módulos. Añade el primero para empezar a organizar el
          temario.
        </p>
      ) : (
        <ol className="admin-modulelist">
          {modules.map((module, moduleIndex) => (
            <li className="admin-module" key={module.id}>
              <div className="admin-module__head">
                <span className="admin-module__index" aria-hidden="true">
                  {moduleIndex + 1}
                </span>

                <input
                  className="admin-input admin-input--module"
                  type="text"
                  value={module.title}
                  onChange={(event) => setModuleTitle(module.id, event.target.value)}
                  placeholder={`Nombre del módulo ${moduleIndex + 1}`}
                  aria-label={`Nombre del módulo ${moduleIndex + 1}`}
                />

                <span className="admin-module__count">
                  {module.lessons.length}{' '}
                  {module.lessons.length === 1 ? 'lección' : 'lecciones'}
                </span>

                <div className="admin-reorder">
                  <button
                    className="admin-iconbtn"
                    type="button"
                    onClick={() => handleMoveModule(moduleIndex, -1)}
                    disabled={!canMoveModule(modules, moduleIndex, -1)}
                    aria-label={`Subir módulo ${moduleIndex + 1}`}
                    title="Subir"
                  >
                    <ArrowUp size={15} strokeWidth={2.2} aria-hidden="true" />
                  </button>

                  <button
                    className="admin-iconbtn"
                    type="button"
                    onClick={() => handleMoveModule(moduleIndex, 1)}
                    disabled={!canMoveModule(modules, moduleIndex, 1)}
                    aria-label={`Bajar módulo ${moduleIndex + 1}`}
                    title="Bajar"
                  >
                    <ArrowDown size={15} strokeWidth={2.2} aria-hidden="true" />
                  </button>

                  <button
                    className="admin-iconbtn"
                    type="button"
                    onClick={() => handleDeleteModule(module)}
                    aria-label={`Eliminar módulo ${moduleIndex + 1}`}
                    title="Eliminar módulo"
                  >
                    <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {module.lessons.length === 0 ? (
                <p className="admin-module__empty">
                  Sin lecciones. Añade la primera para completar este módulo.
                </p>
              ) : (
                <ul className="admin-lessonlist">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isPublished = lesson.status === LESSON_STATUS.published

                    return (
                      <li className="admin-lessonrow" key={lesson.id}>
                        <span
                          className={`admin-lessonrow__icon admin-lessonrow__icon--${lesson.type}`}
                          title={LESSON_TYPE_SHORT_LABELS[lesson.type]}
                        >
                          <LessonTypeIcon type={lesson.type} size={15} />
                        </span>

                        <div className="admin-lessonrow__body">
                          <p className="admin-lessonrow__title">{getLessonTitle(lesson)}</p>
                          <p className="admin-lessonrow__meta">
                            <span className="admin-lessonrow__type">
                              {LESSON_TYPE_SHORT_LABELS[lesson.type]}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{getLessonSummary(lesson)}</span>
                          </p>
                        </div>

                        <span
                          className={`admin-badge admin-badge--${
                            isPublished ? 'published' : 'draft'
                          }`}
                        >
                          {isPublished ? 'Publicada' : 'Borrador'}
                        </span>

                        <div className="admin-lessonrow__actions">
                          <button
                            className="admin-iconbtn"
                            type="button"
                            onClick={() => handleMoveLesson(module, lessonIndex, -1)}
                            disabled={!canMoveLesson(module, lessonIndex, -1)}
                            aria-label={`Subir ${getLessonTitle(lesson)}`}
                            title="Subir"
                          >
                            <ArrowUp size={14} strokeWidth={2.2} aria-hidden="true" />
                          </button>

                          <button
                            className="admin-iconbtn"
                            type="button"
                            onClick={() => handleMoveLesson(module, lessonIndex, 1)}
                            disabled={!canMoveLesson(module, lessonIndex, 1)}
                            aria-label={`Bajar ${getLessonTitle(lesson)}`}
                            title="Bajar"
                          >
                            <ArrowDown size={14} strokeWidth={2.2} aria-hidden="true" />
                          </button>

                          <button
                            className="admin-iconbtn"
                            type="button"
                            onClick={() => onPreviewLesson(lesson)}
                            aria-label={`Vista previa de ${getLessonTitle(lesson)}`}
                            title="Vista previa"
                          >
                            <Eye size={15} strokeWidth={2} aria-hidden="true" />
                          </button>

                          <button
                            className="admin-iconbtn"
                            type="button"
                            onClick={() => onEditLesson(module, lesson)}
                            aria-label={`Editar ${getLessonTitle(lesson)}`}
                            title="Editar"
                          >
                            <Pencil size={15} strokeWidth={2} aria-hidden="true" />
                          </button>

                          <button
                            className="admin-iconbtn admin-iconbtn--danger"
                            type="button"
                            onClick={() => handleDeleteLesson(module, lesson)}
                            aria-label={`Eliminar ${getLessonTitle(lesson)}`}
                            title="Eliminar lección"
                          >
                            <Trash2 size={15} strokeWidth={2} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              <button
                className="admin-btn admin-btn--sm"
                type="button"
                onClick={() => onAddLesson(module.id)}
              >
                <Plus size={14} strokeWidth={2.2} aria-hidden="true" />
                Añadir lección
              </button>
            </li>
          ))}
        </ol>
      )}

      <AdminConfirm
        open={pendingDelete !== null}
        title={
          pendingDelete?.kind === 'module' ? '¿Eliminar módulo?' : '¿Eliminar lección?'
        }
        description={deleteMessage}
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
