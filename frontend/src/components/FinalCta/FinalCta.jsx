import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import backgroundCourses from '../../assets/backgroundCourses.png'
import './FinalCta.css'

/*
  CTA FINAL

  Franja horizontal grande, no una card centrada. Texto a la izquierda y un
  detalle vegetal muy tenue a la derecha (backgroundCourses reutilizado como
  textura). El CTA principal es verde, secundario es ghost sobre blanco para
  mantener el foco en el primer boton.
*/

export default function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <span className="final-cta__glow" aria-hidden="true" />

      <div className="final-cta__container">
        <div className="final-cta__content">
          <h2 className="final-cta__title" id="final-cta-title">
            Construyamos bienestar con decisiones informadas
          </h2>
          <p className="final-cta__text">
            Acompañamos a personas, profesionales y organizaciones para que la ciencia
            se convierta en hábitos sostenibles.
          </p>

          <div className="final-cta__actions">
            <Link className="final-cta__button final-cta__button--primary" to="/servicios">
              <span>Conocer nuestros servicios</span>
              <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
            </Link>

            <Link className="final-cta__button final-cta__button--secondary" to="/contacto">
              Contáctanos
            </Link>
          </div>
        </div>

        <div className="final-cta__visual" aria-hidden="true">
          <div
            className="final-cta__foliage"
            style={{ '--cta-texture': `url(${backgroundCourses})` }}
          />
        </div>
      </div>
    </section>
  )
}