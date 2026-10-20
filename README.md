# dsh-codex-harness

[![npm version](https://img.shields.io/npm/v/@panando/dsh-codex-harness.svg)](https://www.npmjs.com/package/@panando/dsh-codex-harness)
[![license](https://img.shields.io/npm/l/@panando/dsh-codex-harness.svg)](./LICENSE)

**给 DeepSeek Harness（下面简称 DSH）加一个专门写代码的工作模式。**

装上这个包，DSH 的模式选择器里会多出一项「Codex 模式」。选中它的会话会先看清楚项目结构再动手改文件、优先用会话自带的检索工具而不是随手敲命令、把耗时的命令丢到后台跑、改完之后告诉你改了哪些文件、怎么验证的。其余模式不受影响，DSH 不装它也照常工作。

## 这个插件解决什么问题

DSH 自带的标准模式面向通用对话：能聊天、能查资料、也能改点东西。但写代码和聊天是两种工作。写代码时，最常见的四种翻车方式是这样的：

| 常见问题 | 表现 | Codex 模式的应对 |
| --- | --- | --- |
| 没看清就动手 | 改到一半才发现项目结构和想的不一样 | 先只读勘察，列出计划，确认后再进入修改 |
| 搜索靠猜 | 在几万行的仓库里反复敲 `grep` 找文件，又慢又容易被沙箱拦 | 直接用会话内置的 `grep` 和 `glob` 工具检索 |
| 长命令堵住对话 | 跑一次构建要几分钟，期间只能干等 | 命令放到后台任务里跑，对话继续 |
| 说完成但不给证据 | 「已修复」三个字，没跑过测试也没看日志 | 行为约定要求交付时附上真实输出 |

这些习惯写在系统提示词里最省事，但它们不该出现在聊天用的标准模式里。所以这个包做的事是：注册一个**独立的预设**，把这些习惯和一套够用的工具清单装进去，只在这个预设的会话里生效。

## 核心能力

| 能力 | 具体表现 |
| --- | --- |
| 工程化行为约定 | 先读后改、计划先行、检索优先、交付附验证证据，正文在 `lib/prompts.js` 可以改 |
| 终端 | macOS 和 Linux 用 bash，Windows 用 PowerShell，按运行平台自动二选一 |
| 文件读写与检索 | 读写文件，按文件名或内容检索，检索遵守会话自己的文件权限策略 |
| 计划模式 | 先在只读状态下摸清代码结构，产出一份能照着执行的计划，再开始改 |
| 后台任务 | 耗时的构建、测试、安装可以后台运行，运行期间继续对话 |
| 上下文压缩 | 对话变长时自动压缩，过长的工具输出会被裁剪，不占满上下文名额 |
| 联网 | 网页搜索与网页抓取 |
| 技能系统 | 从文件系统加载技能，需要时按名称调用 |
| 日常协作 | 目标跟踪、待办清单、向用户提问、结果展示 |
| 设置页卡片 | 「设置 → 插件 → @panando/dsh-codex-harness」有一张说明卡片，写明提示词在哪、怎么改 |

所有工具都由 DSH 官方发布的插件包提供，本包只负责按 Codex 模式的需要把它们组装起来，不重复实现工具本身。

## 什么时候适合用

适合：给一个已有的代码仓库改功能、修 bug、写测试；需要先读懂结构再动手的任务；需要反复跑构建和测试的长任务。

不太适合：纯聊天、写文案、查资料这类不需要碰代码的会话，用标准模式更轻。

## 环境要求

| 组件 | 版本 | 说明 |
| --- | --- | --- |
| DSH | 0.2.1-rc.2 或其他 0.2.x 正式版 | 本包的 DSH 官方插件依赖按 0.2.1-rc.2 锁定 |
| Node.js | 18 或更高 | 建议 22 以上 |

本包把用到的 DSH 插件声明为 peer 依赖（peer dependency，意思是这些包由宿主 DSH 提供，本包不重复安装）。如果你的 DSH 版本与上表不同，插件的安装过程会提示版本不兼容，这时把 `package.json` 里 `peerDependencies` 的版本号改成你实际使用的 DSH 版本即可。

## 安装方式

### 从 npm 安装（推荐）

先进入你正在使用的 DSH profile 目录，再安装：

```bash
cd ~/.dsh/profiles/<你的 profile 名>
pnpm add @panando/dsh-codex-harness
```

profile 目录的名字因安装方式而异，常见的有 `desktop`、`web`，以你本机实际的目录名称为准。

然后编辑这个 profile 的 `package.json`，把包名加进 `dsh.profile.bundles` 数组：

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

改完重启 DSH。bundle 的装配发生在启动阶段，改文件不会热生效。

### 从源码安装（开发用）

```bash
git clone https://github.com/panando/dsh-codex-harness.git
cd dsh-codex-harness
```

把这份代码链接进 profile：

```bash
cd ~/.dsh/profiles/<你的 profile 名>
pnpm add /绝对路径/dsh-codex-harness
```

同样要把 `@panando/dsh-codex-harness` 加进 `dsh.profile.bundles`，然后重启 DSH。

## 使用方法

1. 启动 DSH，打开 Web 界面。
2. **新建一个会话**，在模式选择器里选择「Codex 模式」。
3. 之后这个会话就按 Codex 模式的行为约定工作。

有两点需要注意：

- 已经在进行的会话不会更换预设。想用新预设，请新开会话。
- 本预设不指定模型，用的就是 profile 的全局默认模型。想换模型，去 profile 的设置里换，不必改本包。

## 配置说明

本包没有需要填写的必填配置。下面几处是你可能想改的地方，按修改代价从低到高排列。

### 修改行为约定（提示词正文）

行为约定的正文只有一处来源，就是安装目录下的 `lib/prompts.js` 里的 `DEFAULT_CODEX_SYSTEM_PROMPT`：

```
node_modules/@panando/dsh-codex-harness/lib/prompts.js
```

改完开一个新会话生效。改的时候有一条硬性限制：正文里不能出现 `{{变量名}}` 这种模板写法。DSH 按变量表严格解析这种写法，而这一版的变量表里只有 `provider` 和 `model` 两个名字，写了别的名字会让整轮对话直接报错。

### 修改身份声明

身份声明在 `cordis.patch.yml` 的 `codex-persona` 那一行，字段名是 `prefix`。默认值是：

```
You are Codex, a coding agent based on the {{model}} model.
```

同样只能使用 `{{model}}` 和 `{{provider}}` 两个变量。工作目录不用写进来，DSH 每轮会自己把运行时上下文（工作目录、profile、沙箱模式）写进提示词。

### 增删工具

工具清单在 `cordis.patch.yml` 的插件列表里，每一项是一个 DSH 官方插件包。删掉一行就少一个工具；`disabled` 字段可以按条件关闭某个工具，终端的两行就是靠这个字段按平台二选一。

### 内置参数表

插件的 `lib/index.js` 里声明了下面这些配置字段。当前版本的运行行为以 `cordis.patch.yml` 和 `lib/prompts.js` 为准，这些字段留作后续版本接入运行时设置用。

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `persona` | 字符串 | 见 `lib/prompts.js` | 身份声明文本 |
| `systemPrompt` | 字符串 | 见 `lib/prompts.js` | 行为约定正文 |
| `terminalToolsEnabled` | 布尔 | `true` | 是否启用终端工具 |
| `patchToolEnabled` | 布尔 | `true` | 是否启用文件修改工具 |
| `planToolEnabled` | 布尔 | `true` | 是否启用计划模式 |
| `webSearchEnabled` | 布尔 | `true` | 是否启用联网搜索 |
| `fast` | 布尔 | `false` | 精简工具集模式 |
| `fastModeControlEnabled` | 布尔 | `true` | 是否允许运行时切换精简模式 |

## 包含的工具

| 工具包 | 作用 |
| --- | --- |
| `dsh-tool-bash` / `dsh-tool-pwsh` | 终端命令，按平台二选一 |
| `dsh-tool-fs` | 文件读写 |
| `dsh-tool-fs-search` | 按文件名和文件内容检索 |
| `dsh-tool-jobs` | 后台任务管理 |
| `dsh-tool-goal` / `dsh-command-goal` | 目标跟踪 |
| `dsh-plan-mode` | 计划模式 |
| `dsh-compaction-basic` / `dsh-command-compact` / `dsh-compaction-tool-result-pruner` | 上下文压缩与工具输出裁剪 |
| `dsh-tool-ask-user` | 向用户提问 |
| `dsh-tool-todo` | 待办清单 |
| `dsh-tool-web` | 联网搜索与网页抓取 |
| `dsh-skill-filesystem` / `dsh-tool-skill` | 技能系统 |
| `dsh-tool-present` | 结果展示 |

## 目录结构

```
dsh-codex-harness/
├── cordis.patch.yml    # 预设与工具清单，DSH 启动时读取
├── client.js           # Web 界面的说明卡片
├── lib/
│   ├── index.js        # 宿主侧入口：把提示词注册成组装表里的一节
│   └── prompts.js      # 默认身份声明与行为约定正文
├── package.json
├── README.md           # 本文件
├── README_EN.md        # 英文说明
├── CHANGELOG.md
└── LICENSE
```

## 实现说明

以下几处是实现上的取舍，改代码之前值得先看一眼。

**提示词按节注册，不挂在 profile 平面。** `lib/index.js` 把行为约定注册成提示词组装表里的一节，名字是 `codex:system-prompt`，排序值是 100。DSH 按排序值从小到大拼接提示词：身份声明是 0，计划模式的说明是 500，所以 100 让行为约定紧跟身份声明、排在工具说明之前。这一节由预设挂载，因此只在 Codex 模式的会话里出现，不会渗进其他模式。

**只有 `systemPrompt` 字段会真正影响提示词。** `apply()` 只读这一个字段，其余字段是预留给后续版本的配置位。

**设置卡片注册在 `plugins.bundle.config` 席位。** 这个席位只在「设置 → 插件 → 某个包」的详情页里渲染，键是包名。0.2.x 的 Web 界面没有为插件单独开设置页的席位，注册到别处会查不到、面板不显示。

**提示词里点名的工具都是这台运行时真有的工具。** 检索写成内置的 `grep` 和 `glob` 工具，待办写成 `todo_write`，这两处改动是为了让模型照着提示词就能调通，不必先试错再找退路。

## 许可证

[MIT](./LICENSE)
