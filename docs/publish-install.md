# 编译 · 发布 · 安装 · 卸载

包名 **`dsh-context-track`**。发布物是已构建的 `dist/`（外加 `icon.svg`、`cordis.patch.yml`、`locale/`）。安装方**不必**再 build。

| 场景 | 章节 |
| --- | --- |
| 本仓库编译 / 自测 | [本地开发](#本地开发) |
| 发到 npm | [发布](#发布) |
| 别人怎么装 | [第三方安装](#第三方安装) |
| 卸掉插件 | [插件卸载](#插件卸载) |
| 本机 harness 联调 | [源码联调](#源码联调) |

> **环境** · Node `^22.19.0 \|\| >=24` · pnpm `>=11`（钉在 `pnpm@11.28.5`）  
> 发 npm 前：`npm login`，registry 为 `https://registry.npmjs.org/`  
> CLI：已装全局用 `dsh`；仅有 harness 源码时，在仓库根目录用 `pnpm dsh`

---

## 本地开发

```bash
pnpm install
pnpm test
pnpm run build
pnpm run clean          # 删掉 dist/
```

编完应有 `dist/host/index.js`，以及 Web 客户端 `dist/client/index.js`。后者是 `window.__ModuleLoader__.load` 工厂，不是 `tsc` 直接吐出的 ESM。`pnpm publish` 前会自动再 build。`clean` 只清本仓库构建产物，不碰 `$DSH_HOME` 或 profile。

### 验包

```bash
pnpm run build && pnpm pack
tar -tzf dsh-context-track-*.tgz | head -40
```

清单里须有 `package/dist/...`。只有 `package.json`、没有 `dist/` → `files` 配错了。

```bash
dsh plugin --profile demo add ./dsh-context-track-<version>.tgz
dsh --profile demo --dump-config    # 应能看到 dsh-context-track
dsh plugin --profile demo remove dsh-context-track
```

---

## 发布

同一版本只能发一次。升版本后再发：

```bash
npm view dsh-context-track version          # 404 = 名字可用
pnpm version 0.1.0 --no-git-tag-version
pnpm publish --dry-run --no-git-checks
pnpm publish --access public --no-git-checks
```

开了 2FA 时加 `--otp=xxxxxx`。

<details>
<summary>发 beta / 日常小改 / 不发公共 npm</summary>

**beta**（不污染 `latest`）：

```bash
pnpm version 0.1.0-beta.1 --no-git-tag-version
pnpm publish --tag beta --access public --no-git-checks
```

**日常小改**固定流程：

```bash
pnpm test && pnpm run build
pnpm version patch --no-git-tag-version
pnpm pack && tar -tzf dsh-context-track-*.tgz | head -20
pnpm publish --access public --no-git-checks
```

**不发公共 npm**：把 `pnpm pack` 得到的 `.tgz` 发给对方 → `dsh plugin add ./xxx.tgz`。  
Git 直装会拉源码且不自动 build，一般不如 npm / tgz。

</details>

发完核对：`npm view dsh-context-track`，或空目录 `pnpm add dsh-context-track`。

---

## 第三方安装

装的是已构建包，**不用**再跑本仓库的 build。

```bash
dsh plugin --profile <profile> add dsh-context-track
# 或指定版本：dsh-context-track@0.1.0 / dsh-context-track@beta

dsh web                              # 同 dsh --profile web
# 或其它 profile：dsh --profile <profile>
```

打开会话后，会话页签和右侧栏引导页出现「上下文链路追踪」。点开即可看树和详情。

> 单独 `pnpm add dsh-context-track` 只进 `node_modules`，**不会**启用 Harness 插件层。要用「上下文链路追踪」，走上面的 `dsh plugin add`。

---

## 插件卸载

从指定 profile 卸掉 Harness 插件层（不是 `pnpm remove`）：

```bash
dsh plugin --profile <profile> remove dsh-context-track
```

仅有 harness 源码、无全局 `dsh` 时，在 harness 根目录：

```bash
pnpm dsh plugin --profile <profile> remove dsh-context-track
# Web 例：   --profile web
# Desktop：  --profile desktop
```

| 注意 | 说明 |
| --- | --- |
| Desktop / 应用在跑 | 先**完全退出**再 `remove`（与 `add` 一样，profile 有写锁） |
| `DSH_HOME` | 与当初 `add`、启动时用的目录一致，否则卸的是另一个 home |
| 卸完后 | Web：重启或刷新；Desktop：重开应用。「上下文链路追踪」页签和右侧栏入口应消失 |
| 核对 | `dsh --profile <profile> --dump-config`（或 `pnpm dsh …`）里不应再有 `dsh-context-track` |

`remove` 只卸插件安装与配置，**不会**删会话日志，也不会清 profile 下本插件写过的旁路文件：

```text
$DSH_HOME/profiles/<profile>/dsh-context-track/
```

若要一并清掉压缩指令等增量 JSONL，手动删该目录即可。

---

## 源码联调

在本机 `deepseek-harness` 源码启动的 **Web** 或 **Desktop** 里调试本插件。二者共用同一套 Web 界面与 Host。

> **原则**
>
> - 不依赖全局 `dsh`：全部在 harness 根目录用 `pnpm dsh …`
> - **不要改** harness 仓库的源码 / 配置 / `package.json`
> - 插件只写到 `$DSH_HOME/profiles/`；harness 目录只做 `install` / `build` / 启动

路径约定（换成你机器上的真实路径）：

| 角色 | 路径 |
| --- | --- |
| 本插件 | `/path/to/dsh-context-track` |
| harness | `/path/to/deepseek-harness` |

下文凡写 `pnpm dsh`，都先 `cd /path/to/deepseek-harness`。

### 1. 一次性准备

```bash
cd /path/to/deepseek-harness && pnpm install && pnpm run build
cd /path/to/dsh-context-track        && pnpm install && pnpm run build   # 必须有 dist/
```

日常改插件：

```bash
cd /path/to/dsh-context-track
pnpm test && pnpm run build
# 再重启 Web，或退出后重开 Desktop
```

> 软链不检查发布白名单；上线前仍用 `pnpm pack` 验一次。

### 2. Web

profile 名自定，这里用 `web`。插件写进普通 `$DSH_HOME`（默认 `~/.dsh`）：

```bash
cd /path/to/deepseek-harness
pnpm dsh plugin --profile web add /path/to/dsh-context-track
pnpm dsh --profile web --dump-config
pnpm dsh web                         # 同 pnpm dsh --profile web；勿再写 --profile
```

浏览器打开终端地址（常见 `http://127.0.0.1:3080`），打开会话后应有「上下文链路追踪」页签，右侧栏引导页也有同名入口。

### 3. Desktop

| 要点 | 说明 |
| --- | --- |
| profile | 固定为 `desktop`，不能用 `pnpm dsh --profile desktop` 启动 |
| 启动方式 | harness 根目录：`pnpm run start:desktop` / `dev:desktop` |
| 装插件顺序 | **先启动一次**初始化 → **完全退出** → `plugin add` → 重开 |
| `DSH_HOME` | 建议指到仓库外，且启动与装插件用**同一**变量 |

```bash
export DSH_HOME=/tmp/dsh-desktop-dev    # 任意仓库外目录

cd /path/to/deepseek-harness
pnpm run start:desktop                  # 首次初始化 desktop profile
# 完全退出后再装：

pnpm dsh plugin --profile desktop add /path/to/dsh-context-track
pnpm run start:desktop                  # 重开并打开会话后应有「上下文链路追踪」
```

<details>
<summary>不用自定义 DSH_HOME / 正式版 Desktop / 其它注意</summary>

默认开发 home 在 harness 树下：

```bash
export DSH_HOME=/path/to/deepseek-harness/apps/desktop/.desktop-build/development/home
cd /path/to/deepseek-harness
pnpm dsh plugin --profile desktop add /path/to/dsh-context-track
```

- `dev:desktop` 会先构建再启动；已有产物时用 `start:desktop` 更快
- 应用在跑时不要 `add` / `remove`（profile 有写锁）
- 已安装的正式 Desktop：用应用自带的 `dsh`（菜单「管理 dsh 命令…」），同样是退出 → `add` → 重开

</details>

### 4. 用 tgz 验收

```bash
cd /path/to/dsh-context-track && pnpm run build && pnpm pack

cd /path/to/deepseek-harness
# Web
pnpm dsh plugin --profile web add /path/to/dsh-context-track/dsh-context-track-<version>.tgz

# Desktop（DSH_HOME 与启动一致；应用须已退出）
pnpm dsh plugin --profile desktop add /path/to/dsh-context-track/dsh-context-track-<version>.tgz
```

改代码后重新 pack + add。恢复开发链：

```bash
pnpm dsh plugin --profile web remove dsh-context-track
pnpm dsh plugin --profile web add /path/to/dsh-context-track

pnpm dsh plugin --profile desktop remove dsh-context-track
pnpm dsh plugin --profile desktop add /path/to/dsh-context-track
```

<details>
<summary>临时 --patch（仅 Web，一般不必用）</summary>

不写 profile；patch 放在**本插件仓库**。Desktop 请用上面的 `plugin add`。

```yaml
# /path/to/dsh-context-track/dev.patch.yml
- insert:
    - id: dsh-context-track
      name: '/path/to/dsh-context-track/dist/host/index.js'
```

```bash
cd /path/to/dsh-context-track && pnpm run build
cd /path/to/deepseek-harness
pnpm dsh web --patch /path/to/dsh-context-track/dev.patch.yml
```

需要完整侧栏 Client 时，仍优先 `pnpm dsh plugin add`。

</details>

### 怎么选

| 目的 | Web | Desktop |
| --- | --- | --- |
| 日常改插件 | `plugin add /path/to/dsh-context-track` | 退出 → `plugin add …` → `start:desktop` |
| 验收打包 | 换成 `…/*.tgz` | 同上 |
| 对照已发布版 | `add dsh-context-track@<版本>` | 同上（`DSH_HOME` 与启动一致） |

插件只进 `$DSH_HOME`，不改 harness 源码。

---

## 常见问题

| 现象 | 处理 |
| --- | --- |
| `select a profile only once` | `dsh web` 已等价于 `--profile web`，用 `dsh web` 或 `dsh --profile web` 其一，不要叠写 |
| publish 403 / 409 | 登录、换包名，或升版本 |
| publish 404 / 推包失败 | 加 `--registry=https://registry.npmjs.org/` |
| 装上了但加载失败 | 先 `pnpm run build`，再用 `tar -tzf` 确认 tgz 有 `dist/` |
| Web / Desktop 没有「上下文链路追踪」 | 确认编过 `dist/client/index.js`（工厂包，不是裸 ESM），且用对应 profile 的 `plugin add` 整包装入。页签只在打开会话后出现 |
| Desktop 装上了但界面没有 | 确认 `DSH_HOME` 与启动一致；装完后重开应用 |
| Desktop `plugin add` 失败 | 先 `start:desktop` 开一次并完全退出，再在 harness 根目录 `pnpm dsh plugin …` |
| `remove` 后仍有「上下文链路追踪」 | 确认卸的是同一 `DSH_HOME` / profile；Web 重启或刷新，Desktop 重开 |
| `plugin remove` 失败 | 应用须已退出；Desktop 与装插件时用同一 `DSH_HOME` |
| link 后改代码没变化 | 插件侧重新 `build`；Web 刷新或重启；Desktop 退出后重开 |
| 安装被 `engines.dsh` 拒绝 | 宿主需在 `>=0.2.0-0 <0.3.0` |

---

功能说明 → [README](../README.md) · 设计 → [design.md](./design.md)

发布细节也可对照 [pnpm 发布指南](https://www.workbuddy.cn/space/d/jR7KRSSKVnUTZoV2bezae8?ext2=copy_link) 与宿主 [打包与安装插件](https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/user/develop/basic/publish.zh.md)。
