import { ArrowRight, ClipboardList, GraduationCap, UserRound } from 'lucide-react'
import './ServicesSection.css'

const SERVICES = [
  {
    id: 'asesoria-nutricional',
    title: 'Asesoría nutricional',
    description:
      'Acompañamiento personalizado para mejorar hábitos, resolver dudas y tomar decisiones más informadas sobre tu alimentación.',
    tone: 'sage',
    icon: UserRound,
  },
  {
    id: 'capacitaciones',
    title: 'Capacitaciones',
    description:
      'Formación práctica en nutrición para profesionales, equipos e instituciones.',
    tone: 'sky',
    icon: GraduationCap,
  },
  {
    id: 'programas-y-talleres',
    title: 'Programas y talleres',
    description:
      'Experiencias educativas para grupos, empresas y comunidades que buscan aprender y aplicar hábitos saludables.',
    tone: 'plain',
    icon: ClipboardList,
  },
]

export default function ServicesSection() {
  return (
    <section className="services" id="servicios" aria-labelledby="services-title">
      <div className="services__container">
        <header className="services__header">
          <p className="services__eyebrow">Servicios</p>

          <h2 className="services__title" id="services-title">
            Acompañamiento más allá de los cursos
          </h2>

          <p className="services__intro">
            Asesorías, capacitaciones y programas pensados para ayudarte a aplicar el
            conocimiento de forma práctica y cercana.
          </p>
        </header>

        <ul className="services__grid">
          {SERVICES.map(({ id, title, description, tone, icon: Icon }) => (
            <li className={`service-block service-block--${tone}`} key={id}>
              <span className="service-block__icon">
                <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
              </span>

              <h3 className="service-block__title">{title}</h3>
              <p className="service-block__text">{description}</p>

              <a
                className="service-block__link"
                href={`/servicios/${id}`}
                aria-label={`Conocer más sobre ${title}`}
              >
                Conocer más
                <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <div className="services__footer">
          <a className="services__all" href="/servicios">
            Ver todos los servicios
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
