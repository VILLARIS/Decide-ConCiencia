import './AuthLayout.css'

/*
  AuthLayout — cascara visual compartida por las pantallas de acceso.

  Login y Registro son el mismo sistema: misma paleta, mismo split y mismo
  lenguaje. Solo cambia el formulario de la columna izquierda.

  Columna izquierda: el formulario de acceso, protagonista y centrado.
  Columna derecha: la ilustracion a sangre (cover), sin transformadas ni velos
  pesados, para que conserve color, contraste y profundidad. Abajo a la
  izquierda de la imagen, un bloque editorial pequeno en glass: el mensaje sin
  taparle el rostro al personaje.

  El formulario va primero en el DOM: asi se lee antes en teclado y lector de
  pantalla, y el orden visual coincide con el orden de lectura.
*/

export function AuthLayout({
  image,
  imageAlt,
  imagePosition = 'center top',
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <main className="auth">
      <section
        className="auth__section"
        style={{ '--auth-image-position': imagePosition }}
      >
        {/* ---------- Columna izquierda: formulario ---------- */}
        <div className="auth__panel">{children}</div>

        {/* ---------- Columna derecha: ilustracion a sangre ---------- */}
        <div className="auth__visual">
          <img className="auth__image" src={image} alt={imageAlt} decoding="async" />

          {/* Unico velo de la pantalla: degrada solo la franja inferior, donde
              se apoya el texto. Arriba la imagen queda intacta. */}
          <span className="auth__veil" aria-hidden="true" />

          <div className="auth__copy">
            <p className="auth__eyebrow">{eyebrow}</p>
            <h1 className="auth__title">{title}</h1>
            {description ? <p className="auth__description">{description}</p> : null}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout