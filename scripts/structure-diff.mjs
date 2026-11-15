// 结构机械核对：对比英文原文与中文译文的结构信号，输出需要人工细读优先的页面。
// 对比项：内部链接集合（/gpu-glossary/...）、外部链接数量、图片引用、代码块数量、
// 数值 token（数字+单位样式片段）、H2/H3 标题数量、段落数量。
// 用法：node scripts/structure-diff.mjs
import fs from 'node:fs'
import path from 'node:path'

const EN = 'gpu-glossary'
const ZH = 'src/content/docs'

function walk(dir) {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(p))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}

function strip(src) {
  return src.replace(/^---\n[\s\S]*?\n---\n/, '')
}

function features(src) {
  const body = strip(src)
  const intLinks = [...body.matchAll(/\((\/gpu-glossary\/[^)\s]+)/g)].map((m) => m[1]).sort()
  const extLinks = [...body.matchAll(/\((https?:\/\/[^)\s]+)/g)].map((m) => m[1])
  const images = [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => path.basename(m[1]))
  const codeFences = (body.match(/^```/gm) || []).length / 2
  const numbers = [...new Set([...body.matchAll(/\d[\d.,×x*/-]*\d|\b\d+\b/g)].map((m) => m[0]))].sort()
  const headings = (body.match(/^#{2,3} /gm) || []).length
  const paras = body.split(/\n\s*\n/).filter((p) => p.trim()).length
  return { intLinks, extLinks, images, codeFences, numbers, headings, paras }
}

const enFiles = walk(EN)
let flagged = 0
for (const enFile of enFiles) {
  const rel = path.relative(EN, enFile)
  const zhFile = path.join(ZH, rel)
  if (!fs.existsSync(zhFile)) {
    console.log(`缺失译文: ${rel}`)
    flagged++
    continue
  }
  const a = features(fs.readFileSync(enFile, 'utf8'))
  const b = features(fs.readFileSync(zhFile, 'utf8'))
  const issues = []
  const norm = (l) => l.map((x) => x.replace(/\/$/, ''))
  const setDiff = (x, y) => norm(x).filter((v) => !norm(y).includes(v))
  const isImg = (v) => v.includes('/images/')
  const aLinks = a.intLinks.filter((v) => !isImg(v)), bLinks = b.intLinks.filter((v) => !isImg(v))
  const missingLinks = setDiff(aLinks, bLinks)
  const extraLinks = setDiff(bLinks, aLinks)
  if (missingLinks.length) issues.push(`缺内部链接: ${missingLinks.join(',')}`)
  if (extraLinks.length) issues.push(`多出内部链接: ${extraLinks.join(',')}`)
  const normImg = (v) => v.replace(/^light-/, '').replace(/\.(svg|png|jpg|pdf)$/, '')
  const an = a.images.map(normImg), bn = b.images.map(normImg)
  const missingImgs = an.filter((v) => !bn.includes(v))
  if (missingImgs.length) issues.push(`缺图片: ${missingImgs.join(',')}`)
  if (a.codeFences !== b.codeFences) issues.push(`代码块 ${a.codeFences} vs ${b.codeFences}`)
  const missingNums = a.numbers.filter((v) => !b.numbers.includes(v))
  if (missingNums.length) issues.push(`译文缺少数值: ${missingNums.slice(0, 12).join(' ')}`)
  if (a.headings !== b.headings) issues.push(`标题数 ${a.headings} vs ${b.headings}`)
  const paraRatio = b.paras / Math.max(a.paras, 1)
  if (paraRatio < 0.7) issues.push(`段落数偏少 ${a.paras} vs ${b.paras}`)
  if (issues.length) {
    console.log(`✗ ${rel}\n    ${issues.join('\n    ')}`)
    flagged++
  }
}
console.log(`\n结构核对完成：${enFiles.length} 页对比，${flagged} 页需要人工优先细读`)
