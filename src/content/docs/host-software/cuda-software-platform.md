---
title: "CUDA 软件平台是什么？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
CUDA 软件平台是用于开发 CUDA 程序的软件集合。

CUDA 全称是 _Compute Unified Device Architecture_（统一计算设备架构）。  
根据上下文， CUDA 可以指代多个不同的事物：
一种 [总体设备架构](/gpu-glossary/device-hardware/cuda-device-architecture/)，或是适用于该设计架构的 [CUDA 编程模型](/gpu-glossary/device-software/cuda-programming-model/)，或是一种扩展高级语言（如 C 语言）以添加该编程模型的软件平台。

CUDA 的设计愿景在 [Lindholm 等人于 2008 年](https://www.cs.cmu.edu/afs/cs/academic/class/15869-f11/www/readings/lindholm08_tesla.pdf) 发布的白皮书中进行了阐述。我们强烈推荐这篇论文，它是 NVIDIA 文档中许多观点、图表乃至特定表述的原始出处。

本文重点关注 CUDA 的 _软件平台_。虽然也存在面向其他语言（如 FORTRAN、Python 和 [BASIC](/gpu-glossary/host-software/cutile-basic/)）的 CUDA 软件平台，但我们将聚焦于占主导地位的 [CUDA C++](/gpu-glossary/host-software/cuda-c/) 版本。

该平台大致可分为用于 _构建_ 应用程序的组件 （如 [NVIDIA CUDA 编译器驱动程序](/gpu-glossary/host-software/nvcc/) 工具链），以及在应用程序中 _使用_ 或 _调用_ 的组件（如 [CUDA Driver API](/gpu-glossary/host-software/cuda-driver-api/) 和 [CUDA Runtime API](/gpu-glossary/host-software/cuda-runtime-api/)），如下图所示。

![](/gpu-glossary/images/light-cuda-toolkit.svg)  

> CUDA 工具包。改编自《Professional CUDA C Programming Guide》。

在这些 API 之上，是为通用及特定领域准备的高性能 [内核 (kernel)](/gpu-glossary/device-software/kernel/) 库——例如做线性代数的 [cuBLAS](/gpu-glossary/host-software/cublas/)、做深度神经网络的 [cuDNN](/gpu-glossary/host-software/cudnn/)——也有供你自行组合此类内核的工具，例如 [CUTLASS](/gpu-glossary/host-software/cutlass/) 和 [CuTe DSL](/gpu-glossary/host-software/cute-dsl/)。