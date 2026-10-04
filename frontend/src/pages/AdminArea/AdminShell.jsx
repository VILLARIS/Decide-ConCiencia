import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  BookOpen,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'
import logo from '../../assets/logo.jpeg'
import { useDemoAuth } from '../../demo/demoAuthStore'
import './AdminShell.css'

/*
  Layout del area administrativa.

  NO reutiliza el navbar ni el footer publicos a proposito: dentro del panel
  no tiene sentido la navegacion comercial, y asi la doctora no sale de su
  area al moverse entre secciones.

  Estructura: barra lateral fija en escritorio (240-260px), colapsable en
  tablet y cajon (drawer) en movil. Sin pie: el panel es una aplicacion
  interna, no una pagina de marketing.
*/

const NAV_ITEMS = [
  { to: '/admin', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/admin/cursos', label: 'Cursos', icon: BookOpen, end: false },
  { to: '/admin/estudiantes', label: 'Estudiantes', icon: Users, end: false },
  { to: '/admin/ventas', label: 'Ventas', icon: ClipboardList, end: false },
  { to: '/admin/evaluaciones', label: 'Evaluaciones', icon: FileCheck2, end: false },
  { to: '/admin/certificados', label: 'Certificados', icon: FileCheck2, end: false },
]

function AdminNavItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      className={({ isActive }) => `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`}
      to={to}
      end={end}
      onClick={onNavigate}
    >
      <Icon className="admin-nav__icon" size={18} strokeWidth={1.9} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

export default function AdminShell({ children }) {
  const { user, logoutDemo } = useDemoAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  /*
    El cajon se cierra al pulsar un enlace, no al cambiar de ruta: en movil, si
    se quedara abierto, taparia la pantalla nueva. Los enlaces de la barra
    lateral pasan closeDrawer en onClick, asi que no hace falta vigilar la
    ruta con un efecto.
  */
  const closeDrawer = () => setDrawerOpen(false)

  const handleLogout = () => {
    closeDrawer()
    logoutDemo()
  }

  return (
    <div className={`admin${drawerOpen ? ' admin--drawer-open' : ''}`}>
      {/* Capa oscura: solo en movil, cierra el cajon al tocar fuera. */}
      {drawerOpen ? (
        <button
          className="admin__scrim"
          type="button"
          aria-label="Cerrar menú de administración"
          onClick={closeDrawer}
        />
      ) : null}

      <aside className="admin-sidebar" aria-label="Administración">
        <div className="admin-sidebar__head">
          <Link className="admin-sidebar__brand" to="/admin" onClick={closeDrawer}>
            <img className="admin-sidebar__logo" src={logo} alt="Yulia" />
            <span className="admin-sidebar__brand-text">Yulia</span>
          </Link>

          {/* Solo en movil: el cajon se cierra con el mismo boton que lo abre. */}
          <button
            className="admin-sidebar__close"
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar menú"
          >
            <X size={19} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Secciones">
          <p className="admin-nav__label">Panel</p>

          {NAV_ITEMS.map((item) => (
            <AdminNavItem key={item.to} {...item} onNavigate={closeDrawer} />
          ))}

          <p className="admin-nav__label">Cuenta</p>

          <span className="admin-nav__separator" role="separator" />

          <AdminNavItem
            to="/admin/configuracion"
            label="Configuración"
            icon={Settings}
            end={false}
            onNavigate={closeDrawer}
          />
        </nav>

        {/* Identidad y salida: abajo del todo, como en cualquier herramienta. */}
        <div className="admin-sidebar__foot">
          <div className="admin-identity">
            <span className="admin-identity__avatar" aria-hidden="true">
              Y
            </span>

            <span className="admin-identity__copy">
              <span className="admin-identity__name">Dra. Yulia</span>
              <span className="admin-identity__role">Administradora</span>
            </span>
          </div>

          <button className="admin-logout" type="button" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={2} aria-hidden="true" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="admin__body">
        {/* Barra superior: solo existe en tablet y movil, donde la barra
            lateral se oculta. En escritorio no hace falta repetir el titulo. */}
        <header className="admin-topbar">
          <button
            className="admin-topbar__toggle"
            type="button"
            onClick={() => setDrawerOpen((open) => !open)}
            aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={drawerOpen}
          >
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          </button>

          <span className="admin-topbar__brand">
            <img className="admin-topbar__logo" src={logo} alt="" />
            <span>Yulia · Administración</span>
          </span>

          <span className="admin-topbar__user" title={user?.email}>
            {user?.firstName ?? 'Yulia'}
          </span>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}