---
title: "什么是性能瓶颈？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
瓶子的“颈”限制了倒出液体的速度；类比到系统上，性能瓶颈限制的是完成任务的速率。

![](/gpu-glossary/images/light-roofline-model.svg)

> 像这样的[屋顶线图](/gpu-glossary/perf/roofline-model/) 用于快速识别吞吐量导向型系统中的性能瓶颈。改编自 [Williams, Waterman, and Patterson (2008)](https://people.eecs.berkeley.edu/~kubitron/cs252/handouts/papers/RooflineVyNoYellow.pdf)。

瓶颈是性能优化的目标。教科书式的优化方法是：

-   确定瓶颈；
-   抬升瓶颈，直到它不再构成瓶颈；
-   对新的瓶颈重复上述过程。

这种方法存在形式化的表述，例如 Eliyahu Goldratt 的[《约束理论》](https://en.wikipedia.org/wiki/Theory_of_constraints)，它帮助 [将丰田制造方法传播给全球的制造商](https://www.leanproduction.com/theory-of-constraints/)，[进而影响了软件工程和运营领域](https://youtu.be/1jU7iUr-0xE)。

在 [为 Jane Street 做的这个演讲](https://youtu.be/139UPjoq7Kw?t=1229) 中，Horace He 将在 GPU 上运行的程序 [内核](/gpu-glossary/device-software/kernel/) 所做的工作分解为三类：

-   计算（在 [CUDA 核心](/gpu-glossary/device-hardware/cuda-core/) 或 [Tensor Core](/gpu-glossary/device-hardware/tensor-core/) 上运行浮点运算）
-   内存（在系统的 [内存层次结构](/gpu-glossary/device-software/memory-hierarchy/) 中搬运数据）
-   开销（其他所有操作）

因此，对于 GPU [内核](/gpu-glossary/device-software/kernel/)，性能瓶颈主要分为三类：

-   [计算受限](/gpu-glossary/perf/compute-bound/) [内核](/gpu-glossary/device-software/kernel/)，受计算单元[算术带宽](/gpu-glossary/perf/arithmetic-bandwidth/) 瓶颈限制的[内核](/gpu-glossary/device-software/kernel/)，例如大型矩阵乘矩阵，
-   [内存受限](/gpu-glossary/perf/memory-bound/) [内核](/gpu-glossary/device-software/kernel/)，受限于 [内存子系统的带宽](/gpu-glossary/perf/memory-bandwidth/)，例如大型向量对向量的乘法，以及
-   [开销受限](/gpu-glossary/perf/overhead/) [内核](/gpu-glossary/device-software/kernel/)，受限于延迟，例如小型数组操作。

[屋顶线模型](/gpu-glossary/perf/roofline-model/) 分析有助于快速确定程序的性能是受限于计算/[算术带宽](/gpu-glossary/perf/arithmetic-bandwidth/) 还是 [内存带宽](/gpu-glossary/perf/memory-bandwidth/)。

<small>当然，*任何* 资源都可能成为瓶颈。例如，电力输入和热量排出足以让某些 GPU 的性能低于其理论最大值。参见 [NVIDIA 的这篇文章](https://developer.nvidia.com/blog/nvidia-sets-new-generative-ai-performance-and-scale-records-in-mlperf-training-v4-0/)，该文说明把从 L2 缓存重新分配给 [流式多处理器 (Streaming Multiprocessor)](/gpu-glossary/device-hardware/streaming-multiprocessor/) 带来了 4% 的端到端性能提升；或者参考 [Horace He 的这篇文章](https://www.thonking.ai/p/strangely-matrix-multiplications)，指出矩阵乘法的性能会因输入数据而异——晶体管翻转所消耗的功率随之变化。</small>