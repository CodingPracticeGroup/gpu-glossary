---
title: "什么是共享内存？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
![](/gpu-glossary/images/light-cuda-programming-model.svg)  

> 共享内存是与 CUDA 线程组层次结构（左图）中的[线程块](/gpu-glossary/device-software/thread-block/)级别（左图、中图）相关联的抽象内存。改编自 NVIDIA 的 [CUDA 复习：CUDA 编程模型](https://developer.nvidia.com/blog/cuda-refresher-cuda-programming-model/) 和 NVIDIA [CUDA C++ 编程指南](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#programming-model) 中的图表。

共享内存 (Shared Memory) 是 [内存层次结构](/gpu-glossary/device-software/memory-hierarchy/) 中的一个层级，对应 [CUDA 编程模型](/gpu-glossary/device-software/cuda-programming-model/) [线程层次结构](/gpu-glossary/device-software/thread-hierarchy/) 中的 [线程块](/gpu-glossary/device-software/thread-block/) 级别。通常，共享内存的容量远小于 [全局内存](/gpu-glossary/device-software/global-memory/) ，但在吞吐量和延迟方面快得多。

因此，一个相当典型的 [内核](/gpu-glossary/device-software/kernel/) 通常如下所示：

- 从 [全局内存](/gpu-glossary/device-software/global-memory/) 加载数据到共享内存
- 通过 [CUDA 核心](/gpu-glossary/device-hardware/cuda-core/) 和 [Tensor Core](/gpu-glossary/device-hardware/tensor-core/) 对该数据执行一系列算术运算
- （可选） 在执行这些操作时，通过屏障同步 [线程块](/gpu-glossary/device-software/thread-block/) 内的 [线程](/gpu-glossary/device-software/thread/)
- 将数据写回 [全局内存](/gpu-glossary/device-software/global-memory/)，（可选）通过原子操作防止跨 [线程块](/gpu-glossary/device-software/thread-block/) 间的数据竞争

共享内存存储在 GPU 的 [流式多处理器 (SM)](/gpu-glossary/device-hardware/streaming-multiprocessor/) 的 [L1 数据缓存](/gpu-glossary/device-hardware/l1-data-cache/) 中。