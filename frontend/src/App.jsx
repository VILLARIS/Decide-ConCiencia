import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer/Footer.jsx'
import Hero from './components/Hero/Hero.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import ServicesSection from './components/ServicesSection/ServicesSection.jsx'
import PurposeSection from './components/PurposeSection/PurposeSection.jsx'
import AboutSection from './components/AboutSection/AboutSection.jsx'
import TeamSection from './components/TeamSection/TeamSection.jsx'
import FinalCta from './components/FinalCta/FinalCta.jsx'

function smoothScrollToAnchor(hash) {
  if (!hash) return
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

/*
  HOME DE YUMIBIOTIC (EMPRESARIAL)
*/

function HomeView() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      smoothScrollToAnchor(location.hash)
    }
  }, [location])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesSection />
        <PurposeSection />
        <AboutSection />
        <TeamSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  if (location.pathname === '/') {
    return <HomeView />
  }
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}