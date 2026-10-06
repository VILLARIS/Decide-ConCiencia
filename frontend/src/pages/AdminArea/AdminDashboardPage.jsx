import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminPerson,
  AdminQuickAction,
  AdminSection,
  AdminStat,
  AdminStatRow,
  AdminTable,
  AdminTableCell,
} from './AdminParts'
import { AdminCourseRow } from './AdminCourseRow'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  DEMO_ADMIN_COURSES,
  DEMO_ADMIN_SALES,
  DEMO_ADMIN_STATS,
  DEMO_ADMIN_STUDENTS,
  formatAmount,
  getCoursePrice,
  getCourseTitle,
  getStudentName,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Dashboard de la doctora (Plan Profesional).

  Cuatro cifras, dos columnas (ventas y accesos), y debajo las listas de
  cursos y de estudiantes. El orden va de lo que cambia solo (la actividad) a lo
  que se sostiene en el tiempo (el catalogo).

  No hay graficas, tendencias ni porcentajes: el panel informa, no analiza, y un
  porcentaje derivado de datos ficticios no informa de nada. Eso es del Plan
  Integral (ver ADMIN_PLAN en demoAdminData).

  Todas las cifras vienen de demoAdminData; este archivo no repite numeros.
*/

const RECENT_SALES = DEMO_ADMIN_SALES.slice(0, 5)
const RECENT_COURSES = DEMO_ADMIN_COURSES.slice(0, 3)
const RECENT_STUDENTS = DEMO_ADMIN_STUDENTS.slice(0, 4)

/*
  Cada KPI lleva su icono y su tono pastel. El mapeo va aqui y no en
  demoAdminData porque es una decision de como se ve la cifra, no de que mide:
  los datos siguen siendo los mismos y ninguna otra pantalla cambia.
*/
const STAT_ICONS = {
  'sales-month': { icon: BadgeDollarSign, tone: 'green' },
  'sales-total': { icon: TrendingUp, tone: 'blue' },
  students: { icon: Users, tone: 'sand' },
  courses: { icon: BookOpen, tone: 'sage' },
}

/* El importe se toma del curso: el historico guarda lo que se cobro. */
function saleAmount(sale) {
  return getCoursePrice(sale.courseId)
}

function DashboardView() {
  return (
    <AdminShell>
      {/*
        Sin boton aqui a proposito: "Crear curso" vive en la columna de accesos
        rapidos. Repetirlo en el encabezado y en el contenido obligaba a elegir
        cual de los dos era el bueno.
      */}
      <div className="admin-hero">
        <div className="admin-hero__copy">
          <p className="admin-hero__eyebrow">
            <GraduationCap size={15} strokeWidth={1.9} aria-hidden="true" />
            Panel de la doctora
          </p>

          <h1 className="admin-hero__title">Buenos días, Dra. Yulia</h1>

          <p className="admin-hero__sub">
            Aquí tienes todo lo que pasa en tu plataforma: las ventas del mes, tus
            cursos y las personas que están aprendiendo contigo.
          </p>
        </div>

        <p className="admin-hero__motto">Aprender también se entrena.</p>

        {/* Formas suaves de fondo: dan profundidad sin robar atención al dato. */}
        <span className="admin-hero__shape admin-hero__shape--one" aria-hidden="true" />
        <span className="admin-hero__shape admin-hero__shape--two" aria-hidden="true" />
      </div>

      <AdminStatRow>
        {DEMO_ADMIN_STATS.map((stat) => {
          const { icon: StatIcon, tone } = STAT_ICONS[stat.id] ?? {}

          return (
            <AdminStat
              key={stat.id}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
              icon={StatIcon}
              tone={tone}
            />
          )
        })}
      </AdminStatRow>

      <div className="admin-dash">
        {/* ---------- Ventas y accesos ---------- */}
        <div className="admin-dash__cols">
          <AdminSection
            title="Últimas ventas"
            subtitle="Los movimientos más recientes de la plataforma."
            flush
            action={
              <Link className="admin-link" to="/admin/ventas">
                Ver todas
                <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            }
          >
            <AdminTable headers={['Estudiante', 'Curso', 'Monto', 'Fecha', 'Estado']}>
              {RECENT_SALES.map((sale) => (
                <tr key={sale.id}>
                  <AdminTableCell label="Estudiante">
                    <AdminPerson name={getStudentName(sale.studentId)} size="sm" />
                  </AdminTableCell>

                  <AdminTableCell label="Curso" className="admin-table__muted">
                    {getCourseTitle(sale.courseId)}
                  </AdminTableCell>

                  <AdminTableCell label="Monto" className="admin-table__num">
                    {formatAmount(sale.courseId, saleAmount(sale))}
                  </AdminTableCell>

                  <AdminTableCell label="Fecha" className="admin-table__muted">
                    {sale.date}
                  </AdminTableCell>

                  <AdminTableCell label="Estado">
                    <AdminBadge status={sale.status}>{sale.status}</AdminBadge>
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          </AdminSection>

          {/* ---------- Acciones rapidas ---------- */}
          <AdminSection title="Acciones rápidas" subtitle="Lo habitual, en un clic.">
            <div className="admin-quickactions">
              <AdminQuickAction
                to="/admin/cursos/nuevo"
                icon={Plus}
                title="Crear curso"
                description="Empezar uno nuevo en blanco."
              />

              <AdminQuickAction
                to="/admin/estudiantes"
                icon={Users}
                title="Ver estudiantes"
                description="Fichas y cursos de cada persona."
              />

              <AdminQuickAction
                to="/admin/ventas"
                icon={ClipboardList}
                title="Revisar ventas"
                description="Aprobadas, pendientes y reembolsos."
              />

              <AdminQuickAction
                to="/admin/evaluaciones"
                icon={FileCheck2}
                title="Ver evaluaciones"
                description="Qué cursos ya tienen evaluación."
              />

              <AdminQuickAction
                to="/admin/certificados"
                icon={FileCheck2}
                title="Certificados"
                description="Consultar y previsualizar los emitidos."
              />
            </div>
          </AdminSection>
        </div>

        {/* ---------- Cursos ---------- */}
        <AdminSection
          title="Cursos recientes"
          subtitle="Tus ultimos cursos y su estado."
          action={
            <Link className="admin-link" to="/admin/cursos">
              Ver todos
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          }
        >
          <ul className="admin-courses">
            {RECENT_COURSES.map((course) => (
              <AdminCourseRow course={course} key={course.id} />
            ))}
          </ul>
        </AdminSection>

        {/* ---------- Estudiantes ---------- */}
        <AdminSection
          title="Últimos estudiantes"
          subtitle="Altas más recientes en la plataforma."
          flush
          action={
            <Link className="admin-link" to="/admin/estudiantes">
              Ver todos
              <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          }
        >
          <ul className="admin-people">
            {RECENT_STUDENTS.map((student) => (
              <li className="admin-people__row" key={student.id}>
                <span className="admin-people__avatar" aria-hidden="true">
                  {student.name.charAt(0)}
                </span>

                <span className="admin-people__copy">
                  <span className="admin-people__name">{student.name}</span>
                  <span className="admin-people__mail">{student.email}</span>
                </span>

                <span className="admin-people__meta">
                  <span className="admin-people__courses">
                    {student.purchases.length}{' '}
                    {student.purchases.length === 1 ? 'curso' : 'cursos'}
                  </span>

                  <AdminBadge status={student.status}>{student.status}</AdminBadge>
                </span>
              </li>
            ))}
          </ul>
        </AdminSection>
      </div>
    </AdminShell>
  )
}

export default function AdminDashboardPage() {
  return (
    <RequireAdminSession>
      <DashboardView />
    </RequireAdminSession>
  )
}
