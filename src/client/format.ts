/** Compact numbers keep a full decimal form for the tooltip and the clipboard. */

export interface ShownNumber {
  text: string
  full: string
  abbreviated: boolean
}

export function abbreviate(value: number): ShownNumber {
  const full = String(value)
  const abs = Math.abs(value)
  if (!Number.isFinite(value) || abs < 10000) return { text: full, full, abbreviated: false }
  const units: readonly [number, string][] = [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'k']]
  for (const [unit, suffix] of units) {
    if (abs < unit) continue
    const scaled = abs / unit
    const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2
    const factor = 10 ** digits
    const truncated = Math.trunc(scaled * factor) / factor
    const text = `${value < 0 ? '-' : ''}${truncated}${suffix}`
    return { text, full, abbreviated: true }
  }
  return { text: full, full, abbreviated: false }
}

export function formatDuration(ms: number): ShownNumber {
  const full = String(ms)
  if (Math.abs(ms) < 1000) return { text: `${full} ms`, full, abbreviated: false }
  const seconds = Math.trunc(ms / 100) / 10
  return { text: `${seconds} s`, full, abbreviated: true }
}

export async function copyText(value: string): Promise<void> {
  const clipboard = navigator.clipboard
  if (clipboard !== undefined && typeof clipboard.writeText === 'function') {
    await clipboard.writeText(value)
  }
}
