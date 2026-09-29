const fs = require('fs')
const path = require('path')

const dir = 'src/components'
const files = []
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.css')) files.push(p)
  }
}
walk(dir)

const grab = (src, re) => {
  const out = []
  let m
  while ((m = re.exec(src))) out.push(m[1].trim())
  return out
}

const rows = []
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  rows.push({
    file: f.replace(dir + path.sep, '').replace(path.sep, '/'),
    container: grab(src, /max-width:\s*([^;}]+)/g),
    padInline: grab(src, /padding-inline:\s*([^;}]+)/g),
    pad: grab(src, /(?<!-)padding:\s*([^;}]+)/g),
    radius: [...new Set(grab(src, /border-radius:\s*([^;}]+)/g))],
    shadow: [...new Set(grab(src, /(?:box-shadow|border[^:]*?):\s*([^;}]*)/g))].filter((s) => s.includes('rgba') || s.includes('#')),
  })
}

for (const r of rows) {
  console.log('=== ' + r.file)
  console.log('  max-width : ' + [...new Set(r.container)].join(' | '))
  console.log('  padding   : ' + [...new Set(r.pad)].join(' | '))
  console.log('  radius    : ' + r.radius.join(' | '))
  console.log('  shadow    : ' + r.shadow.join('  ||  '))
}

console.log('\n=== COLORES DECLARADOS POR SECCION ===')
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  const vars = grab(src, /(--[a-z-]+):\s*([^;}]+)/g)
  const colors = grab(src, /#[0-9a-fA-F]{6}\b/g)
  console.log('\n' + f.replace(dir + path.sep, '').replace(path.sep, '/'))
  console.log('  vars: ' + vars.join('  '))
  console.log('  hex : ' + [...new Set(colors)].sort().join(' '))
}
