import { Link } from 'react-router-dom'
import { Eye, GraduationCap, Pencil, Users } from 'lucide-react'
import { AdminBadge, CourseCover } from './AdminParts'

/*
  Fila de curso reutilizable (dashboard y listado).

  Muestra portada, titulo, precio, estado e inscritos, con las acciones de
  siempre: editar y abrir la ficha publica. No duplica el marcado en dos
  pantallas.
*/

export function AdminCourseRow({ course, actions = true }) {
  return (
    <li className="admin-course">
      <CourseCover courseId={course.id} tone={course.tone} />

      <div className="admin-course__body">
        <h3 className="admin-course__title">{course.title}</h3>

        <p className="admin-course__meta">
          <AdminBadge status={course.status}>{course.status}</AdminBadge>

          <span className="admin-course__price">
            {course.price > 0 ? `${course.currency}${course.price}` : 'Sin precio'}
          </span>

          <span className="admin-course__students">
            <Users size={13} strokeWidth={1.9} aria-hidden="true" />
            {course.students}
          </span>
        </p>
      </div>

      {actions ? (
        <div className="admin-course__side">
          <div className="admin-course__actions">
            <Link
              className="admin-btn admin-btn--sm"
              to={`/admin/cursos/${course.id}`}
              aria-label={`Editar ${course.title}`}
            >
              <Pencil size={13} strokeWidth={2} aria-hidden="true" />
              Editar
            </Link>

            {/* Un borrador todavia no tiene ficha publica que abrir. */}
            {course.status === 'Publicado' ? (
              <Link
                className="admin-iconbtn"
                to={`/cursos/${course.id}`}
                aria-label={`Ver ${course.title} en la web`}
                title="Ver en la web"
              >
                <Eye size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            ) : (
              <span
                className="admin-iconbtn"
                title="Disponible cuando el curso se publique"
                aria-label="Curso en borrador"
              >
                <GraduationCap size={15} strokeWidth={2} aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      ) : null}
    </li>
  )
}

