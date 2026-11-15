// CI 校验脚本：`npm run validate`
// 1. 每个内容页必须有合法 frontmatter（title、status）；
// 2. 站内链接 /gpu-glossary/... 必须能解析到实际内容页；
// 3. 图片引用必须存在于 public/images/；
// 4. 输出复核进度统计（不失败，仅报告）。
import fs from 'node:fs'
import path from 'node:path'

const DOCS = 'src/content/docs'
const BASE = '/gpu-glossary'

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (/\.(md|mdx)$/.test(e.name)) out.push(p)
  }
  return out
}

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/)
  return m ? m[1] : null
}

function hasPage(slug) {
  return fs.existsSync(path.join(DOCS, `${slug}.md`)) || fs.existsSync(path.join(DOCS, `${slug}.mdx`))
}

const errors = []
let reviewed = 0
let unreviewed = 0
// 四个分类落地页不计入词条复核统计（由维护者直接维护）。
const CATEGORY_PAGES = ['device-hardware.md', 'device-software.md', 'host-software.md', 'perf.md']
const files = walk(DOCS)
const isCategory = (f) => CATEGORY_PAGES.includes(path.relative(DOCS, f))

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  const fm = frontmatter(src)
  if (!fm) {
    errors.push(`${file}: 缺少 frontmatter`)
    continue
  }
  if (!/^title:\s*\S/m.test(fm)) errors.push(`${file}: frontmatter 缺少 title`)
  // 分类落地页不要求复核状态字段（由维护者直接维护），但链接与图片照常校验。
  if (!isCategory(file)) {
    const status = fm.match(/^status:\s*(\S+)\s*$/m)?.[1]
    if (status === undefined) {
      // index/review 等站点自有页面不要求复核状态。
      if (file.endsWith('.md')) errors.push(`${file}: frontmatter 缺少 status`)
    } else if (status === 'reviewed') {
      reviewed++
    } else if (status === 'unreviewed') {
      unreviewed++
    } else if (file.endsWith('.md')) {
      errors.push(`${file}: status 值非法: ${status}（应为 unreviewed 或 reviewed）`)
    }
    if (file.endsWith('.md') && status === 'reviewed' && !/^reviewer:\s*\S/m.test(fm)) {
      errors.push(`${file}: status 为 reviewed 但未填写 reviewer`)
    }
  }

  // 图片
  for (const m of src.matchAll(/!\[[^\]]*\]\(\s*(\/gpu-glossary\/images\/[^\s)]+)\s*\)/g)) {
    const rel = m[1].slice(BASE.length) // /images/xxx.svg
    if (!fs.existsSync(path.join('public', rel))) {
      errors.push(`${file}: 图片不存在: ${m[1]}`)
    }
  }

  // 站内链接
  for (const m of src.matchAll(/(!?)\[[^\]]*\]\((\s*\/gpu-glossary\/[^\s)]*)\)/g)) {
    if (m[1] === '!') continue // 图片链接不参与
    let href = m[2].trim()
    if (!href.endsWith('/')) {
      errors.push(`${file}: 站内链接应以 / 结尾: ${href}`)
      href = href.replace(/\/?$/, '/')
    }
    const slug = href.slice(BASE.length + 1).replace(/\/$/, '') || 'index'
    if (!hasPage(slug)) {
      errors.push(`${file}: 站内链接指向不存在的页面: ${href}`)
    }
  
  }
}

const total = reviewed + unreviewed
console.log(`词条复核进度: ${reviewed}/${total} 已复核`)
for (const e of errors) console.error('✗ ' + e)
if (errors.length) {
  console.error(`\n校验失败: ${errors.length} 个问题`)
  process.exit(1)
}
console.log(`校验通过: ${files.length} 个内容页，链接与图片引用完整`)
