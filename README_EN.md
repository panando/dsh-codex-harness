# dsh-codex-harness

[![npm version](https://img.shields.io/npm/v/@panando/dsh-codex-harness.svg)](https://www.npmjs.com/package/@panando/dsh-codex-harness)
[![license](https://img.shields.io/npm/l/@panando/dsh-codex-harness.svg)](./LICENSE)

**A coding mode for DeepSeek Harness (DSH).**

Install this package and the DSH mode selector gains a **Codex mode**. A session that uses it inspects the repository before touching files, searches with the session's own search tools instead of shelling out, runs long commands in the background, and tells you what changed and how it was verified. Other modes are untouched, and DSH keeps working without this package.

## The problem it solves

The standard preset that ships with DSH targets general conversation: it can chat, look things up, and change a file or two. Coding is a different job. Four things go wrong most often:

| Problem | How it shows up | What Codex mode does |
| --- | --- | --- |
| Acting before looking | Half of the change is done when the repository turns out to be shaped differently | Explore read-only first, lay out a plan, then edit |
| Search by guesswork | Repeated `grep` calls over a large repository: slow and often blocked by the sandbox | Search straight through the built-in `grep` and `glob` tools |
| Long commands block the chat | A build takes minutes and nothing else can happen | Run it as a background job and keep talking |
| Claims without evidence | "Fixed" with no test run and no log | The contract requires real output in the delivery |

Those habits belong in a system prompt, but they do not belong in a chat-oriented standard mode. So this package registers an **independent preset** that bundles the habits with a tool set, and that preset applies only to its own sessions.

## Features

| Capability | What it does |
| --- | --- |
| Engineering behavior contract | Read before edit, plan first, search before shelling out, back claims with evidence; the text lives in `lib/prompts.js` |
| Terminal | bash on macOS and Linux, PowerShell on Windows, picked automatically per platform |
| Files and search | Read and write files, search by filename or content, all under the session's own file policy |
| Plan mode | Explore read-only, produce a plan you can execute, then start changing files |
| Background jobs | Builds, tests, and installs run in the background while the conversation continues |
| Context compaction | Long conversations are compacted and oversized tool output is pruned |
| Web | Web search and page fetch |
| Skills | Load skills from the filesystem and invoke them by name |
| Collaboration | Goal tracking, todo lists, user questions, and result presentation |
| Settings card | A read-only card under Settings → Plugins → `@panando/dsh-codex-harness` telling you where the prompt lives and how to reload changes |

Every tool comes from an official DSH plugin package. This bundle only assembles them for the Codex mode; it does not reimplement them.

## When to use it

Good fit: changing features, fixing bugs, or writing tests in an existing repository; tasks where you must understand the structure before touching it; long tasks that involve repeated builds and test runs.

Poor fit: purely conversational sessions, writing prose, or looking things up without touching code — the standard mode is lighter for those.

## Requirements

| Component | Version | Notes |
| --- | --- | --- |
| DSH | 0.2.1-rc.2 or newer, below 0.3.0 (prereleases included) | Declared once as an `engines.dsh` range, not pinned per version |
| Node.js | 18 or later | 22+ recommended |

This package states the DSH versions it supports in one field, `engines.dsh` in `package.json`, whose value is `^0.2.1-rc.2`. In semantic versioning (the shared rules for comparing version numbers) that means every version from 0.2.1-rc.2 up to, but not including, 0.3.0, including prereleases such as `-rc.1` and `-rc.2`.

DSH compares that range with the running version whenever it installs or enables a plugin. So when DSH moves from 0.2.1-rc.2 to 0.2.1-rc.3, 0.2.2, or another release on the same 0.2 line, this package keeps working without a version bump or a new release. The DSH plugin packages listed in `peerDependencies` use the same range, so the two places agree.

If your DSH version falls outside the range (a future 0.3.0, say), the install still reports an incompatibility. You then have two options. The first is to grant a one-off exemption for that exact plugin version on that exact DSH version with `dsh plugin allow-version`, which the plugin manager UI offers as well. The second is to upgrade this package to a release that declares the new range.

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
