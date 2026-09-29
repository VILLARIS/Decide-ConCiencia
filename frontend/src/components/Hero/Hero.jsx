import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react'
import heroBackground from '../../assets/backgroundHero.png'
import heroAvatar from '../../assets/avatarHero.png'
import './Hero.css'

const FEATURES = [
  { icon: BadgeCheck, label: 'Basado en evidencia' },
  { icon: Lightbulb, label: 'Aprendizaje práctico' },
  { icon: HeartHandshake, label: 'Acompañamiento humano' },
]

export default function Hero() {
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      style={{ '--hero-background-image': `url(${heroBackground})` }}
    >
      <div className="hero__decor" aria-hidden="true" />

      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__badge">
            <GraduationCap size={15} strokeWidth={2} aria-hidden="true" />
            Plataforma educativa
          </p>

          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-line hero__title-line--primary">
              Decide ConCiencia
            </span>
            <span className="hero__title-line hero__title-line--accent">
              Aprende con Yulia
            </span>
          </h1>

          <p className="hero__text">
            Cursos, capacitación y acompañamiento en nutrición para tomar
            decisiones informadas, mejorar tu salud y construir hábitos
            sostenibles.
          </p>

          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href="/cursos">
              <span>Ver cursos</span>
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </a>
            <a
              className="hero__button hero__button--secondary"
              href="/servicios"
            >
              Conocer servicios
            </a>
          </div>

          <ul className="hero__features">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li className="hero__feature" key={label}>
                <span className="hero__feature-icon">
                  <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__spacer" />
      </div>

      <div className="hero__stage">
        <img
          className="hero__avatar"
          src={heroAvatar}
          alt="Yulia preparando un curso de nutrición junto a su laptop y sus libros"
          width="1122"
          height="1402"
        />

        <p className="hero__handnote">
          <span className="hero__handnote-text">
            Conocimiento para decisiones reales
          </span>
          <svg
            className="hero__handnote-arrow"
            width="96"
            height="32"
            viewBox="0 0 96 32"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 5c14-3 34 3 52 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M46 17l9 3-6 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>

        <aside className="hero__card">
          <span className="hero__card-icon">
            <BookOpen size={17} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="hero__card-body">
            <span className="hero__card-title">Aprende a tu ritmo</span>
            <span className="hero__card-text">Contenido práctico y accesible</span>
          </span>
        </aside>
      </div>
    </section>
  )
}
