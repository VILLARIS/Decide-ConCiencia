import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import asesoríaImg from '../../assets/Home/OurServices/Asesoria.png'
import capacitacionesImg from '../../assets/Home/OurServices/Capacitaciones.png'
import bienestarImg from '../../assets/Home/OurServices/Bienestar.png'
import cursosImg from '../../assets/Home/OurServices/Cursos.png'
import './ServicesSection.css'

/*
  SERVICIOS

  Composicion editorial asimetrica, no cuatro cards identicas: una tarjeta alta
  con foto a la izquierda (asesoria, el servicio mas cercano a la persona) y dos
  tarjetas apiladas a la derecha, mas una tarjeta ancha de cierre para cursos.
  Asi el bloque tiene ritmo y no se lee como una grilla repetida.

  NOTA DE ASSETS: la foto de la tarjeta grande es avatarHero.png, que el Hero
  dejo de usar. Las otras tres tarjetas no tienen fotografia propia todavia, asi
  que usan los fondos anchos que ya tenia el proyecto (backgroundCourses,
  backgroundAbout, backgroundHero) como textura de marca al 12%: dan material
  sin inventar imagenes. Cuando existan fotos reales de cada servicio, se
  sustituyen por un <img> con object-fit: cover, igual que la tarjeta grande.
*/

const SERVICES = [
  {
    key: 'asesoria',
    variant: 'lead',
    category: 'Asesoría',
    title: 'Asesoría nutricional',
    description:
      'Orientación cercana para comer con criterio y sostener cambios que duren en el tiempo.',
    to: '/servicios',
    image: asesoríaImg,
    imagePosition: 'center 24%',
  },
  {
    key: 'capacitaciones',
    variant: 'stack',
    category: 'Capacitación',
    title: 'Capacitaciones',
    description:
      'Formación para equipos y profesionales con herramientas aplicables a su día a día.',
    to: '/servicios',
    image: capacitacionesImg,
    imagePosition: 'center 30%',
  },
  {
    key: 'programas',
    variant: 'stack',
    category: 'Bienestar',
    title: 'Programas de bienestar',
    description:
      'Acompañamiento sostenido para organizar hábitos de alimentación y cuidado personal.',
    to: '/servicios',
    image: bienestarImg,
    imagePosition: 'center 26%',
  },
  {
    key: 'cursos',
    variant: 'wide',
    category: 'Educación',
    title: 'Cursos y formación',
    description:
      'Contenido para aprender a tu ritmo, desde la plataforma de cursos de Yumibiotic.',
    to: '/cursos',
    image: cursosImg,
    imagePosition: 'center 22%',
  },
]

export default function ServicesSection() {
  return (
    <section className="services" id="servicios" aria-labelledby="services-title">
      <div className="services__container">
        <header className="services__head">
          <h2 className="services__title" id="services-title">
            Nuestros servicios
          </h2>
          <p className="services__intro">
            Soluciones pensadas para acompañar distintas necesidades en nutrición,
            educación y bienestar.
          </p>
        </header>

        <div className="services__grid">
          {SERVICES.map((service) => (
            <article
              className={`services__card services__card--${service.variant}`}
              key={service.key}
              style={
                service.imagePosition
                  ? { '--card-image-position': service.imagePosition }
                  : undefined
              }
            >
              {service.image && (
                <figure className="services__media">
                  <img
                    className="services__image"
                    src={service.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              )}

              <div className="services__body">
                <p className="services__category">{service.category}</p>
                <h3 className="services__card-title">{service.title}</h3>
                <p className="services__description">{service.description}</p>

                <Link className="services__link" to={service.to}>
                  <span>Conocer más</span>
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}