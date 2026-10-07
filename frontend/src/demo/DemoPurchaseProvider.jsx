import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  Compras e inscripciones en modo demostracion.

  Se monta DENTRO de <DemoAuthProvider>: una compra siempre pertenece a un
  usuario autenticado. Ahora persiste purchases y enrollments en localStorage
  para sobrevivir a F5, manteniendo el aislamiento por userId.
*/

const COMMERCE_STORAGE_KEY = 'yumibiotic.demo.commerce'

function isValidCommerceData(data) {
  if (!data || typeof data !== 'object') return false
  if (!Array.isArray(data.purchases)) return false
  if (!Array.isArray(data.enrollments)) return false
  return true
}

function readStoredCommerce() {
  try {
    const raw = localStorage.getItem(COMMERCE_STORAGE_KEY)
    if (!raw) return { purchases: [], enrollments: [] }
    const parsed = JSON.parse(raw)
    if (isValidCommerceData(parsed)) {
      return {
        purchases: Array.isArray(parsed.purchases) ? parsed.purchases : [],
        enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : [],
      }
    }
    return { purchases: [], enrollments: [] }
  } catch {
    return { purchases: [], enrollments: [] }
  }
}

function writeStoredCommerce({ purchases, enrollments }) {
  try {
    localStorage.setItem(
      COMMERCE_STORAGE_KEY,
      JSON.stringify({
        purchases: Array.isArray(purchases) ? purchases : [],
        enrollments: Array.isArray(enrollments) ? enrollments : [],
      }),
    )
  } catch {
    /* ignorar errores de almacenamiento */
  }
}

let purchaseSequence = 0

function nextPurchaseId() {
  purchaseSequence += 1
  return `purchase-${Date.now()}-${purchaseSequence}`
}

export function DemoPurchaseProvider({ children }) {
  const { user } = useDemoAuth()
  const userId = user?.id ?? null

  const [purchases, setPurchases] = useState(() => readStoredCommerce().purchases)
  const [enrollments, setEnrollments] = useState(() => readStoredCommerce().enrollments)

  const purchasesRef = useRef(purchases)
  const enrollmentsRef = useRef(enrollments)
  useEffect(() => { purchasesRef.current = purchases }, [purchases])
  useEffect(() => { enrollmentsRef.current = enrollments }, [enrollments])
  useEffect(() => { writeStoredCommerce({ purchases, enrollments }) }, [purchases, enrollments])

  const startPurchase = useCallback(
    ({ courseId, amount }) => {
      if (!userId) return null

      const currentPurchases = purchasesRef.current
      const currentEnrollments = enrollmentsRef.current

      if (isEnrolledIn(currentEnrollments, userId, courseId)) return null

      const previousFailed = currentPurchases.filter(
        (p) =>
          p.userId === userId &&
          p.courseId === courseId &&
          (p.status === PURCHASE_STATUS.rejected || p.status === PURCHASE_STATUS.cancelled),
      )
      const filtered = previousFailed.length > 0
        ? currentPurchases.filter((p) => !previousFailed.some((f) => f.id === p.id))
        : currentPurchases

      if (hasOpenPurchase(filtered, userId, courseId)) return null

      const purchase = createPurchase({
        id: nextPurchaseId(),
        userId,
        courseId,
        amount,
        createdAt: new Date().toISOString(),
      })

      setPurchases([...filtered, purchase])
      return purchase
    },
    [userId],
  )

  const updatePurchaseStatus = useCallback(
    (purchaseId, status) => {
      if (!userId) return false

      const currentPurchases = purchasesRef.current
      const target = currentPurchases.find((item) => item.id === purchaseId && item.userId === userId)
      if (!target) return false

      const nextPurchases = currentPurchases.map((item) =>
        item.id === purchaseId ? { ...item, status } : item,
      )
      setPurchases(nextPurchases)

      if (status === PURCHASE_STATUS.approved) {
        const currentEnrollments = enrollmentsRef.current
        if (!isEnrolledIn(currentEnrollments, userId, target.courseId)) {
          setEnrollments([
            ...currentEnrollments,
            createEnrollment({
              userId,
              courseId: target.courseId,
              enrolledAt: new Date().toISOString(),
              progress: 0,
            }),
          ])
        }
      }

      return true
    },
    [userId],
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