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
  Sesion de demostracion, unicamente en memoria.

  MODO DEMO
  - No hay backend, ni hash de contrasa, ni cookie, ni sesion de servidor.
  - La comparacion de credenciales ocurre en el navegador. Eso es UX de
     prototipo, NO es seguridad: cualquiera que abra las herramientas del
     desarrollador ve las credenciales y puede saltarse esta pantalla.
  - No se persiste nada. Al recargar la pagina se pierde la sesion, por
     diseno, para no dejar datos en el equipo de quien prueba la demo.
  - El objeto de usuario nunca incluye la contrasena.

  ROLES
  -----
  Un unico provider maneja los dos perfiles: Andrea (student) y la doctora
  (admin). El rol se copia del perfil que coincidio con el formulario, nunca
  se elige en la interfaz, asi que no se puede "elevar" el rol desde el login.
  Montarlo en mas de un sitio haria que se reinicie al navegar: vive solo en
  <Root> (ver Root.jsx), por encima de las rutas.
*/

function toSessionUser(profile) {
  /* Copia limpia: se descarta cualquier campo extra. */
  const { id, firstName, lastName, email, role } = profile
  return { id, firstName, lastName, email, role }
}

export function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null)

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
    return sessionUser
  }, [])

  const logoutDemo = useCallback(() => setUser(null), [])

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