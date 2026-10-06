import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './StudentShell.css'

/*
  Contenedor comun del area de estudiante (Mi aprendizaje, Mi perfil y
  Mis certificados).

  Solo es composicion: Navbar arriba, contenido en el centro y un pie
  compacto. No guarda estado ni toca la sesion demo.
*/

export default function StudentShell({ children }) {
  return (
    <div className="student">
      <Navbar />

      <main className="student__main">
        <div className="student__container">{children}</div>
      </main>

      {/* En area autenticada el pie va reducido: informa sin robar atencion. */}
      <Footer compact studentArea />
    </div>
  )
}