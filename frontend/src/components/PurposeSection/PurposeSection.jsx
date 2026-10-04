import { BadgeCheck, BookOpenCheck, HeartHandshake, Layers } from 'lucide-react'
import './PurposeSection.css'

/*
  POR QUE YUMIBIOTIC

  Cuatro columnas simples, sin cards ni bordes: icono, titulo y texto,
  separadas por lineas verticales muy suaves. El bloque va sobre un verde
  clarisimo para marcar el ritmo de la pagina sin usar colores intensos.
*/

const VALUES = [
  {
    icon: BadgeCheck,
    title: 'Basado en evidencia',
    description: 'Información que se sostiene en fuentes y no en opiniones de moda.',
  },
  {
    icon: Layers,
    title: 'Enfoque integral',
    description: 'Alimentación, hábitos y contexto: las decisiones se toman completas.',
  },
  {
    icon: BookOpenCheck,
    title: 'Educación práctica',
    description: 'Explicamos para que se pueda aplicar, no solo para que se entienda.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento profesional',
    description: 'Personas que acompañan el proceso con criterio y cerca.',
  },
]

export default function PurposeSection() {
  return (
    <section className="why" aria-labelledby="why-title">
      <span className="why__leaf" aria-hidden="true" />

      <div className="why__container">
        <header className="why__head">
          <h2 className="why__title" id="why-title">
            Una forma diferente de entender el bienestar
          </h2>
          <p className="why__intro">
            Somos una empresa de nutrición, educación y bienestar. Trabajamos para
            que la información se convierta en decisiones y en hábitos que se
            sostienen con el tiempo.
          </p>
        </header>

        <ul className="why__values">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <li className="why__value" key={title}>
              <span className="why__icon" aria-hidden="true">
                <Icon size={17} strokeWidth={2.1} />
              </span>
              <h3 className="why__value-title">{title}</h3>
              <p className="why__value-text">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}