import { useEffect } from 'react'

/*
  Cierre de las capas que tapan la pagina: el drawer de leccion y el dialogo de
  vista previa.

  Hace dos cosas, y las dos hacen falta en un panel:

  1. Escape cierra. Se escucha en el documento porque el foco puede estar en el
     textarea del editor de texto, que se come las teclas.
  2. El fondo deja de desplazarse. Sin esto, con el drawer abierto, rueda la
     pagina de detras y da la sensacion de que la capa se ha soltado.

  Cada capa bloquea y desbloquea el fondo por su cuenta. Solo importa que al
  cerrar una se devuelva el valor que habia, y de ahi el previousOverflow.
*/
export function useOverlayDismiss(isOpen, onDismiss) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onDismiss()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onDismiss])
}
