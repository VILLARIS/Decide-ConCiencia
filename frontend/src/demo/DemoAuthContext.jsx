import { useCallback, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { DEMO_ADMIN_USER, DEMO_ROLES, DEMO_USER } from './demoData'
import {
  DemoAuthContext,
  findDemoAccount,
  getRoleHome,
  isAdmin,
  isStudent,
  useDemoAuth,
} from './demoAuthStore'

/*
  Sesion de demostracion.

  Ahora persiste la sesion en localStorage para que sobreviva a F5 y al
  volver a abrir la pestaña. Solo se guarda el perfil limpio (sin contraseña).
*/

const AUTH_STORAGE_KEY = 'yumibiotic.demo.auth'

function isValidDemoUser(user) {
  if (!user || typeof user !== 'object') return false
  if (typeof user.id !== 'string') return false
  if (typeof user.firstName !== 'string') return false
  if (typeof user.lastName !== 'string') return false
  if (typeof user.email !== 'string') return false
  if (user.role !== DEMO_ROLES.student && user.role !== DEMO_ROLES.admin) return false
  return true
}

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (isValidDemoUser(parsed)) {
      return parsed
    }
    return null
  } catch {
    return null
  }
}

function toSessionUser(profile) {
  /* Copia limpia: se descarta cualquier campo extra. */
  const { id, firstName, lastName, email, role } = profile
  return { id, firstName, lastName, email, role }
}

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredAuth())

  /* Compara contra las dos credenciales ficticias y devuelve el usuario con
     su rol, o null si no coincide. La comparacion vive en findDemoAccount.

     Devolver el usuario (y no solo true/false) permite que la pantalla de
     acceso decida el destino segun el rol sin tener que leer un estado que
     todavia no se ha actualizado. */
  const loginDemo = useCallback((email, password) => {
    const account = findDemoAccount(email, password)
    if (!account) return null

    const profile = account.email === DEMO_ADMIN_USER.email ? DEMO_ADMIN_USER : DEMO_USER
    const sessionUser = toSessionUser(profile)

    setUser(sessionUser)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser))
    } catch {
      /* ignorar errores de almacenamiento */
    }
    return sessionUser
  }, [])

  const logoutDemo = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      /* ignorar errores de almacenamiento */
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isDemo: user !== null,
      isAdmin: isAdmin(user),
      isStudent: isStudent(user),
      /* A donde debe ir segun su rol, sin decidir nada en la pagina. */
      roleHome: getRoleHome(user?.role),
      loginDemo,
      logoutDemo,
    }),
    [user, loginDemo, logoutDemo],
  )

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>
}

/*
  Guardia de rutas de la demo.

  Solo evita que el area de estudiante se vea sin sesion activa. NO es una
  proteccion real: el estado vive en memoria del navegador y el contenido se
  sirve desde el propio bundle, asi que no protege ningun dato.
*/
export function RequireDemoSession({ children }) {
  const { isAuthenticated } = useDemoAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/acceso" replace state={{ from: location.pathname }} />
  }

  return children
}

/*
  Guardia del panel de la doctora.

  - sin sesion -> /acceso (y se recuerda desde donde venia);
  - sesion de estudiante -> /mi-aprendizaje, sin mostrar mensaje de error:
    no es un fallo, es que ese contenido no es suyo;
  - sesion de administradora -> entra.
*/
export function RequireAdminSession({ children }) {
  const { isAuthenticated, isAdmin } = useDemoAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/acceso" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/mi-aprendizaje" replace />
  }

  return children
}

export { DEMO_ROLES }