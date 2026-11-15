# 术语对照表

用于统一译法。规则：正文首次出现时给出"中文 (English)"对照，之后可用中文或
英文；保留行业通用的英文缩写（SM、PTX、SASS、warp 等首次给全称对照）。
新增或有争议的条目先在此登记再落稿。

下表从现有译稿草稿（miter6/gpu-glossary-zh）中整理，**本身也待复核确认**；
与复核结论冲突时，以复核后的结论为准并更新本表。

## NVIDIA / CUDA 通用

| 英文 | 译法 | 说明 |
| --- | --- | --- |
| GPU | GPU | 不译 |
| host / device | 主机 / 设备 | 首次出现注明 NVIDIA 语境中的含义 |
| CUDA core | CUDA 核心 | |
| Tensor Core | Tensor Core | 专有硬件名，正文保留英文，不用"张量核心" |
| Streaming Multiprocessor (SM) | 流式多处理器 (SM) | 上下文已明确时可用 "SM" |
| thread | 线程 | |
| warp | 线程束 (warp) | 首次出现保留英文 |
| warpgroup | 线程组 (warpgroup) | |
| thread block | 线程块 | |
| grid | 线程块网格 | |
| kernel | 核函数 | |
| cooperative thread array (CTA) | 协作线程数组 (CTA) | 与"线程块"对应关系按原文说明 |
| shared memory | 共享内存 | |
| global memory | 全局内存 | |
| register file | 寄存器文件 | |
| register pressure | 寄存器压力 | |
| occupancy | 占用率 | |
| compute-bound / memory-bound | 计算受限 / 内存受限 | |
| roofline model | 屋顶线模型（roofline） | 首次出现保留英文 |
| memory coalescing | 访存合并 / 内存合并访问 | 待定名：复核时统一其一 |
| bank conflict | 存储体冲突 | 待定名：复核时统一 |
| latency hiding | 延迟隐藏 | |
| instruction set architecture (ISA) | 指令集架构 (ISA) | |
| PTX | PTX | 保留缩写，首次给 "Parallel Thread eXecution" 全称 |
| SASS | SASS | 保留缩写 |
| nvcc | nvcc | 命令行工具名不译 |
| stream multiprocessor architecture | 流式多处理器架构 | |

## 软件栈

| 英文 | 译法 | 说明 |
| --- | --- | --- |
| driver / kernel driver | 驱动程序 / 内核驱动 | |
| runtime API / driver API | 运行时 API / 驱动 API | API 不译 |
| CUDA Toolkit | CUDA 工具包 | |
| profiler | 性能分析工具 | "剖析器" 不采用 |
| profiling | 性能分析 | |

## 写作规范

- 正文用全角标点；代码、命令、URL、标识符保持原样。
- 中英文之间加半角空格（如 "CUDA 核心"）。
- 数值、单位与原文严格一致，不做单位换算。
- 标题句式统一为 "什么是 X？"；侧边栏短名由脚本从标题生成，不要在正文再写 H1。
