// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const sidebar = JSON.parse(readFileSync('./src/data/sidebar.json', 'utf8')).sections;

// https://astro.build/config
export default defineConfig({
	site: 'https://codingpracticegroup.github.io',
	base: '/gpu-glossary',
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'GPU 术语表',
			description: '简体中文版 GPU 术语表：GPU 硬件、CUDA 软件栈与性能优化术语。译自 Modal GPU Glossary。',
			locales: { root: { label: '简体中文', lang: 'zh-CN' } },
			social: [
				{ icon: 'github', label: 'GitHub 仓库', href: 'https://github.com/CodingPracticeGroup/gpu-glossary' },
				{ icon: 'external', label: '英文原文', href: 'https://modal.com/gpu-glossary' },
			],
			editLink: {
				baseUrl: 'https://github.com/CodingPracticeGroup/gpu-glossary/edit/site-zh/src/content/docs/',
			},
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'viewport',
						content: 'width=device-width, initial-scale=1',
					},
				},
			],
			sidebar,
		}),
	],
});
