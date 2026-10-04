import { createContext, useContext } from 'react'
import { DEMO_ADMIN_LOGIN, DEMO_ROLES, DEMO_STUDENT_LOGIN } from './demoData'

/*
  Contexto de sesion demo: solo el objeto, sin componentes.

  Vive aparte de <DemoAuthProvider> para que ese archivo exporte unicamente
  componentes y React Fast Refresh funcione correctamente en desarrollo.
*/

export const DemoAuthContext = createContext(null)

/* Perfiles que pueden iniciar sesion en la demo. */
const CREDENTIALS = [DEMO_STUDENT_LOGIN, DEMO_ADMIN_LOGIN]

/*
  Compara el formulario con las credenciales ficticias.

  MODO DEMO: esto corre en el navegador y NO es seguridad. El correo se normaliza
  (espacios y mayusculas) para que la demo sea comoda de probar; la contrasena
  se compara tal cual.

  Se revisan las dos credenciales (estudiante y administradora) para que el
  rol salga de ahi y no se tenga que escribir a mano en la interfaz.
*/
export function findDemoAccount(email, password) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase()

  return (
    CREDENTIALS.find(
      (account) =>
        account.email === normalizedEmail && account.password === String(password ?? ''),
    ) ?? null
  )
}

/* Comprueba contra un perfil concreto. Se mantiene por compatibilidad. */
export function matchesDemoLogin(email, password) {
  const normalizedEmail = String(email ?? '').trim().toLowerCase()

  return (
    normalizedEmail === DEMO_STUDENT_LOGIN.email &&
    String(password ?? '') === DEMO_STUDENT_LOGIN.password
  )
}

/* A donde entra cada rol tras autenticarse. */
export const ROLE_HOME = {
  [DEMO_ROLES.student]: '/mi-aprendizaje',
  [DEMO_ROLES.admin]: '/admin',
}

export function getRoleHome(role) {
  return ROLE_HOME[role] ?? ROLE_HOME[DEMO_ROLES.student]
}

export function isAdmin(user) {
  return user?.role === DEMO_ROLES.admin
}

export function isStudent(user) {
  return user?.role === DEMO_ROLES.student
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)

  if (!context) {
    throw new Error('useDemoAuth debe usarse dentro de <DemoAuthProvider>')
  }

  return context
}