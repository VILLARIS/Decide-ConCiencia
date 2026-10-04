import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import AdminShell from './AdminShell'
import {
  AdminBadge,
  AdminEmptyState,
  AdminFilters,
  AdminPageHeader,
  AdminSection,
  AdminStat,
  AdminStatRow,
  AdminTable,
  AdminTableCell,
} from './AdminParts'
import { RequireAdminSession } from '../../demo/DemoAuthContext'
import {
  DEMO_ADMIN_SALES,
  SALE_STATUS,
  formatAmount,
  getCoursePrice,
  getCourseTitle,
  getStudentName,
} from '../../demo/demoAdminData'
import './AdminArea.css'

/*
  Ventas (Plan Profesional).

  Listado basico con filtro por estado. Sin graficas, sin tendencias, sin
  reportes ni exportaciones: es el historial, no un analisis. Eso pertenece al
  Plan Integral.

  Los importes salen del precio del curso (helpers de demoAdminData), asi que
  el historico no duplica cifras. Las tres cifras de arriba cuentan lo que hay
  en la tabla, no toda la plataforma: si estas filtrando, el resumen debe
  contar lo mismo que la lista que estas leyendo.
*/

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: SALE_STATUS.approved, label: SALE_STATUS.approved },
  { id: SALE_STATUS.pending, label: SALE_STATUS.pending },
  { id: SALE_STATUS.rejected, label: SALE_STATUS.rejected },
  { id: SALE_STATUS.refunded, label: SALE_STATUS.refunded },
]

const HEADERS = ['Código', 'Estudiante', 'Curso', 'Importe', 'Fecha', 'Estado']

/* Suma de lo cobrado: una venta rechazada o reembolsada no cuenta. */
function approvedTotal(sales) {
  return sales
    .filter((sale) => sale.status === SALE_STATUS.approved)
    .reduce((total, sale) => total + getCoursePrice(sale.courseId), 0)
}

function SalesView() {
  const [filter, setFilter] = useState('all')

  const visibleSales =
    filter === 'all' ? DEMO_ADMIN_SALES : DEMO_ADMIN_SALES.filter((sale) => sale.status === filter)

  const stats = [
    { id: 'count', label: 'Ventas mostradas', value: visibleSales.length },
    { id: 'total', label: 'Importe aprobado', value: `S/${approvedTotal(visibleSales)}` },
    {
      id: 'pending',
      label: 'Pendientes',
      value: visibleSales.filter((sale) => sale.status === SALE_STATUS.pending).length,
    },
    { id: 'courses', label: 'Cursos vendidos', value: new Set(visibleSales.map((sale) => sale.courseId)).size },
  ]

  return (
    <AdminShell>
      <AdminPageHeader
        title="Ventas"
        subtitle="Historial de compras de los cursos de la plataforma."
      />

      <AdminStatRow>
        {stats.map((stat) => (
          <AdminStat key={stat.id} label={stat.label} value={stat.value} />
        ))}
      </AdminStatRow>

      <AdminSection
        flush
        title="Historial"
        action={
          <AdminFilters
            options={FILTERS}
            value={filter}
            onChange={setFilter}
            label="Filtrar ventas por estado"
          />
        }
      >
        {visibleSales.length > 0 ? (
          <AdminTable headers={HEADERS}>
            {visibleSales.map((sale) => (
              <tr key={sale.id}>
                <AdminTableCell label="Código" className="admin-table__muted">
                  {sale.id}
                </AdminTableCell>

                <AdminTableCell label="Estudiante" className="admin-table__strong">
                  {getStudentName(sale.studentId)}
                </AdminTableCell>

                <AdminTableCell label="Curso" className="admin-table__muted">
                  {getCourseTitle(sale.courseId)}
                </AdminTableCell>

                <AdminTableCell label="Importe" className="admin-table__num">
                  {formatAmount(sale.courseId, getCoursePrice(sale.courseId))}
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
        ) : (
          <AdminEmptyState
            icon={ClipboardList}
            title="No hay ventas con este estado"
            description="Cambia el filtro para ver el resto del historial."
            action={
              <button className="admin-btn" type="button" onClick={() => setFilter('all')}>
                Ver todas
              </button>
            }
          />
        )}
      </AdminSection>
    </AdminShell>
  )
}

export default function AdminSalesPage() {
  return (
    <RequireAdminSession>
      <SalesView />
    </RequireAdminSession>
  )
}
