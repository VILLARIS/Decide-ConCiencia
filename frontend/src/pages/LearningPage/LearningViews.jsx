import {
  ArrowRight,
  Award,
  CalendarDays,
  Download,
  Eye,
  Fingerprint,
  FlaskConical,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StudentShell from './StudentShell'
import { RequireDemoSession } from '../../demo/DemoAuthContext'
import { useDemoAuth } from '../../demo/demoAuthStore'
import { DEMO_CERTIFICATES, DEMO_MILESTONE, DEMO_PROFILE } from '../../demo/demoData'
import './LearningPage.css'

/*
  Mi Perfil y Mis Certificados — MODO DEMO.

  Sin backend: "Editar perfil", "Cambiar contraseña", "Ver certificado" y
  "Descargar" están deshabilitados y lo dicen. No se inventa funcionalidad.
*/

/* =========================================================
   MI PERFIL
   ========================================================= */

function ProfileView() {
  const { user } = useDemoAuth()
  const firstName = user?.firstName ?? DEMO_PROFILE.firstName
  const lastName = user?.lastName ?? DEMO_PROFILE.lastName
  const email = user?.email ?? DEMO_PROFILE.email
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  const fields = [
    { id: 'nombre', icon: UserRound, label: 'Nombre', value: firstName },
    { id: 'apellidos', icon: UserRound, label: 'Apellidos', value: lastName },
    { id: 'correo', icon: Mail, label: 'Correo', value: email },
    { id: 'registro', icon: CalendarDays, label: 'Registro', value: DEMO_PROFILE.joinedAt },
  ]

  return (
    <StudentShell>
      <header className="page-head" aria-labelledby="profile-title">
        <div className="page-head__inner">
          <div className="page-head__text">
            <p className="page-head__eyebrow">
              <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
              Área de estudiante
            </p>

            <h1 className="page-head__title" id="profile-title">
              Mi <span className="page-head__title-accent">perfil</span>
            </h1>

            <p className="page-head__lead">
              Tus datos dentro de la plataforma. En la demostración son ficticios y viven
              solo en el navegador.
            </p>
          </div>

          <span className="page-head__motif" aria-hidden="true">
            <Fingerprint />
          </span>
        </div>
      </header>

      <div className="profile">
        {/* Tarjeta de identidad */}
        <section className="identity" aria-labelledby="identity-title">
          <span className="identity__avatar" aria-hidden="true">
            {initials}
          </span>

          <div className="identity__text">
            <h2 className="identity__name" id="identity-title">
              {firstName} {lastName}
            </h2>

            <p className="identity__mail">{email}</p>

            <div className="identity__tags">
              <span className="tag tag--blue">{DEMO_PROFILE.roleLabel}</span>
              <span className="tag tag--green">Sesión demo</span>
            </div>
          </div>

          <button
            className="btn btn--ghost identity__action"
            type="button"
            disabled
            title="Requiere backend de cuentas"
          >
            <UserRound size={16} strokeWidth={2} aria-hidden="true" />
            Editar perfil
            <span className="btn__hint">(demo)</span>
          </button>
        </section>

        <div className="profile__grid">
          <div className="profile__main">
            {/* Datos personales */}
            <section className="panel panel--soft" aria-labelledby="profile-data-title">
              <div className="panel__head">
                <h2 className="panel__title" id="profile-data-title">
                  Datos personales
                </h2>
                <span className="panel__badge panel__badge--quiet">Ficticio</span>
              </div>

              <dl className="data-grid">
                {fields.map(({ id, icon: Icon, label, value }) => (
                  <div className="data-grid__item" key={id}>
                    <dt className="data-grid__label">
                      <Icon size={14} strokeWidth={2} aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="data-grid__value">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="data-grid__item data-grid__item--wide">
                <dt className="data-grid__label">
                  <Info size={14} strokeWidth={2} aria-hidden="true" />
                  Biografía
                </dt>
                <dd className="data-grid__value">{DEMO_PROFILE.bio}</dd>
              </div>
            </section>

            {/* Seguridad */}
            <section className="panel panel--soft" aria-labelledby="profile-security-title">
              <div className="panel__head">
                <h2 className="panel__title" id="profile-security-title">
                  Seguridad
                </h2>
              </div>

              <div className="security">
                <span className="security__icon" aria-hidden="true">
                  <Lock size={19} strokeWidth={1.9} />
                </span>

                <div className="security__text">
                  <p className="security__title">Contraseña</p>
                  <p className="security__note">
                    La credencial de la demo es ficticia, se compara en el navegador y no
                    protege ningún dato real.
                  </p>
                </div>

                <button
                  className="btn btn--ghost"
                  type="button"
                  disabled
                  title="Requiere backend de cuentas"
                >
                  Cambiar contraseña
                  <span className="btn__hint">(demo)</span>
                </button>
              </div>
            </section>
          </div>

          {/* Nota de demostración, integrada como tarjeta propia */}
          <aside className="summary" aria-label="Sobre esta demostración">
            <section className="panel panel--notice">
              <span className="panel__notice-icon" aria-hidden="true">
                <ShieldCheck size={20} strokeWidth={1.9} />
              </span>

              <h2 className="panel__title">Sobre esta cuenta</h2>

              <ul className="notice-list">
                <li>Los datos son de ejemplo, no pertenecen a una persona real.</li>
                <li>No hay servidor: todo ocurre en tu navegador.</li>
                <li>Al recargar la página, la sesión se pierde.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </StudentShell>
  )
}

/* =========================================================
   MIS CERTIFICADOS
   ========================================================= */

function CertificatesView() {
  return (
    <StudentShell>
      <header className="page-head" aria-labelledby="cert-title">
        <div className="page-head__inner">
          <div className="page-head__text">
            <p className="page-head__eyebrow">
              <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" />
              Área de estudiante
            </p>

            <h1 className="page-head__title" id="cert-title">
              Mis <span className="page-head__title-accent">certificados</span>
            </h1>

            <p className="page-head__lead">
              El trabajo que completaste, el reconocimiento que te llevas. En la
              demostración el certificado es una maqueta: no hay PDF ni descarga real.
            </p>
          </div>

          <span className="page-head__motif" aria-hidden="true">
            <Award />
          </span>
        </div>
      </header>

      <div className="certificates">
        <div className="certificates__main">
          {DEMO_CERTIFICATES.map((item) => (
            <article className="certificate" key={item.id}>
              {/* Vista previa del certificado */}
              <div className="certificate__preview">
                <span className="certificate__frame" aria-hidden="true" />

                <span className="certificate__seal" aria-hidden="true">
                  <Award size={26} strokeWidth={1.7} />
                </span>

                <p className="certificate__kicker">Certificado de finalización</p>

                <h2 className="certificate__title">{item.title}</h2>

                <p className="certificate__byline">
                  Impartido por {item.issuedBy}
                </p>

                <dl className="certificate__facts">
                  <div>
                    <dt>Fecha</dt>
                    <dd>{item.issuedAt}</dd>
                  </div>
                  <div>
                    <dt>Horas</dt>
                    <dd>{item.hours} h</dd>
                  </div>
                  <div>
                    <dt>Módulos</dt>
                    <dd>{item.modules}</dd>
                  </div>
                </dl>

                <span className="certificate__watermark" aria-hidden="true">
                  Yulia
                </span>
              </div>

              {/* Pie del certificado: estado y acciones */}
              <div className="certificate__foot">
                <div className="certificate__status">
                  <span className="tag tag--green">Completado</span>
<p className="certificate__status-note">
                    Documento de demostración. La fecha, las horas y la firma son ficticias.
                  </p>
                </div>

                <div className="certificate__actions">
                  <button
                    className="btn btn--primary"
                    type="button"
                    disabled
                    title="La vista previa ya se muestra arriba; en la demo no hay PDF"
                  >
                    <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    Ver certificado
                    <span className="btn__hint">(demo)</span>
                  </button>

                  <button
                    className="btn btn--ghost"
                    type="button"
                    disabled
                    title="No se generan archivos PDF en la demostración"
                  >
                    <Download size={16} strokeWidth={2} aria-hidden="true" />
                    Descargar
                    <span className="btn__hint">(demo)</span>
                  </button>
                </div>
              </div>
            </article>
          ))}

          <p className="learning__demo-note">
            Demostración: no se generan archivos PDF ni se validan certificados.
          </p>
        </div>

        <aside className="summary" aria-label="Resumen de certificados">
          <section className="panel panel--progress">
            <div className="panel__head">
              <h2 className="panel__title">Avance hacia tu certificado</h2>
            </div>

            <p className="milestone">
              <strong>
                {DEMO_MILESTONE.coursesCompleted} de {DEMO_MILESTONE.coursesTotal}
              </strong>
              <span>cursos completados</span>
            </p>

            <div className="progress-track progress-track--thin">
              <span
                className="progress-track__fill"
                style={{
                  width: `${(DEMO_MILESTONE.coursesCompleted / DEMO_MILESTONE.coursesTotal) * 100}%`,
                }}
              />
            </div>

            <p className="summary__goal">
              <FlaskConical size={15} strokeWidth={2} aria-hidden="true" />
              <span>
                Te faltan <strong>{DEMO_MILESTONE.pendingCourses} cursos</strong> por
                terminar.
              </span>
            </p>

            <Link className="summary__link" to="/mi-aprendizaje">
              Seguir aprendiendo
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </section>

          <section className="panel panel--notice">
            <span className="panel__notice-icon" aria-hidden="true">
              <Info size={19} strokeWidth={1.9} />
            </span>

            <h2 className="panel__title">Sobre esta demo</h2>

            <p className="panel__text">
              El certificado se muestra como maqueta visual. Cuando exista el backend, aquí
              se descargará el PDF firmado.
            </p>
          </section>
        </aside>
      </div>
    </StudentShell>
  )
}

/* ---------- Guardas de ruta (solo UX, no seguridad) ---------- */

function ProfilePage() {
  return (
    <RequireDemoSession>
      <ProfileView />
    </RequireDemoSession>
  )
}

function CertificatesPage() {
  return (
    <RequireDemoSession>
      <CertificatesView />
    </RequireDemoSession>
  )
}

export { ProfilePage, CertificatesPage }