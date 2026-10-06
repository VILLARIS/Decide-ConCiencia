import { createContext, useContext } from 'react'
import {
  LESSON_STATUS,
  LESSON_TYPES,
  LESSON_TYPE_LABELS,
  LESSON_TYPE_SHORT_LABELS,
  canMove,
  countLessons,
  countPublishedLessons,
  createLesson,
  createModule,
  getLessonSummary,
  getLessonTitle,
  moveItem,
  normalizeContent,
  normalizeLesson,
  validateLesson,
} from './demoCourseContent'

/*
  Contexto de contenido de cursos: solo el objeto, sin componentes.

  Vive aparte de <DemoCourseContentProvider> para que ese archivo exporte
  unicamente componentes y React Fast Refresh funcione en desarrollo, igual que
  demoAuthStore.js y demoPurchaseStore.js.

  Aqui tambien viven las operaciones de lista. Son puras (reciben la lista y
  devuelven una lista nueva), asi que el editor no necesita reducer: compone
  llamadas y cada movimiento de modulo o leccion se lee en un solo sitio.
*/

export const DemoCourseContentContext = createContext(null)

/* ---------- Movimientos ---------- */

/* Sube o baja un modulo. El array es de modulos, no de lecciones. */
export function moveModule(modules, moduleIndex, direction) {
  return normalizeContent(moveItem(modules, moduleIndex, direction))
}

/* Sube o baja una leccion dentro de su modulo. */
export function moveLesson(modules, moduleId, lessonIndex, direction) {
  return normalizeContent(
    modules.map((module) =>
      module.id === moduleId
        ? { ...module, lessons: moveItem(module.lessons, lessonIndex, direction) }
        : module,
    ),
  )
}

export function canMoveModule(modules, moduleIndex, direction) {
  return canMove(moduleIndex, modules.length, direction)
}

export function canMoveLesson(module, lessonIndex, direction) {
  return canMove(lessonIndex, module.lessons.length, direction)
}

/* ---------- Altas ---------- */

/*
  Anade una leccion en blanco al final del modulo.

  El editor la abre en el drawer inmediatamente, con el tipo ya elegido. Anadir
  en blanco y luego editar era el flujo anterior, y dejaba filas vacias si la
  doctora se olvidaba de una.
*/
export function appendLesson(modules, moduleId, lesson = createLesson()) {
  return normalizeContent(
    modules.map((module) =>
      module.id === moduleId ? { ...module, lessons: [...module.lessons, lesson] } : module,
    ),
  )
}

/* Reemplaza una leccion conservando su posicion. */
export function replaceLesson(modules, moduleId, lessonId, nextLesson) {
  return normalizeContent(
    modules.map((module) =>
      module.id === moduleId
        ? {
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? nextLesson : lesson,
            ),
          }
        : module,
    ),
  )
}

export function removeLesson(modules, moduleId, lessonId) {
  return normalizeContent(
    modules.map((module) =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
        : module,
    ),
  )
}

export function appendModule(modules, module = createModule()) {
  return normalizeContent([...modules, module])
}

export function removeModule(modules, moduleId) {
  return normalizeContent(modules.filter((module) => module.id !== moduleId))
}

/* ---------- Busqueda ---------- */

export function findLesson(modules, lessonId) {
  for (const module of modules) {
    const lesson = module.lessons.find((item) => item.id === lessonId)
    if (lesson) return { module, lesson }
  }

  return { module: null, lesson: null }
}

/* ---------- Resumen para el encabezado del panel ---------- */

export function summarizeContent(modules) {
  return {
    modules: modules.length,
    lessons: countLessons(modules),
    published: countPublishedLessons(modules),
  }
}

/*
  Lecciones de un tipo concreto. La vista previa del estudiante solo muestra
  las publicadas, y esta es la funcion que decide cuales son.
*/
export function getPublishedLessons(modules) {
  return modules.flatMap((module) =>
    module.lessons.filter((lesson) => lesson.status === LESSON_STATUS.published),
  )
}

/* ---------- Hook ---------- */

export function useDemoCourseContent() {
  const context = useContext(DemoCourseContentContext)

  if (!context) {
    throw new Error('useDemoCourseContent debe usarse dentro de <DemoCourseContentProvider>')
  }

  return context
}

/* Reexports: las paginas del panel no necesitan llegar a demoCourseContent.js
   para las operaciones basicas. */
export {
  LESSON_STATUS,
  LESSON_TYPES,
  LESSON_TYPE_LABELS,
  LESSON_TYPE_SHORT_LABELS,
  countLessons,
  createLesson,
  createModule,
  getLessonSummary,
  getLessonTitle,
  normalizeLesson,
  validateLesson,
}
