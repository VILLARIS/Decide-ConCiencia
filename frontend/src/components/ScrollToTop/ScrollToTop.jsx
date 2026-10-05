import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/*
  RESET GLOBAL DE SCROLL AL CAMBIAR DE RUTA

  React Router no restaura el scroll entre navegaciones de la SPA: al cambiar de
  ruta el documento conserva la posicion vertical anterior y la pagina nueva
  aparece a media altura. Este componente lo resuelve una sola vez para toda la
  aplicacion, sin tocar cada pagina ni cada enlace.

  Montado dentro del BrowserRouter (ver Root.jsx), por debajo de las rutas.

  Casos:
  - Cambio de ruta normal (por ejemplo /servicios -> /contacto): scroll a 0 con
    behavior "auto", para aparecer de inmediato en el hero, sin animacion.
  - Ruta con ancla (por ejemplo /quienes-somos#esencia): se respeta el destino
    del anchor en lugar de mandar al inicio. Si el ancla no existe todavia,
    cae a 0 para no dejar la pagina a media altura.
*/

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Navegacion intencional a una seccion: se respeta el anchor.
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
