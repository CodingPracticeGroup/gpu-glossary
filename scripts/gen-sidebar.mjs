// Generates src/data/sidebar.json from the table-of-contents data below plus
// the page titles found in src/content/docs.
//
// The TOC order and abbreviation badges mirror the original site
// (https://modal.com/gpu-glossary), whose sidebar is driven by a
// contents.json that is not part of the upstream repository. Re-run
// `npm run gen:sidebar` after adding or renaming pages.
import fs from 'node:fs'
import path from 'node:path'

const DOCS = 'src/content/docs'

const SECTIONS = [
  {
    label: '概览',
    items: [
      { slug: 'readme' },
      { slug: 'contributors' },
      { slug: 'review', label: '译稿复核进度' },
    ],
  },
  {
    label: '设备硬件',
    dir: 'device-hardware',
    items: [
      { slug: 'device-hardware', isCategory: true },
      { slug: 'device-hardware/cuda-device-architecture' },
      { slug: 'device-hardware/streaming-multiprocessor', badge: 'SM' },
      { slug: 'device-hardware/core' },
      { slug: 'device-hardware/special-function-unit', badge: 'SFU' },
      { slug: 'device-hardware/load-store-unit', badge: 'LSU' },
      { slug: 'device-hardware/warp-scheduler' },
      { slug: 'device-hardware/cuda-core' },
      { slug: 'device-hardware/tensor-core' },
      { slug: 'device-hardware/tensor-memory-accelerator', badge: 'TMA' },
      { slug: 'device-hardware/streaming-multiprocessor-architecture' },
      { slug: 'device-hardware/texture-processing-cluster', badge: 'TPC' },
      { slug: 'device-hardware/graphics-processing-cluster', badge: 'GPC' },
      { slug: 'device-hardware/register-file' },
      { slug: 'device-hardware/l1-data-cache' },
      { slug: 'device-hardware/tensor-memory' },
      { slug: 'device-hardware/gpu-ram' },
    ],
  },
  {
    label: '设备软件',
    dir: 'device-software',
    items: [
      { slug: 'device-software', isCategory: true },
      { slug: 'device-software/cuda-programming-model' },
      { slug: 'device-software/streaming-assembler', badge: 'SASS' },
      { slug: 'device-software/parallel-thread-execution', badge: 'PTX' },
      { slug: 'device-software/compute-capability' },
      { slug: 'device-software/thread' },
      { slug: 'device-software/warp' },
      { slug: 'device-software/warpgroup' },
      { slug: 'device-software/cooperative-thread-array' },
      { slug: 'device-software/kernel' },
      { slug: 'device-software/thread-block' },
      { slug: 'device-software/thread-block-grid' },
      { slug: 'device-software/thread-hierarchy' },
      { slug: 'device-software/memory-hierarchy' },
      { slug: 'device-software/registers' },
      { slug: 'device-software/shared-memory' },
      { slug: 'device-software/global-memory' },
      { slug: 'device-software/cuda-tile-programming-model' },
    ],
  },
  {
    label: '主机软件',
    dir: 'host-software',
    items: [
      { slug: 'host-software', isCategory: true },
      { slug: 'host-software/cuda-software-platform' },
      { slug: 'host-software/cuda-c' },
      { slug: 'host-software/nvidia-gpu-drivers' },
      { slug: 'host-software/nvidia-ko' },
      { slug: 'host-software/cuda-driver-api' },
      { slug: 'host-software/libcuda' },
      { slug: 'host-software/nvml', badge: 'NVML' },
      { slug: 'host-software/libnvml' },
      { slug: 'host-software/nvidia-smi' },
      { slug: 'host-software/cuda-runtime-api' },
      { slug: 'host-software/libcudart' },
      { slug: 'host-software/cuda-graph' },
      { slug: 'host-software/nvcc', badge: 'nvcc' },
      { slug: 'host-software/nvrtc' },
      { slug: 'host-software/cupti', badge: 'CUPTI' },
      { slug: 'host-software/nsight-systems' },
      { slug: 'host-software/cuda-binary-utilities' },
      { slug: 'host-software/cublas' },
      { slug: 'host-software/cudnn' },
      { slug: 'host-software/cutlass' },
      { slug: 'host-software/cute' },
      { slug: 'host-software/cute-dsl' },
      // 上游新增词条（原站在线目录暂未收录）。
      { slug: 'host-software/cutile-basic' },
    ],
  },
  {
    label: '性能',
    dir: 'perf',
    items: [
      { slug: 'perf', isCategory: true },
      { slug: 'perf/performance-bottleneck' },
      { slug: 'perf/roofline-model' },
      { slug: 'perf/compute-bound' },
      { slug: 'perf/memory-bound' },
      { slug: 'perf/arithmetic-intensity' },
      { slug: 'perf/overhead' },
      { slug: 'perf/littles-law' },
      { slug: 'perf/memory-bandwidth' },
      { slug: 'perf/arithmetic-bandwidth' },
      { slug: 'perf/latency-hiding' },
      { slug: 'perf/warp-execution-state' },
      { slug: 'perf/active-cycle' },
      { slug: 'perf/occupancy' },
      { slug: 'perf/pipe-utilization' },
      { slug: 'perf/peak-rate' },
      { slug: 'perf/issue-efficiency' },
      { slug: 'perf/streaming-multiprocessor-utilization' },
      { slug: 'perf/warp-divergence' },
      { slug: 'perf/scoreboard-stall' },
      { slug: 'perf/branch-efficiency' },
      { slug: 'perf/memory-coalescing' },
      { slug: 'perf/bank-conflict' },
      { slug: 'perf/register-pressure' },
    ],
  },
]

// Page title from frontmatter: the first `title:` line of the Markdown file.
function pageTitle(slug) {
  for (const ext of ['.md', '.mdx']) {
    const file = path.join(DOCS, `${slug}${ext}`)
    if (!fs.existsSync(file)) continue
    const src = fs.readFileSync(file, 'utf8')
    const m = src.match(/^title:\s*(.+)$/m)
    if (!m) throw new Error(`missing title frontmatter in ${file}`)
    let title = m[1].trim()
    if (title.startsWith('"') && title.endsWith('"')) title = JSON.parse(title)
    return title
  }
  throw new Error(`no content file found for slug ${slug}`)
}

// Sidebar labels are the short form of the page title ("什么是 X？" -> "X"),
// mirroring the original site's sidebar which lists bare term names.
// Titles that append the abbreviation after the "？" keep it: the sidebar
// badge column is narrow and not every renderer shows badges.
function sidebarLabel(title) {
  return title.replace(/^什么是\s*/, '').replace(/\s*[？?]\s*/g, '').trim() || title
}

// Titles (from the imported draft) that phrase the question in a way the
// shortener above cannot strip. Drop entries here once the page titles
// themselves are normalized during review.
const LABEL_OVERRIDES = {
  'device-software/thread-hierarchy': 'CUDA 线程层次结构',
  'host-software/cuda-software-platform': 'CUDA 软件平台',
  'host-software/cuda-binary-utilities': 'CUDA 二进制工具',
  'perf/compute-bound': '计算受限（Compute-bound）',
}

const sidebar = SECTIONS.map((section) => ({
  label: section.label,
  ...(section.dir ? { collapsed: false } : {}),
  items: section.items.map((item) => {
    const title = item.label ? '' : pageTitle(item.slug)
    const label = item.label ?? LABEL_OVERRIDES[item.slug] ?? (item.isCategory ? title : sidebarLabel(title))
    return {
      label,
      slug: item.slug,
      ...(item.isCategory ? { isCategory: true } : {}),
      ...(item.badge ? { badge: { text: item.badge, variant: 'default' } } : {}),
    }
  }),
}))

fs.mkdirSync('src/data', { recursive: true })
fs.writeFileSync(
  'src/data/sidebar.json',
  JSON.stringify({ note: 'generated by scripts/gen-sidebar.mjs — do not edit by hand', sections: sidebar }, null, 2) + '\n'
)
const total = sidebar.reduce((n, s) => n + s.items.length, 0)
console.log(`wrote src/data/sidebar.json (${sidebar.length} groups, ${total} entries)`)
