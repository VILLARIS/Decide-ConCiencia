import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Ban,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Loader,
  Lock,
  Receipt,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react'
import StudentShell from '../LearningPage/StudentShell'
import DemoNotice from '../../components/DemoNotice/DemoNotice'
import { RequireDemoSession } from '../../demo/DemoAuthContext'
import { useDemoAuth } from '../../demo/demoAuthStore'
import {
  PURCHASE_STATUS,
  useDemoPurchases,
} from '../../demo/demoPurchaseStore'
import { DEMO_MODE, PAYMENT_METHODS } from '../../demo/demoConfig'
import {
  formatPrice,
  formatPayLabel,
  getCourseById,
  getDiscountAmount,
  getFinalPrice,
  hasDiscount,
} from '../../demo/demoCatalog'
import './CheckoutPage.css'

/*
  Checkout — MODO DEMO (Plan Profesional, una compra = un curso).

  NO hay pasarela de pago: los datos de tarjeta no se piden, no se guardan y
  no existen. "Pagar" dispara una simulacion en memoria que termina en un
  estado (aprobado / rechazado / cancelado) y, al aprobarse, crea la
  inscripcion del curso.

  En produccion este paso se sustituye por:
  pasarela -> backend -> webhook -> validacion -> compra + inscripcion.
  El boton se quedaria esperando la confirmacion del backend, no un setTimeout.
*/

/* Tiempo de la simulacion: solo existe para poder ver el estado "procesando". */
const SIMULATED_PAYMENT_MS = 1100

const PHASE = {
  form: 'form',
  processing: 'processing',
  approved: 'approved',
  rejected: 'rejected',
  cancelled: 'cancelled',
}

/* ---------- Piezas visuales ---------- */

function CourseThumb({ title }) {
  return (
    <span className="checkout__thumb" aria-hidden="true">
      <GraduationCap size={22} strokeWidth={1.8} />
      <span className="checkout__thumb-label">{title}</span>
    </span>
  )
}

function Microcopy() {
  return (
    <ul className="checkout__microcopy">
      <li>
        <Lock size={13} strokeWidth={2} aria-hidden="true" />
        Pago seguro
      </li>
      <li>
        <BadgeCheck size={13} strokeWidth={2} aria-hidden="true" />
        Acceso después de confirmar el pago
      </li>
      <li>
        <Receipt size={13} strokeWidth={2} aria-hidden="true" />
        Certificado al completar el curso
      </li>
    </ul>
  )
}

function CheckoutView() {
  const { courseId } = useParams()
  const { user } = useDemoAuth()
  const {
    startPurchase,
    updatePurchaseStatus,
    hasEnrollment,
  } = useDemoPurchases()
  const navigate = useNavigate()

  const course = getCourseById(courseId)

  const [phase, setPhase] = useState(PHASE.form)
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id)
  const timerRef = useRef(null)

  const enrolled = course ? hasEnrollment(course.id) : false

  /* Si ya esta inscrito no hay nada que comprar: se va a Mi aprendizaje.
     Tras aprobar, el estado "approved" manda sobre esta redireccion. */
  useEffect(() => {
    if (enrolled && phase !== PHASE.approved) {
      navigate('/mi-aprendizaje', { replace: true })
    }
  }, [enrolled, phase, navigate])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  /* Cambia el estado de la compra y refleja el resultado en pantalla. */
  const settle = (id, outcome) => {
    const success = updatePurchaseStatus(id, PURCHASE_STATUS[outcome])
    if (success) {
      setPhase(outcome)
    } else {
      setPhase(PHASE.rejected)
    }
  }

  const startPayment = (outcome) => {
    if (!course || phase === PHASE.processing) return

    if (enrolled) {
      setPhase(PHASE.approved)
      return
    }

    const amount = getFinalPrice(course)
    const purchase = startPurchase({ courseId: course.id, amount })

    if (!purchase) {
      setPhase(PHASE.rejected)
      return
    }

    updatePurchaseStatus(purchase.id, PURCHASE_STATUS.processing)
    setPhase(PHASE.processing)

    timerRef.current = setTimeout(() => settle(purchase.id, outcome), SIMULATED_PAYMENT_MS)
  }

  /* ---------- Curso inexistente ---------- */

  if (!course) {
    return (
      <StudentShell>
        <div className="checkout-centered-page">
          <div className="checkout-empty">
            <span className="checkout-empty__icon" aria-hidden="true">
              <XCircle size={24} strokeWidth={1.8} />
            </span>

            <h1 className="checkout-empty__title">No encontramos ese curso</h1>

            <p className="checkout-empty__text">
              El enlace de inscripción no corresponde a ningún curso disponible en esta
              demostración.
            </p>

            <Link className="checkout-btn checkout-btn--primary" to="/cursos">
              Ver cursos
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </StudentShell>
    )
  }

  const total = getFinalPrice(course)
  const discount = getDiscountAmount(course)
  const payLabel = formatPayLabel(course)
  const courseHref = `/cursos/${course.slug}`

  /* ---------- Estado: pago aprobado ---------- */

  if (phase === PHASE.approved) {
    return (
      <StudentShell>
        {/* centered-page centra el bloque y deja aire arriba y abajo: la
            confirmacion se lee como una pagina, no como una tarjeta pegada. */}
        <div className="checkout-centered-page">
          <section
            className="checkout-result checkout-result--approved"
            aria-labelledby="ok-title"
          >
            <span className="checkout-result__icon" aria-hidden="true">
              <CheckCircle2 size={30} strokeWidth={1.9} />
            </span>

            <h1 className="checkout-result__title" id="ok-title">
              Tu inscripción está lista
            </h1>

            <p className="checkout-result__text">
              Ya tienes acceso a {course.title}.
            </p>

            <div className="checkout-result__actions">
              <Link className="checkout-btn checkout-btn--primary" to={`/mi-aprendizaje/${course.id}`}>
                Entrar al curso
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>

              <Link className="checkout-btn checkout-btn--ghost" to="/mi-aprendizaje">
                Ver Mi aprendizaje
              </Link>
            </div>
          </section>

          {/* El aviso tecnico va FUERA del contenido principal: informa sin
              competir con el mensaje ni los botones. */}
          <DemoNotice>
            Confirmación de demostración: en producción este estado lo confirma el backend
            tras el aviso de la pasarela.
          </DemoNotice>
        </div>
      </StudentShell>
    )
  }

  /* ---------- Estados: rechazado / cancelado ---------- */

  if (phase === PHASE.rejected || phase === PHASE.cancelled) {
    const isCancel = phase === PHASE.cancelled

    return (
      <StudentShell>
        <div className="checkout-centered-page">
          <section className="checkout-result checkout-result--failed" aria-labelledby="fail-title">
            <span className="checkout-result__icon" aria-hidden="true">
              {isCancel ? (
                <Ban size={28} strokeWidth={1.8} />
              ) : (
                <XCircle size={28} strokeWidth={1.8} />
              )}
            </span>

            <h1 className="checkout-result__title" id="fail-title">
              {isCancel ? 'Cancelaste el pago' : 'No pudimos completar el pago'}
            </h1>

            <p className="checkout-result__text">
              {isCancel
                ? 'La inscripción quedó pendiente. Puedes continuar cuando quieras.'
                : 'Tu curso sigue disponible. Puedes reintentar el pago o volver al curso.'}
            </p>

            <div className="checkout-result__actions">
              <button
                className="checkout-btn checkout-btn--primary"
                type="button"
                onClick={() => setPhase(PHASE.form)}
              >
                Intentar nuevamente
              </button>

              <Link className="checkout-btn checkout-btn--ghost" to={courseHref}>
                Volver al curso
              </Link>
            </div>
          </section>

          <DemoNotice>
            Estado de demostración. No se ha realizado ningún cargo ni se guardan datos de
            pago.
          </DemoNotice>
        </div>
      </StudentShell>
    )
  }

  /* ---------- Estado: formulario / procesando ---------- */

  const isProcessing = phase === PHASE.processing

  return (
    <StudentShell>
      <nav className="checkout-back" aria-label="Volver">
        <Link className="checkout-back__link" to={courseHref}>
          <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" />
          Volver al curso
        </Link>
      </nav>

      <div className="checkout">
        {/* ---------- Izquierda: inscripción y pago ---------- */}
        <div className="checkout__main">
          <header className="checkout__head">
            <h1 className="checkout__title">Finaliza tu inscripción</h1>
            <p className="checkout__lead">Estás a un paso de comenzar tu curso.</p>
          </header>

          {/* Datos del estudiante: vienen de la sesión, no se vuelven a pedir */}
          <section className="checkout-block" aria-labelledby="checkout-student-title">
            <h2 className="checkout-block__title" id="checkout-student-title">
              Datos del estudiante
            </h2>

            <dl className="checkout-student">
              <div className="checkout-student__row">
                <dt>Nombre</dt>
                <dd>
                  {user?.firstName} {user?.lastName}
                </dd>
              </div>
              <div className="checkout-student__row">
                <dt>Correo</dt>
                <dd>{user?.email}</dd>
              </div>
            </dl>

            <p className="checkout-block__note">
              Estos datos vienen de tu sesión. No hace falta escribirlos otra vez.
            </p>
          </section>

          {/* Método de pago: sin campos falsos de tarjeta */}
          <section className="checkout-block" aria-labelledby="checkout-method-title">
            <h2 className="checkout-block__title" id="checkout-method-title">
              Método de pago
            </h2>

            <div className="checkout-methods">
              {PAYMENT_METHODS.map((option) => (
                <label
                  className={`checkout-method${
                    method === option.id ? ' checkout-method--selected' : ''
                  }`}
                  key={option.id}
                >
                  <input
                    className="checkout-method__input"
                    type="radio"
                    name="metodo-pago"
                    value={option.id}
                    checked={method === option.id}
                    onChange={() => setMethod(option.id)}
                    disabled={isProcessing}
                  />

                  <span className="checkout-method__icon" aria-hidden="true">
                    <Wallet size={18} strokeWidth={1.9} />
                  </span>

                  <span className="checkout-method__copy">
                    <span className="checkout-method__label">{option.label}</span>
                    <span className="checkout-method__description">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>

            <p className="checkout-block__note">
              No pedimos datos de tarjeta: en producción ese formulario lo muestra la
              pasarela seleccionada y solo se recibe un identificador de operación.
            </p>

            {/* Controles SOLO de demostración: nunca son parte del producto */}
            {DEMO_MODE ? (
              <details className="checkout-demo">
                <summary className="checkout-demo__summary">
                  Controles de demostración
                </summary>

                <p className="checkout-demo__text">
                  Esta pantalla no cobra nada. El botón de pago simula la respuesta de una
                  pasarela para poder ver cada estado.
                </p>

                <div className="checkout-demo__actions">
                  <button
                    className="checkout-btn checkout-btn--primary"
                    type="button"
                    onClick={() => startPayment('approved')}
                    disabled={isProcessing}
                  >
                    Simular pago aprobado
                  </button>

                  <button
                    className="checkout-btn checkout-btn--ghost"
                    type="button"
                    onClick={() => startPayment('rejected')}
                    disabled={isProcessing}
                  >
                    Simular pago rechazado
                  </button>

                  <button
                    className="checkout-btn checkout-btn--ghost"
                    type="button"
                    onClick={() => startPayment('cancelled')}
                    disabled={isProcessing}
                  >
                    Cancelar compra
                  </button>
                </div>
              </details>
            ) : null}
          </section>

          <p className="checkout__trust">
            <ShieldCheck size={16} strokeWidth={1.9} aria-hidden="true" />
            Tu información de pago viaja con la pasarela, nunca se guarda aquí.
          </p>
        </div>

        {/* ---------- Derecha: resumen del pedido ---------- */}
        <aside className="checkout__summary" aria-labelledby="checkout-summary-title">
          <h2 className="checkout-summary__title" id="checkout-summary-title">
            Resumen de compra
          </h2>

          <div className="checkout-summary__course">
            <CourseThumb title={course.title} />

            <div>
              <p className="checkout-summary__course-title">{course.title}</p>
              <p className="checkout-summary__course-meta">
                {course.modality} · {course.access}
              </p>
            </div>
          </div>

          <dl className="checkout-summary__rows">
            <div className="checkout-summary__row">
              <dt>Precio</dt>
              <dd>{formatPrice(course, course.previousPrice)}</dd>
            </div>

            {hasDiscount(course) ? (
              <div className="checkout-summary__row checkout-summary__row--discount">
                <dt>Descuento</dt>
                <dd>-{formatPrice(course, discount)}</dd>
              </div>
            ) : null}

            <div className="checkout-summary__row checkout-summary__row--total">
              <dt>Total</dt>
              <dd>{formatPrice(course, total)}</dd>
            </div>
          </dl>

          <button
            className="checkout-btn checkout-btn--primary checkout-btn--pay"
            type="button"
            onClick={() => startPayment('approved')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader className="checkout-btn__spinner" size={17} strokeWidth={2.2} aria-hidden="true" />
                Procesando tu pago…
              </>
            ) : (
              <>
                <CreditCard size={17} strokeWidth={2} aria-hidden="true" />
                {payLabel}
              </>
            )}
          </button>

          <p className="checkout-summary__note">
            Tu acceso se activará después de confirmar el pago.
          </p>

          <Microcopy />
        </aside>
      </div>
    </StudentShell>
  )
}

export default function CheckoutPage() {
  return (
    <RequireDemoSession>
      <CheckoutView />
    </RequireDemoSession>
  )
}