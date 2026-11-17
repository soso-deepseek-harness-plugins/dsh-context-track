// `pnpm run check:lib` 的后半段：build 之后核对 lib/ 是否都进了版本库。
// lib/ 随仓库提交，GitHub 直装装的就是它；漏提交时直装会悄悄拿到旧产物。
import { execFileSync } from 'node:child_process';

let dirty;
try {
  dirty = execFileSync('git', ['status', '--porcelain', '--', 'lib'], {
    encoding: 'utf8',
  }).trim();
} catch {
  console.log('不在 git 仓库里，跳过 lib/ 核对。');
  process.exit(0);
}

if (dirty) {
  console.error(
    'lib/ 和提交不一致，GitHub 直装会拿到旧产物。先 pnpm run build，再把 lib/ 一起提交：\n' +
      dirty,
  );
  process.exit(1);
}

console.log('lib/ 已和源码一起提交。');
