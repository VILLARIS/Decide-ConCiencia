/*
  Intencion de compra pendiente.

  Cuando alguien pulsa "Comprar ahora" sin sesion, el curso que queria se
  guarda aqui. Al terminar el acceso, la pagina de login devuelve al checkout
  de ESE curso, en vez de mandar al inicio.

  Es memoria del modulo: se pierde al recargar la pagina. Es lo correcto para
  una demo, porque no deja datos de la compra en el equipo de quien prueba.
  En produccion, la pasarela y el backend guardarian el intento real.
*/

let pendingCourseId = null

export function rememberPendingCheckout(courseId) {
  pendingCourseId = courseId ?? null
}

export function peekPendingCheckout() {
  return pendingCourseId
}

/* Lee y limpia: el checkout es dueño de la intencion una sola vez. */
export function takePendingCheckout() {
  const courseId = pendingCourseId
  pendingCourseId = null
  return courseId
}

export function clearPendingCheckout() {
  pendingCourseId = null
}

/* ---------- Que hace el boton "Comprar ahora" ---------- */

/*
  La regla vive aqui y no en la pagina, para que el detalle comercial no
  tenga que decidir nada sobre la sesion: solo pide la accion y la ejecuta.

  - sin sesion  -> pedir el acceso guardando la intencion (nunca mostrar el curso);
  - con sesion y ya inscrita -> abrir el contenido desde Mi aprendizaje;
  - con sesion y sin compra -> ir al checkout de ESE curso.
*/
export const BUY_ACTION = {
  login: 'login',
  course: 'course',
  checkout: 'checkout',
}

export function resolveBuyAction({ isAuthenticated, isEnrolled }) {
  if (!isAuthenticated) return BUY_ACTION.login
  if (isEnrolled) return BUY_ACTION.course

  return BUY_ACTION.checkout
}