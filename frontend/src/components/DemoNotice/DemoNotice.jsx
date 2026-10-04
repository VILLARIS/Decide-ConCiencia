import { Info } from 'lucide-react'
import './DemoNotice.css'

/*
  Aviso de demostración, deliberadamente discreto.

  Se usa para lo que la demo es y lo que NO es (pago simulado, sin servidor).
  Va fuera del contenido principal de la pagina: es informacion de contexto,
  no el mensaje que la persona tiene que leer.

  Es texto, no un aviso de error: por eso el tono es neutro y el contraste bajo.
*/
export default function DemoNotice({ children }) {
  return (
    <p className="demo-notice" role="note">
      <Info className="demo-notice__icon" size={14} strokeWidth={1.9} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}