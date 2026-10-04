import { Award, BookOpen, Clock3 } from 'lucide-react'
import backgroundCourses from '../../assets/backgroundCourses.png'
import './CoursesHero.css'

const BENEFITS = [
  { id: 'contenido', label: 'Contenido actualizado', icon: BookOpen },
  { id: 'ritmo', label: 'Aprende a tu ritmo', icon: Clock3 },
  { id: 'certificado', label: 'Certificado de finalización', icon: Award },
]

export default function CoursesHero() {
  return (
    <section className="courses-hero" aria-labelledby="courses-hero-title">
      <img
        className="courses-hero__image"
        src={backgroundCourses}
        alt=""
        width="1916"
        height="821"
        fetchPriority="high"
        decoding="async"
      />

      <div className="courses-hero__container">
        <div className="courses-hero__content">
          <p className="courses-hero__eyebrow">Cursos</p>

          <h1 className="courses-hero__title" id="courses-hero-title">
            Explora nuestros cursos
          </h1>

          <p className="courses-hero__text">
            Formación práctica y basada en evidencia para mejorar tu salud y construir
            hábitos sostenibles.
          </p>

          <ul className="courses-hero__benefits">
            {BENEFITS.map(({ id, label, icon: Icon }) => (
              <li className="courses-hero__benefit" key={id}>
                <span className="courses-hero__benefit-icon">
                  <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
