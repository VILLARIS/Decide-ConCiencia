import { useState } from 'react'
import { Check, LogOut, Settings } from 'lucide-react'
import AdminShell from './AdminShell'
import { AdminPageHeader, AdminSection } from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import { useDemoAuth } from '../../demo/demoAuthStore'
import { ADMIN_PLAN, DEMO_PLATFORM } from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Configuracion (Plan Profesional).

  Tres bloques, de menos a mas profundo: perfil (quien esta dentro), marca (lo
  que ve el estudiante) y cuenta (salir). Sin pasarela, dominios, roles, backups
  ni automatizaciones: la configuracion avanzada llega con el backend.

  El perfil y la sesion son de solo lectura porque vienen del proveedor de
  autenticacion: en esta demo no hay donde guardarlos.
*/

function SettingsView() {
  const { user, logoutDemo } = useDemoAuth()
  const [form, setForm] = useState({
    name: DEMO_PLATFORM.name,
    slogan: DEMO_PLATFORM.slogan,
    email: DEMO_PLATFORM.email,
  })
  const [feedback, setFeedback] = useState('')

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setFeedback('El nombre de la plataforma no puede quedar vacío.')
      return
    }

    setFeedback('Cambios guardados en la demostración. No se guardan de forma permanente.')
  }

  const hasError = feedback.startsWith('El nombre')

  return (
    <AdminShell>
      <AdminPageHeader
        title="Configuración"
        subtitle="Administra tu cuenta y las preferencias de tu plataforma."
        eyebrow="Ajustes"
        icon={Settings}
      />

      <div className="admin-settings">
        <div className="admin-settings__main">
          {/* ---------- Perfil ---------- */}
          <AdminSection
            title="Perfil"
            subtitle="La cuenta con la que entras al panel."
          >
            <dl className="admin-deflist">
              <div className="admin-deflist__row">
                <dt className="admin-deflist__term">Nombre</dt>
                <dd className="admin-deflist__desc">
                  {user?.firstName ?? 'Yulia'}
                  {user?.lastName ? ` ${user.lastName}` : ''}
                </dd>
              </div>

              <div className="admin-deflist__row">
                <dt className="admin-deflist__term">Correo</dt>
                <dd className="admin-deflist__desc">{user?.email ?? DEMO_PLATFORM.email}</dd>
              </div>

              <div className="admin-deflist__row">
                <dt className="admin-deflist__term">Rol</dt>
                <dd className="admin-deflist__desc">Administradora</dd>
              </div>
            </dl>
          </AdminSection>

          {/* ---------- Marca ---------- */}
          <AdminSection
            title="Marca"
            subtitle="Nombre, lema y contacto que ve el estudiante."
          >
            <form className="admin-form" onSubmit={handleSubmit}>
              <label className="admin-field">
                <span className="admin-field__label">Nombre</span>
                <input
                  className="admin-input"
                  type="text"
                  value={form.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Lema</span>
                <input
                  className="admin-input"
                  type="text"
                  value={form.slogan}
                  onChange={(event) => setField('slogan', event.target.value)}
                />
              </label>

              <label className="admin-field">
                <span className="admin-field__label">Correo de contacto</span>
                <input
                  className="admin-input"
                  type="email"
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                />
              </label>

              {feedback ? (
                <p className={`admin-alert ${hasError ? 'admin-alert--error' : 'admin-alert--ok'}`}>
                  {feedback}
                </p>
              ) : null}

              <div className="admin-editor__actions">
                <button className="admin-btn admin-btn--primary" type="submit">
                  <Check size={16} strokeWidth={2.2} aria-hidden="true" />
                  Guardar cambios
                </button>
              </div>
            </form>
          </AdminSection>

          {/* ---------- Cuenta ---------- */}
          <AdminSection title="Cuenta" subtitle="Sesión de esta demostración.">
            <p className="admin-note admin-note--flush">
              La demostración no tiene contraseñas propias: se entra con las cuentas de
              prueba y los cambios se pierden al recargar.
            </p>

            <div className="admin-editor__actions">
              <button className="admin-btn admin-btn--danger" type="button" onClick={logoutDemo}>
                <LogOut size={15} strokeWidth={2} aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          </AdminSection>
        </div>

        <aside className="admin-settings__side">
          {/* El plan se muestra como informacion, no se cambia desde aqui. */}
          <AdminSection title="Plan">
            <p className="admin-plan__name">{ADMIN_PLAN.name}</p>
            <p className="admin-plan__desc">{ADMIN_PLAN.description}</p>

            <ul className="admin-plan__list">
              <li>Gestión de cursos y contenido</li>
              <li>Estudiantes y ventas básicas</li>
              <li>Evaluaciones y certificados</li>
            </ul>

            <p className="admin-note">
              El cambio de plan y las funciones avanzadas no están disponibles en esta
              demostración.
            </p>
          </AdminSection>
        </aside>
      </div>
    </AdminShell>
  )
}

export default function AdminSettingsPage() {
  return (
    <RequireAdminSession>
      <SettingsView />
    </RequireAdminSession>
  )
}
