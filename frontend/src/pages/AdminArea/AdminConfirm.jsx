import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import './AdminArea.css'

/*
  Confirmacion de una accion destructiva.

  Vive en AdminParts porque la idea es tener un solo sitio para preguntar antes
  de borrar. Por ahora solo lo usa el temario del editor de curso, pero el
  certificado de compra, el archivo de una leccion o un curso entero pueden
  usarlo igual.

  No hay libreria de dialogos en el proyecto y no hace falta una: es un
  overlay, un panel y dos botones.

  SIN PORTAL, y es a proposito. Las variables --admin-* estan declaradas sobre
  .admin, asi que un createPortal(document.body) dejaria el panel sin colores.
  El overlay va en el sitio del arbol donde se usa.
*/

export default function AdminConfirm({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null)

  /* Escape cierra; el foco arranca en el boton que hay que pulsar. */
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    confirmRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="admin-dialog-layer">
      <button className="admin-drawer__scrim" type="button" aria-label="Cerrar" onClick={onCancel} />

      <div className="admin-dialog" role="alertdialog" aria-modal="true" aria-label={title}>
        <span className="admin-dialog__icon" aria-hidden="true">
          <AlertTriangle size={19} strokeWidth={2} />
        </span>

        <h2 className="admin-dialog__title">{title}</h2>
        <p className="admin-dialog__text">{description}</p>

        <div className="admin-dialog__actions">
          <button className="admin-btn" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>

          <button
            className="admin-btn admin-btn--danger admin-btn--solid"
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
