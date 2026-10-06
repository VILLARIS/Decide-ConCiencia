import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MoreHorizontal, X } from 'lucide-react'
import { useOverlayDismiss } from './useOverlayDismiss'
import './AdminShell.css'
import './AdminArea.css'

/*
  Piezas compartidas del area administrativa.

  Viven aqui, y no dentro de cada pantalla, por una razon concreta: el panel es
  un conjunto de listas, tablas y formularios muy parecidos entre si. Si cada
  pagina escribiera su propio encabezado, su propio badge y su propio boton, un
  cambio de margenes o de tono habia que corregirlo en nueve archivos, y tarde
  o temprano uno se queda sin corregir. Con las piezas aqui, la diferencia entre
  dos pantallas es la diferencia que de verdad existe: los datos.

  Reglas de estilo que respetan todas:

  - El contenedor es blanco con borde de 1px. La sombra se reserva para capas
    que flotan de verdad (drawer, menu, dialogo).
  - El azul es estructura y el verde es acento. Un color por idea.
  - Las etiquetas van en minuscula y el dato en el peso fuerte: se lee de
    un vistazo sin tener que leer la frase entera.
*/

/* ============================================================
   1. ENCABEZADO DE PAGINA
   ============================================================ */

/*
  Encabezado contextual: que se esta viendo y que se puede hacer aqui.

  El boton de accion va a la derecha y solo una vez. Antes cada pagina repetia
  "Nuevo curso" dentro del contenido ademas de aqui, y la pantalla tenia dos
  entradas a lo mismo a la vista.

  Es la misma pieza que el saludo del inicio, sin las formas de fondo del
  dashboard: aqui la cabecera es el marco quieto de la pantalla, no un bloque
  que quiere ser el protagonista. Por eso `eyebrow` e `icon` son opcionales y
  solo los usa quien tiene algo que decir antes del titulo.
*/
export function AdminPageHeader({ title, subtitle, actions, meta, eyebrow, icon: Icon }) {
  return (
    <header className="admin-pagehead">
      <div className="admin-pagehead__copy">
        {eyebrow || Icon ? (
          <p className="admin-pagehead__eyebrow">
            {Icon ? <Icon size={15} strokeWidth={1.9} aria-hidden="true" /> : null}
            {eyebrow}
          </p>
        ) : null}

        <h1 className="admin-pagehead__title">{title}</h1>
        {subtitle ? <p className="admin-pagehead__sub">{subtitle}</p> : null}
        {meta ? <div className="admin-pagehead__meta">{meta}</div> : null}
      </div>

      {actions ? <div className="admin-pagehead__actions">{actions}</div> : null}
    </header>
  )
}

/* ============================================================
   2. SECCION
   ============================================================ */

/*
  Bloque de contenido con su propio encabezado.

  `flush` quita el padding del cuerpo: es lo que necesitan las tablas, que
  llevan sus propias celdas con aire y un separador por fila.
*/
export function AdminSection({ title, subtitle, action, children, flush = false, className = '' }) {
  return (
    <section className={`admin-section${className ? ` ${className}` : ''}`}>
      {title || action ? (
        <div className="admin-section__head">
          <div>
            {title ? <h2 className="admin-section__title">{title}</h2> : null}
            {subtitle ? <p className="admin-section__sub">{subtitle}</p> : null}
          </div>

          {action ? <div className="admin-section__action">{action}</div> : null}
        </div>
      ) : null}

      <div className={`admin-section__body${flush ? ' admin-section__body--flush' : ''}`}>
        {children}
      </div>
    </section>
  )
}

/* Mantiene el nombre anterior para no romper pantallas de un golpe. */
export const AdminPanel = AdminSection
export const AdminPageHead = AdminPageHeader

/* ============================================================
   3. METRICA
   ============================================================ */

/*
  Una cifra y su contexto. Compacta a proposito: cuatro de estas leen mejor en
  fila que en una rejilla de tarjetas grandes.

  `hint` lleva el dato de apoyo ("12 ventas"). No lleva porcentajes inventados:
  si no hay comparacion real, se dice solo la cifra.
*/
export function AdminStat({ label, value, hint, icon: Icon, tone = 'default' }) {
  return (
    <article className={`admin-stat admin-stat--${tone}`}>
      <div className="admin-stat__top">
        <p className="admin-stat__label">{label}</p>

        {Icon ? <Icon className="admin-stat__icon" size={16} strokeWidth={1.9} aria-hidden="true" /> : null}
      </div>

      <p className="admin-stat__value">{value}</p>

      {hint ? <p className="admin-stat__hint">{hint}</p> : null}
    </article>
  )
}

/* Fila de metricas. Es una rejilla de cuatro, se reduce sola en tablet. */
export function AdminStatRow({ children, label = 'Métricas principales' }) {
  return (
    <section className="admin-statrow" aria-label={label}>
      {children}
    </section>
  )
}

/* ============================================================
   4. BADGE DE ESTADO
   ============================================================ */

/*
  Estado en una palabra. El tono sale del estado, no de una tabla de colores
  escrita a mano en cada pagina: asi "Publicado" es verde en todas partes.
*/
const STATUS_TONES = {
  publicado: 'positive',
  publicada: 'positive',
  aprobado: 'positive',
  aprobada: 'positive',
  emitido: 'positive',
  emitida: 'positive',
  completado: 'positive',
  completada: 'positive',
  activo: 'positive',
  activa: 'positive',
  borrador: 'warning',
  pendiente: 'warning',
  inactivo: 'neutral',
  inactiva: 'neutral',
  reembolsado: 'neutral',
  'en revisión': 'review',
  revision: 'review',
  rechazado: 'negative',
  rechazada: 'negative',
}

export function AdminBadge({ children, tone, status }) {
  /* Si no se dice el tono, se deduce del texto del estado. */
  const resolved = tone ?? STATUS_TONES[String(status ?? children ?? '').toLowerCase()] ?? 'neutral'

  return <span className={`admin-badge admin-badge--${resolved}`}>{children}</span>
}

/* ============================================================
   5. TABLA
   ============================================================ */

/*
  Tabla que tambien sirve en movil.

  Cada celda lleva su nombre en `data-label`, y por debajo de 640px el CSS deja
  de hacer tabla: cada fila se convierte en una ficha apilada y la etiqueta sale
  de ahi. Una sola piece de marcado para las dos situations, sin duplicar la
  lista en una version "movil" que luego se desincroniza.
*/
export function AdminTable({ headers, children, loading = false, rows = 0, className = '' }) {
  if (loading) {
    return (
      <div className="admin-table-wrap">
        <AdminSkeleton variant="table" rows={rows || 4} />
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className={`admin-table${className ? ` ${className}` : ''}`}>
        {headers ? (
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}

        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function AdminTableCell({ label, children, className = '', align }) {
  return (
    <td
      className={`${className}${align ? ` admin-table__cell--${align}` : ''}`}
      data-label={label}
      data-align={align}
    >
      {children}
    </td>
  )
}

/* ============================================================
   6. ESTADO VACIO
   ============================================================ */

/*
  Lo que se ve cuando no hay nada.

  Una tabla vacia es la peor forma de decir "aun no hay": parece un fallo. Aqui
  se dice que no hay, por que no hay y que se puede hacer al respecto.
*/
export function AdminEmptyState({ title, description, action, icon: Icon, compact = false }) {
  return (
    <div className={`admin-empty${compact ? ' admin-empty--compact' : ''}`}>
      {Icon ? (
        <span className="admin-empty__icon">
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </span>
      ) : null}

      <p className="admin-empty__title">{title}</p>

      {description ? <p className="admin-empty__desc">{description}</p> : null}

      {action ? <div className="admin-empty__action">{action}</div> : null}
    </div>
  )
}

/* ============================================================
   7. ESQUELETO
   ============================================================ */

/*
  Marcador de carga.

  No se usa todavia porque la demo no carga de la red: los datos estan en el
  modulo. Va preparado para cuando haya API, que es cuando hace falta, y para
  poder cambiar una tabla por su esqueleto sin tocar el resto de la pantalla.
*/
export function AdminSkeleton({ variant = 'text', rows = 3, label = 'Cargando' }) {
  if (variant === 'table') {
    return (
      <div className="admin-skeleton" role="status" aria-live="polite">
        <span className="admin-visually-hidden">{label}</span>

        {Array.from({ length: rows }, (unused, index) => (
          <div className="admin-skeleton__row" key={index}>
            <span className="admin-skeleton__bar" style={{ width: '34%' }} />
            <span className="admin-skeleton__bar" style={{ width: '22%' }} />
            <span className="admin-skeleton__bar" style={{ width: '14%' }} />
            <span className="admin-skeleton__bar" style={{ width: '18%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="admin-skeleton" role="status" aria-live="polite">
      <span className="admin-visually-hidden">{label}</span>

      {Array.from({ length: rows }, (unused, index) => (
        <span className="admin-skeleton__bar" key={index} />
      ))}
    </div>
  )
}

/* ============================================================
   8. MENU DE ACCIONES
   ============================================================ */

/*
  Menu "..." para lo secundario.

  Cuatro botones en cada fila de una tabla son cuatro filas de ruido: lo que se
  usa una vez cada tanto (duplicar, ver, despublicar) va detras de un menu, y lo
  que se usa siempre (editar) se queda a la vista.

  Cierra con Escape, al pulsar fuera y al tabular fuera. Las tres cosas las
  espera cualquiera que haya usado un menu de verdad.
*/
export function AdminActionMenu({ label = 'Más acciones', items = [] }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const firstItemRef = useRef(null)
  const menuId = useId()

  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) close()
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  /* Al abrir, el foco entra en el menu: si no, seguir con el teclado deja al
     usuario perdidos en el documento. */
  useEffect(() => {
    if (open) firstItemRef.current?.focus()
  }, [open])

  return (
    <div className="admin-actionmenu" ref={containerRef}>
      <button
        className="admin-iconbtn"
        type="button"
        onClick={() => setOpen((visible) => !visible)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title={label}
      >
        <MoreHorizontal size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      {open ? (
        <div className="admin-actionmenu__pop" id={menuId} role="menu">
          {items.map((item, index) => (
            <ActionMenuItem item={item} key={item.id ?? item.label} index={index} onDone={close} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ActionMenuItem({ item, index, onDone }) {
  const handleSelect = () => {
    onDone()
    item.onSelect?.()
  }

  const className = `admin-actionmenu__item${item.tone === 'danger' ? ' admin-actionmenu__item--danger' : ''}`
  const content = (
    <>
      {item.icon ? <item.icon size={15} strokeWidth={1.9} aria-hidden="true" /> : null}
      <span>{item.label}</span>
    </>
  )

  if (item.to) {
    return (
      <Link
        className={className}
        to={item.to}
        role="menuitem"
        tabIndex={index === 0 ? 0 : -1}
        onClick={onDone}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={className}
      type="button"
      role="menuitem"
      tabIndex={index === 0 ? 0 : -1}
      onClick={handleSelect}
      disabled={item.disabled}
    >
      {content}
    </button>
  )
}

/* ============================================================
   9. DRAWER
   ============================================================ */

/*
  Panel lateral para mirar y editar una cosa sin perder la pantalla de fondo.

  Reutiliza las mismas clases que el drawer de leccion (.admin-drawer*), a
  proposito: si un panel lateral tiene dos estilos, el usuario lo nota al pasar
  de la ficha del estudiante a editar una leccion, y no hay ninguna buena
  razon para que el segundo sea distinto del primero.

  Escape y el bloqueo de scroll del fondo estan en useOverlayDismiss.
*/
export function AdminDrawer({ open, title, subtitle, eyebrow, onClose, footer, children, width }) {
  const titleId = useId()

  useOverlayDismiss(open, onClose)

  if (!open) return null

  return (
    <div className="admin-drawer-layer">
      <button
        className="admin-drawer__scrim"
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <aside
        className="admin-drawer"
        style={width ? { width: `min(${width}px, 100%)` } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="admin-drawer__head">
          <div>
            {eyebrow ? <p className="admin-drawer__eyebrow">{eyebrow}</p> : null}
            <h2 className="admin-drawer__title" id={titleId}>
              {title}
            </h2>
            {subtitle ? <p className="admin-drawer__sub">{subtitle}</p> : null}
          </div>

          <button
            className="admin-iconbtn"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={17} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="admin-drawer__body">{children}</div>

        {footer ? <footer className="admin-drawer__foot">{footer}</footer> : null}
      </aside>
    </div>
  )
}

/* ============================================================
   10. PESTAÑAS
   ============================================================ */

/*
  Navegacion interna del editor de curso.

  Antes la ficha y el temario vivian en la misma pantalla, y el temario, que es
  lo que mas crece, empujaba los datos basicos fuera de la vista. Con pestanas,
  cada pestana responde a una pregunta: de que va el curso, que contenido tiene,
  como se evalua y si esta listo para salir.
*/
export function AdminTabs({ tabs, active, onChange, ariaLabel = 'Secciones del editor' }) {
  return (
    <div className="admin-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.id === active

        return (
          <button
            className={`admin-tab${isActive ? ' admin-tab--active' : ''}`}
            key={tab.id}
            type="button"
            role="tab"
            id={`admin-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`admin-tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}

            {tab.count !== undefined && tab.count !== null ? (
              <span className="admin-tab__count">{tab.count}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function AdminTabPanel({ id, active, children }) {
  if (!active) return null

  return (
    <div
      className="admin-tabpanel"
      role="tabpanel"
      id={`admin-tabpanel-${id}`}
      aria-labelledby={`admin-tab-${id}`}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

/* ============================================================
   11. ACCION RAPIDA
   ============================================================ */

/*
  Atajo del panel principal: icono, titulo y una frase. No es una tarjeta: es
  un enlace con tres lineas, para que la columna derecha no se llene de cajas.

  El chevron es decorativo (aria-hidden): la frase ya dice a donde lleva, y
  repetirlo para el lector de pantalla solo anade ruido.
*/
export function AdminQuickAction({ to, icon: Icon, title, description }) {
  return (
    <Link className="admin-quickaction" to={to}>
      <span className="admin-quickaction__icon">
        <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
      </span>

      <span className="admin-quickaction__copy">
        <span className="admin-quickaction__title">{title}</span>
        <span className="admin-quickaction__desc">{description}</span>
      </span>

      <ChevronRight className="admin-quickaction__chevron" size={16} strokeWidth={2} aria-hidden="true" />
    </Link>
  )
}

/* ============================================================
   12. FILTROS
   ============================================================ */

/*
  Filtros de estado. Vienen en la fila de herramientas de la seccion, no
  sueltos: son parte de la lista que controlan.
*/
export function AdminFilters({ options, value, onChange, label = 'Filtrar' }) {
  return (
    <div className="admin-filters" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className={`admin-filter${value === option.id ? ' admin-filter--active' : ''}`}
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/* ============================================================
   13. PERSONA
   ============================================================ */

/*
  Nombre con avatar de iniciales.

  Vive aqui, y no en cada pagina, porque "quien es esta persona" sale en
  estudiantes, en ventas y en certificados. Si cada pantalla dibuja su propio
  circulo, esas tres dejan de reconocerse como la misma lista de gente.

  "Ana Quispe" -> "AQ": dos iniciales bastan para reconocer a alguien en una
  fila, y no hace falta inventar un color por persona.
*/
function getPersonInitials(name) {
  const parts = String(name).trim().split(/\s+/)

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function AdminPerson({ name, secondary, size = 'md' }) {
  return (
    <span className={`admin-person${size === 'sm' ? ' admin-person--sm' : ''}`}>
      <span className="admin-person__avatar" aria-hidden="true">
        {getPersonInitials(name)}
      </span>

      <span className="admin-person__copy">
        <span className="admin-person__name">{name}</span>
        {secondary ? <span className="admin-person__meta">{secondary}</span> : null}
      </span>
    </span>
  )
}

/* ============================================================
   14. PORTADA DEL CURSO
   ============================================================ */

/*
  Es una pieza de color con las iniciales, no una imagen: las fichas del panel
  se ven igual sin depender de archivos pesados ni de imagery que cargar.
*/
const COURSE_GLYPHS = {
  'bioquimica-aplicada-a-la-nutricion': 'BQ',
  'nutricion-clinica-aplicada': 'NC',
  'metabolismo-de-carbohidratos': 'MC',
  'fisiologia-digestiva': 'FD',
  'nutricion-materna': 'NM',
}

export function CourseCover({ courseId, tone, size = 'md' }) {
  const glyph = COURSE_GLYPHS[courseId] ?? 'CY'

  return (
    <span
      className={`admin-cover admin-cover--${tone ?? 'sky'}${
        size === 'sm' ? ' admin-cover--sm' : size === 'lg' ? ' admin-cover--lg' : ''
      }`}
      aria-hidden="true"
    >
      {glyph}
    </span>
  )
}
