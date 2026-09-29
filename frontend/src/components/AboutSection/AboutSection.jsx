import { BookOpen, FlaskConical, Heart } from 'lucide-react'
import aboutBackground from '../../assets/backgroundAbout.png'
import aboutAvatar from '../../assets/avatarAbout.png'
import './AboutSection.css'

const VALUES = [
  {
    id: 'ciencia',
    title: 'Ciencia',
    text: 'sin complicaciones',
    icon: FlaskConical,
  },
  {
    id: 'habitos',
    title: 'Hábitos',
    text: 'para la vida real',
    icon: Heart,
  },
  {
    id: 'conocimiento',
    title: 'Conocimiento',
    text: 'que se aplica',
    icon: BookOpen,
  },
]

export default function AboutSection() {
  return (
    <section
      className="about"
      style={{ '--about-background-image': `url(${aboutBackground})` }}
      aria-labelledby="about-title"
    >
      <div className="about__container">
        <div className="about__layout">
          <div className="about__figure">
            <img
              className="about__avatar"
              src={aboutAvatar}
              alt="Yulia, nutricionista, con bata blanca señalando hacia arriba"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="about__content">
            <p className="about__eyebrow">Sobre Yulia</p>

            <h2 className="about__title" id="about-title">
              Hagamos de la nutrición algo claro, práctico y basado en ciencia.
            </h2>

            <p className="about__text">
              Soy Yulia, y creo en una nutrición sin mitos, cercana y aplicable a la vida
              real. A través de Decide ConCiencia, te acompaño con información confiable,
              herramientas prácticas y un enfoque humano.
            </p>

            <ul className="about__values">
              {VALUES.map(({ id, title, text, icon: Icon }) => (
                <li className="about__value" key={id}>
                  <Icon
                    className="about__value-icon"
                    size={26}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <span className="about__value-copy">
                    <span className="about__value-title">{title}</span>
                    <span className="about__value-text">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
