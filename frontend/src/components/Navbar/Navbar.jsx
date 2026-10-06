import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, LogOut, Menu, X } from 'lucide-react'
import logo from '../../assets/Navbar/Logo.png'
import { useDemoAuth } from '../../demo/demoAuthStore'
import './Navbar.css'

/*
  NAVEGACION PUBLICA DE YUMIBIOTIC

  - Logo de marca a la izquierda, enlaces al centro y "Comenzar" a la derecha.
  - "Comenzar" es la UNICA entrada al acceso: no hay "Acceso", "Ingresar" ni
    "Registrarse" sueltos en la barra.
  - Con sesion activa, "Comenzar" desaparece y aparece la cuenta del usuario.

  RUTAS
  -----
  Inicio ........  /
  Quienes somos .  /quienes-somos
  Servicios .....  /servicios
  Cursos ........  /cursos
  Contacto ......  /contacto
  Comenzar ......  /acceso

  Todos los enlaces usan NavLink/Link de react-router: un <a href> haria que el
  navegador recargara la app entera y, como la sesion demo vive en memoria,
  quien esta conectada apareceria desconectada. Ver el mismo aviso en Footer.jsx.
*/
const DEFAULT_LINKS = [
  { id: 'inicio', label: 'Inicio', to: '/', end: true },
  { id: 'quienes-somos', label: 'Quiénes somos', to: '/quienes-somos' },
  { id: 'servicios', label: 'Servicios', to: '/servicios' },
  { id: 'cursos', label: 'Cursos', to: '/cursos' },
  { id: 'contacto', label: 'Contacto', to: '/contacto' },
]

const DEFAULT_CTA = { label: 'Comenzar', to: '/acceso' }

/*
  Accesos de la cuenta, segun el rol con el que entro. Quien administra ve su
  panel; quien estudia, su area. No se mezclan: un enlace al area equivocada
  manda a la otra persona a un sitio que no puede usar.
*/
function getAccountLinks({ isAdmin }) {
  if (isAdmin) {
    return [{ id: 'admin', label: 'Panel de administración', to: '/admin' }]
  }

  return [
    { id: 'aprendizaje', label: 'Mi aprendizaje', to: '/mi-aprendizaje' },
    { id: 'perfil', label: 'Mi perfil', to: '/mi-perfil' },
    { id: 'certificados', label: 'Mis certificados', to: '/mis-certificados' },
  ]
}

export default function Navbar({ links = DEFAULT_LINKS, cta = DEFAULT_CTA }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const { user, isAuthenticated, isAdmin, logoutDemo } = useDemoAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const accountLinks = getAccountLinks({ isAdmin })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /*
    Los menus se cierran solos al cambiar de ruta: con un enlace del panel, con
    el logo o con el boton de atras del navegador. Sin esto, abrir el menu en una
    pagina y pulsar atras lo dejaria pegado abierto.

    Se ajusta durante el render y no en un efecto a proposito: un efecto que
    llama a setState sincrono provoca un segundo render en cascada (regla
    react-hooks/set-state-in-effect). Este es el patron que recomienda React
    para reiniciar estado cuando cambia una entrada.
  */
  const [lastPathname, setLastPathname] = useState(location.pathname)
  if (lastPathname !== location.pathname) {
    setLastPathname(location.pathname)
    setIsMenuOpen(false)
    setIsAccountOpen(false)
  }

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

  /* El menu de cuenta se cierra con Escape o al hacer clic fuera. */
  useEffect(() => {
    if (!isAccountOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsAccountOpen(false)
    }

    const handlePointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isAccountOpen])

  const closeMenu = () => setIsMenuOpen(false)

  /* Demo: al cerrar sesion solo se limpia el estado en memoria. El guard de cada
     area (/mi-aprendizaje, /admin) devuelve a /acceso si sigue abierta. */
  const handleLogout = () => {
    setIsAccountOpen(false)
    setIsMenuOpen(false)
    logoutDemo()
    navigate('/acceso', { replace: true })
  }

  return (
    <nav
      className={`navbar${isScrolled ? ' navbar--scrolled' : ''}`}
      aria-label="Navegación principal"
    >
      <div className="navbar__inner">
        {/* Logo de marca. El archivo tiene mucho margen blanco alrededor del
            dibujo: el marco lo recorta para que se vea grande sin deformarlo. */}
        <NavLink className="navbar-logo" to="/" aria-label="Yumibiotic, ir al inicio">
          <span className="navbar-logo__frame">
            <img
              className="navbar-logo__img"
              src={logo}
              alt="Yumibiotic"
              width={1536}
              height={1024}
            />
          </span>
        </NavLink>

        {/* Enlaces al centro. */}
        <ul className="navbar__links">
          {links.map((link) => (
            <li className="navbar__item" key={link.id}>
              <NavLink
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' navbar__link--active' : ''}`
                }
                to={link.to}
                end={link.end}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Derecha: "Comenzar" sin sesion, cuenta con sesion. Nunca las dos. */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__account" ref={accountRef}>
              <button
                className="navbar__account-trigger"
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
                aria-label={`Cuenta de ${user.firstName}`}
              >
                <span className="navbar__account-avatar" aria-hidden="true">
                  {user.firstName.charAt(0)}
                </span>
                <span className="navbar__account-name">{user.firstName}</span>
                <ChevronDown
                  className={`navbar__account-chevron${
                    isAccountOpen ? ' navbar__account-chevron--open' : ''
                  }`}
                  size={15}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </button>

              <div
                className={`navbar__account-menu${
                  isAccountOpen ? ' navbar__account-menu--open' : ''
                }`}
                role="menu"
              >
                {accountLinks.map((link) => (
                  <NavLink
                    className="navbar__account-item"
                    role="menuitem"
                    key={link.id}
                    to={link.to}
                    onClick={() => setIsAccountOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                <span className="navbar__account-separator" role="separator" />

                <button
                  className="navbar__account-item navbar__account-item--danger"
                  role="menuitem"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
                  Salir
                </button>
              </div>
            </div>
          ) : (
            <NavLink className="navbar__cta" to={cta.to}>
              <span>{cta.label}</span>
              <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
            </NavLink>
          )}
        </div>

        <button
          className="navbar__toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          aria-controls="yumibiotic-navbar-mobile-menu"
        >
          {isMenuOpen ? (
            <X size={22} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Menu desplegable de movil. */}
      <div
        id="yumibiotic-navbar-mobile-menu"
        className={`navbar__panel${isMenuOpen ? ' navbar__panel--open' : ''}`}
      >
        <ul className="navbar__panel-list">
          {links.map((link) => (
            <li key={link.id}>
              <NavLink
                className={({ isActive }) =>
                  `navbar__panel-link${isActive ? ' navbar__panel-link--active' : ''}`
                }
                to={link.to}
                end={link.end}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sin sesion, "Comenzar". Con sesion, sus accesos y Salir. */}
        {isAuthenticated ? (
          <div className="navbar__panel-account">
            <p className="navbar__panel-user">
              Sesión de <strong>{user.firstName}</strong>
            </p>

            {accountLinks.map((link) => (
              <NavLink
                className="navbar__panel-link navbar__panel-link--account"
                key={link.id}
                to={link.to}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}

            <button className="navbar__panel-logout" type="button" onClick={handleLogout}>
              <LogOut size={15} strokeWidth={1.9} aria-hidden="true" />
              Salir
            </button>
          </div>
        ) : (
          <NavLink className="navbar__panel-cta" to={cta.to} onClick={closeMenu}>
            <span>{cta.label}</span>
            <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
          </NavLink>
        )}
      </div>
    </nav>
  )
}