import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/Home/heroImage.png'
import './Hero.css'

const ATTRIBUTES = [
  'Basado en evidencia',
  'Enfoque integral',
  'Acompañamiento profesional',
]

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">Nutrición · Educación · Bienestar</p>
          <h1 className="hero__title" id="hero-title">
            <span className="hero__title-line">Soluciones en nutrición,</span>
            <span className="hero__title-line hero__title-line--accent">educación y bienestar</span>
          </h1>
          <p className="hero__text">Acompañamos a personas, profesionales y organizaciones a tomar decisiones informadas y construir hábitos sostenibles mediante asesoría, capacitación y educación basada en evidencia.</p>
          <div className="hero__actions">
            <Link className="hero__button hero__button--primary" to="/servicios">
              <span>Conocer servicios</span>
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </Link>
            <Link className="hero__button hero__button--secondary" to="/quienes-somos">Quiénes somos</Link>
          </div>
          <ul className="hero__attributes">
            {ATTRIBUTES.map((label) => (
              <li className="hero__attribute" key={label}>
                <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p className="hero__signature">
            <span className="hero__signature-text">Conocimiento para decisiones reales</span>
          </p>
        </div>
      </div>
      <figure className="hero__figure">
        <img
          className="hero__image"
          src={heroImage}
          alt="Dra. Yulia sentada junto a su laptop y sus libros, con saco blanco y blusa crema, en un entorno claro con plantas"
          width="1448"
          height="1086"
          fetchPriority="high"
          decoding="async"
        />
      </figure>
    </section>
  )
}