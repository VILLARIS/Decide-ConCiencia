import { Mail, MapPin, Phone } from 'lucide-react'
import './Footer.css'

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'cursos', label: 'Cursos', href: '/cursos' },
  { id: 'servicios', label: 'Servicios', href: '/servicios' },
  { id: 'acceso', label: 'Acceso', href: '/acceso' },
]

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

export default function Footer({ logo }) {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            {logo ? (
              <a className="footer__logo" href="/" aria-label="Yulia, ir al inicio">
                <img className="footer__logo-img" src={logo} alt="Yulia" />
              </a>
            ) : null}

            <p className="footer__brand-text">
              Educación y acompañamiento en nutrición para tomar decisiones con
              conciencia.
            </p>
          </div>

          <nav className="footer__col" aria-label="Navegación del pie de página">
            <h2 className="footer__title">Navegación</h2>
            <ul className="footer__list">
              {NAV_LINKS.map(({ id, label, href }) => (
                <li key={id}>
                  <a className="footer__link" href={href}>
                    {label}
                  </a>
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
          <p className="footer__copy">© 2026 Yulia. Todos los derechos reservados.</p>

          <ul className="footer__legal">
            <li>
              <a className="footer__link" href="/terminos-y-condiciones">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a className="footer__link" href="/politica-de-privacidad">
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
