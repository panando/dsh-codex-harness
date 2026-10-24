# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] — 2026-10-24

### Fixed

- DSH 0.2.1-rc.3 上安装本包会被判定为「不支持当前 DSH 版本」。原因是 0.1.3 把 20 个 `@deepseek-ai/dsh-*` 的 peer 依赖全部钉成精确版本 `0.2.1-rc.2`，而 DSH 的兼容性检查要求当前运行的版本满足每一个这样的 peer，rc.3 因此对不上。
- 不再把 DSH 版本写死：`package.json` 新增 `engines.dsh: "^0.2.1-rc.2"`，`peerDependencies` 里的 20 个精确版本一并改成同一个范围。DSH 的检查代码优先读 `engines.dsh`，读到之后只按这一个范围判定，不再逐个比对 peer。

### Changed

- 中文与英文 README 的「环境要求」一节重写：说明 `^0.2.1-rc.2` 指的是「0.2.1-rc.2 及以上、0.3.0 以下，含预发布版」；说明同一条 0.2 线内的小版本升级不需要本包跟着改版本号；补上版本落到范围之外时用 `dsh plugin allow-version` 开一次性豁免的办法。

## [0.1.3] — 2026-10-20

### Changed

- 重写中文与英文 README：开篇直接说明插件用途和它要解决的问题，核心能力改为表格，补充适用与不适用的场景。
- `package.json` 的 `description` 改为中文一句话说明。

## [0.1.2] — 2026-10-20

### Changed

- LICENSE now names a single copyright holder.
- Package metadata version bumped to 0.1.2; no functional changes.

## [0.1.1] — 2026-10-20

First public release on npm as `@panando/dsh-codex-harness`.

### Added

- A Codex-style agent preset for DSH 0.2.x, registered declaratively through `cordis.patch.yml`.
- Full tool set for coding sessions:
  - terminal (bash or PowerShell, chosen by platform)
  - file read/write and content search
  - background jobs
  - goal tracking
  - plan mode
  - context compaction and tool-output pruning
  - user questions and todo lists
  - web search and fetch
  - skill system
  - result presentation
- Behavior contract registered as a prompt section at order 100, mounted inside the preset so it never leaks into other modes.
- Web UI settings card under Settings → Plugins → `@panando/dsh-codex-harness`.
- Chinese and English documentation.

### Notes

- No model is pinned; the preset inherits the profile's default model.
- The identity line uses `{{model}}` only. This DSH release registers just `provider` and `model` as prompt variables, so any other template name aborts the turn.
- Tool names mentioned in the behavior contract (`grep`, `glob`, `todo_write`) match the tools this runtime actually provides.
