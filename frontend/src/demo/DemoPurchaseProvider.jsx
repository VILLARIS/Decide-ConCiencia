import { useCallback, useMemo, useState } from 'react'
import { DEMO_CATALOG } from './demoCatalog'
import {
  PURCHASE_STATUS,
  createEnrollment,
  createPurchase,
  hasOpenPurchase,
  isEnrolledIn,
} from './demoPurchaseStore'
import { DemoPurchaseContext } from './demoPurchaseStore'
import { useDemoAuth } from './demoAuthStore'

/*
  Compras e inscripciones en memoria (modo demostracion).

  Se monta DENTRO de <DemoAuthProvider>: una compra siempre pertenece a un
  usuario autenticado. No se persiste nada al recargar.

  Cuando una compra pasa a "approved" se crea la inscripcion. Al hacerlo se
  comprueba antes que no exista ya una inscripcion para ese par usuario/curso,
  de modo que un segundo pago del mismo curso no genera duplicados.

  En produccion, este provider deja de decidir el resultado: la compra se
  guardaria en el backend a partir del webhook de la pasarela y esta capa solo
  leeria lo que el backend confirmo.
*/

let purchaseSequence = 0

function nextPurchaseId() {
  purchaseSequence += 1
  return `purchase-${Date.now()}-${purchaseSequence}`
}

export function DemoPurchaseProvider({ children }) {
  const { user } = useDemoAuth()
  const userId = user?.id ?? null

  const [purchases, setPurchases] = useState([])
  const [enrollments, setEnrollments] = useState([])

  /* Crea la compra en estado "pending". Devuelve null si ya esta inscrito o si
     ya tiene una compra abierta, para bloquear la doble compra desde el origen. */
  const startPurchase = useCallback(
    ({ courseId, amount }) => {
      if (!userId) return null

      const alreadyEnrolled = isEnrolledIn(enrollments, userId, courseId)
      const alreadyOpen = hasOpenPurchase(purchases, userId, courseId)

      if (alreadyEnrolled || alreadyOpen) return null

      const purchase = createPurchase({
        id: nextPurchaseId(),
        userId,
        courseId,
        amount,
        createdAt: new Date().toISOString(),
      })

      setPurchases((prev) => [...prev, purchase])
      return purchase
    },
    [enrollments, purchases, userId],
  )

  /* Unicavia de cambio de estado. Al aprobar, crea la inscripcion. */
  const updatePurchaseStatus = useCallback(
    (purchaseId, status) => {
      if (!userId) return

      const purchase = purchases.find((item) => item.id === purchaseId)
      if (!purchase || purchase.userId !== userId) return

      setPurchases((prev) =>
        prev.map((item) => (item.id === purchaseId ? { ...item, status } : item)),
      )

      if (status === PURCHASE_STATUS.approved) {
        setEnrollments((prev) => {
          if (isEnrolledIn(prev, userId, purchase.courseId)) return prev

          return [
            ...prev,
            createEnrollment({
              userId,
              courseId: purchase.courseId,
              enrolledAt: new Date().toISOString(),
              progress: 0,
            }),
          ]
        })
      }
    },
    [purchases, userId],
  )

  const getPurchases = useCallback(
    () => purchases.filter((purchase) => purchase.userId === userId),
    [purchases, userId],
  )

  const hasEnrollment = useCallback(
    (courseId) => (userId ? isEnrolledIn(enrollments, userId, courseId) : false),
    [enrollments, userId],
  )

  /* Cursos inscritos, con los datos de presentacion del catalogo. */
  const enrolledCourses = useMemo(
    () =>
      enrollments
        .filter((enrollment) => enrollment.userId === userId)
        .map((enrollment) => {
          const course = DEMO_CATALOG.find((item) => item.id === enrollment.courseId)
          if (!course) return null

          return {
            id: course.id,
            title: course.title,
            category: course.category,
            level: course.level,
            tone: course.tone,
            progress: enrollment.progress,
            status: 'Inscrito',
            enrolled: true,
            enrolledAt: enrollment.enrolledAt,
          }
        })
        .filter(Boolean),
    [enrollments, userId],
  )

  const value = useMemo(
    () => ({
      purchases,
      enrollments,
      startPurchase,
      updatePurchaseStatus,
      getPurchases,
      hasEnrollment,
      enrolledCourses,
    }),
    [
      purchases,
      enrollments,
      startPurchase,
      updatePurchaseStatus,
      getPurchases,
      hasEnrollment,
      enrolledCourses,
    ],
  )

  return <DemoPurchaseContext.Provider value={value}>{children}</DemoPurchaseContext.Provider>
}