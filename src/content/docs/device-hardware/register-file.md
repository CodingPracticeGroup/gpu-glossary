---
title: "什么是寄存器文件？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
[流式多处理器 (Streaming Multiprocessor)](/gpu-glossary/device-hardware/streaming-multiprocessor/) 的寄存器文件是在[计算核心 (core)](/gpu-glossary/device-hardware/core/) 进行数据操作期间的主要数据存储单元。

![](/gpu-glossary/images/light-gh100-sm.svg)  

> H100 流式多处理器（SM）的内部架构图。蓝色部分描绘的是寄存器文件。修改自 NVIDIA 的 [H100 白皮书](https://modal-cdn.com/gpu-glossary/gtc22-whitepaper-hopper.pdf)。

与 CPU 中的寄存器类似，这些寄存器由速度极快的存储技术构成，能够跟上计算 [核心 (core)](/gpu-glossary/device-hardware/core/) 的处理速度，比 [L1 数据缓存 (L1 data cache)](/gpu-glossary/device-hardware/l1-data-cache/) 快大约一个数量级。

寄存器文件被划分为 32 位寄存器，可在不同数据类型（如 32 位整数、64 位浮点数以及 16 位或更小的浮点数组）之间动态重新分配。这些物理寄存器是 [并行线程执行 (Parallel Thread eXecution, PTX)](/gpu-glossary/device-software/parallel-thread-execution/) 中 [虚拟寄存器 (virtual registers)](/gpu-glossary/device-software/registers/) 中间表示层的底层实现。

在 [流式汇编器 (Streaming Assembler, SASS)](/gpu-glossary/device-software/streaming-assembler/) 中，物理寄存器分配给 [线程 (thread)](/gpu-glossary/device-software/thread/) 的工作由像 `ptxas` 这样的编译器管理，该编译器按 [线程块 (thread block)](/gpu-glossary/device-software/thread-block/) 优化寄存器文件的使用。如果每个 [线程块 (thread block)](/gpu-glossary/device-software/thread-block/) 消耗过多的寄存器文件（俗称高 "[寄存器压力 (register pressure)](/gpu-glossary/perf/register-pressure/)"），那么可并发调度的 [线程 (thread)](/gpu-glossary/device-software/thread/) 数量将会减少，导致低 [占用率 (occupancy)](/gpu-glossary/perf/occupancy/)，并可能通过减少 [延迟隐藏 (latency hiding)](/gpu-glossary/perf/latency-hiding/) 的机会而影响性能。