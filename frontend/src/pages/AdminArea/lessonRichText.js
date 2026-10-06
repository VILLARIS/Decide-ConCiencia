/*
  Texto de las lecciones: markdown sencillo -> HTML.

  POR QUE MARKDOWN Y NO UN EDITOR RICO
  ------------------------------------
  Un editor de verdad (Quill, Tiptap, Slate) traeria su propio modelo de
  documento, con un objeto JSON por leccion. Eso obliga al backend a validar
  HTML y obliga a sanitizarlo al pintarlo. Aqui se escribe markdown en un
  textarea y se convierte al leer.

  El subconjunto es el justo para escribir una clase:

    ## Subtitulo
    **negrita** y *cursiva*
    - elemento de lista
    [texto del enlace](https://destino.example)

  Es lo que cabe en la barra de formato del editor. Anadir mas exigiria un
  editor de verdad, y no hace falta para un curso de nutricion.

  SEGURIDAD
  ---------
  El texto se escapa ANTES de aplicar las conversiones, y las conversiones solo
  pueden anadir etiquetas de una lista cerrada. Los enlaces se limitan a
  http, https y mailto: cualquier otro esquema (javascript:, data:) se
  descarta y se queda el texto. El resultado se pinta con
  dangerouslySetInnerHTML, asi que el orden de estas operaciones no es
  negociable.
*/

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/* Un destino que vale: nada de javascript:, data: ni esquemas raros. */
function sanitizeHref(href) {
  const value = String(href ?? '').trim()

  return /^(https?:\/\/|mailto:)/i.test(value) ? value : null
}

/* Formato en linea, sobre texto ya escapado. */
function renderInline(escaped) {
  return escaped
    /* Enlaces: primero, para que el texto del enlace no se toque despues. */
    .replace(
      /\[([^\]]*)\]\(([^)\s]+)\)/g,
      (match, label, href) => {
        const safeHref = sanitizeHref(unescapeForHref(href))

        if (!safeHref) return label
        return `<a href="${safeHref}" target="_blank" rel="noreferrer noopener">${label}</a>`
      },
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
}

/*
  El href llega escapado (&amp; en vez de &). Para comprobar el esquema hay que
  deshacerlo primero; como el texto ya escapa el <, deshacer aqui no
  reintroduce nada peligroso: solo se usa para mirar el prefijo.
*/
function unescapeForHref(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

/*
  Convierte el texto ya escapado en bloques de HTML.

  Se recorre linea a linea y no separando por lineas en blanco. Quien escribe
  una clase pone un subtitulo y debajo su parrafo sin dejar siempre una linea en
  blanco entre medias; agrupando solo por lineas vacias, ese subtitulo se
  comia el parrafo y se veia como un solo bloque de texto. Leyendo linea a linea,
  un subtitulo es un subtitulo este como este escrito.
*/
function renderBlocks(escaped) {
  const html = []

  /* Un parrafo se acumula en lineas sueltas hasta una linea vacia, un subtitulo
     o un elemento de lista. */
  let paragraph = []
  let list = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`)
    paragraph = []
  }

  const flushList = () => {
    if (list.length === 0) return
    html.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`)
    list = []
  }

  for (const line of escaped.split('\n')) {
    const current = line.trim()

    if (!current) {
      flushParagraph()
      flushList()
      continue
    }

    /* h4 y h5: son subtitulos dentro de la leccion, no Titulos de pagina. */
    const heading = current.match(/^(#{2,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length === 2 ? 4 : 5
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      continue
    }

    const item = current.match(/^[-*]\s+(.+)$/)
    if (item) {
      flushParagraph()
      list.push(item[1])
      continue
    }

    /* Un parrafo normal corta la lista: si no, dos listas separadas por un
       texto acaba en una sola <ul>. */
    flushList()
    paragraph.push(current)
  }

  flushParagraph()
  flushList()

  return html.join('')
}

/*
  Convierte markdown a HTML.

  Devuelve { html, isEmpty } para que quien lo use sepa si hay algo que pintar
  sin recorrer el resultado a mano.
*/
export function renderRichText(markdown) {
  const source = String(markdown ?? '').trim()

  if (!source) return { html: '', isEmpty: true }

  /* Se escapa el documento entero una sola vez, aqui. Todo lo que viene
     despues son transformaciones sobre texto que ya no puede contener "<". */
  const html = renderBlocks(escapeHtml(source))

  return { html, isEmpty: html.length === 0 }
}

/* Texto plano para resumenes y contadores, sin etiquetas. */
export function toPlainText(markdown) {
  return String(markdown ?? '')
    .replace(/\s*[#*]\s*/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

/* Cuantas palabras tiene la lectura, para el pie del editor. */
export function countWords(markdown) {
  const plain = toPlainText(markdown)
  return plain ? plain.split(' ').length : 0
}
