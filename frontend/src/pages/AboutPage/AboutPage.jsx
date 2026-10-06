import { ArrowRight, BookOpen, Check, FlaskConical, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'
import aboutHero from '../../assets/AboutUs/imageHero.png'
import founderImage from '../../assets/AboutUs/avatarAbout.png'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './AboutPage.css'

const ATTRIBUTES = ['Ciencia', 'Educación', 'Bienestar']

const PILLARS = [
  {
    title: 'Ciencia',
    description:
      'Basamos cada decisión en evidencia confiable y actualizada, con rigor y criterio profesional.',
    icon: FlaskConical,
  },
  {
    title: 'Educación clara',
    description:
      'Traducimos el conocimiento científico en herramientas sencillas, prácticas y aplicables a la vida real.',
    icon: BookOpen,
  },
  {
    title: 'Bienestar integral',
    description:
      'Acompañamos de forma cercana y humana, considerando a la persona completa y no solo un diagnóstico.',
    icon: HeartHandshake,
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        {/* =========================================================
            HERO
            Composición horizontal única. La fotografía es el fondo del
            bloque y el texto se apoya en su zona clara izquierda, con un
            degradado muy suave que lo devuelve al blanco. Sin card, sin
            marco, sin radio, sin sombra.
            ========================================================= */}
        <section className="about-hero" aria-labelledby="about-page-title">
          <div className="about-hero__media">
            <img
              className="about-hero__image"
              src={aboutHero}
              alt="Dra. Yulia en un entorno de nutrición y bienestar, con alimentos frescos alrededor"
              width="1916"
              height="821"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="about-hero__container">
            <div className="about-hero__content">
              <p className="about-hero__eyebrow">QUIÉNES SOMOS</p>

              <h1 className="about-hero__title" id="about-page-title">
                Hagamos de la nutrición algo{' '}
                <span className="about-hero__title-accent">claro, práctico y basado en ciencia.</span>
              </h1>

              <p className="about-hero__text">
                En Yumibiotic ayudamos a personas, profesionales y organizaciones a tomar
                decisiones informadas sobre su salud a través de la nutrición, la educación y el
                bienestar, combinando ciencia, acompañamiento y soluciones aplicables a la vida real.
              </p>

              <div className="about-hero__actions">
                <Link className="about-hero__button about-hero__button--primary" to="#esencia">
                  <span>Conoce nuestra historia</span>
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
                </Link>
                <Link className="about-hero__button about-hero__button--secondary" to="/servicios">
                  Ver servicios
                </Link>
              </div>

              <ul className="about-hero__attributes">
                {ATTRIBUTES.map((label) => (
                  <li className="about-hero__attribute" key={label}>
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================
            NUESTRA ESENCIA
            Tres pilares como columnas sueltas separadas por líneas
            suaves. Sin cards, sin bordes, sin sombras.
            ========================================================= */}
        <section className="about-essence" id="esencia" aria-labelledby="essence-title">
          <div className="about-essence__container">
            <header className="about-essence__head">
              <p className="about-essence__eyebrow">Nuestra esencia</p>
              <h2 className="about-essence__title" id="essence-title">
                Ciencia, educación y acompañamiento
              </h2>
              <p className="about-essence__intro">
                Yumibiotic es una empresa de nutrición, educación y bienestar. Trabajamos para
                acercar la ciencia de la nutrición a la vida real, con herramientas prácticas y un
                acompañamiento cercano y profesional.
              </p>
            </header>

            <ul className="about-essence__grid">
              {PILLARS.map(({ title, description, icon: Icon }) => (
                <li className="about-essence__pillar" key={title}>
                  <span className="about-essence__icon">
                    <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <h3 className="about-essence__pillar-title">{title}</h3>
                  <p className="about-essence__pillar-text">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* =========================================================
            NUESTRA FUNDADORA
            Foto grande y texto editorial al lado. Sin card de perfil.
            ========================================================= */}
        <section className="about-founder" aria-labelledby="founder-title">
          <div className="about-founder__container">
            <div className="about-founder__grid">
              <figure className="about-founder__figure">
                <img
                  className="about-founder__image"
                  src={founderImage}
                  alt="Dra. Yulia, fundadora y directora de Yumibiotic"
                  width="1254"
                  height="1254"
                  loading="lazy"
                  decoding="async"
                />
              </figure>

              <div className="about-founder__content">
                <p className="about-founder__eyebrow">Nuestra fundadora</p>
                <h2 className="about-founder__title" id="founder-title">
                  Dra. Yulia
                </h2>
                <p className="about-founder__role">Fundadora y Directora de Yumibiotic</p>
                <p className="about-founder__text">
                  La Dra. Yulia impulsa Yumibiotic con una visión centrada en acercar la nutrición
                  basada en evidencia a la vida cotidiana, combinando educación, acompañamiento y
                  bienestar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CTA FINAL
            ========================================================= */}
        <section className="about-closing" aria-labelledby="closing-title">
          <div className="about-closing__container">
            <h2 className="about-closing__title" id="closing-title">
              Decidir mejor también es cuidar de ti.
            </h2>
            <p className="about-closing__text">
              Conoce nuestros servicios y descubre cómo Yumibiotic puede acompañarte.
            </p>
            <div className="about-closing__actions">
              <Link className="about-closing__button about-closing__button--primary" to="/servicios">
                <span>Conocer servicios</span>
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
              </Link>
              <Link className="about-closing__button about-closing__button--secondary" to="/contacto">
                Contáctanos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
