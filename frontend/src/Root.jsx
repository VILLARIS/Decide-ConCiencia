import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import AboutPage from './pages/AboutPage/AboutPage.jsx'
import ContactPage from './pages/ContactPage/ContactPage.jsx'
import CoursesPage from './pages/CoursesPage/CoursesPage.jsx'
import ServicesPage from './pages/ServicesPage/ServicesPage.jsx'
import AccesoPage from './pages/AccesoPage/AccesoPage.jsx'
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage.jsx'
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.jsx'
import LearningPage from './pages/LearningPage/LearningPage.jsx'
import CourseLearningPage from './pages/LearningPage/CourseLearningPage.jsx'
import { CertificatesPage, ProfilePage } from './pages/LearningPage/LearningViews.jsx'
import AdminDashboardPage from './pages/AdminArea/AdminDashboardPage.jsx'
import AdminCoursesPage from './pages/AdminArea/AdminCoursesPage.jsx'
import AdminCourseEditorPage from './pages/AdminArea/AdminCourseEditorPage.jsx'
import AdminStudentsPage from './pages/AdminArea/AdminStudentsPage.jsx'
import AdminSalesPage from './pages/AdminArea/AdminSalesPage.jsx'
import AdminEvaluationsPage from './pages/AdminArea/AdminEvaluationsPage.jsx'
import AdminCertificatesPage from './pages/AdminArea/AdminCertificatesPage.jsx'
import AdminSettingsPage from './pages/AdminArea/AdminSettingsPage.jsx'
import { DemoAuthProvider } from './demo/DemoAuthContext.jsx'
import { DemoPurchaseProvider } from './demo/DemoPurchaseProvider.jsx'
import { DemoCourseContentProvider } from './demo/DemoCourseContentProvider.jsx'

export default function Root() {
  return (
    <BrowserRouter>
      {/* La sesion demo vive en memoria: al recargar se pierde. Sin backend. */}
      <DemoAuthProvider>
        {/* Compras e inscripciones tambien en memoria. Va dentro de la sesion
            porque toda compra pertenece a un usuario autenticado. */}
        <DemoPurchaseProvider>
          {/* Temario de los cursos: modulos, lecciones y su contenido. Va aqui
              para que el editor de curso guarde y lea del mismo sitio, y el
              contenido sobreviva a la navegacion dentro de la SPA. */}
          <DemoCourseContentProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/cursos" element={<CoursesPage />} />
              <Route path="/cursos/:slug" element={<CourseDetailPage />} />
              <Route path="/servicios" element={<ServicesPage />} />
              {/* Destino de los enlaces "Quienes somos" y "Contacto" del navbar.
                  Antes apuntaban a /about y /contact, rutas que no estaban
                  declaradas: caian en la comodin y mostraban el home. */}
              <Route path="/quienes-somos" element={<AboutPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/acceso" element={<AccesoPage />} />

              {/* Una compra = un curso. El checkout aplica su propio
                  RequireDemoSession: sin sesion vuelve al acceso y regresa aqui. */}
              <Route path="/checkout/:courseId" element={<CheckoutPage />} />

              {/* Area de estudiante: cada pagina aplica su propio RequireDemoSession. */}
              <Route path="/mi-aprendizaje" element={<LearningPage />} />
              {/* Vista de estudio de un curso inscrito. La propia pagina comprueba
                  la inscripcion: si no existe, devuelve a /cursos/:courseId. */}
              <Route path="/mi-aprendizaje/:courseId" element={<CourseLearningPage />} />
              <Route
                path="/mi-aprendizaje/:courseId/leccion/:lessonId"
                element={<CourseLearningPage />}
              />
              <Route path="/mi-perfil" element={<ProfilePage />} />
              <Route path="/mis-certificados" element={<CertificatesPage />} />

              {/* Panel de la doctora (Plan Profesional). Cada pagina aplica
                  RequireAdminSession: sin sesion vuelve al acceso y, si quien
                  entra es estudiante, vuelve a su area. El guard va en cada
                  pagina para que el panel no dependa de que la ruta este
                  declarada en un orden concreto. */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/cursos" element={<AdminCoursesPage />} />
              {/* /nuevo antes que /:id: si el orden importara, la ruta estatica
                  ganaria; declararla primero lo deja explicito. */}
              <Route path="/admin/cursos/nuevo" element={<AdminCourseEditorPage />} />
              <Route path="/admin/cursos/:id" element={<AdminCourseEditorPage />} />
              <Route path="/admin/estudiantes" element={<AdminStudentsPage />} />
              <Route path="/admin/ventas" element={<AdminSalesPage />} />
              <Route path="/admin/evaluaciones" element={<AdminEvaluationsPage />} />
              <Route path="/admin/certificados" element={<AdminCertificatesPage />} />
              <Route path="/admin/configuracion" element={<AdminSettingsPage />} />

              <Route path="*" element={<App />} />
            </Routes>
          </DemoCourseContentProvider>
        </DemoPurchaseProvider>
      </DemoAuthProvider>
    </BrowserRouter>
  )
}

