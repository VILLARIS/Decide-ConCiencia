import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  HeartPulse,
  Mail,
  MessageCircle,
  School,
  Stethoscope,
  Target,
  UserRound,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './ServicesPage.css'

const CONTACT_EMAIL = 'hola@yulia.com'

const mailto = (subject) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

/* Atributos del hero: iconos pequenos en linea, sin cards. */
const HERO_ATTRIBUTES = [
  { id: 'cercana', label: 'Atención cercana', icon: MessageCircle },
  { id: 'practico', label: 'Enfoque práctico', icon: Target },
  { id: 'evidencia', label: 'Basado en evidencia', icon: BookOpen },
]

/* Servicios principales. Los tonos alternan blanco, azul muy claro y verde
   muy claro para dar ritmo sin relying en sombras. */
const SERVICES = [
  {
    id: 'asesoria-nutricional',
    title: 'Asesoría nutricional',
    description:
      'Acompañamiento personalizado para mejorar hábitos, resolver dudas y tomar decisiones más informadas sobre tu alimentación.',
    includes: [
      'orientación personalizada',
      'revisión de hábitos',
      'recomendaciones prácticas',
    ],
    cta: 'Solicitar información',
    tone: 'plain',
    icon: UserRound,
  },
  {
    id: 'capacitaciones',
    title: 'Capacitaciones',
    description:
      'Sesiones educativas para profesionales, equipos e instituciones que buscan fortalecer sus conocimientos en nutrición.',
    includes: [
      'sesiones virtuales o presenciales',
      'contenido adaptado al público',
      'material educativo',
    ],
    cta: 'Consultar capacitación',
    tone: 'sky',
    icon: GraduationCap,
  },
  {
    id: 'programas-y-talleres',
    title: 'Programas y talleres',
    description:
      'Experiencias educativas diseñadas para grupos, empresas o comunidades.',
    includes: ['talleres prácticos', 'programas temáticos', 'dinámicas educativas'],
    cta: 'Conocer programas',
    tone: 'sage',
    icon: UsersRound,
  },
]

/* Proceso en 3 pasos. Solo explica el flujo: no hay reservas ni calendario. */
const STEPS = [
  {
    id: 'necesidad',
    number: '01',
    title: 'Cuéntanos qué necesitas',
    description: 'Explícanos qué tipo de asesoría o capacitación estás buscando.',
  },
  {
    id: 'opcion',
    number: '02',
    title: 'Definimos la mejor opción',
    description:
      'Yulia te orientará sobre el servicio que mejor se adapte a tus objetivos.',
  },
  {
    id: 'coordinacion',
    number: '03',
    title: 'Coordinamos contigo',
    description: 'Definimos modalidad, fecha y detalles para comenzar.',
  },
]

/* Perfiles: cuadrícula editorial ligera, no cards. */
const AUDIENCES = [
  {
    id: 'personas',
    title: 'Personas que buscan mejorar sus hábitos',
    description: 'Acompañamiento individual para ordenar la alimentación diaria.',
    icon: HeartPulse,
  },
  {
    id: 'profesionales',
    title: 'Profesionales de salud y nutrición',
    description: 'Formación para fortalecer conceptos y atender con más confianza.',
    icon: Stethoscope,
  },
  {
    id: 'educativas',
    title: 'Instituciones educativas',
    description: 'Capacitaciones y talleres para docentes, estudiantes y comunidades.',
    icon: School,
  },
  {
    id: 'empresas',
    title: 'Empresas y organizaciones',
    description: 'Programas para equipos que buscan bienestar sostenido.',
    icon: Building2,
  },
]

/* Escena botanica del hero: SVG decorativo en vez de fotografia stock.
   Se mantiene aria-hidden porque no aporta informacion que el texto no tenga. */
function HeroBotanical() {
  return (
    <svg
      className="servicios-hero__scene"
      viewBox="0 0 420 340"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="svcLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8fc46f" />
          <stop offset="100%" stopColor="#62b747" />
        </linearGradient>
        <linearGradient id="svcLeafSoft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9e6bb" />
          <stop offset="100%" stopColor="#a5d491" />
        </linearGradient>
        <linearGradient id="svcPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fbfdfb" />
        </linearGradient>
      </defs>

      {/* Halo suave de fondo */}
      <ellipse cx="212" cy="176" rx="188" ry="136" fill="#f1f8ee" />
      <ellipse cx="330" cy="96" rx="72" ry="58" fill="#eaf3f7" />

      {/* Hojas traseras */}
      <path
        d="M62 250c-6-52 18-104 66-124 8 46-10 96-52 116-5 3-13 6-14 8z"
        fill="url(#svcLeafSoft)"
      />
      <path
        d="M352 268c14-40 8-84-18-112-24 32-26 78-2 108 4 3 16 4 20 4z"
        fill="url(#svcLeafSoft)"
      />

      {/* Libreta */}
      <g>
        <rect
          x="126"
          y="104"
          width="176"
          height="164"
          rx="16"
          fill="url(#svcPaper)"
          stroke="#e4ede6"
          strokeWidth="1.5"
        />
        <path d="M156 104v164" stroke="#e4ede6" strokeWidth="1.5" />
        <g fill="#e4ede6">
          <rect x="174" y="132" width="102" height="7" rx="3.5" />
          <rect x="174" y="152" width="86" height="7" rx="3.5" />
          <rect x="174" y="172" width="94" height="7" rx="3.5" />
        </g>
        <rect x="174" y="198" width="64" height="7" rx="3.5" fill="#8fc46f" />
        <rect x="174" y="218" width="44" height="7" rx="3.5" fill="#e4ede6" />

        {/* Brote sobre la libreta */}
        <path
          d="M206 244c-2-14 6-26 20-30 3 14-5 26-18 30h-2z"
          fill="url(#svcLeaf)"
        />
        <path
          d="M204 244c-8-8-10-20-4-30 10 6 13 19 6 30h-2z"
          fill="#8fc46f"
        />
        <path d="M204 244v10" stroke="#4e8c39" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* Frutos */}
      <g>
        <circle cx="92" cy="112" r="24" fill="#f0b183" />
        <path d="M92 88c6-4 12-4 16 0-6 3-12 3-16 0z" fill="#4e8c39" />
        <circle cx="86" cy="104" r="7" fill="#f7c79f" />
      </g>
      <g>
        <circle cx="330" cy="222" r="27" fill="#8fc46f" />
        <path d="M330 195c7-5 14-5 18 0-7 4-14 4-18 0z" fill="#4e8c39" />
        <circle cx="322" cy="212" r="8" fill="#a9d791" />
      </g>
      <circle cx="66" cy="186" r="7" fill="#d3e8c8" />
      <circle cx="366" cy="150" r="9" fill="#d3e8c8" />
      <circle cx="140" cy="60" r="6" fill="#cfe4dd" />
    </svg>
  )
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="servicios">
        {/* ---------- 1. Hero ---------- */}
        <section className="servicios-hero" aria-labelledby="servicios-hero-title">
          <div className="servicios-hero__container">
            <div className="servicios-hero__content">
              <p className="servicios-hero__eyebrow">Servicios</p>

              <h1 className="servicios-hero__title" id="servicios-hero-title">
                Acompañamiento nutricional pensado para la vida real
              </h1>

              <p className="servicios-hero__text">
                Asesorías, capacitaciones y programas diseñados para ayudarte a aplicar el
                conocimiento de forma práctica, cercana y basada en evidencia.
              </p>

              <div className="servicios-hero__actions">
                <a className="servicios-hero__cta" href="#servicios">
                  Conocer servicios
                  <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
                </a>

                <a className="servicios-hero__cta servicios-hero__cta--ghost" href={mailto('Contacto desde la página de servicios')}>
                  Contactar
                </a>
              </div>

              <ul className="servicios-hero__attributes">
                {HERO_ATTRIBUTES.map(({ id, label, icon: Icon }) => (
                  <li className="servicios-hero__attribute" key={id}>
                    <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="servicios-hero__visual">
              <HeroBotanical />
            </div>
          </div>
        </section>

        {/* ---------- 2. Servicios principales ---------- */}
        <section className="servicios-main" id="servicios" aria-labelledby="servicios-main-title">
          <div className="servicios-main__container">
            <header className="servicios-main__header">
              <h2 className="servicios-main__title" id="servicios-main-title">
                Servicios pensados para diferentes necesidades
              </h2>

              <p className="servicios-main__intro">
                Desde el acompañamiento individual hasta la formación para equipos e
                instituciones.
              </p>
            </header>

            <ul className="servicios-main__grid">
              {SERVICES.map(({ id, title, description, includes, cta, tone, icon: Icon }) => (
                <li className={`servicio servicio--${tone}`} key={id}>
                  <span className="servicio__icon">
                    <Icon size={23} strokeWidth={1.75} aria-hidden="true" />
                  </span>

                  <h3 className="servicio__title">{title}</h3>
                  <p className="servicio__text">{description}</p>

                  <ul className="servicio__list">
                    {includes.map((item) => (
                      <li className="servicio__item" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    className="servicio__link"
                    href={mailto(`Consulta por ${title}`)}
                    aria-label={`${cta}: ${title}`}
                  >
                    {cta}
                    <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 3. Cómo funciona ---------- */}
        <section className="servicios-proceso" aria-labelledby="servicios-proceso-title">
          <div className="servicios-proceso__container">
            <header className="servicios-proceso__header">
              <h2 className="servicios-proceso__title" id="servicios-proceso-title">
                ¿Cómo funciona?
              </h2>
            </header>

            <ol className="servicios-proceso__steps">
              {STEPS.map(({ id, number, title, description }) => (
                <li className="servicios-proceso__step" key={id}>
                  <span className="servicios-proceso__number">{number}</span>
                  <h3 className="servicios-proceso__step-title">{title}</h3>
                  <p className="servicios-proceso__text">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- 4. Para quién es ---------- */}
        <section className="servicios-audiencia" aria-labelledby="servicios-audiencia-title">
          <div className="servicios-audiencia__container">
            <header className="servicios-audiencia__header">
              <h2 className="servicios-audiencia__title" id="servicios-audiencia-title">
                ¿Para quién son estos servicios?
              </h2>
            </header>

            <ul className="servicios-audiencia__grid">
              {AUDIENCES.map(({ id, title, description, icon: Icon }) => (
                <li className="servicios-audiencia__item" key={id}>
                  <span className="servicios-audiencia__icon">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </span>

                  <h3 className="servicios-audiencia__item-title">{title}</h3>
                  <p className="servicios-audiencia__text">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 5. CTA final ---------- */}
        <section className="servicios-cta" aria-labelledby="servicios-cta-title">
          <div className="servicios-cta__container">
            <div className="servicios-cta__panel">
              <div className="servicios-cta__copy">
                <h2 className="servicios-cta__title" id="servicios-cta-title">
                  ¿Tienes dudas sobre qué servicio elegir?
                </h2>

                <p className="servicios-cta__text">
                  Cuéntanos qué necesitas y te orientaremos hacia la opción más
                  adecuada.
                </p>
              </div>

              <div className="servicios-cta__actions">
                <a className="servicios-cta__button" href={mailto('Consulta sobre servicios')}>
                  <Mail size={16} strokeWidth={2} aria-hidden="true" />
                  Contactar
                </a>

                <Link className="servicios-cta__link" to="/cursos">
                  Ver cursos
                  <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
