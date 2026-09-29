import logo from './assets/logo.jpeg'
import AboutSection from './components/AboutSection/AboutSection.jsx'
import FeaturedCourses from './components/FeaturedCourses/FeaturedCourses.jsx'
import FinalCta from './components/FinalCta/FinalCta.jsx'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ServicesSection from './components/ServicesSection/ServicesSection.jsx'

function App() {
  return (
    <>
      <Navbar logo={logo} />
      <main>
        <Hero />
        <FeaturedCourses />
        <ServicesSection />
        <AboutSection />
        <FinalCta />
      </main>
      <Footer logo={logo} />
    </>
  )
}

export default App
