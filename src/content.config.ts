import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: () =>
				z.object({
					// 翻译复核状态：unreviewed = 未经人工对照英文原文复核；reviewed = 已复核。
					status: z.enum(['unreviewed', 'reviewed']).default('unreviewed'),
					// 复核/校对时所依据的上游（modal-labs/gpu-glossary）提交号。
					upstream_commit: z.string().optional(),
					// 复核人（GitHub 用户名），未复核时省略。
					reviewer: z.string().optional(),
				}),
		}),
	}),
};
