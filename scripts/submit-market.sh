#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# 把本插件收录进 dsh-market 的插件目录。
#
# 关键事实：dsh-market 仓库本身不收插件条目。它的目录来自
# awesome-dsh-plugin/awesome-dsh-plugin，投稿 = 往那边提一个 PR，
# 只加一个文件：data/plugins/<owner>__<repo>.yml。
# 合并后网站、index.json 和 dsh-market 会自动读到，通常一天内。
#
# 用法：
#   ./scripts/submit-market.sh --dry-run    # 只检查并打印条目，不碰远端
#   ./scripts/submit-market.sh              # fork → 分支 → 推送 → 开 PR
#   ./scripts/submit-market.sh -y           # 跳过最后确认
#   ./scripts/submit-market.sh --category usage --icon https://raw.githubusercontent.com/...
#
# 可覆盖的环境变量：PLUGIN_OWNER / PLUGIN_REPO / CATEGORY / ICON / EN_DESC / ZH_DESC / BRANCH / WORKDIR
# ---------------------------------------------------------------------------

set -euo pipefail

# --- 默认值（改这里，或用环境变量 / 命令行参数覆盖） -----------------------
OWNER="${PLUGIN_OWNER:-soso-deepseek-harness-plugins}"
REPO="${PLUGIN_REPO:-dsh-context-track}"
UPSTREAM="${UPSTREAM:-awesome-dsh-plugin/awesome-dsh-plugin}"
CATEGORY="${CATEGORY:-session}"
ICON="${ICON:-}"
BRANCH="${BRANCH:-add-${REPO}}"
WORKDIR="${WORKDIR:-${TMPDIR:-/tmp}/awesome-dsh-plugin-submit}"

EN_DESC="${EN_DESC:-Expandable tree of one agent session's context: rounds, model steps, tool calls, subagents, session naming, compaction and search, with each call's input, output, token usage, cache hit rate and timing on click.}"
ZH_DESC="${ZH_DESC:-把一次 agent 会话的上下文收成可展开的树：轮次、模型步骤、工具调用、子会话、会话命名、上下文压缩与检索，点开每个节点可看这次调用的输入、输出、token 用量、缓存命中率与耗时。}"

VALID_CATEGORIES="agi ui usage theme model identity session memory tools wsl browser vision voice docs skill workflow git notify dev security remote market fun"

DRY_RUN=0
ASSUME_YES=0

# --- 小工具 ----------------------------------------------------------------
die()  { printf '\n✗ %s\n' "$*" >&2; exit 1; }
warn() { printf '! %s\n' "$*" >&2; }
step() { printf '\n==> %s\n' "$*"; }

usage() {
  sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run)  DRY_RUN=1 ;;
    -y|--yes)   ASSUME_YES=1 ;;
    --category) shift; CATEGORY="${1:-}" ;;
    --icon)     shift; ICON="${1:-}" ;;
    -h|--help)  usage; exit 0 ;;
    *) die "未知参数：$1（--help 看用法）" ;;
  esac
  shift
done

case " $VALID_CATEGORIES " in
  *" $CATEGORY "*) ;;
  *) die "category 不合法：$CATEGORY（可选：$VALID_CATEGORIES）" ;;
esac

if [ -n "$ICON" ]; then
  case "$ICON" in
    https://raw.githubusercontent.com/*|https://user-images.githubusercontent.com/*|https://camo.githubusercontent.com/*|https://github.com/*) ;;
    *) die "icon 只收 GitHub 托管的 https 位图（png/jpg/jpeg/webp）：$ICON" ;;
  esac
  case "$ICON" in
    *.svg) die "icon 不收 SVG：$ICON" ;;
  esac
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/package.json"
ENTRY_NAME="${OWNER}__${REPO}.yml"
ENTRY_PATH="data/plugins/${ENTRY_NAME}"
TMP_ENTRY="$(mktemp "${TMPDIR:-/tmp}/dsh-entry.XXXXXX")"
trap 'rm -f "$TMP_ENTRY"' EXIT

# --- 1. 本地检查：包名与 dsh.bundle ----------------------------------------
step "检查插件清单"
[ -f "$PKG" ] || die "找不到 $PKG"
node - "$PKG" "$REPO" <<'NODE' || exit 1
const fs = require('fs')
const [file, repo] = process.argv.slice(2)
let pkg
try { pkg = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) {
  console.error(`读不了 ${file}: ${e.message}`)
  process.exit(1)
}
if (pkg.name !== repo) {
  console.error(`package.json 的 name 是 "${pkg.name}"，与 PLUGIN_REPO="${repo}" 不一致`)
  process.exit(1)
}
if (!pkg.dsh || !pkg.dsh.bundle) {
  console.error('package.json 缺少 dsh.bundle——dsh plugin add 装不了，投稿会被打回')
  process.exit(1)
}
console.log(`✓ ${pkg.name}@${pkg.version || '?'} 声明了 dsh.bundle`)
NODE

# --- 2. 远端检查（有 gh 且已登录时） --------------------------------------
GH_OK=0
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  GH_OK=1
fi

REMOTE_HAS_LIB=0
REMOTE_HAS_PREPARE=0
PROBLEMS=0

preflight_remote() {
  step "检查 GitHub 上的插件仓库"

  local created age topics raw_pkg
  created="$(gh api "repos/$OWNER/$REPO" -q .created_at 2>/dev/null || true)"
  [ -n "$created" ] || { warn "读不到 github.com/$OWNER/$REPO，确认已推送且公开"; PROBLEMS=$((PROBLEMS+1)); return 0; }

  age="$(python3 - "$created" <<'PY'
import sys, datetime
c = datetime.datetime.fromisoformat(sys.argv[1].replace('Z', '+00:00'))
print(int((datetime.datetime.now(datetime.timezone.utc) - c).total_seconds() // 86400))
PY
)"
  if [ "$age" -lt 1 ]; then
    warn "仓库创建于 $created，还不满 1 天；CI 会拦，过几小时再跑"
    PROBLEMS=$((PROBLEMS+1))
  else
    echo "✓ 仓库已存在 ${age} 天（要求 ≥ 1 天）"
  fi

  topics="$(gh api "repos/$OWNER/$REPO/topics" -H 'Accept: application/vnd.github+json' -q '.names | join(" ")' 2>/dev/null || true)"
  case " $topics " in
    *" dsh-plugin "*) echo "✓ 已有 dsh-plugin topic" ;;
    *)
      if [ "$DRY_RUN" -eq 1 ]; then
        warn "远端缺 dsh-plugin topic（正式提交时脚本会自动补上）"
      else
        echo "… 补 dsh-plugin topic"
        gh repo edit "$OWNER/$REPO" --add-topic dsh-plugin >/dev/null 2>&1 \
          || warn "没能自动加 topic，请到仓库 About 里手动添加 dsh-plugin"
      fi
      ;;
  esac

  raw_pkg="$(mktemp "${TMPDIR:-/tmp}/dsh-pkg.XXXXXX")"
  if gh api "repos/$OWNER/$REPO/contents/package.json" -H 'Accept: application/vnd.github.raw' >"$raw_pkg" 2>/dev/null; then
    node - "$raw_pkg" <<'NODE' || PROBLEMS=$((PROBLEMS+1))
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
if (!pkg.dsh || !pkg.dsh.bundle) {
  console.error('! 远端 package.json 缺少 dsh.bundle，投稿会被打回')
  process.exit(1)
}
console.log('✓ 远端 package.json 声明了 dsh.bundle')
NODE
    if node -e 'const p=require(process.argv[1]);process.exit(p.scripts&&p.scripts.prepare?0:1)' "$raw_pkg"; then
      REMOTE_HAS_PREPARE=1
    fi
  else
    warn "读不到远端 package.json"
  fi
  rm -f "$raw_pkg"

  gh api "repos/$OWNER/$REPO/contents/lib/host/index.js" >/dev/null 2>&1 && REMOTE_HAS_LIB=1

  if [ "$REMOTE_HAS_LIB" -eq 0 ] && [ "$REMOTE_HAS_PREPARE" -eq 0 ]; then
    warn "远端既没有 lib/host/index.js 也没有 prepare 脚本：dsh plugin add 装完会缺产物"
    PROBLEMS=$((PROBLEMS+1))
  elif [ "$REMOTE_HAS_LIB" -eq 0 ]; then
    warn "远端靠 prepare 现场编译：pnpm 11 默认拦安装脚本，用户要先放行才能装成功"
    warn "建议先把构建产物 lib/ 提交并推送，或发 npm（预构建包免放行）"
  else
    echo "✓ 远端已提交 lib/，GitHub 直装可用"
  fi
}

if [ "$GH_OK" -eq 1 ]; then
  preflight_remote
else
  step "跳过远端检查"
  warn "gh 未安装或未登录；正式提交前先跑：gh auth login"
fi

# --- 3. 本仓库是否已推送 ---------------------------------------------------
if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  if [ -n "$(git -C "$ROOT" status --porcelain)" ]; then
    warn "本仓库有未提交改动（含 lib/ 等）：评审看的是 GitHub 上的 main"
    warn "先把改动提交并推送，再来提收录 PR：git add -A && git commit -m ... && git push"
    PROBLEMS=$((PROBLEMS+1))
  fi
  if git -C "$ROOT" rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    ahead="$(git -C "$ROOT" rev-list --count '@{u}..HEAD' 2>/dev/null || echo 0)"
    if [ "$ahead" -gt 0 ]; then
      warn "有 $ahead 个本地提交没推到 GitHub：评审读不到它们"
      PROBLEMS=$((PROBLEMS+1))
    fi
  fi
fi

# --- 4. 生成条目 -----------------------------------------------------------
yaml_quote() {
  printf "'%s'" "$(printf '%s' "$1" | sed "s/'/''/g")"
}

step "生成 $ENTRY_PATH"
{
  printf 'url: https://github.com/%s/%s\n' "$OWNER" "$REPO"
  printf 'name: %s/%s\n' "$OWNER" "$REPO"
  printf 'category: %s\n' "$CATEGORY"
  printf 'description:\n'
  printf '  en: %s\n' "$(yaml_quote "$EN_DESC")"
  printf '  zh: %s\n' "$(yaml_quote "$ZH_DESC")"
  if [ -n "$ICON" ]; then
    printf 'icon: %s\n' "$ICON"
  fi
} > "$TMP_ENTRY"

cat "$TMP_ENTRY"

if [ "$DRY_RUN" -eq 1 ]; then
  printf '\n--dry-run：没有改动任何远端。去掉 --dry-run 就会 fork、推分支、开 PR。\n'
  if [ "$PROBLEMS" -gt 0 ]; then
    printf '还有 %s 个提醒，见上面的 "!"。\n' "$PROBLEMS"
  fi
  exit 0
fi

[ "$GH_OK" -eq 1 ] || die "正式提交需要 gh：brew install gh && gh auth login"

# --- 5. 最后确认 -----------------------------------------------------------
if [ "$ASSUME_YES" -eq 0 ]; then
  printf '\n将在 %s 开 PR（分支 %s）。继续？[y/N] ' "$UPSTREAM" "$BRANCH"
  read -r answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) die "已取消" ;;
  esac
fi

# --- 6. fork + 同步 upstream ----------------------------------------------
step "准备 fork"
ME="$(gh api user -q .login)"
FORK="$ME/${UPSTREAM#*/}"
if ! gh api "repos/$FORK" >/dev/null 2>&1; then
  echo "创建 fork：$FORK"
  gh repo fork "$UPSTREAM" --clone=false >/dev/null
  i=0
  while [ "$i" -lt 20 ]; do
    gh api "repos/$FORK" >/dev/null 2>&1 && break
    i=$((i+1)); sleep 3
  done
fi
gh api "repos/$FORK" >/dev/null 2>&1 || die "fork 还没就绪，稍等几秒重跑"

step "同步上游 main"
if [ ! -d "$WORKDIR/.git" ]; then
  mkdir -p "$(dirname "$WORKDIR")"
  gh repo clone "$FORK" "$WORKDIR" -- --depth=50 >/dev/null
fi
git -C "$WORKDIR" remote get-url upstream >/dev/null 2>&1 \
  || git -C "$WORKDIR" remote add upstream "https://github.com/$UPSTREAM.git"
git -C "$WORKDIR" fetch --quiet --depth=1 upstream main
git -C "$WORKDIR" checkout --quiet -B "$BRANCH" FETCH_HEAD
git -C "$WORKDIR" reset --quiet --hard FETCH_HEAD
git -C "$WORKDIR" clean --quiet -fd

# --- 7. 写条目并只提交这一个文件 ------------------------------------------
EXISTED=0
[ -f "$WORKDIR/$ENTRY_PATH" ] && EXISTED=1
mkdir -p "$WORKDIR/data/plugins"
cp "$TMP_ENTRY" "$WORKDIR/$ENTRY_PATH"

CHANGED="$(git -C "$WORKDIR" status --porcelain | wc -l | tr -d ' ')"
[ "$CHANGED" = "1" ] || die "工作区应只改 1 个文件，实际 $CHANGED 个——先看看 $WORKDIR"

if [ "$EXISTED" -eq 1 ]; then VERB="Update"; else VERB="Add"; fi

step "待提交的 diff"
git -C "$WORKDIR" --no-pager diff -- "$ENTRY_PATH"

# --- 8. 提交、推送、开 PR --------------------------------------------------
step "提交并推送"
git -C "$WORKDIR" add "$ENTRY_PATH"
git -C "$WORKDIR" commit --quiet -m "$VERB $OWNER/$REPO"
git -C "$WORKDIR" push --quiet -u origin "$BRANCH" --force-with-lease

step "开 PR"
PR_URL="$(gh pr list --repo "$UPSTREAM" --head "$ME:$BRANCH" --state open --json url -q '.[0].url // ""' 2>/dev/null || true)"
if [ -n "$PR_URL" ]; then
  echo "已有打开的 PR，已把新提交推上去：$PR_URL"
else
  PR_URL="$(gh pr create \
    --repo "$UPSTREAM" \
    --base main \
    --head "$ME:$BRANCH" \
    --title "$VERB $OWNER/$REPO" \
    --body "$(cat <<EOF
Adds \`$ENTRY_PATH\` for https://github.com/$OWNER/$REPO.

- [x] one entry file; no generated README changes
- [x] \`package.json\` declares \`dsh.bundle\`
- [x] repo has the \`dsh-plugin\` topic
- [x] repo is older than 1 day
EOF
)")"
fi

cat <<EOF

==> 完成
PR：$PR_URL

接下来：
  1. CI（Submission gate）会自动跑；失败时按提示在同一分支补提交，脚本可重跑。
  2. 合并后，网站、index.json 与 dsh-market 通常一天内自动收录，不用再往 dsh-market 提 PR。
  3. 想换图标/截图：改本仓库后重新跑脚本即可；截图放本仓库的 screenshots.json。
EOF
