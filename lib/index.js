/*
 * Host-side entry for the Codex preset.
 *
 * The preset itself is declared in cordis.patch.yml; this module only supplies
 * the behavior contract that the preset mounts.
 *
 * 设计要点：把 lib/prompts.js 里的正文注册成提示词组装表里的一节。本插件由
 * cordis.patch.yml 里的 Codex 预设挂载，所以这一节只在 Codex 模式的会话里出现，
 * 不会渗到其他模式。
 *
 * 为什么不用 settings 服务：DSH 0.2.1 的 settings 服务里没有 markVolatile
 * 这一类方法，注册过去的配置没有任何代码读取，提示词会变成死代码。注册成
 * 组装表的一节是这一版真正生效的接法。
 */

import z from "@deepseek-ai/schemastery";
import { DEFAULT_CODEX_SYSTEM_PROMPT, DEFAULT_CODEX_PERSONA } from "./prompts.js";

export const name = "dsh-codex-harness";

/** 只依赖提示词注册表：本插件唯一的职责就是往它里面加一节。 */
export const inject = ["systemPrompt"];

/** 本节的名字，必须与组装表里其他节不重名。 */
const SECTION_NAME = "codex:system-prompt";

/**
 * 本节在提示词里的落点。DSH 按 order 从小到大拼装：
 * deployment:persona-prefix 是 0，PLAN_POLICY 是 500，因此 100 让 Codex
 * 的行为约定紧随身份声明，排在工具说明之前。
 */
const SECTION_ORDER = 100;

export const Config = z.object({
  persona: z.string().default(DEFAULT_CODEX_PERSONA),
  systemPrompt: z.string().default(DEFAULT_CODEX_SYSTEM_PROMPT),
  terminalToolsEnabled: z.boolean().default(true),
  patchToolEnabled: z.boolean().default(true),
  planToolEnabled: z.boolean().default(true),
  webSearchEnabled: z.boolean().default(true),
  fast: z.boolean().default(false),
  fastModeControlEnabled: z.boolean().default(true),
});

export function apply(ctx, config) {
  const text = typeof config?.systemPrompt === "string" ? config.systemPrompt.trim() : "";
  if (text === "") return;
  ctx.effect(
    () => ctx.systemPrompt.section({ name: SECTION_NAME, order: SECTION_ORDER, text }),
    "codex.systemPrompt.section()",
  );
}

export default { name, inject, Config, apply };
