import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Leaf,
  Search,
  Sparkles,
  Timer,
  Layers,
} from 'lucide-react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import CoursesHero from '../../components/CoursesHero/CoursesHero.jsx'
import logo from '../../assets/logo.jpeg'
import './CoursesPage.css'

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'nutricion', label: 'Nutrición' },
  { id: 'habitos', label: 'Hábitos' },
  { id: 'bienestar', label: 'Bienestar' },
]

const SORT_OPTIONS = [
  { id: 'recientes', label: 'Más recientes' },
  { id: 'precio-asc', label: 'Precio menor' },
  { id: 'precio-desc', label: 'Precio mayor' },
]

const COURSES = [
  {
    id: 'bioquimica-aplicada-a-la-nutricion',
    category: 'nutricion',
    categoryLabel: 'Nutrición',
    title: 'Bioquímica aplicada a la Nutrición',
    description: 'Bases moleculares para aplicar la bioquímica en la práctica nutricional.',
    modules: 6,
    duration: '40 horas',
    price: 149,
    tone: 'sage',
    scene: 'label',
    icon: Leaf,
  },
  {
    id: 'introduccion-alimentacion-saludable',
    category: 'nutricion',
    categoryLabel: 'Nutrición',
    title: 'Introducción a la alimentación saludable',
    description: 'Bases prácticas para mejorar tu alimentación en el día a día.',
    modules: 12,
    duration: '3 horas',
    price: 89,
    tone: 'sage',
    scene: 'bowl',
    icon: Leaf,
  },
  {
    id: 'habitos-que-transforman',
    category: 'habitos',
    categoryLabel: 'Hábitos',
    title: 'Hábitos que transforman',
    description: 'Aprende a crear y mantener hábitos alimentarios sostenibles.',
    modules: 10,
    duration: '2.5 horas',
    price: 89,
    tone: 'sky',
    scene: 'loop',
    icon: Sparkles,
  },
  {
    id: 'planificacion-de-comidas',
    category: 'nutricion',
    categoryLabel: 'Nutrición',
    title: 'Planificación de comidas saludables',
    description: 'Organiza tus comidas de forma simple, práctica y realista.',
    modules: 8,
    duration: '2 horas',
    price: 79,
    tone: 'mist',
    scene: 'planner',
    icon: BookOpen,
  },
  {
    id: 'nutricion-bienestar-general',
    category: 'bienestar',
    categoryLabel: 'Bienestar',
    title: 'Nutrición para el bienestar general',
    description: 'Cuida tu energía, sueño y bienestar con una alimentación equilibrada.',
    modules: 10,
    duration: '2 horas',
    price: 89,
    tone: 'sky',
    scene: 'sleep',
    icon: HeartPulse,
  },
  {
    id: 'lectura-de-etiquetas',
    category: 'nutricion',
    categoryLabel: 'Nutrición',
    title: 'Lectura de etiquetas alimentarias',
    description: 'Aprende a elegir mejor en el supermercado y tomar decisiones informadas.',
    modules: 8,
    duration: '1.5 horas',
    price: 69,
    tone: 'sage',
    scene: 'label',
    icon: ChefHat,
  },
  {
    id: 'nutricion-y-ejercicio',
    category: 'habitos',
    categoryLabel: 'Hábitos',
    title: 'Nutrición y ejercicio',
    description: 'Optimiza tu rendimiento y recuperación con una alimentación adecuada.',
    modules: 10,
    duration: '2.5 horas',
    price: 89,
    tone: 'mist',
    scene: 'move',
    icon: Dumbbell,
  },
]

const PAGES = [1, 2, 3]

/* ---------- Escenas de portada ---------- */

function CoverBase({ tone = 'sage', children }) {
  return (
    <div className={`catalog-card__cover catalog-card__cover--${tone}`}>{children}</div>
  )
}

function BowlScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="254" cy="42" r="30" fill="rgba(255,255,255,0.5)" />
      <circle cx="62" cy="58" r="16" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="152" rx="86" ry="9" fill="rgba(23,63,103,0.07)" />
      <path d="M86 96 C86 130 118 145 160 145 C202 145 234 130 234 96 Z" fill="#FFFFFF" />
      <ellipse cx="160" cy="96" rx="74" ry="13" fill="#F3F8EF" />
      <ellipse cx="126" cy="94" rx="24" ry="13" fill="#8FC269" transform="rotate(-12 126 94)" />
      <ellipse cx="158" cy="89" rx="22" ry="12" fill="#ACD285" transform="rotate(4 158 89)" />
      <ellipse cx="190" cy="93" rx="23" ry="13" fill="#7EB15B" transform="rotate(14 190 93)" />
      <circle cx="200" cy="86" r="13" fill="#B7D694" />
      <circle cx="200" cy="86" r="7.5" fill="#DCEBC4" />
      <circle cx="140" cy="86" r="5.5" fill="#E9CE85" />
      <circle cx="168" cy="92" r="5" fill="#E9CE85" />
      <ellipse cx="160" cy="96" rx="74" ry="13" fill="none" stroke="#E1EEDB" strokeWidth="1.5" />
      <g transform="translate(242 122)">
        <ellipse rx="14" ry="20" fill="#B7D694" transform="rotate(18)" />
        <ellipse cy="2" rx="9" ry="14" fill="#DCEBC4" transform="rotate(18)" />
        <circle cy="14" r="3.5" fill="#A9834F" />
      </g>
    </svg>
  )
}

function LoopScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="66" cy="46" r="26" fill="rgba(255,255,255,0.45)" />
      <circle cx="268" cy="128" r="18" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="156" rx="72" ry="8" fill="rgba(23,63,103,0.06)" />
      <path
        d="M104 104 a44 44 0 1 1 20 38"
        fill="none"
        stroke="#BBD3E8"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M124 142 a44 44 0 0 0 20 -38"
        fill="none"
        stroke="#8FC269"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M112 132 l14 12 l-3 -19 Z" fill="#7EB15B" />
      <circle cx="160" cy="92" r="17" fill="#FFFFFF" stroke="#C3D8EA" strokeWidth="1.5" />
      <path d="M160 83 v9 l6 4" stroke="#2E5B87" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <g transform="translate(232 52)">
        <ellipse rx="13" ry="18" fill="#8FC269" transform="rotate(24)" />
        <ellipse cx="-4" cy="6" rx="9" ry="13" fill="#ACD285" transform="rotate(24)" />
      </g>
      <g transform="translate(84 58)">
        <ellipse rx="12" ry="6" fill="#ACD285" transform="rotate(-18)" />
        <ellipse cx="15" cy="6" rx="10" ry="5" fill="#8FC269" transform="rotate(12)" />
      </g>
    </svg>
  )
}

function PlannerScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="58" cy="44" r="26" fill="rgba(255,255,255,0.45)" />
      <circle cx="278" cy="56" r="15" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="158" rx="96" ry="8" fill="rgba(23,63,103,0.06)" />
      <rect x="58" y="46" width="204" height="104" rx="14" fill="#FFFFFF" stroke="#D6E5E0" strokeWidth="1.5" />
      <rect x="58" y="46" width="204" height="26" rx="14" fill="#EAF3F0" />
      <rect x="58" y="60" width="204" height="12" fill="#EAF3F0" />
      <rect x="74" y="54" width="42" height="6" rx="3" fill="#7EB15B" />
      <g stroke="#E3EDEA" strokeWidth="1.5">
        <path d="M58 96 H262" />
        <path d="M58 122 H262" />
        <path d="M126 72 V150" />
        <path d="M194 72 V150" />
      </g>
      <rect x="70" y="104" width="46" height="12" rx="6" fill="#D3E7DE" />
      <rect x="138" y="80" width="46" height="12" rx="6" fill="#BBD8EC" />
      <rect x="206" y="130" width="44" height="12" rx="6" fill="#DCEBC4" />
      <rect x="70" y="130" width="46" height="12" rx="6" fill="#E6EDF4" />
      <g transform="translate(238 34)">
        <ellipse rx="11" ry="6" fill="#8FC269" transform="rotate(-20)" />
      </g>
    </svg>
  )
}

function SleepScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="252" cy="50" r="30" fill="rgba(255,255,255,0.5)" />
      <circle cx="70" cy="62" r="17" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="152" rx="80" ry="8" fill="rgba(23,63,103,0.06)" />
      <path
        d="M186 52 a44 44 0 1 0 24 60 a36 36 0 0 1 -24 -60 Z"
        fill="#BBD8EC"
      />
      <path
        d="M132 74 c-7 8 -11 18 -11 28 a30 30 0 0 0 46 17 c-6 3 -13 4 -20 2 a34 34 0 0 1 -15 -47 Z"
        fill="#DCE9F4"
      />
      <g fill="none" stroke="#BBD8EC" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M96 46 q6 -6 12 0" />
        <path d="M84 64 q6 -6 12 0" />
      </g>
      <g transform="translate(224 128)">
        <circle r="15" fill="#8FC269" />
        <circle r="9" fill="#DCEBC4" />
      </g>
      <g transform="translate(92 132)">
        <ellipse rx="14" ry="7" fill="#ACD285" transform="rotate(-14)" />
        <ellipse cx="17" cy="7" rx="11" ry="6" fill="#8FC269" transform="rotate(12)" />
      </g>
    </svg>
  )
}

function LabelScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="66" cy="48" r="28" fill="rgba(255,255,255,0.45)" />
      <circle cx="272" cy="132" r="18" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="156" rx="78" ry="8" fill="rgba(23,63,103,0.06)" />
      <rect x="88" y="40" width="144" height="106" rx="16" fill="#FFFFFF" stroke="#DDE8D3" strokeWidth="1.5" />
      <rect x="104" y="58" width="70" height="9" rx="4.5" fill="#7EB15B" />
      <rect x="104" y="76" width="112" height="7" rx="3.5" fill="#E1EEDB" />
      <rect x="104" y="92" width="92" height="7" rx="3.5" fill="#E9F0E3" />
      <rect x="104" y="108" width="52" height="7" rx="3.5" fill="#E9F0E3" />
      <rect x="104" y="124" width="80" height="7" rx="3.5" fill="#E9F0E3" />
      <g transform="translate(238 96)">
        <path d="M-30 -12 L34 -12 L34 12 L-30 12 Z" fill="#EAF1F8" />
        <path d="M34 -12 L50 0 L34 12 Z" fill="#D3E0EC" />
        <circle cx="-8" cy="0" r="9" fill="#FFFFFF" stroke="#BBD8EC" strokeWidth="2" />
        <path d="M-16 0 L-11 5 L1 -6" fill="none" stroke="#62B747" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g transform="translate(78 138)">
        <ellipse rx="12" ry="6" fill="#8FC269" transform="rotate(-16)" />
        <ellipse cx="15" cy="6" rx="10" ry="5" fill="#ACD285" transform="rotate(10)" />
      </g>
    </svg>
  )
}

function MoveScene() {
  return (
    <svg className="catalog-card__scene" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <circle cx="60" cy="50" r="26" fill="rgba(255,255,255,0.45)" />
      <circle cx="266" cy="58" r="16" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="154" rx="90" ry="8" fill="rgba(23,63,103,0.06)" />
      <g stroke="#9AA9B8" strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M96 84 L128 84" />
        <path d="M96 84 L112 68" />
        <path d="M96 84 L112 100" />
        <path d="M224 84 L192 84" />
        <path d="M224 84 L208 68" />
        <path d="M224 84 L208 100" />
      </g>
      <rect x="128" y="66" width="64" height="36" rx="10" fill="#7EB15B" />
      <rect x="140" y="76" width="40" height="4" rx="2" fill="#DCEBC4" />
      <rect x="140" y="86" width="26" height="4" rx="2" fill="#DCEBC4" />
      <g transform="translate(160 132)">
        <ellipse cx="-24" cy="0" rx="15" ry="11" fill="#F3DFA6" />
        <ellipse cx="24" cy="0" rx="15" ry="11" fill="#E9CE85" />
        <ellipse cx="0" cy="0" rx="13" ry="13" fill="#FFFFFF" stroke="#DCEBC4" strokeWidth="1.5" />
      </g>
      <g transform="translate(254 116)">
        <ellipse rx="12" ry="6" fill="#8FC269" transform="rotate(-20)" />
      </g>
    </svg>
  )
}

const SCENES = {
  bowl: BowlScene,
  loop: LoopScene,
  planner: PlannerScene,
  sleep: SleepScene,
  label: LabelScene,
  move: MoveScene,
}

export default function CoursesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('todos')
  const [sort, setSort] = useState('recientes')
  const [page, setPage] = useState(1)

  const visibleCourses = COURSES.filter((course) => {
    const matchesCategory = category === 'todos' || course.category === category
    const term = query.trim().toLowerCase()
    const matchesQuery =
      term === '' ||
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    return matchesCategory && matchesQuery
  })

  const sortedCourses = [...visibleCourses].sort((a, b) => {
    if (sort === 'precio-asc') return a.price - b.price
    if (sort === 'precio-desc') return b.price - a.price
    return 0
  })

  return (
    <>
      <Navbar />

      <main className="courses-catalog">
        {/* ---------- 1. Cabecera ---------- */}
        <CoursesHero />

        {/* ---------- 2. Barra de exploración ---------- */}
        <section className="courses-toolbar" aria-label="Explorar cursos">
          <div className="courses-toolbar__container">
            <div className="courses-toolbar__inner">
              <div className="courses-search">
                <Search size={17} strokeWidth={1.9} aria-hidden="true" />
                <input
                  className="courses-search__input"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Buscar cursos..."
                  aria-label="Buscar cursos"
                />
              </div>

              <ul className="courses-categories">
                {CATEGORIES.map(({ id, label }) => (
                  <li key={id}>
                    <button
                      className={`courses-category${
                        category === id ? ' courses-category--active' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setCategory(id)
                        setPage(1)
                      }}
                      aria-pressed={category === id}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              <label className="courses-sort">
                <span className="courses-sort__label">Ordenar por</span>
                <select
                  className="courses-sort__select"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Ordenar cursos"
                >
                  {SORT_OPTIONS.map(({ id, label }) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
              </label>
            </div>
          </div>
        </section>

        {/* ---------- 3. Grid ---------- */}
        <section className="courses-catalog__section" aria-labelledby="catalog-title">
          <div className="courses-catalog__container">
            <div className="courses-catalog__head">
              <h2 className="courses-catalog__title" id="catalog-title">
                Catálogo de cursos
              </h2>
              <p className="courses-catalog__count">
                {sortedCourses.length}{' '}
                {sortedCourses.length === 1 ? 'curso disponible' : 'cursos disponibles'}
              </p>
            </div>

            {sortedCourses.length > 0 ? (
              <ul className="courses-catalog__grid">
                {sortedCourses.map((course) => {
                  const Scene = SCENES[course.scene] ?? BowlScene

                  return (
                    <li className="catalog-card" key={course.id}>
                      <div className="catalog-card__media">
                        <CoverBase tone={course.tone}>
                          <Scene />
                        </CoverBase>

                        <span className={`catalog-card__pill catalog-card__pill--${course.tone}`}>
                          {course.categoryLabel}
                        </span>
                      </div>

                      <div className="catalog-card__body">
                        <h3 className="catalog-card__title">{course.title}</h3>
                        <p className="catalog-card__text">{course.description}</p>

                        <ul className="catalog-card__meta">
                          <li className="catalog-card__meta-item">
                            <Layers size={14} strokeWidth={1.9} aria-hidden="true" />
                            {course.modules} módulos
                          </li>
                          <li className="catalog-card__meta-item">
                            <Timer size={14} strokeWidth={1.9} aria-hidden="true" />
                            {course.duration}
                          </li>
                        </ul>

                        <div className="catalog-card__footer">
                          <p className="catalog-card__price">
                            <span className="catalog-card__currency">S/</span>
                            {course.price}
                          </p>

                          <Link
                            className="catalog-card__cta"
                            to={`/cursos/${course.id}`}
                            aria-label={`Ver curso: ${course.title}`}
                          >
                            Ver curso
                            <ArrowRight size={15} strokeWidth={2.25} aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="courses-catalog__empty">
                No encontramos cursos con esa búsqueda. Prueba con otro término o
                selecciona otra categoría.
              </p>
            )}

            {/* ---------- 4. Paginación ---------- */}
            <nav className="courses-pagination" aria-label="Paginación de cursos">
              <button
                className="courses-pagination__arrow"
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                aria-label="Página anterior"
              >
                <ChevronLeft size={17} strokeWidth={2.1} aria-hidden="true" />
              </button>

              <ul className="courses-pagination__pages">
                {PAGES.map((item) => (
                  <li key={item}>
                    <button
                      className={`courses-pagination__page${
                        page === item ? ' courses-pagination__page--active' : ''
                      }`}
                      type="button"
                      onClick={() => setPage(item)}
                      aria-current={page === item ? 'page' : undefined}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                className="courses-pagination__arrow"
                type="button"
                disabled={page === PAGES.length}
                onClick={() => setPage((current) => Math.min(PAGES.length, current + 1))}
                aria-label="Página siguiente"
              >
                <ChevronRight size={17} strokeWidth={2.1} aria-hidden="true" />
              </button>
            </nav>
          </div>
        </section>

        {/* ---------- 5. Franja de ayuda ---------- */}
        <section className="courses-help" aria-labelledby="courses-help-title">
          <div className="courses-help__container">
            <div className="courses-help__panel">
              <span className="courses-help__icon" aria-hidden="true">
                <Leaf size={18} strokeWidth={1.8} />
              </span>

              <div className="courses-help__copy">
                <p className="courses-help__eyebrow">¿No sabes por dónde empezar?</p>

                <h2 className="courses-help__title" id="courses-help-title">
                  Te ayudo a encontrar el curso ideal
                </h2>

                <p className="courses-help__text">
                  Si tienes dudas, puedes revisar nuestros servicios o escribirme.
                </p>
              </div>

              <Link className="courses-help__button" to="/servicios">
                Conocer servicios
                <ArrowRight size={16} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer logo={logo} />
    </>
  )
}
