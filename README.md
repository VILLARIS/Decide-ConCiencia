Yumibiotic - README Markdown | Página 3
---
## Build de producción
Generar la versión de producción:
```bash
npm run build
```
Previsualizar el build:
```bash
npm run preview
```
---
## Lint
Ejecutar:
```bash
npm run lint
```
---
## Rutas principales
### Públicas
```text
/
/quienes-somos
/servicios
/cursos
/cursos/:courseId
/contacto
/acceso
/registro
```
### Estudiante
```text
/mi-aprendizaje
/mi-aprendizaje/:courseId
/mi-aprendizaje/:courseId/leccion/:lessonId
/mi-perfil
```
### Administración
```text
/admin
/admin/cursos
/admin/cursos/nuevo
/admin/cursos/:id
/admin/estudiantes
/admin/ventas
/admin/evaluaciones
/admin/configuracion
```
---
## Flujo general del estudiante
```text
Catálogo
→ Detalle del curso
→ Registro / inicio de sesión
Yumibiotic - README Markdown | Página 4
→ Checkout
→ Pago
→ Inscripción
→ Mi aprendizaje
→ Curso
→ Módulos y lecciones
```
---
## Flujo general de administración
```text
Acceso de administradora
→ Dashboard
→ Cursos
→ Estudiantes
→ Ventas
→ Evaluaciones
→ Configuración
```
La doctora puede gestionar directamente el contenido de la plataforma sin depender del
desarrollador para los cambios habituales.
---
## Assets
Los recursos gráficos del proyecto se encuentran principalmente en:
```text
src/assets/
```
Los recursos específicos del Home están organizados en:
```text
src/assets/Home/
```
Por ejemplo:
```text
src/assets/Home/OurServices/
```
Esta carpeta contiene imágenes utilizadas en la sección de servicios de Yumibiotic.
---
## Estado del proyecto
El proyecto se encuentra actualmente en desarrollo activo.
Algunas funciones todavía trabajan con datos demo mientras se completa la integración definitiva
con backend, base de datos, pagos y servicios externos.
---
## Buenas prácticas
Antes de realizar un commit:
```bash
npm run lint
npm run build
```
Verificar también:
- navegación
- responsive
Yumibiotic - README Markdown | Página 5
- consola del navegador
- rutas protegidas
- imágenes
- enlaces
- formularios
- flujo de compra
- acceso a cursos
- panel administrativo
---
## Marca
**Yumibiotic**
Nutrición, educación y bienestar.
La marca busca ofrecer soluciones y acompañamiento para personas, profesionales y organizaciones
mediante un enfoque basado en evidencia, educación y bienestar integral.
---
## Desarrollo
Proyecto desarrollado con React + Vite.
Este repositorio continuará evolucionando conforme se integren nuevas funciones, servicios y
módulos de la plataforma.
