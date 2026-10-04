import AboutSection from '../../components/AboutSection/AboutSection.jsx'
import FinalCta from '../../components/FinalCta/FinalCta.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx'
import './AboutPage.css'

/*
  /quienes-somos

  El navbar apunta aqui, asi que la ruta tiene que existir de verdad: antes
  "Quienes Somos" iba a /about, que no estaba declarada y caia en la ruta
  comodin, mostrando el home en lugar de una pagina dequienes somos.

  No se inventa contenido nuevo: el bloque de presentacion es el AboutSection que
  ya aparece en el home, y el cierre es el FinalCta de siempre.
*/
export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="about-page__hero" aria-labelledby="about-page-title">
          <div className="about-page__container">
            <p className="about-page__eyebrow">Quiénes somos</p>

            <h1 className="about-page__title" id="about-page-title">
              Hagamos de la nutrición algo claro, práctico y basado en ciencia
            </h1>

            <p className="about-page__lead">
              Información confiable, herramientas prácticas y un enfoque humano para
              acompañar decisiones en nutrición, tanto en la vida diaria como en el
              trabajo profesional.
            </p>
          </div>
        </section>

        <AboutSection />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}