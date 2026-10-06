import { createContext, useContext } from 'react'

/*
  Modelo de compras e inscripciones (modo demostracion).

  Cada compra es de UN SOLO curso. Cuando una compra pasa a "approved" se crea
  la inscripcion correspondiente. No se guarda ningun dato de tarjeta: solo id,
  usuario, curso, importe y estado.

  ESTRUCTURA PARA PRODUCCION
  --------------------------
  Pasarela -> backend -> webhook -> validacion de la operacion -> guardar compra
  -> crear inscripcion. El frontend solo pinta el resultado confirmado.
  Aqui, en cambio, la resolucion ocurre en memoria del navegador: es UX de
  prototipo, NO una confirmación de pago.
*/

export const PURCHASE_STATUS = {
  pending: 'pending',
  processing: 'processing',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled',
}

/* Estados en los que una compra todavia puede cambiar. */
export const OPEN_PURCHASE_STATUSES = [PURCHASE_STATUS.pending, PURCHASE_STATUS.processing]

export const DemoPurchaseContext = createContext(null)

export function createPurchase({
  id,
  userId,
  courseId,
  amount,
  status = PURCHASE_STATUS.pending,
  createdAt,
}) {
  return { id, userId, courseId, amount, status, createdAt }
}

export function createEnrollment({ userId, courseId, enrolledAt, progress = 0 }) {
  return { userId, courseId, enrolledAt, progress }
}

/* Un usuario no puede estar inscrito dos veces en el mismo curso. */
export function isEnrolledIn(enrollments, userId, courseId) {
  return enrollments.some(
    (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId,
  )
}

/* Tampoco puede haber dos compras abiertas para el mismo curso. */
export function hasOpenPurchase(purchases, userId, courseId) {
  return purchases.some(
    (purchase) =>
      purchase.userId === userId &&
      purchase.courseId === courseId &&
      OPEN_PURCHASE_STATUSES.includes(purchase.status),
  )
}

export function useDemoPurchases() {
  const context = useContext(DemoPurchaseContext)

  if (!context) {
    throw new Error('useDemoPurchases debe usarse dentro de <DemoPurchaseProvider>')
  }

  return context
}