/*
 * Web UI settings card for the Codex preset.
 *
 * The card registers at the `plugins.bundle.config` slot, keyed by package
 * name. That slot is the only per-plugin slot this DSH release renders, so the
 * card shows up on the plugin's detail page under Settings -> Plugins.
 *
 * Styling uses the `--dsw-alias-*` theme tokens of this release; the older
 * `--color-*` names resolve to nothing here and leave the card without a
 * background.
 */

window.__ModuleLoader__.load({
  id: '@panando/dsh-codex-harness',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const rows = [
      ['身份声明', '由预设的 persona 行给出：You are Codex…，并带上模型名。'],
      ['行为约定', 'lib/prompts.js 里的 Codex 系统提示词，注册成提示词组装表的一节（order 100）。'],
      ['工具集', '预设自带一份工具清单：终端、文件读写与检索、后台任务、目标、计划模式、待办、联网搜索、技能、present。'],
      ['怎么用', '新建会话时在预设选择器里挑「Codex 模式」；已经在进行的会话不换预设。'],
      ['想改提示词', '编辑本插件目录下的 lib/prompts.js，改完开一个新会话生效。'],
      ['没有模型设置', '这个预设不钉死模型，沿用 profile 的全局默认模型。'],
    ];

    function CodexSettingsPanel() {
      return h('div', {
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: 'var(--dsw-alias-bg-layer-1)',
          border: '1px solid var(--dsw-alias-border-l1)',
        },
      },
        h('h3', {
          style: { margin: '0 0 8px 0', color: 'var(--dsw-alias-label-primary)', fontSize: '15px' },
        }, 'Codex 模式'),
        h('p', {
          style: {
            margin: '0 0 12px 0',
            color: 'var(--dsw-alias-label-secondary)',
            fontSize: '14px',
            lineHeight: '1.6',
          },
        }, 'Codex 风格的编码模式：一份精简的行为约定，配一套够用的工具清单。'),
        h('dl', { style: { margin: '0', fontSize: '13px', lineHeight: '1.7' } },
          rows.flatMap(([term, desc]) => [
            h('dt', {
              key: term,
              style: { color: 'var(--dsw-alias-brand-primary)', fontWeight: '600' },
            }, term),
            h('dd', {
              key: term + '-desc',
              style: { margin: '0 0 8px 0', color: 'var(--dsw-alias-label-secondary)' },
            }, desc),
          ]),
        ),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('plugins.bundle.config', () =>
          ctx.slots.register({
            name: 'plugins.bundle.config',
            key: '@panando/dsh-codex-harness',
            label: () => 'Codex 模式',
          }, CodexSettingsPanel),
        );
      },
    };
  },
});
