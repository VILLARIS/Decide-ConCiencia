import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../../assets/Navbar/Logo.png'
import './Footer.css'

/*
  Enlaces de navegacion del pie: usan Link y no <a href> a proposito.

  Un enlace con href="/cursos" hace que el navegador pida la URL de nuevo: se
  recarga toda la aplicacion y, como la sesion demo vive en memoria, la
  persona aparece desconectada al volver. Con Link se navega dentro de la app
  y la sesion se conserva.
*/

/* Marca + descripcion breve. */
const BRAND = {
  name: 'Yumibiotic',
  description:
    'Soluciones en nutrición, educación y bienestar para personas, profesionales y organizaciones.',
}

/* Espejo del navbar. */
const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'quienes-somos', label: 'Quiénes somos', href: '/quienes-somos' },
  { id: 'servicios', label: 'Servicios', href: '/servicios' },
  { id: 'cursos', label: 'Cursos', href: '/cursos' },
  { id: 'contacto', label: 'Contacto', href: '/contacto' },
]

/* Las cuatro lineas del negocio, en el mismo orden que la seccion de servicios
   del home. courses primero. */
const SERVICE_LINKS = [
  { id: 'asesoria', label: 'Asesoría nutricional', href: '/servicios' },
  { id: 'capacitaciones', label: 'Capacitaciones', href: '/servicios' },
  { id: 'programas', label: 'Programas de bienestar', href: '/servicios' },
  { id: 'cursos-recursos', label: 'Cursos y recursos', href: '/cursos' },
]

/*
  Datos de contacto: los que ya tenia el pie de pagina. NO se inventan
  telefonos, correos ni direcciones. WhatsApp sigue sin numero real, asi que se
  muestra como texto y no como enlace.
*/
const CONTACT = [
  {
    id: 'email',
    icon: Mail,
    label: 'Correo',
    value: 'hola@yulia.com',
    href: 'mailto:hola@yulia.com',
  },
  {
    id: 'whatsapp',
    icon: Phone,
    label: 'WhatsApp',
    value: '+51 9XX XXX XXX',
    href: null,
  },
  {
    id: 'ubicacion',
    icon: MapPin,
    label: 'Ubicación',
    value: 'Lima, Perú',
    href: null,
  },
]

const SOCIALS = [
  { id: 'instagram', name: 'Instagram', url: '#' },
  { id: 'youtube', name: 'YouTube', url: '#' },
  { id: 'linkedin', name: 'LinkedIn', url: '#' },
  { id: 'tiktok', name: 'TikTok', url: '#' },
]

const SOCIAL_SHAPES = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4.5" />
      <path d="M10.4 9.1 15.2 12l-4.8 2.9z" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
      <path d="M6.8 10.6v6.6" />
      <circle cx="6.8" cy="7.5" r="1.15" fill="currentColor" stroke="none" />
      <path d="M11.2 10.6v6.6" />
      <path d="M11.2 13.8c0-1.9 1.1-3.2 2.9-3.2s2.9 1.3 2.9 3.2v3.4" />
    </>
  ),
  tiktok: (
    <>
      <circle cx="10.7" cy="13.4" r="3.6" />
      <path d="M14.3 13.4V3.6c0 2.4 1.9 4.3 4.3 4.3" />
    </>
  ),
}

function SocialIcon({ network }) {
  return (
    <svg
      className="footer__social-icon"
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SOCIAL_SHAPES[network]}
    </svg>
  )
}

export default function Footer({ compact = false, studentArea = false }) {
  /* Version reducida para areas autenticadas: una sola fila, sin columnas. */
  if (compact) {
    return (
      <footer className={`footer footer--compact${studentArea ? ' footer--student' : ''}`}>
        <div className="footer__compact-inner">
          <p className="footer__compact-copy">
            © 2026 {BRAND.name}. Todos los derechos reservados.
          </p>

          <ul className="footer__compact-nav">
            {NAV_LINKS.map(({ id, label, href }) => (
              <li key={id}>
                <Link className="footer__link" to={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {studentArea ? (
            <p className="footer__compact-note">
              Área de estudiante en modo demostración: datos ficticios, sin servidor.
            </p>
          ) : null}
        </div>
      </footer>
    )
  }

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link className="footer__logo" to="/" aria-label="Yumibiotic, ir al inicio">
              <img className="footer__logo-img" src={logo} alt={BRAND.name} />
            </Link>

            <p className="footer__brand-name">{BRAND.name}</p>
            <p className="footer__brand-text">{BRAND.description}</p>
          </div>

          <nav className="footer__col" aria-label="Navegación del pie de página">
            <h2 className="footer__title">Navegación</h2>
            <ul className="footer__list">
              {NAV_LINKS.map(({ id, label, href }) => (
                <li key={id}>
                  <Link className="footer__link" to={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Servicios">
            <h2 className="footer__title">Servicios</h2>
            <ul className="footer__list">
              {SERVICE_LINKS.map(({ id, label, href }) => (
                <li key={id}>
                  <Link className="footer__link" to={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__title">Contacto</h2>
            <ul className="footer__list footer__contact">
              {CONTACT.map(({ id, icon: Icon, label, value, href }) => (
                <li className="footer__contact-item" key={id}>
                  <Icon
                    className="footer__contact-icon"
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {href ? (
                    <a
                      className="footer__link"
                      href={href}
                      aria-label={`${label}: ${value}`}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="footer__contact-value">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__title">Síguenos</h2>
            <ul className="footer__socials">
              {SOCIALS.map(({ id, name, url }) => (
                <li key={id}>
                  <a
                    className="footer__social"
                    href={url}
                    aria-label={name}
                    title={name}
                  >
                    <SocialIcon network={id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © 2026 {BRAND.name}. Todos los derechos reservados.
          </p>

          <ul className="footer__legal">
            <li>
              <Link className="footer__link" to="/terminos-y-condiciones">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link className="footer__link" to="/politica-de-privacidad">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
