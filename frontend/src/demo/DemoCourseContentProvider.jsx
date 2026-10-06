import { useCallback, useMemo, useState } from 'react'
import { DEMO_COURSE_CONTENT, emptyContent, normalizeContent } from './demoCourseContent'
import { DemoCourseContentContext } from './demoCourseContentStore'

/*
  Contenido de los cursos en memoria: modulos y lecciones.

  MODO DEMO
  ---------
  Sin backend. El contenido vive en un useState mientras la pestana siga
  abierta, asi que sobrevive a la navegacion entre paginas del panel: al
  guardar un curso y volver a abrirlo, sigue ahi. Al recargar se pierde, igual
  que la sesion.

  Por que un provider y no un useState en la pagina del editor: el contenido
  tiene que sobrevivir a un <Link> de ida y vuelta. Con estado local en la
  pagina, guardar y volver a abrir el curso daria un formulario vacio, que es
  justo lo que la doctora no puede trabajar.

  Cada funcion de aqui tiene su equivalente real cuando exista la API:
  - getCourseContent  -> GET    /courses/:id/content
  - saveCourseContent -> PUT    /courses/:id/content

  Se normaliza al guardar para que `order` viaje explicito y el backend no
  tenga que deducirlo de la posicion de un array.
*/

export function DemoCourseContentProvider({ children }) {
  /* Clave por courseId. Se parte del contenido de ejemplo para que los cursos
     de la demo lleguen al editor con temario visible. */
  const [contentByCourse, setContentByCourse] = useState(DEMO_COURSE_CONTENT)

  /*
    Contenido de un curso. Si no hay nada guardado devuelve un array vacio,
    nunca undefined: el editor distingue "sin contenido" con .length y asi
    queda un solo camino.
  */
  const getCourseContent = useCallback(
    (courseId) => contentByCourse[courseId] ?? emptyContent(),
    [contentByCourse],
  )

  /* Guarda el contenido completo del curso y recalcula los `order`. */
  const saveCourseContent = useCallback((courseId, modules) => {
    setContentByCourse((prev) => ({ ...prev, [courseId]: normalizeContent(modules) }))
  }, [])

  const value = useMemo(
    () => ({ contentByCourse, getCourseContent, saveCourseContent }),
    [contentByCourse, getCourseContent, saveCourseContent],
  )

  return <DemoCourseContentContext.Provider value={value}>{children}</DemoCourseContentContext.Provider>
}
