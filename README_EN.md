# dsh-codex-harness

A Codex-style coding agent preset (bundle) for DeepSeek Harness (DSH) 0.2.x. After installation, the mode selector in DSH gains a **Codex mode**: an engineering-oriented behavior contract plus a complete tool set for reading and writing code, running commands, and looking things up.

## Overview

A DSH session's behavior is defined by its *preset*: a list that names the identity line, the behavior contract, and the tools the session may use. DSH ships a few built-in presets; the standard preset targets general conversation.

Coding is not quite conversation. When writing code you want the agent to inspect the repository before touching it, to search with the session's own search tools instead of shelling out, and to report what changed and how it was verified. Those habits belong in a system prompt, but they do not belong in a chat-oriented standard mode.

This package registers an independent preset that bundles those habits with a tool set. Standard mode is untouched; DSH keeps working without this package.

## Features

- **Independent preset** — appears as "Codex 模式" in the mode selector and applies only to new sessions.
- **Identity line** — opens the system prompt by describing the agent as a coding agent and naming the current model.
- **Behavior contract** — read before edit, prefer built-in search tools, plan before executing, back up completion claims with evidence.
- **Terminal** — bash on macOS and Linux, PowerShell on Windows, selected automatically per platform.
- **Files** — read and write files, search by content or filename, governed by the session's file policy.
- **Background jobs** — long-running commands can run in the background while the conversation continues.
- **Plan mode** — explore read-only first, produce a plan you can execute, then make changes.
- **Context compaction** — compacts long conversations and prunes oversized tool output.
- **Web** — web search and page fetch.
- **Skills** — load skills from the filesystem and invoke them by name.
- **Collaboration** — goal tracking, todo lists, user questions, and result presentation.
- **Settings card** — a read-only card under Settings → Plugins → `@panando/dsh-codex-harness` telling you where the prompt lives and how to reload changes.

Every tool comes from an official DSH plugin package. This bundle only assembles them for the Codex mode; it does not reimplement them.

## Requirements

| Component | Version | Notes |
| --- | --- | --- |
| DSH | 0.2.1-rc.2 or another 0.2.x release | The 21 DSH plugin dependencies are pinned to 0.2.1-rc.2 |
| Node.js | 18 or later | 22+ recommended |

The DSH plugins are declared as peer dependencies: the host DSH provides them and this package does not install a second copy. If your DSH version differs, the plugin manager reports an incompatibility at install time; update the versions in `peerDependencies` to the DSH version you actually run.

## Installation

### From npm (recommended)

Enter the DSH profile you are using, then install:

```bash
cd ~/.dsh/profiles/<your-profile>
pnpm add @panando/dsh-codex-harness
```

Profile directory names vary by installation; `desktop` and `web` are common.

Then add the package to `dsh.profile.bundles` in that profile's `package.json`:

```json
{
  "dsh": {
    "profile": {
      "bundles": [
        "@deepseek-ai/dsh-base",
        "@deepseek-ai/dsh-web-app",
        "@panando/dsh-codex-harness"
      ]
    }
  }
}
```

Restart DSH afterwards. Bundles are composed at startup; editing files does not take effect on a running instance.

### From source (development)

```bash
git clone https://github.com/panando/dsh-codex-harness.git
cd dsh-codex-harness
```

Link the checkout into your profile:

```bash
cd ~/.dsh/profiles/<your-profile>
pnpm add /absolute/path/to/dsh-codex-harness
```

Add `@panando/dsh-codex-harness` to `dsh.profile.bundles` as shown above, then restart DSH.

## Usage

1. Start DSH and open the web UI.
2. **Start a new session** and pick "Codex 模式" in the mode selector.
3. The session now follows the Codex behavior contract.

Two things to keep in mind:

- An existing session keeps its preset. Start a new session to use this one.
- This preset pins no model; it inherits the profile's default model. Change the model in the profile settings, not here.

## Configuration

Nothing is required to get started. The following are the places you may want to change, ordered by cost.

### Behavior contract (prompt body)

The prompt body has exactly one source: `DEFAULT_CODEX_SYSTEM_PROMPT` in `lib/prompts.js` inside the installed package:

```
node_modules/@panando/dsh-codex-harness/lib/prompts.js
```

Start a new session after editing. One hard constraint: the text must not contain `{{variable}}` templates. DSH resolves that syntax strictly against a variable table that, in this release, only holds `provider` and `model`; any other name aborts the turn.

### Identity line

The identity line is the `codex-persona` row in `cordis.patch.yml`, field `prefix`. Default:

```
You are Codex, a coding agent based on the {{model}} model.
```

Only `{{model}}` and `{{provider}}` are available. Do not add the working directory: DSH writes the runtime context (working directory, profile, sandbox mode) into the prompt every turn.

### Adding or removing tools

The tool list lives in the `plugins` array of `cordis.patch.yml`; each entry is an official DSH plugin package. Removing a row removes a tool. The `disabled` field switches a row off by condition — the two terminal rows use it to select bash or PowerShell per platform.

### Declared settings

`lib/index.js` declares the fields below. In this release the runtime behavior is defined by `cordis.patch.yml` and `lib/prompts.js`; these fields are placeholders for a future runtime-settings integration.

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `persona` | string | see `lib/prompts.js` | Identity line |
| `systemPrompt` | string | see `lib/prompts.js` | Behavior contract |
| `terminalToolsEnabled` | boolean | `true` | Enable terminal tools |
| `patchToolEnabled` | boolean | `true` | Enable file-editing tools |
| `planToolEnabled` | boolean | `true` | Enable plan mode |
| `webSearchEnabled` | boolean | `true` | Enable web search |
| `fast` | boolean | `false` | Reduced tool set |
| `fastModeControlEnabled` | boolean | `true` | Allow toggling the reduced mode at runtime |

## Included tools

| Package | Purpose |
| --- | --- |
| `dsh-tool-bash` / `dsh-tool-pwsh` | Terminal commands, one per platform |
| `dsh-tool-fs` | File read and write |
| `dsh-tool-fs-search` | Search by filename and file content |
| `dsh-tool-jobs` | Background job management |
| `dsh-tool-goal` / `dsh-command-goal` | Goal tracking |
| `dsh-plan-mode` | Plan mode |
| `dsh-compaction-basic` / `dsh-command-compact` / `dsh-compaction-tool-result-pruner` | Compaction and tool-output pruning |
| `dsh-tool-ask-user` | Ask the user questions |
| `dsh-tool-todo` | Todo lists |
| `dsh-tool-web` | Web search and fetch |
| `dsh-skill-filesystem` / `dsh-tool-skill` | Skill system |
| `dsh-tool-present` | Result presentation |

## Layout

```
dsh-codex-harness/
├── cordis.patch.yml    # Preset and tool list, read by DSH at startup
├── client.js           # Web UI settings card
├── lib/
│   ├── index.js        # Host entry: registers the prompt section
│   └── prompts.js      # Default identity line and behavior contract
├── package.json
├── README.md           # Chinese documentation
├── README_EN.md        # This file
├── CHANGELOG.md
└── LICENSE
```

## Implementation notes

A few decisions worth knowing before changing the code.

**The prompt is registered as a section, not mounted on the profile.** `lib/index.js` registers the behavior contract as a section named `codex:system-prompt` with order 100. DSH concatenates prompt sections by ascending order: the identity line is 0 and the plan-mode policy is 500, so 100 places the contract right after the identity line and before tool descriptions. The section is mounted by the preset, so it appears only in Codex-mode sessions and never leaks into other modes.

**Only `systemPrompt` affects the prompt today.** `apply()` reads that single field; the rest are declared placeholders.

**The settings card registers at the `plugins.bundle.config` slot.** That slot renders only inside a plugin's detail page, keyed by package name. DSH 0.2.x has no per-plugin settings page slot, so registering anywhere else renders nothing.

**Tool names in the prompt match this runtime.** Search is written as the built-in `grep`/`glob` tools and planning as `todo_write`, so the model can follow the prompt without trial and error.

## License

[MIT](./LICENSE)
