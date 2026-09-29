import { ArrowRight, ChefHat, Droplets, Sprout } from 'lucide-react'
import './FeaturedCourses.css'

const COURSES = [
  {
    id: 'fundamentos-nutricion',
    title: 'Fundamentos de nutrición saludable',
    description:
      'Aprende los principios clave para construir una alimentación equilibrada y sostenible.',
    price: '89',
    tone: 'sage',
    scene: 'bowl',
    category: 'Nutrición básica',
    icon: Sprout,
  },
  {
    id: 'habitos-alimenticios',
    title: 'Hábitos alimenticios para tu bienestar',
    description:
      'Descubre estrategias prácticas para mejorar tu rutina y sostener cambios reales.',
    price: '79',
    tone: 'sky',
    scene: 'bottle',
    category: 'Hábitos saludables',
    icon: Droplets,
  },
  {
    id: 'nutricion-practica',
    title: 'Nutrición práctica para el día a día',
    description:
      'Aplica conceptos simples y útiles para tomar mejores decisiones en tu alimentación.',
    price: '95',
    tone: 'mist',
    scene: 'board',
    category: 'Aplicación práctica',
    icon: ChefHat,
  },
]

/* ---------- Escenas de portada ---------- */

function BowlScene() {
  return (
    <svg
      className="courses-card__scene"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="scene-bowl-rim">
          <ellipse cx="160" cy="104" rx="80" ry="14" />
        </clipPath>
      </defs>

      <circle cx="252" cy="48" r="34" fill="rgba(255,255,255,0.5)" />
      <circle cx="66" cy="66" r="18" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="168" rx="90" ry="10" fill="rgba(23,63,103,0.07)" />

      <path
        d="M80 104 C80 142 116 158 160 158 C204 158 240 142 240 104 Z"
        fill="#FFFFFF"
      />
      <ellipse cx="160" cy="104" rx="80" ry="14" fill="#F3F8EF" />

      <g clipPath="url(#scene-bowl-rim)">
        <ellipse
          cx="124"
          cy="102"
          rx="26"
          ry="15"
          fill="#8FC269"
          transform="rotate(-12 124 102)"
        />
        <ellipse
          cx="158"
          cy="96"
          rx="24"
          ry="14"
          fill="#ACD285"
          transform="rotate(4 158 96)"
        />
        <ellipse
          cx="192"
          cy="101"
          rx="25"
          ry="15"
          fill="#7EB15B"
          transform="rotate(14 192 101)"
        />
        <circle cx="205" cy="93" r="15" fill="#B7D694" />
        <circle cx="205" cy="93" r="9" fill="#DCEBC4" />
        <circle cx="136" cy="94" r="6.5" fill="#E9CE85" />
        <circle cx="170" cy="100" r="6" fill="#E9CE85" />
        <circle cx="152" cy="88" r="5" fill="#E9CE85" />
      </g>

      <ellipse cx="160" cy="104" rx="80" ry="14" fill="none" stroke="#E1EEDB" strokeWidth="1.5" />

      <g transform="translate(252 132)">
        <ellipse cx="0" cy="0" rx="17" ry="24" fill="#B7D694" transform="rotate(18)" />
        <ellipse cx="0" cy="2" rx="11" ry="17" fill="#DCEBC4" transform="rotate(18)" />
        <circle cx="0" cy="17" r="4" fill="#A9834F" />
      </g>
      <g transform="translate(70 128)">
        <ellipse cx="0" cy="0" rx="14" ry="7" fill="#8FC269" transform="rotate(-24)" />
        <ellipse cx="16" cy="9" rx="12" ry="6" fill="#ACD285" transform="rotate(-4)" />
      </g>
    </svg>
  )
}

function BottleScene() {
  return (
    <svg
      className="courses-card__scene"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="scene-bottle-body">
          <path d="M120 94 C120 78 133 72 133 63 L133 52 L149 52 L149 63 C149 72 162 78 162 94 L162 150 a13 13 0 0 1 -13 13 L133 163 a13 13 0 0 1 -13 -13 Z" />
        </clipPath>
      </defs>

      <circle cx="72" cy="52" r="30" fill="rgba(255,255,255,0.45)" />
      <circle cx="268" cy="140" r="20" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="141" cy="172" rx="66" ry="9" fill="rgba(23,63,103,0.07)" />

      <g transform="rotate(-7 74 126)">
        <rect x="40" y="88" width="66" height="80" rx="9" fill="#FFFFFF" />
        <rect x="40" y="88" width="12" height="80" rx="6" fill="#E3EDF6" />
        <rect x="62" y="106" width="32" height="5" rx="2.5" fill="#D3E0EC" />
        <rect x="62" y="119" width="26" height="5" rx="2.5" fill="#D3E0EC" />
        <rect x="62" y="132" width="30" height="5" rx="2.5" fill="#D3E0EC" />
      </g>

      <path
        d="M120 94 C120 78 133 72 133 63 L133 52 L149 52 L149 63 C149 72 162 78 162 94 L162 150 a13 13 0 0 1 -13 13 L133 163 a13 13 0 0 1 -13 -13 Z"
        fill="#F1F7FC"
      />
      <g clipPath="url(#scene-bottle-body)">
        <rect x="112" y="102" width="58" height="70" fill="#BBD8EC" />
        <ellipse cx="141" cy="102" rx="29" ry="5" fill="#A8CBE4" />
        <rect x="126" y="72" width="7" height="96" rx="3.5" fill="rgba(255,255,255,0.7)" />
      </g>
      <path
        d="M120 94 C120 78 133 72 133 63 L133 52 L149 52 L149 63 C149 72 162 78 162 94 L162 150 a13 13 0 0 1 -13 13 L133 163 a13 13 0 0 1 -13 -13 Z"
        fill="none"
        stroke="#C9DDEC"
        strokeWidth="1.5"
      />
      <rect x="130" y="42" width="22" height="12" rx="4" fill="#2E5B87" />

      <g transform="translate(226 106)">
        <circle cx="0" cy="0" r="29" fill="#F3DFA6" />
        <circle cx="0" cy="0" r="23" fill="#FBEECB" />
        <circle cx="0" cy="0" r="23" fill="none" stroke="#EBD49A" strokeWidth="1.5" />
        <g stroke="#EBD49A" strokeWidth="1.6" strokeLinecap="round">
          <path d="M0 0 L0 -21" />
          <path d="M0 0 L14.8 -14.8" />
          <path d="M0 0 L21 0" />
          <path d="M0 0 L14.8 14.8" />
          <path d="M0 0 L0 21" />
          <path d="M0 0 L-14.8 14.8" />
          <path d="M0 0 L-21 0" />
          <path d="M0 0 L-14.8 -14.8" />
        </g>
      </g>

      <g transform="translate(206 160)">
        <ellipse cx="0" cy="0" rx="13" ry="7" fill="#8FC269" transform="rotate(-18)" />
        <ellipse cx="15" cy="7" rx="10" ry="5" fill="#ACD285" transform="rotate(8)" />
      </g>
    </svg>
  )
}

function BoardScene() {
  return (
    <svg
      className="courses-card__scene"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="scene-board-plate">
          <rect x="52" y="74" width="216" height="98" rx="16" />
        </clipPath>
      </defs>

      <circle cx="62" cy="46" r="28" fill="rgba(255,255,255,0.45)" />
      <circle cx="276" cy="58" r="16" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="160" cy="182" rx="104" ry="9" fill="rgba(23,63,103,0.06)" />

      <rect x="52" y="74" width="216" height="98" rx="16" fill="#E8DBC8" />
      <g clipPath="url(#scene-board-plate)">
        <rect x="52" y="74" width="216" height="98" fill="#E8DBC8" />
        <rect x="52" y="74" width="216" height="3" fill="#F2E9DB" />
        <rect x="52" y="106" width="216" height="2" fill="#DCCBB2" />
        <rect x="52" y="140" width="216" height="2" fill="#DCCBB2" />
      </g>
      <rect x="52" y="74" width="216" height="98" rx="16" fill="none" stroke="#DCCBB2" strokeWidth="1.5" />

      <g transform="translate(96 118)">
        <circle cx="0" cy="0" r="24" fill="#D9705E" />
        <circle cx="0" cy="2" r="24" fill="#E08A74" opacity="0.55" />
        <path
          d="M0 -24 L-7 -34 L7 -34 Z"
          fill="#5E8F4A"
        />
      </g>

      <g transform="translate(158 124) rotate(14)">
        <path d="M-34 0 L26 0 L14 -30 L-22 -30 Z" fill="#E89B5C" />
        <path d="M-22 -30 L14 -30 L10 -38 L-18 -38 Z" fill="#6FA653" />
        <path d="M-30 -8 L-8 -8" stroke="#D2864C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-18 -20 L2 -20" stroke="#D2864C" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g transform="translate(216 120)">
        <circle cx="-14" cy="-10" r="17" fill="#7EB15B" />
        <circle cx="10" cy="-16" r="15" fill="#8FC269" />
        <circle cx="0" cy="2" r="16" fill="#6FA653" />
        <rect x="-4" y="10" width="8" height="22" rx="4" fill="#C8DDB4" />
      </g>

      <g transform="translate(238 66) rotate(24)">
        <path d="M-34 -7 L12 -7 L12 7 L-34 7 Z" fill="#DCE4EC" />
        <path d="M12 -7 L26 0 L12 7 Z" fill="#C3D0DD" />
        <rect x="-52" y="-6" width="20" height="12" rx="5" fill="#2E5B87" />
      </g>

      <g transform="translate(72 166)">
        <ellipse cx="0" cy="0" rx="14" ry="8" fill="#ACD285" transform="rotate(-12)" />
        <ellipse cx="17" cy="8" rx="11" ry="6" fill="#8FC269" transform="rotate(10)" />
      </g>
    </svg>
  )
}

const SCENES = {
  bowl: BowlScene,
  bottle: BottleScene,
  board: BoardScene,
}

function CourseCover({ scene }) {
  const Scene = SCENES[scene] ?? BowlScene

  return (
    <div className="courses-card__cover">
      <Scene />
    </div>
  )
}

/* ---------- Sección ---------- */

export default function FeaturedCourses() {
  return (
    <section className="courses" id="cursos" aria-labelledby="courses-title">
      <div className="courses__container">
        <header className="courses__header">
          <div className="courses__heading">
            <p className="courses__eyebrow">Cursos</p>
            <h2 className="courses__title" id="courses-title">
              Cursos destacados
            </h2>
            <p className="courses__subtitle">
              Aprende a tu ritmo con contenido práctico y basado en evidencia.
            </p>
          </div>

          <a className="courses__link" href="/cursos">
            Ver todos los cursos
            <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
          </a>
        </header>

        <ul className="courses__grid">
          {COURSES.map(
            ({ id, title, description, price, tone, scene, category, icon: Icon }) => (
              <li className="courses-card" key={id}>
                <div className={`courses-card__media courses-card__media--${tone}`}>
                  <CourseCover scene={scene} />

                  <span className={`courses-card__pill courses-card__pill--${tone}`}>
                    <Icon size={12} strokeWidth={2.25} aria-hidden="true" />
                    {category}
                  </span>
                </div>

                <div className="courses-card__body">
                  <h3 className="courses-card__title">{title}</h3>
                  <p className="courses-card__text">{description}</p>

                  <div className="courses-card__footer">
                    <p className="courses-card__price">
                      <span className="courses-card__currency">S/</span>
                      {price}
                    </p>

                    <a
                      className="courses-card__cta"
                      href={`/cursos/${id}`}
                      aria-label={`Ver curso: ${title}`}
                    >
                      Ver curso
                      <span className="courses-card__cta-icon">
                        <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  )
}
