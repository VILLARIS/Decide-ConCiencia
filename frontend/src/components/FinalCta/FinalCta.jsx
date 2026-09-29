import { ArrowRight, Leaf } from 'lucide-react'
import './FinalCta.css'

export default function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__container">
        <div className="final-cta__panel">
          <span className="final-cta__leaf" aria-hidden="true">
            <Leaf size={18} strokeWidth={1.8} />
          </span>

          <div className="final-cta__copy">
            <h2 className="final-cta__title" id="final-cta-title">
              Empieza hoy tu camino hacia una mejor nutrición
            </h2>

            <p className="final-cta__text">
              Accede a nuestros cursos y servicios, y toma decisiones con conciencia.
            </p>
          </div>

          <a className="final-cta__button" href="/cursos">
            Explorar cursos
            <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
