---
title: "什么是图形/GPU 处理集群？（GPC）"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
GPC 是一组 [纹理处理集群 (TPC)](/gpu-glossary/device-hardware/texture-processing-cluster/)（本身由 [流式多处理器 (Streaming Multiprocessor)](/gpu-glossary/device-hardware/streaming-multiprocessor/)或 SM 组成）加上一个光栅引擎的集合。看得出，还是有人拿 NVIDIA GPU 做图形渲染的，光栅引擎对他们很重要。无独有偶，这一缩写原本代表 Graphics Processing Cluster（图形处理集群），但现在（例如在 [NVIDIA CUDA C++ 编程指南](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html) 中）被展开为“GPU Processing Cluster（GPU 处理集群）”。

自 H100 等 [计算能力 (compute capability)](/gpu-glossary/device-software/compute-capability/) 9.0 GPU 推出以来，[CUDA 编程模型 (CUDA programming model)](/gpu-glossary/device-software/cuda-programming-model/) 的 [线程层次结构 (thread hierarchy)](/gpu-glossary/device-software/thread-hierarchy/) 增加了一个额外层级，即调度到同一 GPC 上的 [线程块](/gpu-glossary/device-software/thread-block/) 的“集群（cluster）”——就像 [线程块 (thread block)](/gpu-glossary/device-software/thread-block/) 的线程被调度到同一个 [SM](/gpu-glossary/device-hardware/streaming-multiprocessor/) 上一样，并拥有自己的一级[内存层次结构](/gpu-glossary/device-software/memory-hierarchy/)——分布式共享内存。本站其余部分我们略去了对这一特性的讨论。
