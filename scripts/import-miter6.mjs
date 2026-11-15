// One-off importer: pulls the Simplified Chinese translation from the
// miter6/gpu-glossary-zh repository into the Starlight content tree.
//
// It is kept in the repo so the import is reproducible, but ongoing
// maintenance happens on the imported files directly (see CONTRIBUTING-zh.md).
//
// Usage:
//   node scripts/import-miter6.mjs [path-to-gpu-glossary-zh-checkout]
//
// The checkout is expected to have translations at source/gpu-glossary/**.md
// (a `git clone https://github.com/miter6/gpu-glossary-zh` checkout).
//
// Transformations applied per file:
//   1. The first `# Title` heading is stripped and moved to frontmatter
//      (Starlight renders the page title itself).
//   2. Frontmatter is added with the review workflow fields:
//        status: unreviewed        # unreviewed -> reviewed, maintained by reviewers
//        upstream_commit: <sha>    # upstream content version this draft is based on
//   3. Local SVG references (![..](light-x.svg) / ./light-x.svg) are rewritten
//      to /gpu-glossary/images/<file>, and the SVGs are copied there.
//   4. The GitHub user-attachment image in tensor-core.md is pointed at the
//      matching diagram from the Modal CDN (light-tensor-core-mma.svg).
//   5. Sphinx-era links (/gpu-glossary/<section>/index[.rst]) are normalized
//      to section landing pages; all /gpu-glossary/... links get a trailing
//      slash so GitHub Pages directory indexes resolve directly.
import fs from 'node:fs'
import path from 'node:path'

const SRC = process.argv[2] ?? '/tmp/gg-zh/source/gpu-glossary'
const OUT = 'src/content/docs'
const IMAGES = 'public/images'
// The upstream (modal-labs/gpu-glossary) commit whose contents the translated
// drafts were checked against when this import was produced.
const UPSTREAM_COMMIT = '9597497a3d8102c9cd17fc35ff06af5d97928275'
const BASE = '/gpu-glossary'

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

let count = 0
for (const file of walk(SRC)) {
  if (file.endsWith('.svg')) {
    fs.mkdirSync(IMAGES, { recursive: true })
    fs.copyFileSync(file, path.join(IMAGES, path.basename(file)))
    continue
  }
  if (!file.endsWith('.md')) continue

  const rel = path.relative(SRC, file)
  let content = fs.readFileSync(file, 'utf8')

  const h1 = content.match(/^# (.+)[ \t]*\r?\n/)
  if (!h1) throw new Error(`no H1 title found in ${rel}`)
  const title = h1[1].trim()
  content = content.slice(h1.index + h1[0].length)

  // 3+4. images
  content = content.replace(
    /!\[([^\]]*)\]\(\s*(?:\.\/)?([A-Za-z0-9.\-]+\.svg)\s*\)/g,
    (_, alt, f) => `![${alt}](${BASE}/images/${f})`
  )
  content = content.replace(
    /!\[([^\]]*)\]\(https:\/\/github\.com\/user-attachments\/assets\/[0-9a-f-]+\)/g,
    `![替换自上游的示意图](${BASE}/images/light-tensor-core-mma.svg)`
  )

  // 5. links
  content = content.replace(
    new RegExp(`\\]\\(${BASE}/(device-hardware|device-software|host-software|perf)/index(?:\\.rst)?\\)`, 'g'),
    `](${BASE}/$1/)`
  )
  content = content.replace(new RegExp(`\\]\\(${BASE}/([^)\\s#]*?)\\)`, 'g'),
    (_, href) => href.endsWith('.svg')
      ? `](${BASE}/${href})`
      : `](${BASE}/${href.endsWith('/') ? href : href + '/'})`)

  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    'status: unreviewed',
    `upstream_commit: ${UPSTREAM_COMMIT}`,
    '---',
    '',
  ].join('\n')

  const dest = path.join(OUT, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, fm + content.trimStart())
  count++
  console.log(`imported ${rel}`)
}
console.log(`\n${count} pages imported into ${OUT}`)
