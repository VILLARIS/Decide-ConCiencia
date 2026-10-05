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
import heroImagen from '../../assets/Services/imageHero.png'
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

/* Hero: la fotografia entra por la derecha hasta el borde del viewport y su
   lado izquierdo se disuelve con una mascara, igual que en Home y About. No hay
   card, ni marco, ni radio, ni sombra. */
function HeroFigure() {
  return (
    <figure className="servicios-hero__figure">
      <img
        className="servicios-hero__image"
        src={heroImagen}
        alt="Acompañamiento nutricional: alimentación saludable y herramientas prácticas de consulta"
        width="2172"
        height="724"
        fetchPriority="high"
        decoding="async"
      />
    </figure>
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
                <a className="servicios-hero__button servicios-hero__button--primary" href="#servicios">
                  <span>Conocer servicios</span>
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
                </a>

                <a
                  className="servicios-hero__button servicios-hero__button--secondary"
                  href={mailto('Contacto desde la página de servicios')}
                >
                  Contactar
                </a>
              </div>

              <ul className="servicios-hero__attributes">
                {HERO_ATTRIBUTES.map(({ id, label, icon: Icon }) => (
                  <li className="servicios-hero__attribute" key={id}>
                    <Icon size={15} strokeWidth={2} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <HeroFigure />
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
