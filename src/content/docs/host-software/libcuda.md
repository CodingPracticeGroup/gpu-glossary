---
title: "什么是 libcuda.so？"
status: reviewed
reviewer: ai-review
upstream_commit: 9597497a3d8102c9cd17fc35ff06af5d97928275
---
在 Linux 系统上，实现 [CUDA Driver API](/gpu-glossary/host-software/cuda-driver-api/) 的二进制共享对象文件的典型名称是 libcuda.so。CUDA 程序会动态链接该文件，若缺失通常意味着驱动安装不完整或存在问题。
