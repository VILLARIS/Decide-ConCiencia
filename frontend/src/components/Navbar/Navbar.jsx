import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import './Navbar.css'

const DEFAULT_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/cursos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Acceso', href: '/acceso' },
]

const DEFAULT_CTA = { label: 'Explorar cursos', href: '/cursos' }

export default function Navbar({
  links = DEFAULT_LINKS,
  cta = DEFAULT_CTA,
  activePath = '/',
  logo = '/assets/logo.jpeg',
  brand = 'Yulia',
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (href) => activePath === href
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav
      className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`}
      aria-label="Navegación principal"
    >
      <div className="navbar__inner">
        <a className="navbar-logo" href="/" aria-label="Yulia, ir al inicio">
          {/* LOGO: reemplaza este bloque por <img src={logo} alt="Yulia" className="navbar-logo__img" /> cuando tengas el logo definitivo. */}
          {logo ? (
            <img className="navbar-logo__img" src={logo} alt={brand} />
          ) : (
            <span className="navbar-logo__text">{brand}</span>
          )}
        </a>

        <div className="navbar__actions">
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.href} className="navbar__item">
                <a
                  className={`navbar__link${
                    isActive(link.href) ? ' navbar__link--active' : ''
                  }`}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a className="navbar__cta" href={cta.href}>
            <span>{cta.label}</span>
            <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </div>

        <button
          className="navbar__toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="yulia-navbar-mobile-menu"
        >
          {isMenuOpen ? (
            <X size={22} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="yulia-navbar-mobile-menu"
        className={`navbar__panel${isMenuOpen ? ' navbar__panel--open' : ''}`}
      >
        <ul className="navbar__panel-list">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className={`navbar__panel-link${
                  isActive(link.href) ? ' navbar__panel-link--active' : ''
                }`}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="navbar__panel-cta" href={cta.href} onClick={closeMenu}>
          <span>{cta.label}</span>
          <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
        </a>
      </div>
    </nav>
  )
}
