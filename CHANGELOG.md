# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
