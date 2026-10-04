import { useState } from 'react'
import { Download, Eye, FileCheck2 } from 'lucide-react'
import logo from '../../assets/logo.jpeg'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminDrawer,
  AdminEmptyState,
  AdminPageHeader,
  AdminSection,
  AdminTable,
  AdminTableCell,
} from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  DEMO_ADMIN_CERTIFICATES,
  DEMO_PLATFORM,
  getCourseTitle,
  getStudentName,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Certificados (Plan Profesional).

  Solo el historial de certificados emitidos: quien lo recibio, de que curso y
  cuando. Verificar o reemitir un certificado no tiene sentido con datos
  ficticios, asi que las acciones son de lectura y de descarga simulada.

  La previsualizacion va en un panel lateral: es como se ve el certificado de
  verdad, y asi la tabla sigue debajo en lugar de desaparecer.
*/

const HEADERS = ['Estudiante', 'Curso', 'Emitido', 'Estado', '']

function CertificatePreview({ certificate }) {
  return (
    <article className="admin-certcard">
      <img className="admin-certcard__logo" src={logo} alt="" />

      <p className="admin-certcard__brand">{DEMO_PLATFORM.name}</p>
      <p className="admin-certcard__slogan">{DEMO_PLATFORM.slogan}</p>

      <p className="admin-certcard__body">
        Se certifica que
      </p>

      <p className="admin-certcard__name">{getStudentName(certificate.studentId)}</p>

      <p className="admin-certcard__body">
        ha completado satisfactoriamente el curso
      </p>

      <p className="admin-certcard__course">{getCourseTitle(certificate.courseId)}</p>

      <footer className="admin-certcard__foot">
        <span>{certificate.issuedAt}</span>
        <span className="admin-certcard__code">{certificate.id.toUpperCase()}</span>
      </footer>
    </article>
  )
}

function CertificatesView() {
  const [downloadedIds, setDownloadedIds] = useState([])
  const [openId, setOpenId] = useState(null)

  /* Sin backend no hay PDF que bajar. Dejar constancia de la accion es mas
     honesto que un enlace que no lleva a ningun sitio. */
  const handleDownload = (certificateId) => {
    setDownloadedIds((prev) => (prev.includes(certificateId) ? prev : [...prev, certificateId]))
  }

  const openCertificate =
    DEMO_ADMIN_CERTIFICATES.find((certificate) => certificate.id === openId) ?? null

  return (
    <AdminShell>
      <AdminPageHeader
        title="Certificados"
        subtitle="Certificados emitidos a estudiantes de la plataforma."
      />

      <AdminSection
        flush
        title="Emitidos"
        subtitle={`${DEMO_ADMIN_CERTIFICATES.length} ${
          DEMO_ADMIN_CERTIFICATES.length === 1 ? 'certificado' : 'certificados'
        }`}
      >
        {DEMO_ADMIN_CERTIFICATES.length > 0 ? (
          <AdminTable headers={HEADERS}>
            {DEMO_ADMIN_CERTIFICATES.map((certificate) => (
              <tr key={certificate.id}>
                <AdminTableCell label="Estudiante" className="admin-table__strong">
                  {getStudentName(certificate.studentId)}
                </AdminTableCell>

                <AdminTableCell label="Curso" className="admin-table__muted">
                  {getCourseTitle(certificate.courseId)}
                </AdminTableCell>

                <AdminTableCell label="Emitido" className="admin-table__muted">
                  {certificate.issuedAt}
                </AdminTableCell>

                <AdminTableCell label="Estado">
                  <AdminBadge status={certificate.status}>{certificate.status}</AdminBadge>
                </AdminTableCell>

                <AdminTableCell label="Acciones" align="right">
                  <div className="admin-table__actions">
                    <button
                      className="admin-iconbtn"
                      type="button"
                      onClick={() => setOpenId(certificate.id)}
                      aria-label={`Previsualizar el certificado de ${getStudentName(
                        certificate.studentId,
                      )}`}
                      title="Previsualizar"
                    >
                      <Eye size={15} strokeWidth={2} aria-hidden="true" />
                    </button>

                    <button
                      className="admin-btn admin-btn--sm"
                      type="button"
                      onClick={() => handleDownload(certificate.id)}
                    >
                      <Download size={13} strokeWidth={2} aria-hidden="true" />
                      {downloadedIds.includes(certificate.id) ? 'Descargado' : 'Descargar'}
                    </button>
                  </div>
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <AdminEmptyState
            icon={FileCheck2}
            title="Todavía no se han emitido certificados"
            description="Aparecerán aquí cuando un curso con certificado termine."
          />
        )}
      </AdminSection>

      <p className="admin-note">
        La descarga de certificados es simulada en la demostración: no hay archivos PDF
        generados.
      </p>

      {/* ---------- Previsualizacion ---------- */}
      <AdminDrawer
        open={Boolean(openCertificate)}
        eyebrow="Vista previa"
        title={openCertificate ? getStudentName(openCertificate.studentId) : ''}
        subtitle={openCertificate ? getCourseTitle(openCertificate.courseId) : undefined}
        onClose={() => setOpenId(null)}
        width={520}
        footer={
          openCertificate ? (
            <button
              className="admin-btn admin-btn--primary"
              type="button"
              onClick={() => handleDownload(openCertificate.id)}
            >
              <Download size={15} strokeWidth={2} aria-hidden="true" />
              {downloadedIds.includes(openCertificate.id) ? 'Descargado' : 'Descargar'}
            </button>
          ) : null
        }
      >
        {openCertificate ? <CertificatePreview certificate={openCertificate} /> : null}
      </AdminDrawer>
    </AdminShell>
  )
}

export default function AdminCertificatesPage() {
  return (
    <RequireAdminSession>
      <CertificatesView />
    </RequireAdminSession>
  )
}
