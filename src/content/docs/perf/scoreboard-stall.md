---
title: "什么是记分板停顿？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
当某条指令由于依赖先前指令的结果而无法发射（Issue）时，就会发生记分板停顿 (Scoreboard Stall)。

记分板 (Scoreboard) 是一种硬件结构，用于追踪哪些 [寄存器](/gpu-glossary/device-software/registers/) 正等待被在途（in-flight）指令写入。[线程束 (warp)](/gpu-glossary/device-software/warp/) 处于[停顿状态](/gpu-glossary/perf/warp-execution-state/) 时便无法推进。

记分板停顿通常可以分为两类：短记分板停顿 (Short Scoreboard Stalls) 和长记分板停顿 (Long Scoreboard Stalls)。

短记分板停顿发生在某条指令等待一个不会离开 [流式多处理器 (SM)](/gpu-glossary/device-hardware/streaming-multiprocessor/) 的可变延迟指令的结果时。最突出的例子是 `LDS`、`STS` 这类 [共享内存](/gpu-glossary/device-software/shared-memory/) 操作。某些 [特殊功能单元 (SFU)](/gpu-glossary/device-hardware/special-function-unit/) 操作同样会触发短记分板停顿，其缘由多少有些隐晦，但[有讨论指出](https://stackoverflow.com/questions/66123750/what-are-the-long-and-short-scoreboards-w-r-t-mio-l1tex)这与其接入的是和共享内存访问相同的 Memory Input/Output（MIO）硬件有关。

长记分板停顿发生在某条指令等待一个可能离开 [SM](/gpu-glossary/device-hardware/streaming-multiprocessor/) 的内存操作的结果时，例如 [全局内存](/gpu-glossary/device-software/global-memory/) 加载（`LDG`）或存储（`STG`）。[内存受限](/gpu-glossary/perf/memory-bound/) 的代码以长记分板停顿为主。

部分记分板信息可以从 [流式汇编器 (SASS)](/gpu-glossary/device-software/streaming-assembler/) 中读出来。例如你会看到，每个 [线程束 (warp)](/gpu-glossary/device-software/warp/) 有六个互不相同的屏障标识符（barrier identifiers），编译器用它们在指令之间追踪数据依赖。

具体来说，下面是带 `--dump-sass` 标志运行 `cuobjdump` 时你可能看到的内容：

```nasm
[barrier:  :  :  :  ]  /*line*/  INSTRUCTION Ri, [Rj] ; # Format: scoreboard info, line number, instruction, operands
[B------:R-:W2:-:S04]  /*00f0*/  LDG.E.SYS R0, [R2] ;   # 设置记分板 2
[B------:R-:W2:-:S01]  /*0100*/  LDG.E.SYS R5, [R4] ;   # `ptxas` 智能地复用了记分板 2
...
[B--2---:R-:W-:Y:S08]  /*0150*/  IMAD R0, R0, c[0x0][0x160], R5 ;  # 等待记分板 2
```

我们可以看到，这里的 `IMAD` 指令在记分板 2 上有一个栅栏同步/屏障（`B--2---`），这表明它需要该位标志（Bit Flag）被清除后才能发射。 两条 `LDG` 指令在发射时都会递增记分板 2（`W2` 写入），从而确保 `IMAD` 指令在执行前，寄存器 R0 和 R5 中已经写入了正确的值。

一条指令可能会受到多个记分板的屏障限制，例如 `B01--4-` 意味着必须等待记分板 0、1、4 全部被清除。当数据依赖关系得到满足时，对应的记分板就会递减。

记分板的复用可能会导致 Nsight Compute 的停顿分类不够准确。如果长记分板停顿和短记分板停顿使用了同一个记分板，它们可能会被混淆。

[记分板](https://www.cs.umd.edu/~meesh/411/website/projects/dynamic/scoreboard.html) 是一种在动态指令调度中用于跟踪依赖关系的技术，其历史可以追溯到 “第一台超级计算机” —— [Control Data Corporation 6600](https://en.wikipedia.org/wiki/CDC_6600)，其中一台机器曾在 1966 年 [推翻了欧拉幂和猜想](https://www.ams.org/journals/bull/1966-72-06/S0002-9904-1966-11654-3/S0002-9904-1966-11654-3.pdf)。

与 CPU 不同的是，GPU 中的记分板并不用于 [线程](/gpu-glossary/device-software/thread/) 内部的乱序执行（指令级并行，ILP），而仅用于线程之间（线程级并行，TLP）；具体可参见相关的 [NVIDIA 专利](https://patents.google.com/patent/US7676657)。

欲了解更多关于 GPU 记分板实现的详细信息，请参阅 [Matthew D. Sinclair 教授的课程讲义 (Slides)](https://pages.cs.wisc.edu/~sinclair/courses/cs758/fall2019/handouts/lecture/cs758-fall19-gpu_uarch2.pdf)。