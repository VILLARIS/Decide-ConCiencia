import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Infinity as InfinityIcon,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Video,
  Wifi,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer.jsx'
import Navbar from '../../components/Navbar/Navbar.jsx'
import logo from '../../assets/logo.jpeg'
import yuliaAvatar from '../../assets/avatarHero.png'
import { useDemoAuth } from '../../demo/demoAuthStore'
import { useDemoPurchases } from '../../demo/demoPurchaseStore'
import { rememberPendingCheckout, BUY_ACTION, resolveBuyAction } from '../../demo/demoPendingCheckout'
import { getCourseById } from '../../demo/demoCatalog'
import './CourseDetailPage.css'

/*
  Pagina de detalle comercial de un curso.

  Prototipo visual: sin backend ni pasarela. El CTA "Comprar ahora" respeta la
  sesion demo: con sesion va al checkout, sin sesion recuerda el curso y
  devuelve al acceso, que luego devuelve al checkout.

  El desplegable de modulos y el FAQ usan <details>/<summary> nativos, que no
  requieren logica de React ni estado.
*/

/* Ficha comercial de referencia. Los precios salen del catalogo demo. */
const CATALOG_COURSE = getCourseById('bioquimica-aplicada-a-la-nutricion')

const COURSE = {
  slug: CATALOG_COURSE.slug,
  badge: 'Curso destacado',
  title: CATALOG_COURSE.title,
  description:
    'Comprende cómo funcionan los nutrientes a nivel molecular y aprende a aplicar la bioquímica en la práctica nutricional con un enfoque claro, actual y basado en evidencia.',
  price: CATALOG_COURSE.price,
  previousPrice: CATALOG_COURSE.previousPrice,
  discount: CATALOG_COURSE.discountLabel,
  meta: [
    { id: 'duracion', label: CATALOG_COURSE.duration, icon: Timer },
    { id: 'modalidad', label: CATALOG_COURSE.modality, icon: Wifi },
    { id: 'certificado', label: CATALOG_COURSE.certificate, icon: Award },
    { id: 'acceso', label: CATALOG_COURSE.access, icon: Clock },
    { id: 'nivel', label: 'Nivel intermedio', icon: GraduationCap },
  ],
  highlights: [
    'Nutrición basada en la ciencia',
    'De la teoría a la práctica',
    'Casos reales y aplicados',
    'Acompañamiento docente',
  ],
}

const LEARNINGS = [
  'Comprender el metabolismo de carbohidratos, lípidos y proteínas.',
  'Relacionar la bioquímica con la evaluación y el plan nutricional.',
  'Analizar casos clínicos con base en evidencia científica.',
  'Aplicar el conocimiento bioquímico en la práctica profesional.',
  'Desarrollar pensamiento crítico para la toma de decisiones.',
]

const AUDIENCES = [
  {
    id: 'formacion',
    title: 'Estás en formación',
    text: 'Estudiantes de Nutrición que buscan bases sólidas.',
    icon: BookOpen,
  },
  {
    id: 'profesional',
    title: 'Eres profesional',
    text: 'Nutricionistas que desean actualizar y fortalecer conocimientos.',
    icon: Target,
  },
  {
    id: 'pasion',
    title: 'Te apasiona',
    text: 'La ciencia de la nutrición y su aplicación en la vida real.',
    icon: Sparkles,
  },
  {
    id: 'evidencia',
    title: 'Buscas evidencia',
    text: 'Quieres tomar mejores decisiones en tu práctica diaria.',
    icon: FileText,
  },
]

const MODULES = [
  {
    id: 'm1',
    number: '01',
    title: 'Fundamentos de bioquímica en nutrición',
    lessons: [
      'Qué es la bioquímica y por qué importa en nutrición',
      'Estructura y función de biomoléculas',
      'Enzimas: cómo catalizan las reacciones',
    ],
    classes: 4,
    hours: 6,
  },
  {
    id: 'm2',
    number: '02',
    title: 'Metabolismo de carbohidratos',
    lessons: ['Glucólisis y producción de ATP', 'Glucogenogénesis y glucogenólisis', 'Vía pentosa fosfato'],
    classes: 5,
    hours: 7,
  },
  {
    id: 'm3',
    number: '03',
    title: 'Lípidos y metabolismo energético',
    lessons: ['Digestión y absorción de grasas', 'Beta oxidación', 'Lipoproteínas y transporte'],
    classes: 5,
    hours: 7,
  },
  {
    id: 'm4',
    number: '04',
    title: 'Proteínas y aminoácidos',
    lessons: ['Aminoácidos esenciales', 'Balance nitrogenado', 'Proteínas en la dieta'],
    classes: 4,
    hours: 6,
  },
  {
    id: 'm5',
    number: '05',
    title: 'Integración metabólica',
    lessons: ['Interrelación de vías metabólicas', 'Regulación hormonal', 'Estrés metabólico y ayuno'],
    classes: 5,
    hours: 7,
  },
  {
    id: 'm6',
    number: '06',
    title: 'Aplicación clínica y casos',
    lessons: ['Análisis de casos clínicos', 'Interpretación de laboratorio', 'Discusión y cierre'],
    classes: 5,
    hours: 7,
  },
]

const INCLUDES = [
  { id: 'video', text: '40 horas de contenido en video', icon: Video },
  { id: 'materiales', text: 'Materiales descargables', icon: Download },
  { id: 'certificado', text: 'Certificado de finalización', icon: Award },
  { id: 'acceso', text: 'Acceso por 12 meses', icon: Clock },
  { id: 'ritmo', text: 'Aprendizaje a tu ritmo', icon: InfinityIcon },
  { id: 'soporte', text: 'Soporte académico', icon: MessageCircle },
]

const FAQ = [
  {
    id: 'faq-1',
    question: '¿Necesito conocimientos previos?',
    answer:
      'Está pensado para quienes tienen una base inicial en nutrición o bioquímica. El nivel es intermedio, pero el curso repasa los conceptos fundamentales antes de avanzar.',
  },
  {
    id: 'faq-2',
    question: '¿Cuánto tiempo tendré acceso al curso?',
    answer: 'El acceso al contenido está planteado por 12 meses desde la inscripción. El detalle definitivo se comunicará al momento de la compra.',
  },
  {
    id: 'faq-3',
    question: '¿El curso incluye certificado?',
    answer:
      'Al completar los requisitos del curso podrás obtener un certificado de finalización. Los detalles sobre su emisión se confirmarán antes del inicio.',
  },
  {
    id: 'faq-4',
    question: '¿Puedo avanzar a mi propio ritmo?',
    answer: 'Sí. Las clases están grabadas y se consultan a tu ritmo, dentro del periodo de acceso.',
  },
  {
    id: 'faq-5',
    question: '¿Cómo se realiza la evaluación?',
    answer:
      'La forma de evaluación está en definición y se comunicará antes del inicio del curso.',
  },
]

/* ---------- Portada del curso: escena SVG propia ---------- */

function CourseCover() {
  return (
    <svg
      className="course-cover__scene"
      viewBox="0 0 560 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="560" height="400" fill="#EAF1F8" />

      {/* Círculos suaves de fondo */}
      <circle cx="452" cy="74" r="54" fill="rgba(255,255,255,0.55)" />
      <circle cx="96" cy="330" r="40" fill="rgba(255,255,255,0.45)" />
      <circle cx="486" cy="318" r="26" fill="rgba(98,183,71,0.10)" />

      {/* Mesa / plano de trabajo */}
      <ellipse cx="288" cy="352" rx="196" ry="20" fill="rgba(23,63,103,0.07)" />
      <rect x="96" y="300" width="392" height="8" rx="4" fill="#FFFFFF" />
      <rect x="96" y="300" width="392" height="8" rx="4" fill="none" stroke="#D8E4EF" strokeWidth="1" />

      {/* Matraz de Erlenmeyer */}
      <g transform="translate(150 150)">
        <path
          d="M28 0 h40 v46 l44 92 c8 16 -2 30 -18 30 h-92 c-16 0 -26 -14 -18 -30 l44 -92 Z"
          fill="#FFFFFF"
          stroke="#BBD3E8"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 132 h96 c6 13 -1 24 -16 24 h-64 c-15 0 -22 -11 -16 -24 Z"
          fill="#8FC269"
        />
        <path d="M22 108 h80 l14 30 c5 10 -1 18 -11 18 h-86 c-10 0 -16 -8 -11 -18 Z" fill="#ACD285" opacity="0.55" />
        <circle cx="44" cy="140" r="5" fill="#DCEBC4" />
        <circle cx="70" cy="146" r="3.4" fill="#EAF3E0" />
        <rect x="24" y="-8" width="48" height="12" rx="6" fill="#BBD3E8" />
      </g>

      {/* Microscopio */}
      <g transform="translate(330 168)">
        <rect x="52" y="0" width="14" height="26" rx="4" fill="#2E5B87" />
        <rect x="42" y="22" width="34" height="14" rx="7" fill="#173F67" />
        <path d="M59 36 L59 92" stroke="#2E5B87" strokeWidth="9" strokeLinecap="round" />
        <rect x="30" y="92" width="58" height="10" rx="5" fill="#173F67" />
        <rect x="36" y="102" width="46" height="26" rx="8" fill="#BBD3E8" />
        <path d="M6 130 h100 l-8 22 h-84 Z" fill="#2E5B87" />
        <rect x="18" y="104" width="76" height="8" rx="4" fill="#8FC269" />
      </g>

      {/* Molecula */}
      <g transform="translate(438 158)">
        <g stroke="#8FB4D4" strokeWidth="2.6">
          <path d="M0 22 L34 0 L68 22 L68 62 L34 84 L0 62 Z" fill="none" />
          <path d="M34 0 L34 84" />
        </g>
        <circle cx="0" cy="22" r="8" fill="#62B747" />
        <circle cx="34" cy="0" r="8" fill="#2E5B87" />
        <circle cx="68" cy="22" r="6" fill="#8FC269" />
        <circle cx="68" cy="62" r="8" fill="#2E5B87" />
        <circle cx="34" cy="84" r="6" fill="#62B747" />
        <circle cx="0" cy="62" r="6" fill="#8FC269" />
      </g>

      {/* Hojas */}
      <g transform="translate(66 96)">
        <ellipse rx="15" ry="9" fill="#8FC269" transform="rotate(-22)" />
        <ellipse cx="19" cy="8" rx="12" ry="7" fill="#ACD285" transform="rotate(16)" />
        <ellipse cx="6" cy="24" rx="10" ry="6" fill="#7EB15B" transform="rotate(8)" />
      </g>
      <g transform="translate(262 78)">
        <ellipse rx="12" ry="7" fill="#ACD285" transform="rotate(-16)" />
        <ellipse cx="16" cy="7" rx="9" ry="5" fill="#8FC269" transform="rotate(14)" />
      </g>
    </svg>
  )
}

/* ---------- Miniatura de certificado ---------- */

function CertificatePreview() {
  return (
    <svg
      className="course-certificate__preview"
      viewBox="0 0 420 260"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Vista previa de un certificado de finalización"
    >
      <rect width="420" height="260" rx="10" fill="#FFFFFF" stroke="#D8E4EF" strokeWidth="2" />
      <rect x="16" y="16" width="388" height="228" rx="6" fill="#F7FAFC" />
      <rect x="24" y="24" width="372" height="212" rx="4" fill="none" stroke="#DCE7F0" strokeWidth="1.5" />

      <g transform="translate(178 44)">
        <circle cx="32" cy="26" r="26" fill="#EAF1F8" />
        <circle cx="32" cy="26" r="19" fill="#8FC269" />
        <path d="M23 26 l6 7 l12 -13" fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 44 l-8 12 l14 -3 Z" fill="#ACD285" />
        <path d="M50 44 l8 12 l-14 -3 Z" fill="#ACD285" />
      </g>

      <rect x="140" y="108" width="140" height="9" rx="4.5" fill="#173F67" />
      <rect x="168" y="127" width="84" height="6" rx="3" fill="#C3D8EA" />
      <rect x="124" y="146" width="172" height="5" rx="2.5" fill="#E3ECF4" />
      <rect x="148" y="158" width="124" height="5" rx="2.5" fill="#E3ECF4" />

      <path d="M286 168 v22" stroke="#B9CBDD" strokeWidth="2" />
      <path d="M286 190 l-10 10 l10 -3 l10 3 Z" fill="#8FC269" />
      <rect x="112" y="206" width="96" height="5" rx="2.5" fill="#DDE7F0" />
      <rect x="316" y="206" width="60" height="5" rx="2.5" fill="#DDE7F0" />
    </svg>
  )
}

export default function CourseDetailPage() {
  const totalClasses = MODULES.reduce((sum, module) => sum + module.classes, 0)
  const totalHours = MODULES.reduce((sum, module) => sum + module.hours, 0)

  const navigate = useNavigate()
  const { isAuthenticated } = useDemoAuth()
  const { hasEnrollment } = useDemoPurchases()
  const isEnrolled = hasEnrollment(CATALOG_COURSE.id)

  /*
    Esta pagina es PUBLICA: se lee la sesion, pero nunca la exige ni la cierra.
    La unica vez que se pide un acceso es al pulsar "Comprar ahora", y la regla
    la decide resolveBuyAction (ver demoPendingCheckout):

    - sin sesion -> se guarda la intencion y se va al acceso, que devuelve al
      checkout del MISMO curso;
    - con sesion y ya inscrita -> se abre el contenido desde Mi aprendizaje;
    - con sesion sin compra -> checkout de este curso.
  */
  const handleBuy = () => {
    const action = resolveBuyAction({ isAuthenticated, isEnrolled })

    if (action === BUY_ACTION.login) {
      rememberPendingCheckout(CATALOG_COURSE.id)
      navigate('/acceso', { state: { from: `/checkout/${CATALOG_COURSE.id}` } })
      return
    }

    /* El contenido del curso vive en el area de estudiante, no en esta ficha
       comercial: por eso "Ir al curso" entra a Mi aprendizaje. */
    if (action === BUY_ACTION.course) {
      navigate('/mi-aprendizaje')
      return
    }

    navigate(`/checkout/${CATALOG_COURSE.id}`)
  }

  /* Microcopy bajo el CTA: confianza sin sonar a tienda. */
  const buyMicrocopy = (
    <ul className="course-buy__assurance">
      <li>
        <ShieldCheck size={14} strokeWidth={1.9} aria-hidden="true" />
        Pago seguro
      </li>
      <li>
        <BadgeCheck size={14} strokeWidth={1.9} aria-hidden="true" />
        Acceso después de confirmar el pago
      </li>
      <li>
        <Award size={14} strokeWidth={1.9} aria-hidden="true" />
        Certificado al completar el curso
      </li>
    </ul>
  )

  return (
    <>
      <Navbar />

      <main className="course-page">
        {/* ---------- 1. Hero ---------- */}
        <section className="course-hero" aria-labelledby="course-title">
          <div className="course-hero__container">
            <nav className="course-breadcrumb" aria-label="Ruta de navegación">
              <Link to="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <Link to="/cursos">Cursos</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{COURSE.title}</span>
            </nav>

            <div className="course-hero__grid">
              <div className="course-hero__info">
                <p className="course-hero__badge">{COURSE.badge}</p>

                <h1 className="course-hero__title" id="course-title">
                  {COURSE.title}
                </h1>

                <p className="course-hero__description">{COURSE.description}</p>

                <ul className="course-hero__meta">
                  {COURSE.meta.map(({ id, label, icon: Icon }) => (
                    <li className="course-hero__meta-item" key={id}>
                      <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>

                <div className="course-hero__price">
                  <span className="course-hero__price-current">
                    <span className="course-price__currency">S/</span>
                    {COURSE.price}
                  </span>
                  <span className="course-hero__price-previous">
                    S/ {COURSE.previousPrice}
                  </span>
                  <span className="course-hero__price-discount">{COURSE.discount}</span>
                </div>

                <div className="course-hero__actions">
                  <button
                    className="course-btn course-btn--primary"
                    type="button"
                    onClick={handleBuy}
                  >
                    {isEnrolled ? 'Ir al curso' : 'Comprar ahora'}
                    <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
                  </button>
                  <a className="course-btn course-btn--ghost" href="#contenido">
                    Ver temario
                  </a>
                </div>

                {!isEnrolled ? (
                  <ul className="course-buy__assurance course-buy__assurance--hero">
                    <li>
                      <ShieldCheck size={14} strokeWidth={1.9} aria-hidden="true" />
                      Pago seguro
                    </li>
                    <li>
                      <BadgeCheck size={14} strokeWidth={1.9} aria-hidden="true" />
                      Acceso después de confirmar el pago
                    </li>
                    <li>
                      <Award size={14} strokeWidth={1.9} aria-hidden="true" />
                      Certificado al completar el curso
                    </li>
                  </ul>
                ) : (
                  <p className="course-hero__enrolled-note">
                    <BadgeCheck size={15} strokeWidth={2} aria-hidden="true" />
                    Ya estás inscrita en este curso.
                  </p>
                )}
              </div>

              <div className="course-hero__media">
                <div className="course-cover">
                  <CourseCover />
                  <button
                    className="course-cover__play"
                    type="button"
                    aria-label="Ver video de presentación del curso"
                  >
                    <Play size={22} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>

                <p className="course-cover__caption">Ver video de presentación</p>

                <ul className="course-highlights">
                  {COURSE.highlights.map((item) => (
                    <li className="course-highlight" key={item}>
                      <Check size={15} strokeWidth={2.6} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 2. Contenido + sidebar ---------- */}
        <section className="course-body" aria-label="Detalle del curso">
          <div className="course-body__container">
            <div className="course-body__main">
              {/* Qué aprenderás */}
              <section className="course-block" aria-labelledby="course-learn-title">
                <h2 className="course-block__title" id="course-learn-title">
                  Qué aprenderás
                </h2>

                <ul className="course-learn__list">
                  {LEARNINGS.map((item) => (
                    <li className="course-learn__item" key={item}>
                      <span className="course-learn__check" aria-hidden="true">
                        <Check size={14} strokeWidth={2.8} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Para quién */}
              <section className="course-block" aria-labelledby="course-audience-title">
                <h2 className="course-block__title" id="course-audience-title">
                  Este curso es para ti si...
                </h2>

                <ul className="course-audience__grid">
                  {AUDIENCES.map(({ id, title, text, icon: Icon }) => (
                    <li className="course-audience" key={id}>
                      <span className="course-audience__icon" aria-hidden="true">
                        <Icon size={17} strokeWidth={1.8} />
                      </span>
                      <h3 className="course-audience__title">{title}</h3>
                      <p className="course-audience__text">{text}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Contenido del curso */}
              <section className="course-block" id="contenido" aria-labelledby="course-syllabus-title">
                <h2 className="course-block__title" id="course-syllabus-title">
                  Contenido del curso
                </h2>

                <ul className="course-summary">
                  <li>6 módulos</li>
                  <li>{totalClasses} clases</li>
                  <li>{totalHours} horas</li>
                </ul>

                <div className="course-modules">
                  {MODULES.map((module, index) => (
                    <details className="course-module" key={module.id} open={index === 0}>
                      <summary className="course-module__summary">
                        <span className="course-module__number">{module.number}</span>
                        <span className="course-module__title">{module.title}</span>
                        <span className="course-module__meta">
                          {module.classes} clases · {module.hours} horas
                        </span>
                        <ChevronDown className="course-module__chevron" size={18} aria-hidden="true" />
                      </summary>

                      <ul className="course-module__lessons">
                        {module.lessons.map((lesson) => (
                          <li className="course-module__lesson" key={lesson}>
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              </section>

              {/* Docente */}
              <section className="course-block" aria-labelledby="course-teacher-title">
                <h2 className="course-block__title" id="course-teacher-title">
                  Dictado por
                </h2>

                <div className="course-teacher">
                  <img
                    className="course-teacher__avatar"
                    src={yuliaAvatar}
                    alt="Retrato de la Dra. Yulia"
                    width="1122"
                    height="1402"
                    decoding="async"
                  />

                  <div className="course-teacher__copy">
                    <p className="course-teacher__name">Dra. Yulia</p>
                    <p className="course-teacher__role">Nutricionista · Educadora</p>
                    <p className="course-teacher__text">
                      Especialista en bioquímica nutricional y docencia.
                    </p>
                  </div>

                  <Link className="course-teacher__link" to="/servicios">
                    Conoce más sobre la Dra. Yulia
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                </div>
              </section>

              {/* Certificado */}
              <section className="course-block" aria-labelledby="course-certificate-title">
                <h2 className="course-block__title" id="course-certificate-title">
                  Tu certificado de finalización
                </h2>

                <div className="course-certificate">
                  <CertificatePreview />

                  <div className="course-certificate__copy">
                    <p className="course-certificate__text">
                      Al completar los requisitos del curso podrás obtener un certificado
                      de finalización.
                    </p>
                    <p className="course-certificate__note">
                      Los detalles sobre su emisión se confirmarán antes del inicio del
                      curso.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="course-block" aria-labelledby="course-faq-title">
                <h2 className="course-block__title" id="course-faq-title">
                  Preguntas frecuentes
                </h2>

                <div className="course-faq">
                  {FAQ.map((item) => (
                    <details className="course-faq__item" key={item.id}>
                      <summary className="course-faq__question">
                        {item.question}
                        <ChevronDown className="course-faq__chevron" size={18} aria-hidden="true" />
                      </summary>
                      <p className="course-faq__answer">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* ---------- Sidebar de compra ---------- */}
            <aside className="course-aside">
              <div className="course-buy">
                <p className="course-buy__name">{COURSE.title}</p>

                <div className="course-buy__price">
                  <span className="course-buy__price-current">
                    <span className="course-price__currency">S/</span>
                    {COURSE.price}
                  </span>
                  <span className="course-buy__price-previous">S/ {COURSE.previousPrice}</span>
                </div>

                <span className="course-buy__discount">{COURSE.discount}</span>

                <button
                  className="course-btn course-btn--primary course-btn--block"
                  type="button"
                  onClick={handleBuy}
                >
                  {isEnrolled ? 'Ir al curso' : 'Comprar ahora'}
                  {isEnrolled ? null : (
                    <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
                  )}
                </button>

                {!isEnrolled ? buyMicrocopy : null}

                <h2 className="course-buy__heading">Este curso incluye</h2>

                <ul className="course-buy__list">
                  {INCLUDES.map(({ id, text, icon: Icon }) => (
                    <li className="course-buy__item" key={id}>
                      <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
                      {text}
                    </li>
                  ))}
                </ul>

                <p className="course-buy__trust">
                  <ShieldCheck size={16} strokeWidth={1.9} aria-hidden="true" />
                  Pago seguro y confiable
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* ---------- CTA final ---------- */}
        <section className="course-final" aria-labelledby="course-final-title">
          <div className="course-final__container">
            <div className="course-final__copy">
              <h2 className="course-final__title" id="course-final-title">
                Empieza a fortalecer tu criterio profesional
              </h2>
              <p className="course-final__text">
                Aprende bioquímica aplicada a la nutrición con un enfoque práctico y
                basado en evidencia.
              </p>
            </div>

            <button
              className="course-btn course-btn--primary course-btn--final"
              type="button"
              onClick={handleBuy}
            >
              {isEnrolled ? 'Ir al curso' : 'Comprar ahora'}
              {isEnrolled ? null : (
                <ArrowRight size={17} strokeWidth={2.25} aria-hidden="true" />
              )}
            </button>
          </div>
        </section>
      </main>

      <Footer logo={logo} />
    </>
  )
}