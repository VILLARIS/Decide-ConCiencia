import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import founderImage from '../../assets/avatarAbout.png'
import './AboutSection.css'

/*
  SOBRE YUMIBIOTIC

  Sección que presenta primero a Yumibiotic como empresa de nutrición, educación
  y bienestar, para luego introducir a la Dra. Yulia como fundadora.

  La imagen usada es assets/avatarAbout.png. No se inventan credenciales,
  grados, universidades, especialidades, años de experiencia ni certificaciones.
*/

export default function AboutSection() {
  return (
    <section className="about" id="quienes-somos" aria-labelledby="about-title">
      <div className="about__container">
        <div className="about__figure">
          <img
            className="about__portrait"
            src={founderImage}
            alt="Dra. Yulia, fundadora de Yumibiotic"
            width="1122"
            height="1402"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="about__content">
          <p className="about__eyebrow">Nuestra esencia</p>

          <h2 className="about__title" id="about-title">
            Ciencia, educación y acompañamiento
          </h2>

          <p className="about__text">
            Yumibiotic es una empresa de nutrición, educación y bienestar. Trabajamos
            para que la información confiable pase a ser decisiones prácticas y a
            hábitos que se sostienen con el tiempo.
          </p>

          <p className="about__text about__text--secondary">
            Creemos que educar bien es acompañar mejor: por eso traducimos la ciencia
            a herramientas aplicables a la vida diaria y al trabajo de quienes
            atienden a otras personas.
          </p>

          <p className="about__quote">
            “Conocimiento para decisiones reales.”
          </p>

          <p className="about__founder">
            <span className="about__founder-name">Dra. Yulia</span>
            <span className="about__founder-role">Fundadora</span>
          </p>

          <Link className="about__link" to="/quienes-somos">
            Conocer más
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}