# 简体中文站点维护与译稿复核指南（site-zh 分支）

本文档只适用于 `site-zh` 分支。`main` 分支镜像上游
[modal-labs/gpu-glossary](https://github.com/modal-labs/gpu-glossary) 的英文
内容，**只读，不要直接在上面修改**。

## 分支模型

- `main`：跟踪上游英文内容。更新方式：`git fetch upstream && git merge --ff-only upstream/main`。
- `site-zh`：简体中文站点。内容包括：
  - `src/content/docs/`：译文词条（每个 `.md` 对应上游同路径词条）；
  - `public/images/`：示意图 SVG（源自 miter6 仓库与 Modal CDN）；
  - `scripts/`、`src/`、`astro.config.mjs`：Astro Starlight 建站代码；
  - `.github/workflows/deploy.yml`：推送到本分支后自动构建并发布到
    GitHub Pages（<https://codingpracticegroup.github.io/gpu-glossary/>）。

上游内容更新时：先把 `upstream/main` 合入 `main`，再把 `main` 合入
`site-zh`；冲突只会出现在改动过的词条上，按下面的复核流程处理即可。

## 译稿来源与复核状态

词条初始译文以 [miter6/gpu-glossary-zh](https://github.com/miter6/gpu-glossary-zh)
为草稿，该翻译质量不错但**不是标准答案**，所以每个词条的 frontmatter 都带
有复核状态：

```yaml
---
title: "什么是 Tensor Core？"   # 页面标题（会渲染为 H1，正文里不要再写标题）
status: unreviewed              # unreviewed | reviewed
upstream_commit: 9597497a...    # 译文所依据的上游英文提交号
reviewer: your-github-id        # 仅 reviewed 时填写
---
```

站点的「译稿复核进度」页按此统计与展示；CI（`npm run validate`）会检查字段
合法性、站内链接和图片引用。

## 单个词条的复核流程

1. **对照原文**：打开 `gpu-glossary/<同路径>.md`（英文）与
   `src/content/docs/<同路径>.md`（中文），逐段核对。
2. **检查要点**（按优先级）：
   - 技术事实、数值、单位、条件与例外是否被改变或遗漏；
   - 句读是否被错误合并（草稿由多来源汇编，存在段落粘连的先例）；
   - 所有链接是否指向正确词条、图片是否正常显示；
   - 术语是否符合 [`docs/terminology.md`](docs/terminology.md)。
3. **修改后自测**：`npm run validate`，并可选 `npm run dev` 本地预览。
4. **标记完成**：把 `status` 改为 `reviewed`，填写 `reviewer`，同时把
   `upstream_commit` 更新为你核对时 `main` 分支的头（`git rev-parse main`），
   表示译文与该英文版本对齐。提交 PR，标题带词条路径，如
   `review: device-hardware/tensor-core`。

## 术语统一

新出现或有争议的译法，先在讨论中定名，再登记进
[`docs/terminology.md`](docs/terminology.md)。已经复核过的词条如果使用了旧
译法，开单独提交统一。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖（Node ≥ 22.23.4） |
| `npm run dev` | 本地预览，<http://localhost:4321/gpu-glossary/> |
| `npm run validate` | 校验 frontmatter / 站内链接 / 图片 |
| `npm run build` | 构建静态站点到 `dist/` |
| `npm run gen:sidebar` | 新增或改名词条后，重新生成侧边栏 |

## 新增词条（上游新增页面时）

1. 从 `src/content/docs/` 新建同名文件，写 frontmatter（`status: unreviewed`）。
2. 在 `scripts/gen-sidebar.mjs` 的目录数据中加入该 slug（顺序对照原站），
   然后 `npm run gen:sidebar`。
3. 译文可参考 miter6 仓库（如已译）；没有就先自译，同样标记 `unreviewed`。

## 许可

- 英文原文：CC BY 4.0，© Modal（[modal-labs/gpu-glossary](https://github.com/modal-labs/gpu-glossary)）。
- 中文底稿：MIT，© miter6（[miter6/gpu-glossary-zh](https://github.com/miter6/gpu-glossary-zh)）。
- 衍生译文沿用 CC BY 4.0；站点请在页脚保留上述署名。
