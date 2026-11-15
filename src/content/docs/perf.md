---
title: "性能（Performance）"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---

人们使用 GPU，是因为应用在通用硬件上的性能不够理想。这让为 GPU 编程与大多
数其他形式的编程截然不同。

对于传统的应用程序——比如数据库管理系统或 Web 服务器——正确性是首要关切。
如果应用丢失数据或返回错误的结果，那这个应用就算失败了，而性能往往被放在
一边。

在为 GPU 编程时，正确性通常是个定义模糊的概念："正确"的输出只在若干有效
比特位内成立，或者只对"表现良好（well-behaved）"输入中某个欠定的子集成
立。而且正确性至多是必要条件而非充分条件。如果应用的程序员无法取得更优越
的性能（按每秒、每美元或每瓦衡量），那这个应用就算失败了——因为 GPU 编程
太难、能力太受限、运行成本太高，以至于其他任何目标都轮不到排在性能前面。

在 NVIDIA，这个事实被浓缩成了一句干脆的口号："performance is the product"
（性能就是产品本身）。

GPU 术语表的这一部分汇集并定义了优化 GPU 程序性能所需理解的关键术语。大
致来说，当你使用 [NSight Compute](https://developer.nvidia.com/nsight-compute)
调试 GPU [核函数（kernel）](/gpu-glossary/device-software/kernel/)的性能问
题时遇到的术语，这里应当都有所覆盖。
