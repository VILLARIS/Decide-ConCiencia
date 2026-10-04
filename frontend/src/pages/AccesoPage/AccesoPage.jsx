import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Sparkles,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx'
import yuliaAvatar from '../../assets/avatarHero.png'
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

export default function AccesoPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { loginDemo } = useDemoAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

      <main className="acceso">
        <section className="acceso__section" aria-labelledby="acceso-title">
          <div className="acceso__container">
            {/* ---------- Columna izquierda: apoyo visual ---------- */}
            <div className="acceso__intro">
              <p className="acceso__eyebrow">
                <span className="acceso__eyebrow-dot" aria-hidden="true" />
                Plataforma educativa
              </p>

              <h1 className="acceso__headline" id="acceso-title">
                Aprende. Practica.
                <br />
                <span className="acceso__headline-accent">Avanza con criterio.</span>
              </h1>

              <p className="acceso__lead">
                Accede a tus cursos, evaluaciones, materiales y certificados en un solo
                lugar.
              </p>
            </div>

            {/* Ilustracion de Yulia, mediana y completa. En movil se
                reordena despues del formulario (ver grid-template-areas). */}
            <figure className="acceso__art">
              <span className="acceso__art-halo" aria-hidden="true" />
              <img
                className="acceso__art-image"
                src={yuliaAvatar}
                alt="Yulia, profesora de bioquímica nutricional"
                width="1122"
                height="1402"
                decoding="async"
              />
            </figure>

            {/* ---------- Cuentas de demostracion ----------
                Dos credenciales en la misma pantalla: Andrea para el area de
                estudiante y la doctora para su panel. Estar separadas seria
                un login distinto, y la sesion es la misma. */}
            <aside className="acceso__demo" aria-label="Cuentas de demostración">
              <p className="acceso__demo-title">
                <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
                Cuentas de demostración
              </p>

              <p className="acceso__demo-note">
                Credenciales ficticias para recorrer la plataforma. No son cuentas reales y
                no protegen ningún dato.
              </p>

              {[
                { label: 'Estudiante', account: DEMO_STUDENT_LOGIN },
                { label: 'Administradora', account: DEMO_ADMIN_LOGIN },
              ].map(({ label, account }) => (
                <div className="acceso__demo-account" key={account.email}>
                  <dl className="acceso__demo-credentials">
                    <div className="acceso__demo-row">
                      <dt>{label}</dt>
                      <dd>{account.email}</dd>
                    </div>
                    <div className="acceso__demo-row">
                      <dt>Contraseña</dt>
                      <dd>{account.password}</dd>
                    </div>
                  </dl>

                  <button
                    className="acceso__demo-fill"
                    type="button"
                    onClick={() => fillDemoAccount(account)}
                  >
                    Usar cuenta
                  </button>
                </div>
              ))}
            </aside>

            {/* ---------- Columna derecha: formulario ---------- */}
            <div className="acceso__panel">
              <button className="acceso__lang" type="button" aria-label="Cambiar idioma">
                <Globe size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>ES</span>
                <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
              </button>

              <h2 className="acceso__title">Bienvenido de nuevo</h2>
              <p className="acceso__subtitle">
                Ingresa a tu cuenta para continuar aprendiendo con Yulia.
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
                    Recordarme en este dispositivo
                  </label>

                  <a className="acceso__forgot" href="#recuperar">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button className="acceso__submit" type="submit">
                  Iniciar sesión
                  <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
                </button>

                <div className="acceso__divider">
                  <span>o continúa con</span>
                </div>

                <div className="acceso__social">
                  <button className="acceso__social-btn" type="button">
                    <svg className="acceso__social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.87c2.27-2.09 3.56-5.17 3.56-8.89z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3.02c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.13A12 12 0 0 0 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.26a7.2 7.2 0 0 1 0-4.6V6.53H1.29a12 12 0 0 0 0 10.86l3.98-3.13z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.53l3.98 3.13C6.22 6.88 8.87 4.77 12 4.77z"
                      />
                    </svg>
                    Continuar con Google
                  </button>

                  <button className="acceso__social-btn" type="button">
                    <svg className="acceso__social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M16.37 12.78c.03 3.2 2.81 4.27 2.84 4.28-.02.07-.44 1.51-1.46 2.99-.88 1.28-1.8 2.55-3.24 2.58-1.42.03-1.87-.84-3.49-.84-1.62 0-2.12.81-3.46.87-1.39.05-2.45-1.38-3.34-2.65-1.82-2.63-3.21-7.44-1.34-10.68.93-1.61 2.59-2.63 4.39-2.66 1.37-.03 2.66.92 3.49.92.83 0 2.39-1.14 4.03-.97.68.03 2.6.28 3.84 2.08-.1.06-2.29 1.34-2.26 3.98zM14.06 4.6c.74-.9 1.24-2.15 1.1-3.4-1.07.04-2.36.71-3.12 1.61-.68.8-1.28 2.07-1.12 3.29 1.19.09 2.4-.6 3.14-1.5z"
                      />
                    </svg>
                    Continuar con Apple
                  </button>
                </div>
              </form>

              <p className="acceso__signup">
                ¿No tienes una cuenta?{' '}
                <a className="acceso__signup-link" href="#crear-cuenta">
                  Crear cuenta
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
