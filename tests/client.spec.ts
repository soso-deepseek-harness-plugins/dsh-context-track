import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { childExpandable, defaultExpanded, emptyTrack, toggleExpanded } from '../src/shared/model.ts'
import { traceCss } from '../src/client/styles.ts'

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sources(path)
    return path.endsWith('.ts') || path.endsWith('.tsx') ? [readFileSync(path, 'utf8')] : []
  })
}

describe('client', () => {
  it('keeps expansion in component state and leaves the projection untouched', () => {
    const track = emptyTrack()
    expect(defaultExpanded('turn', 'running')).toBe(true)
    expect(defaultExpanded('turn', 'ok')).toBe(false)
    const open = toggleExpanded({}, 'sess:turn:1', false)
    expect(open).toEqual({ 'sess:turn:1': true })
    expect(toggleExpanded(open, 'sess:turn:1', false)).toEqual({ 'sess:turn:1': false })
    expect(track).toEqual(emptyTrack())
    expect(childExpandable('external')).toBe(false)
  })

  it('uses alias colors, one web client, and no desktop-only frame', () => {
    expect(traceCss).toContain('--dsw-alias-')
    expect(traceCss).not.toContain('--dsh-frame-leading-clearance')
    expect(traceCss).toContain('[data-platform=\'darwin\'] .dsh-context-track-main')
    expect(traceCss).toContain('[data-conversation-scroll]:has(.dsh-context-track) > [data-composer-seat]:not(:has([data-approval-key], [data-question-key], [data-plan-review-key]))')
    expect(traceCss).toContain('[data-conversation-scroll]:has(.dsh-context-track) ~ [data-width-handle]')
    expect(traceCss).toContain('--dsh-frame-top-clearance')
    const withoutPalette = traceCss.replace(/\/\* palette \*\/[\s\S]*?\/\* \/palette \*\//, '')
    expect(withoutPalette).not.toMatch(/#[0-9a-fA-F]{3,8}\b/)
    expect(traceCss).toContain('--dsh-cat-tools')
    expect(traceCss).toContain('--dsh-json-string')
    expect(traceCss).not.toContain('.dsh-context-track-json-string { color: var(--dsw-alias-state-success-primary)')
    expect(traceCss).not.toContain('.dsh-context-track-json-boolean { color: var(--dsw-alias-state-error-primary)')
    expect(traceCss).not.toMatch(/rgb\(|rgba\(/)
    const client = sources(join(process.cwd(), 'src/client')).join('\n')
    expect(client).not.toContain('iframe')
    expect(client).not.toMatch(/from ['"]highlight\.js['"]/)
    expect(client).not.toMatch(/from ['"]shiki['"]/)
    expect(client).not.toMatch(/from ['"]echarts['"]/)
    expect(client).not.toMatch(/from ['"]recharts['"]/)
    expect(client).not.toContain('BrowserWindow')
    expect(client).not.toMatch(/from ['"]\.\.\/host/)
    const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as {
      dsh: { client: { platform: string } }
    }
    const materialize = readFileSync(join(process.cwd(), 'src/host/materialize.ts'), 'utf8')
    const toolHistory = readFileSync(join(process.cwd(), 'src/host/tool-history.ts'), 'utf8')
    expect(materialize).not.toContain('deepseek-harness')
    expect(toolHistory).toContain("require.resolve('@deepseek-ai/dsh-session/package.json')")
    const entry = readFileSync(join(process.cwd(), 'src/client/index.ts'), 'utf8')
    expect(entry).toContain("export const inject = ['slots', 'locale', 'remote']")
    expect(entry).toContain("name: 'conversation.view'")
    expect(entry).toContain("name: 'sidebar.right.pane.tab'")
    expect(entry).toContain("inject(['sidebarRightTabs']")
    expect(entry).toContain("name: 'sidebar.panellist'")
    expect(entry).toContain("name: 'main'")
    expect(entry).toContain('PANEL_ID')
    expect(entry).toContain("inject(['remote.track']")
    expect(entry).not.toMatch(/[^k]ctx\.remote\.track/)
    expect(pkg.dsh.client.platform).toBe('web')
    const patch = readFileSync(join(process.cwd(), 'cordis.patch.yml'), 'utf8')
    expect(patch).toContain('id: dsh-context-track')
    expect(patch).not.toContain('client')
  })
})
