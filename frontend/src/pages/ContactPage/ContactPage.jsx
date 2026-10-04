import { ArrowRight, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import FinalCta from '../../components/FinalCta/FinalCta.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx'
import './ContactPage.css'

/*
  /contacto

  El navbar apunta aqui, asi que la ruta tiene que existir de verdad: antes
  "Contacto" iba a /contact, que no estaba declarada y caia en la ruta comodin,
  mostrando el home en lugar de una pagina de contacto.

  Los datos son los que ya publica el pie de pagina (mismo correo y misma
  ciudad). No se inventan telefonos ni redes: lo que no tiene dato real, no se
  enlaza.
*/
const CONTACT_CHANNELS = [
  {
    id: 'email',
    icon: Mail,
    label: 'Correo',
    value: 'hola@yulia.com',
    href: 'mailto:hola@yulia.com',
    text: 'Para consultas sobre cursos, servicios y formas de pago.',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Escribir por WhatsApp',
    href: null,
    text: 'El numero se confirma al inscribirte en un curso o contratar un servicio.',
  },
  {
    id: 'ubicacion',
    icon: MapPin,
    label: 'Ubicación',
    value: 'Lima, Perú',
    href: null,
    text: 'Consultas y acompañamiento en linea con citas previas.',
  },
]

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="contact-page__hero" aria-labelledby="contact-page-title">
          <div className="contact-page__container">
            <p className="contact-page__eyebrow">Contacto</p>

            <h1 className="contact-page__title" id="contact-page-title">
              Hablemos
            </h1>

            <p className="contact-page__lead">
              Escríbenos para resolver dudas sobre los cursos, contratar un servicio o
              coordinar una asesoría. Respondemos por correo.
            </p>
          </div>
        </section>

        <section className="contact-page__channels" aria-label="Canales de contacto">
          <div className="contact-page__container contact-page__grid">
            {CONTACT_CHANNELS.map(({ id, icon: Icon, label, value, href, text }) => (
              <article className="contact-page__card" key={id}>
                <span className="contact-page__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>

                <h2 className="contact-page__card-label">{label}</h2>

                {href ? (
                  <a className="contact-page__card-value" href={href}>
                    {value}
                  </a>
                ) : (
                  <span className="contact-page__card-value">{value}</span>
                )}

                <p className="contact-page__card-text">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-page__next" aria-label="Siguiente paso">
          <div className="contact-page__container contact-page__next-inner">
            <p className="contact-page__next-text">
              ¿Ya sabes cuál es tu curso? Puedes entrar con tu cuenta para seguir tu
              progreso.
            </p>

            <Link className="contact-page__next-link" to="/acceso">
              Comenzar
              <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <FinalCta />
      </main>

      <Footer />
    </>
  )
}