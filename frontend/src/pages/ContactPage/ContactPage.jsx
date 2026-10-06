import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FlaskConical,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react'
import contactHero from '../../assets/Contact/heroImage.png'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './ContactPage.css'

/*
  /contacto

  Pagina de contacto de Yumibiotic. Estructura en dos tiempos: primero se pide
  la solicitud (formulario) y, a la derecha, un panel que resume el servicio y
  explica el proceso hasta el posible pago.

  Sin backend. El formulario es demo: valida en el navegador y muestra un estado
  de exito, pero no envia ni almacena nada. El panel de pago es orientativo: el
  boton "Continuar al pago" todavia no navega a ningun checkout.

  PENDIENTE DE CONFIGURAR antes de publicar:
  - WHATSAPP_NUMBER: numero real con prefijo internacional y sin simbolos
    (ejemplo: '51987654321'). Mientras este vacio, el boton de WhatsApp cae a
    correo en lugar de inventar un numero.
  - SERVICIOS: duracion e inversion de cada tipo de servicio. De momento solo
    se muestra "Por definir": los valores reales se confirman con la doctora
    durante la revision de la solicitud (paso 3).
*/

const WHATSAPP_NUMBER = ''

const CONTACT_EMAIL = 'contacto@yumibiotic.com'

const mailto = (subject) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

const whatsappUrl = (mensaje) =>
  WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    : null

/* Tipos de servicio. Cada uno lleva la duracion y la inversion referencial que
   se muestran en el panel de la derecha. */
const SERVICIOS = [
  {
    id: 'asesoria',
    label: 'Asesoría nutricional',
    duracion: 'Por definir',
    inversion: 'Según alcance',
  },
  {
    id: 'capacitaciones',
    label: 'Capacitaciones',
    duracion: 'Por definir',
    inversion: 'Según alcance',
  },
  {
    id: 'programas',
    label: 'Programas de bienestar',
    duracion: 'Por definir',
    inversion: 'Según alcance',
  },
  {
    id: 'cursos',
    label: 'Cursos',
    duracion: 'Por definir',
    inversion: 'Según alcance',
  },
  {
    id: 'otro',
    label: 'Otro',
    duracion: 'Por definir',
    inversion: 'Según alcance',
  },
]

const MODALIDADES = ['Virtual', 'Presencial', 'Indistinto']

/* Mini beneficios del hero: icono, titulo y apoyo. */
const HERO_BENEFITS = [
  {
    id: 'respuesta',
    icon: UserRoundSearch,
    title: 'Respuesta clara',
    text: 'Te orientamos sin compromiso.',
  },
  {
    id: 'personalizada',
    icon: HeartHandshake,
    title: 'Atención personalizada',
    text: 'Un equipo dispuesto a ayudarte.',
  },
  {
    id: 'evidencia',
    icon: FlaskConical,
    title: 'Basado en evidencia',
    text: 'Información confiable y actualizada.',
  },
]

/* Pasos que explican el proceso, del formulario al posible pago. */
const PROCESS_STEPS = [
  { id: 'envias', label: 'Envías tu solicitud' },
  { id: 'revisamos', label: 'Revisamos tu caso' },
  { id: 'confirmamos', label: 'Te confirmamos el servicio y la inversión' },
  { id: 'pagas', label: 'Realizas el pago y coordinamos contigo' },
]

/* Canales alternativos. */
const CHANNELS = [
  {
    id: 'email',
    icon: Mail,
    label: 'Correo',
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    text: 'Detalle de tu caso, documentación o consultas de servicios.',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Coordinación por WhatsApp',
    href: null,
    text: 'Coordinamos día y hora al confirmar tu registro.',
  },
  {
    id: 'horario',
    icon: Clock,
    label: 'Horario',
    value: 'Lun a vie, 9:00 am – 6:00 pm',
    href: null,
    text: 'Respondemos dentro de 24 a 48 horas hábiles.',
  },
  {
    id: 'modalidad',
    icon: MapPin,
    label: 'Modalidad',
    value: 'Virtual y presencial',
    href: null,
    text: 'Las sesiones presenciales se coordinan según disponibilidad.',
  },
]

const INITIAL_FORM = {
  nombre: '',
  email: '',
  whatsapp: '',
  servicio: '',
  modalidad: '',
  mensaje: '',
  acepta: false,
}

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const actualizar = (campo) => (evento) => {
    const valor =
      evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value
    setForm((previo) => ({ ...previo, [campo]: valor }))
    // El error de un campo desaparece en cuanto el usuario lo corrige.
    setErrores((previos) => (previos[campo] ? { ...previos, [campo]: undefined } : previos))
  }

  const validar = () => {
    const encontrados = {}

    if (form.nombre.trim().length < 2) {
      encontrados.nombre = 'Escribe tu nombre.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      encontrados.email = 'Escribe un correo válido.'
    }

    if (!form.servicio) {
      encontrados.servicio = 'Selecciona un tipo de servicio.'
    }

    if (!form.modalidad) {
      encontrados.modalidad = 'Selecciona una modalidad.'
    }

    if (form.mensaje.trim().length < 10) {
      encontrados.mensaje = 'Cuéntanos un poco más para poder orientarte.'
    }

    if (!form.acepta) {
      encontrados.acepta = 'Necesitamos tu autorización para contactarte.'
    }

    return encontrados
  }

  /* Demo: no hay backend. Solo se valida y se muestra la confirmacion. */
  const enviar = (evento) => {
    evento.preventDefault()
    const encontrados = validar()
    setErrores(encontrados)

    if (Object.keys(encontrados).length > 0) {
      return
    }

    setEnviado(true)
  }

  const reiniciar = () => {
    setForm(INITIAL_FORM)
    setErrores({})
    setEnviado(false)
  }

  /* El panel de la derecha lee lo que hay seleccionado en el formulario. */
  const servicioElegido = SERVICIOS.find((servicio) => servicio.id === form.servicio)
  const resumenServicio = servicioElegido ? servicioElegido.label : 'Por definir'
  const resumenDuracion = servicioElegido ? servicioElegido.duracion : 'Por definir'
  const resumenInversion = servicioElegido ? servicioElegido.inversion : 'Por definir'
  const resumenModalidad = form.modalidad || 'Por definir'

  const enlaceWhatsapp = whatsappUrl(
    'Hola, me gustaría orientación sobre un servicio de Yumibiotic.',
  )

  return (
    <>
      <Navbar />

      <main className="contact">
        {/* =========================================================
            1. HERO
            La foto entra por la derecha hasta el borde del viewport y su lado
            izquierdo se disuelve con una mascara, igual que en Inicio,
            Quienes somos y Servicios. Sin card, sin marco, sin sombra.
            ========================================================= */}
        <section className="contact-hero" aria-labelledby="contact-title">
          <div className="contact-hero__media">
            <img
              className="contact-hero__image"
              src={contactHero}
              alt="Yumibiotic: acompanamiento nutricional, educacion y bienestar"
              width="1672"
              height="941"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="contact-hero__container">
            <div className="contact-hero__content">
              <p className="contact-hero__eyebrow">Contacto</p>

              <h1 className="contact-hero__title" id="contact-title">
                Conversemos sobre la mejor forma de acompañarte
              </h1>

              <p className="contact-hero__lead">
                Puedes escribirnos para solicitar una asesoría, conocer nuestros programas,
                capacitaciones o formaciones. Estamos aquí para ayudarte a elegir la mejor opción
                según tus necesidades.
              </p>

              <div className="contact-hero__actions">
                <a className="contact-button contact-button--primary" href="#solicitud">
                  <span>Solicitar información</span>
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
                </a>

                {enlaceWhatsapp ? (
                  <a
                    className="contact-button contact-button--secondary"
                    href={enlaceWhatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                    Hablar por WhatsApp
                  </a>
                ) : (
                  <a
                    className="contact-button contact-button--secondary"
                    href={mailto('Contacto por WhatsApp desde la página de contacto')}
                    title="Añade el número de WhatsApp en ContactPage.jsx para activar este enlace"
                  >
                    <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                    Hablar por WhatsApp
                  </a>
                )}
              </div>

              <ul className="contact-hero__benefits">
                {HERO_BENEFITS.map(({ id, icon: Icon, title, text }) => (
                  <li className="contact-benefit" key={id}>
                    <span className="contact-benefit__icon">
                      <Icon size={17} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="contact-benefit__body">
                      <span className="contact-benefit__title">{title}</span>
                      <span className="contact-benefit__text">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================
            2. FORMULARIO + PANEL DE PAGO POR SERVICIO
            ========================================================= */}
        <section className="contact-main" id="solicitud" aria-labelledby="contact-form-title">
          <div className="contact-main__container">
            <div className="contact-main__grid">
              {/* ---------- Formulario ---------- */}
              <div className="contact-form">
                <header className="contact-form__head">
                  <p className="contact-form__eyebrow">Solicitud</p>
                  <h2 className="contact-form__title" id="contact-form-title">
                    Cuéntanos lo que necesitas
                  </h2>
                  <p className="contact-form__intro">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>
                </header>

                {enviado ? (
                  <div className="contact-form__success" role="status">
                    <span className="contact-form__success-icon">
                      <CheckCircle2 size={26} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="contact-form__success-title">Recibimos tu solicitud</h3>
                    <p className="contact-form__success-text">
                      Gracias, {form.nombre.trim().split(' ')[0]}. Revisamos tu caso y te
                      confirmamos el servicio y la inversión dentro de 24 a 48 horas hábiles.
                    </p>
                    <button className="contact-form__reset" type="button" onClick={reiniciar}>
                      Enviar otra solicitud
                    </button>
                  </div>
                ) : (
                  <form className="contact-form__body" onSubmit={enviar} noValidate>
                    <div className="contact-form__row">
                      <div className="contact-field">
                        <label className="contact-field__label" htmlFor="contact-nombre">
                          Nombre
                        </label>
                        <input
                          className="contact-field__input"
                          id="contact-nombre"
                          name="nombre"
                          type="text"
                          autoComplete="name"
                          placeholder="Nombre y apellido"
                          value={form.nombre}
                          onChange={actualizar('nombre')}
                          aria-invalid={Boolean(errores.nombre)}
                          aria-describedby={errores.nombre ? 'error-nombre' : undefined}
                          required
                        />
                        {errores.nombre && (
                          <p className="contact-field__error" id="error-nombre">
                            {errores.nombre}
                          </p>
                        )}
                      </div>

                      <div className="contact-field">
                        <label className="contact-field__label" htmlFor="contact-email">
                          Correo electrónico
                        </label>
                        <input
                          className="contact-field__input"
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@correo.com"
                          value={form.email}
                          onChange={actualizar('email')}
                          aria-invalid={Boolean(errores.email)}
                          aria-describedby={errores.email ? 'error-email' : undefined}
                          required
                        />
                        {errores.email && (
                          <p className="contact-field__error" id="error-email">
                            {errores.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="contact-form__row">
                      <div className="contact-field">
                        <label className="contact-field__label" htmlFor="contact-whatsapp">
                          WhatsApp <span className="contact-field__hint">(opcional)</span>
                        </label>
                        <input
                          className="contact-field__input"
                          id="contact-whatsapp"
                          name="whatsapp"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+51 900 000 000"
                          value={form.whatsapp}
                          onChange={actualizar('whatsapp')}
                        />
                      </div>

                      <div className="contact-field">
                        <label className="contact-field__label" htmlFor="contact-modalidad">
                          Modalidad
                        </label>
                        <div className="contact-field__select">
                          <select
                            className="contact-field__control"
                            id="contact-modalidad"
                            name="modalidad"
                            value={form.modalidad}
                            onChange={actualizar('modalidad')}
                            aria-invalid={Boolean(errores.modalidad)}
                            aria-describedby={errores.modalidad ? 'error-modalidad' : undefined}
                            required
                          >
                            <option value="">Selecciona una opción</option>
                            {MODALIDADES.map((modalidad) => (
                              <option value={modalidad} key={modalidad}>
                                {modalidad}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errores.modalidad && (
                          <p className="contact-field__error" id="error-modalidad">
                            {errores.modalidad}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="contact-field">
                      <label className="contact-field__label" htmlFor="contact-servicio">
                        Tipo de servicio
                      </label>
                      <div className="contact-field__select">
                        <select
                          className="contact-field__control"
                          id="contact-servicio"
                          name="servicio"
                          value={form.servicio}
                          onChange={actualizar('servicio')}
                          aria-invalid={Boolean(errores.servicio)}
                          aria-describedby={errores.servicio ? 'error-servicio' : undefined}
                          required
                        >
                          <option value="">Selecciona una opción</option>
                          {SERVICIOS.map((servicio) => (
                            <option value={servicio.id} key={servicio.id}>
                              {servicio.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errores.servicio && (
                        <p className="contact-field__error" id="error-servicio">
                          {errores.servicio}
                        </p>
                        )}
                    </div>

                    <div className="contact-field">
                      <label className="contact-field__label" htmlFor="contact-mensaje">
                        Mensaje
                      </label>
                      <textarea
                        className="contact-field__control contact-field__textarea"
                        id="contact-mensaje"
                        name="mensaje"
                        rows={5}
                        placeholder="Objetivo, contexto o duda principal."
                        value={form.mensaje}
                        onChange={actualizar('mensaje')}
                        aria-invalid={Boolean(errores.mensaje)}
                        aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
                        required
                      />
                      {errores.mensaje && (
                        <p className="contact-field__error" id="error-mensaje">
                          {errores.mensaje}
                        </p>
                      )}
                    </div>

                    <div className="contact-consent">
                      <input
                        className="contact-consent__checkbox"
                        id="contact-acepta"
                        name="acepta"
                        type="checkbox"
                        checked={form.acepta}
                        onChange={actualizar('acepta')}
                        aria-invalid={Boolean(errores.acepta)}
                        aria-describedby={errores.acepta ? 'error-acepta' : undefined}
                      />
                      <label className="contact-consent__label" htmlFor="contact-acepta">
                        Acepto ser contactado/a para recibir información sobre mi solicitud.
                      </label>
                    </div>
                    {errores.acepta && (
                      <p className="contact-field__error" id="error-acepta">
                        {errores.acepta}
                      </p>
                    )}

                    <button className="contact-button contact-button--primary" type="submit">
                      <span>Enviar solicitud</span>
                      <Send size={17} strokeWidth={2.1} aria-hidden="true" />
                    </button>
                  </form>
                )}
              </div>

              {/* ---------- Panel de pago por servicio ---------- */}
              <aside className="contact-payment" aria-labelledby="contact-payment-title">
                <header className="contact-payment__head">
                  <span className="contact-payment__head-icon">
                    <CreditCard size={18} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="contact-payment__title" id="contact-payment-title">
                      Pago por servicio
                    </h2>
                    <p className="contact-payment__lead">
                      Si el servicio requiere pago previo, aquí podrás revisar la inversión y
                      continuar.
                    </p>
                  </div>
                </header>

                {/* Resumen. Los valores se atenuan hasta que el formulario tiene
                    algo seleccionado, y se iluminan cuando lo hay. */}
                <dl className="contact-payment__summary">
                  <div className="contact-payment__row">
                    <dt>Servicio seleccionado</dt>
                    <dd data-active={Boolean(servicioElegido)}>{resumenServicio}</dd>
                  </div>
                  <div className="contact-payment__row">
                    <dt>Modalidad</dt>
                    <dd data-active={Boolean(form.modalidad)}>{resumenModalidad}</dd>
                  </div>
                  <div className="contact-payment__row">
                    <dt>Duración estimada</dt>
                    <dd data-active={Boolean(servicioElegido)}>{resumenDuracion}</dd>
                  </div>
                  <div className="contact-payment__row">
                    <dt>Inversión referencial</dt>
                    <dd data-active={Boolean(servicioElegido)}>{resumenInversion}</dd>
                  </div>
                </dl>

                <p className="contact-payment__notice">
                  <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
                  El pago solo se habilita cuando corresponde al servicio elegido.
                </p>

                <div>
                  <p className="contact-payment__process-title">¿Cómo funciona?</p>
                  <ol className="contact-payment__steps">
                    {PROCESS_STEPS.map(({ id, label }, indice) => (
                      <li className="contact-payment__step" key={id}>
                        <span className="contact-payment__step-number">
                          {String(indice + 1).padStart(2, '0')}
                        </span>
                        <span className="contact-payment__step-label">{label}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="contact-payment__actions">
                  {/* Todavia no hay checkout: el boton queda deshabilitado y a la
                      espera de conectar el flujo de pago real. */}
                  <button
                    className="contact-button contact-button--primary contact-button--blocked"
                    type="button"
                    aria-disabled="true"
                    title="El pago se habilita cuando confirmemos el servicio y la inversión"
                  >
                    <span>Continuar al pago</span>
                    <CreditCard size={17} strokeWidth={2.1} aria-hidden="true" />
                  </button>

                  <a
                    className="contact-button contact-button--secondary"
                    href={mailto('Consulta previa al pago')}
                  >
                    Consultar antes de pagar
                  </a>
                </div>

                <p className="contact-payment__note">
                  <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
                  Pago seguro · Confirmación por correo o WhatsApp
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. CANALES ALTERNATIVOS
            ========================================================= */}
        <section className="contact-channels" aria-labelledby="contact-channels-title">
          <div className="contact-channels__container">
            <h2 className="contact-channels__title" id="contact-channels-title">
              También puedes escribirnos por aquí
            </h2>

            <ul className="contact-channels__grid">
              {CHANNELS.map(({ id, icon: Icon, label, value, href, text }) => (
                <li className="contact-channel" key={id}>
                  <span className="contact-channel__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <div className="contact-channel__body">
                    <p className="contact-channel__label">{label}</p>
                    {href ? (
                      <a className="contact-channel__value" href={href}>
                        {value}
                      </a>
                    ) : (
                      <p className="contact-channel__value">{value}</p>
                    )}
                    <p className="contact-channel__text">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================================================
            4. CTA FINAL
            ========================================================= */}
        <section className="contact-closing" aria-labelledby="contact-closing-title">
          <div className="contact-closing__container">
            <h2 className="contact-closing__title" id="contact-closing-title">
              ¿No sabes qué servicio necesitas?
            </h2>
            <p className="contact-closing__text">
              Escríbenos y te orientamos según tu objetivo.
            </p>
            <div className="contact-closing__actions">
              <a
                className="contact-button contact-button--primary"
                href={mailto('Solicitud de orientación')}
              >
                <span>Solicitar orientación</span>
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
              </a>
              <Link className="contact-button contact-button--secondary" to="/servicios">
                Ver servicios
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
