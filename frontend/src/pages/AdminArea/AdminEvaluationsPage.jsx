import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileCheck2, Plus } from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminEmptyState,
  AdminFilters,
  AdminPageHeader,
  AdminSection,
  AdminTable,
  AdminTableCell,
} from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  DEMO_ADMIN_EVALUATIONS,
  getAdminCourse,
  getEvaluationsForCourse,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Evaluaciones (Plan Profesional).

  Solo gestion: que evaluaciones existen, de que curso son y cuantas preguntas
  tienen. No se guardan respuestas ni resultados de estudiantes; el analisis
  de respuestas es del Plan Integral.

  Una evaluacion pertenece a un curso, asi que se crea desde el editor de ese
  curso, no desde aqui. Por eso el boton solo aparece cuando hay un curso
  elegido: sin curso, "crear evaluacion" no tiene destino.
*/

const HEADERS = ['Evaluación', 'Curso', 'Preguntas', 'Estado', '']

function EvaluationsView() {
  /* Filtro por curso: solo tiene sentido para quien gestiona varios. */
  const [courseFilter, setCourseFilter] = useState('all')

  const courseIds = [...new Set(DEMO_ADMIN_EVALUATIONS.map((evaluation) => evaluation.courseId))]

  const visibleEvaluations =
    courseFilter === 'all'
      ? DEMO_ADMIN_EVALUATIONS
      : getEvaluationsForCourse(courseFilter)

  const courseOptions = [
    { id: 'all', label: 'Todos los cursos' },
    ...courseIds.map((courseId) => ({
      id: courseId,
      label: getAdminCourse(courseId)?.title ?? courseId,
    })),
  ]

  return (
    <AdminShell>
      <AdminPageHeader
        title="Evaluaciones"
        subtitle="Organiza exámenes, resultados y seguimiento de los cursos que ya tienen evaluación."
        eyebrow="Contenido"
        icon={FileCheck2}
        actions={
          courseFilter === 'all' ? null : (
            <Link
              className="admin-btn admin-btn--primary"
              to={`/admin/cursos/${courseFilter}?tab=evaluacion`}
            >
              <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
              Crear evaluación
            </Link>
          )
        }
      />

      <AdminSection
        flush
        title="Listado"
        subtitle={`${visibleEvaluations.length} ${
          visibleEvaluations.length === 1 ? 'evaluación' : 'evaluaciones'
        }`}
        action={
          <AdminFilters
            options={courseOptions}
            value={courseFilter}
            onChange={setCourseFilter}
            label="Filtrar evaluaciones por curso"
          />
        }
      >
        {visibleEvaluations.length > 0 ? (
          <AdminTable headers={HEADERS}>
            {visibleEvaluations.map((evaluation) => {
              const course = getAdminCourse(evaluation.courseId)

              return (
                <tr key={evaluation.id}>
                  <AdminTableCell label="Evaluación" className="admin-table__strong">
                    {evaluation.name}
                  </AdminTableCell>

                  <AdminTableCell label="Curso" className="admin-table__muted">
                    {course?.title ?? evaluation.courseId}
                  </AdminTableCell>

                  <AdminTableCell label="Preguntas" className="admin-table__num">
                    {evaluation.questions}
                  </AdminTableCell>

                  <AdminTableCell label="Estado">
                    <AdminBadge status={evaluation.status}>{evaluation.status}</AdminBadge>
                  </AdminTableCell>

                  <AdminTableCell label="Editar" align="right">
                    <div className="admin-table__actions">
                      <Link
                        className="admin-btn admin-btn--sm"
                        to={`/admin/cursos/${evaluation.courseId}?tab=evaluacion`}
                      >
                        Editar
                      </Link>
                    </div>
                  </AdminTableCell>
                </tr>
              )
            })}
          </AdminTable>
        ) : (
          <AdminEmptyState
            icon={FileCheck2}
            title="Este curso todavía no tiene evaluaciones"
            description="Créalas desde la pestaña Evaluación del editor del curso."
            action={
              courseFilter === 'all' ? null : (
                <Link
                  className="admin-btn"
                  to={`/admin/cursos/${courseFilter}?tab=evaluacion`}
                >
                  Ir al editor del curso
                </Link>
              )
            }
          />
        )}
      </AdminSection>

      <p className="admin-note">
        Las respuestas de los estudiantes y sus resultados no se guardan en esta versión del
        panel. Plan Integral.
      </p>
    </AdminShell>
  )
}

export default function AdminEvaluationsPage() {
  return (
    <RequireAdminSession>
      <EvaluationsView />
    </RequireAdminSession>
  )
}
