---
title: "什么是活动周期？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
活动周期指的是 [流式多处理器 (Streaming Multiprocessor)](/gpu-glossary/device-hardware/streaming-multiprocessor/) 中至少驻留有一个 [活动线程束（active warp）](/gpu-glossary/perf/warp-execution-state/) 的时钟周期。该 [线程束 (warp)](/gpu-glossary/device-software/warp/) 可能处于 [就绪 (eligible)](/gpu-glossary/perf/warp-execution-state/) 或 [停顿 (stalled)](/gpu-glossary/perf/warp-execution-state/) 状态。

![](/gpu-glossary/images/light-cycles.svg)

> 此图中所示的所有周期均为活动周期。图表灵感来源于 GTC 2025 上的 [*CUDA Techniques to Maximize Compute and Instruction Throughput*](https://www.nvidia.com/en-us/on-demand/session/gtc25-s72685/) 演讲。