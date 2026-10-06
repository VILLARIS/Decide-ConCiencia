import './TeamSection.css'

/*
  EQUIPO

  Estructura limpia y respetuosa: no se inventan nombres, especialidades,
  cargos, experiencia ni datos profesionales.

  En esta fase no hay datos reales disponibles, por eso no se rellenan tarjetas
  con información ficticia: se dejan huecos visuales provisionales con un borde
  discontinuo. Cuando se reciba la información del equipo, solo hay que
  sustituir las figuras por imágenes reales y completar los campos existentes.

  La sección usa un azul/verde muy suave como fondo para dar ritmo al Home
  sin recargarlo.
*/

export default function TeamSection() {
  return (
    <section className="team" aria-labelledby="team-title">
      <span className="team__orb" aria-hidden="true" />

      <div className="team__container">
        <header className="team__head">
          <h2 className="team__title" id="team-title">
            Nuestro equipo
          </h2>
          <p className="team__intro">
            Profesionales comprometidos con una atención cercana y basada en evidencia.
          </p>
        </header>

        <div className="team__grid">
          {['uno', 'dos', 'tres'].map((item) => (
            <article className="team-slot" key={item} aria-hidden="true">
              <figure className="team-slot__media" />
              <div className="team-slot__body">
                <p className="team-slot__placeholder">Próximamente</p>
                <p className="team-slot__note">
                  Se completará cuando estén disponibles los datos del equipo.
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="team__footnote">
          Sin datos ficticios. La estructura queda lista para incorporar perfiles reales.
        </p>
      </div>
    </section>
  )
}