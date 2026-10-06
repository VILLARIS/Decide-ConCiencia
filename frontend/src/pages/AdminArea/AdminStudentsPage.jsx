import { useState } from 'react'
import { ClipboardList, UserCheck, UserRound, Users, UserX } from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminDrawer,
  AdminEmptyState,
  AdminFilters,
  AdminPageHeader,
  AdminPerson,
  AdminSection,
  AdminStat,
  AdminStatRow,
  AdminTable,
  AdminTableCell,
} from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  DEMO_ADMIN_STUDENTS,
  STUDENT_STATUS,
  formatAmount,
  getCourseTitle,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Estudiantes (Plan Profesional).

  Una tabla de personas y, al pulsar una, su ficha en un panel lateral. Antes el
  detalle se despletaba dentro de la propia fila: funcionaba, pero al leer una
  ficha tenias la lista entera deformada debajo, y comparar dos estudiantes
  era imposible sin cerrarla.

  El drawer deja la lista de fondo intacta, asi que se puede ir de una ficha a
  otra sin perder el sitio. Con backend, este mismo detalle puede pasar a ser
  una ruta propia sin cambiar los datos.
*/

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: STUDENT_STATUS.active, label: STUDENT_STATUS.active },
  { id: STUDENT_STATUS.inactive, label: STUDENT_STATUS.inactive },
]

const HEADERS = ['Nombre', 'Correo', 'Cursos', 'Alta', 'Estado']

function StudentDetail({ student }) {
  return (
    <>
      <p className="admin-drawer__text">
        Se registró el {student.registeredAt} · {student.purchases.length}{' '}
        {student.purchases.length === 1 ? 'curso' : 'cursos'}
      </p>

      <ul className="admin-purchases">
        {student.purchases.map((purchase) => (
          <li className="admin-purchase" key={purchase.id}>
            <div>
              <p className="admin-purchase__title">{getCourseTitle(purchase.courseId)}</p>
              <p className="admin-purchase__meta">
                {purchase.id} · {purchase.date}
              </p>
            </div>

            <span className="admin-table__num">
              {formatAmount(purchase.courseId, purchase.amount)}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

function StudentsView() {
  const [openId, setOpenId] = useState(null)
  const [filter, setFilter] = useState('all')

  const visibleStudents =
    filter === 'all'
      ? DEMO_ADMIN_STUDENTS
      : DEMO_ADMIN_STUDENTS.filter((student) => student.status === filter)

  const openStudent = DEMO_ADMIN_STUDENTS.find((student) => student.id === openId) ?? null

  /* Las cuatro cifras salen de contar la misma lista, no de un sitio aparte.
     El icono y el tono van aqui porque son eleccion de presentacion: cuentan
     las mismas personas que la tabla de abajo. */
  const stats = [
    { id: 'total', label: 'Estudiantes', value: DEMO_ADMIN_STUDENTS.length, icon: Users, tone: 'blue' },
    {
      id: 'active',
      label: 'Activos',
      value: DEMO_ADMIN_STUDENTS.filter((student) => student.status === STUDENT_STATUS.active)
        .length,
      icon: UserCheck,
      tone: 'green',
    },
    {
      id: 'inactive',
      label: 'Inactivos',
      value: DEMO_ADMIN_STUDENTS.filter((student) => student.status === STUDENT_STATUS.inactive)
        .length,
      icon: UserX,
      tone: 'sand',
    },
    {
      id: 'purchases',
      label: 'Inscripciones',
      value: DEMO_ADMIN_STUDENTS.reduce((total, student) => total + student.purchases.length, 0),
      icon: ClipboardList,
      tone: 'sage',
    },
  ]

  return (
    <AdminShell>
      <AdminPageHeader
        title="Estudiantes"
        subtitle="Visualiza el avance y la información de tus estudiantes: qué cursos toman y desde cuándo forman parte de la plataforma."
        eyebrow="Comunidad"
        icon={Users}
      />

      <AdminStatRow>
        {stats.map((stat) => (
          <AdminStat
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </AdminStatRow>

      <AdminSection
        flush
        title="Listado"
        action={
          <AdminFilters
            options={FILTERS}
            value={filter}
            onChange={setFilter}
            label="Filtrar estudiantes por estado"
          />
        }
      >
        {visibleStudents.length > 0 ? (
          <AdminTable headers={HEADERS}>
            {visibleStudents.map((student) => (
              <tr key={student.id}>
                <AdminTableCell label="Nombre">
                  <button
                    className="admin-personrow"
                    type="button"
                    onClick={() => setOpenId(student.id)}
                  >
                    <AdminPerson name={student.name} size="sm" />
                  </button>
                </AdminTableCell>

                <AdminTableCell label="Correo" className="admin-table__muted">
                  {student.email}
                </AdminTableCell>

                <AdminTableCell label="Cursos" className="admin-table__muted">
                  {student.purchases.length}
                </AdminTableCell>

                <AdminTableCell label="Alta" className="admin-table__muted">
                  {student.registeredAt}
                </AdminTableCell>

                <AdminTableCell label="Estado">
                  <AdminBadge status={student.status}>{student.status}</AdminBadge>
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        ) : (
          <AdminEmptyState
            icon={UserRound}
            title="Nadie con ese estado"
            description="No hay estudiantes que coincidan con el filtro elegido."
            action={
              <button className="admin-btn" type="button" onClick={() => setFilter('all')}>
                Ver todos
              </button>
            }
          />
        )}
      </AdminSection>

      {/* ---------- Ficha del estudiante ---------- */}
      <AdminDrawer
        open={Boolean(openStudent)}
        eyebrow="Estudiante"
        title={openStudent?.name ?? ''}
        subtitle={openStudent?.email}
        onClose={() => setOpenId(null)}
        width={480}
      >
        {openStudent ? (
          <>
            <div className="admin-drawer__section">
              <p className="admin-drawer__label">Estado</p>

              <AdminBadge status={openStudent.status}>{openStudent.status}</AdminBadge>
            </div>

            <div className="admin-drawer__section">
              <StudentDetail student={openStudent} />
            </div>
          </>
        ) : null}
      </AdminDrawer>
    </AdminShell>
  )
}

export default function AdminStudentsPage() {
  return (
    <RequireAdminSession>
      <StudentsView />
    </RequireAdminSession>
  )
}
