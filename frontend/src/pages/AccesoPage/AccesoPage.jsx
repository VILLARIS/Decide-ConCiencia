import { useId, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx'
import loginImage from '../../assets/Register-Login/loginImage.png'
import { getRoleHome, useDemoAuth } from '../../demo/demoAuthStore'
import { takePendingCheckout } from '../../demo/demoPendingCheckout'
import { DEMO_ADMIN_LOGIN, DEMO_STUDENT_LOGIN } from '../../demo/demoData'
import './AccesoPage.css'

/*
  Pantalla de Acceso, comun para estudiantes y para la doctora.

  MODO DEMO: el formulario no hace llamadas de red. Compara la credencial de
  demostracion en memoria (ver DemoAuthContext) y, si coincide, entra a su
  area. No es autenticacion real.

  Cuando exista el backend, solo se reemplaza loginDemo por la llamada real:
  el resto de la interfaz no cambia.

  Solo se toco la presentacion. La logica de sesion, el destino segun rol, el
  checkout pendiente y las credenciales demo son los mismos de antes.

  DESTINO TRAS ENTRAR
  -------------------
  El rol decide a donde se entra, y sale del perfil que coincidio, no de la
  interfaz:
  - administradora -> /admin;
  - estudiante sin intencion de compra -> /mi-aprendizaje;
  - estudiante que venia a comprar -> el checkout del curso que pulsó.

  La intencion de compra solo aplica a estudiantes: si entro la doctora, el
  panel manda. Por eso el curso pendiente se lee despues de saber el rol.
*/

/* Cuentas ficticias. Siguen viniendo de la fuente de datos demo: aqui solo se
   etiqueta como antes, sin duplicar ninguna credencial. */
const DEMO_ACCOUNTS = [
  { label: 'Estudiante', account: DEMO_STUDENT_LOGIN },
  { label: 'Administradora', account: DEMO_ADMIN_LOGIN },
]

export default function AccesoPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { loginDemo } = useDemoAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const demoPanelId = useId()

  /* Rellena el formulario con una de las cuentas ficticias. */
  const fillDemoAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  /*
    Destino segun el rol.

    El checkout pendiente solo se consulta para estudiantes. takePendingCheckout
    consume el valor, asi que leerlo de mas lo borraria: por eso primero se
    decide el rol y solo luego, si toca, se lee.
  */
  const resolvePostLoginTarget = (role) => {
    /* La doctora entra siempre a su panel. */
    if (role === DEMO_ADMIN_LOGIN.role) {
      return getRoleHome(role)
    }

    const from = location.state?.from
    const pendingCourseId = takePendingCheckout()

    const courseId = pendingCourseId ?? from?.split('/checkout/')[1]
    const cameFromCheckout =
      typeof from === 'string' && from.startsWith('/checkout/') && Boolean(courseId)

    if (cameFromCheckout) {
      return `/checkout/${courseId}`
    }

    return getRoleHome(role)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const sessionUser = loginDemo(email, password)

    if (sessionUser) {
      navigate(resolvePostLoginTarget(sessionUser.role), { replace: true })
      return
    }

    setError('Las credenciales de demostración no coinciden.')
  }

  return (
    <>
      <Navbar />

      <AuthLayout
        image={loginImage}
        imageAlt="Yumibiotic: plataforma educativa de nutricion y bienestar"
        imagePosition="center 18%"
        eyebrow="Plataforma educativa"
        title="Aprende y avanza con criterio."
        description="Accede a tus cursos, materiales y evaluaciones desde un mismo lugar."
      >
        <div className="acceso">
          <p className="acceso__mobile-eyebrow">Plataforma educativa</p>

          <h2 className="acceso__title">Bienvenido de nuevo</h2>
          <p className="acceso__subtitle">
            Ingresa a tu cuenta para continuar en Yumibiotic.
          </p>

          <form className="acceso__form" onSubmit={handleSubmit}>
            {error ? (
              <p className="acceso__error" role="alert">
                <AlertCircle size={16} strokeWidth={2} aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <div className="acceso__field">
              <label className="acceso__label" htmlFor="acceso-email">
                Correo electrónico
              </label>

              <div className="acceso__control">
                <Mail
                  className="acceso__control-icon"
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <input
                  className="acceso__input"
                  id="acceso-email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="acceso__field">
              <label className="acceso__label" htmlFor="acceso-password">
                Contraseña
              </label>

              <div className="acceso__control">
                <Lock
                  className="acceso__control-icon"
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <input
                  className="acceso__input acceso__input--reveal"
                  id="acceso-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tu contraseña"
                />
                <button
                  className="acceso__reveal"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={17} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <Eye size={17} strokeWidth={1.8} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="acceso__row">
              <label className="acceso__remember">
                <input className="acceso__checkbox" type="checkbox" name="remember" />
                <span className="acceso__checkbox-mark" aria-hidden="true" />
                Recordarme
              </label>

              <a className="acceso__forgot" href="#recuperar">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button className="acceso__submit" type="submit">
              Iniciar sesión
              <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
            </button>

            {/* ---------- Acceso de demostracion ----------
                Cuentas ficticias, plegadas por defecto: el bloque cerrado
                ocupa una sola linea. Al desplegar, "Usar cuenta" rellena el
                formulario igual que antes. */}
            <div className="acceso__demo">
              <button
                className="acceso__demo-toggle"
                type="button"
                onClick={() => setShowDemo((visible) => !visible)}
                aria-expanded={showDemo}
                aria-controls={demoPanelId}
              >
                <span className="acceso__demo-label">
                  <GraduationCap size={15} strokeWidth={2} aria-hidden="true" />
                  Acceso de demostración
                </span>

                <span className="acceso__demo-action">
                  {showDemo ? 'Ocultar' : 'Ver cuentas demo'}
                  <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
                </span>
              </button>

              <div className="acceso__demo-panel" id={demoPanelId} hidden={!showDemo}>
                <p className="acceso__demo-disclaimer">
                  Estas cuentas contienen datos ficticios y se utilizan únicamente para
                  recorrer la plataforma.
                </p>

                {DEMO_ACCOUNTS.map(({ label, account }) => (
                  <div className="acceso__demo-account" key={account.email}>
                    <span className="acceso__demo-role">{label}</span>
                    <span className="acceso__demo-email">{account.email}</span>
                    <span className="acceso__demo-password">{account.password}</span>

                    <button
                      className="acceso__demo-fill"
                      type="button"
                      onClick={() => fillDemoAccount(account)}
                    >
                      Usar cuenta
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>

          <p className="acceso__signup">
            ¿No tienes una cuenta?{' '}
            <a className="acceso__signup-link" href="#crear-cuenta">
              Crear cuenta
            </a>
          </p>
        </div>
      </AuthLayout>
    </>
  )
}