import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Eye, EyeOff, Plus, Search } from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminActionMenu,
  AdminBadge,
  AdminEmptyState,
  AdminFilters,
  AdminPageHeader,
  AdminSection,
  AdminTable,
  AdminTableCell,
  CourseCover,
} from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  ADMIN_PLAN,
  COURSE_STATUS,
  DEMO_ADMIN_COURSES,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Gestion de cursos (Plan Profesional).

  Una tabla y ya. El listado es de consulta y de una accion rapida por fila:
  editar, que es lo unico que se hace todos los dias, se ve siempre; duplicar,
  despublicar y abrir la ficha publica van detras del menu, porque son cosas
  que se hacen una vez cada tanto y cuatro botones por fila tapaban la propia
  tabla.

  NO hay eliminacion definitiva. Borrar un curso con estudiantes inscritos es
  una decision irreversible y en esta demo los datos son ficticios, asi que
  no tiene sentido offerla: se archiva cambiando el estado a Borrador. Cuando
  exista backend, la eliminacion real llevara confirmacion y se pedira
  expresamente.
*/

/* Estado inicial del filtro: "Todos". */
const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: COURSE_STATUS.published, label: COURSE_STATUS.published },
  { id: COURSE_STATUS.draft, label: COURSE_STATUS.draft },
]

const HEADERS = ['Curso', 'Precio', 'Estado', 'Estudiantes', 'Actualizado', 'Acciones']

function CoursesView() {
  /* Cambiar estado y duplicar se reflejan en la lista mientras esta abierta. */
  const [courses, setCourses] = useState(DEMO_ADMIN_COURSES)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const search = query.trim().toLowerCase()

  const visibleCourses = courses.filter((course) => {
    const matchesFilter = filter === 'all' || course.status === filter
    const matchesSearch =
      !search ||
      course.title.toLowerCase().includes(search) ||
      course.category.toLowerCase().includes(search)

    return matchesFilter && matchesSearch
  })

  /* Publicar o volver a borrador. */
  const toggleStatus = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status:
                course.status === COURSE_STATUS.published
                  ? COURSE_STATUS.draft
                  : COURSE_STATUS.published,
            }
          : course,
      ),
    )
  }

  /* Duplicar: copia el contenido en un borrador nuevo, sin inscritos. */
  const duplicateCourse = (courseId) => {
    setCourses((prev) => {
      const source = prev.find((course) => course.id === courseId)
      if (!source) return prev

      const copyId = `${source.id}-copia-${prev.length + 1}`
      const copy = {
        ...source,
        id: copyId,
        title: `${source.title} (copia)`,
        status: COURSE_STATUS.draft,
        students: 0,
        updatedAt: 'Hoy',
      }

      return [copy, ...prev]
    })
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Cursos"
        subtitle={`Gestiona el contenido de tu plataforma. Plan ${ADMIN_PLAN.name}.`}
        actions={
          <Link className="admin-btn admin-btn--primary" to="/admin/cursos/nuevo">
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            Crear nuevo curso
          </Link>
        }
      />

      <AdminSection flush>
        {/* ---------- Herramientas de la lista ---------- */}
        <div className="admin-toolbar">
          <AdminFilters
            options={FILTERS}
            value={filter}
            onChange={setFilter}
            label="Filtrar cursos por estado"
          />

          <div className="admin-search">
            <Search className="admin-search__icon" size={15} strokeWidth={2} aria-hidden="true" />

            <input
              className="admin-search__input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o categoría"
              aria-label="Buscar cursos"
            />
          </div>
        </div>

        {/* ---------- Listado ---------- */}
        {visibleCourses.length > 0 ? (
          <AdminTable headers={HEADERS}>
            {visibleCourses.map((course) => (
              <CourseAdminRow
                course={course}
                key={course.id}
                onDuplicate={() => duplicateCourse(course.id)}
                onToggleStatus={() => toggleStatus(course.id)}
              />
            ))}
          </AdminTable>
        ) : (
          <AdminEmptyState
            title="Ningún curso coincide con la búsqueda"
            description="Prueba con otro estado o limpia el buscador para ver todo el catálogo."
            action={
              <button
                className="admin-btn"
                type="button"
                onClick={() => {
                  setFilter('all')
                  setQuery('')
                }}
              >
                Quitar filtros
              </button>
            }
          />
        )}
      </AdminSection>

      <p className="admin-note">
        Los cursos en borrador no aparecen en la web. No hay eliminación definitiva: si
        quieres retirar un curso, déjalo en borrador.
      </p>
    </AdminShell>
  )
}

function CourseAdminRow({ course, onDuplicate, onToggleStatus }) {
  const isPublished = course.status === COURSE_STATUS.published

  return (
    <tr>
      <AdminTableCell label="Curso">
        <div className="admin-coursestack">
          <CourseCover courseId={course.id} tone={course.tone} size="sm" />

          <div className="admin-coursestack__body">
            <Link className="admin-table__rowlink" to={`/admin/cursos/${course.id}`}>
              {course.title}
            </Link>

            <span className="admin-coursestack__meta">
              {course.category} · {course.level}
            </span>
          </div>
        </div>
      </AdminTableCell>

      <AdminTableCell label="Precio" className="admin-table__num">
        {course.price > 0 ? `${course.currency}${course.price}` : 'Sin precio'}
      </AdminTableCell>

      <AdminTableCell label="Estado">
        <AdminBadge status={course.status}>{course.status}</AdminBadge>
      </AdminTableCell>

      <AdminTableCell label="Estudiantes" className="admin-table__muted">
        {course.students}
      </AdminTableCell>

      <AdminTableCell label="Actualizado" className="admin-table__muted">
        {course.updatedAt}
      </AdminTableCell>

      <AdminTableCell label="Acciones" align="right">
        <div className="admin-table__actions">
          <Link
            className="admin-btn admin-btn--sm"
            to={`/admin/cursos/${course.id}`}
            aria-label={`Editar ${course.title}`}
          >
            Editar
          </Link>

          <AdminActionMenu
            label={`Más acciones para ${course.title}`}
            items={[
              ...(isPublished
                ? [
                    {
                      id: 'ver',
                      label: 'Ver en la web',
                      icon: Eye,
                      to: `/cursos/${course.id}`,
                    },
                  ]
                : []),
              {
                id: 'duplicar',
                label: 'Duplicar como borrador',
                icon: Copy,
                onSelect: onDuplicate,
              },
              {
                id: 'estado',
                label: isPublished ? 'Despublicar' : 'Publicar',
                icon: isPublished ? EyeOff : Eye,
                onSelect: onToggleStatus,
              },
            ]}
          />
        </div>
      </AdminTableCell>
    </tr>
  )
}

export default function AdminCoursesPage() {
  return (
    <RequireAdminSession>
      <CoursesView />
    </RequireAdminSession>
  )
}
