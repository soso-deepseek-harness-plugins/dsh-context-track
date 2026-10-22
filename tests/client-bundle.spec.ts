/**
 * The web host serves `exports["./client"]` as a classic script. That script
 * must register a factory with `window.__ModuleLoader__.load`. A TypeScript
 * ESM entry parses as `Cannot use import statement outside a module` and the
 * boot page reports that the import failed.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

interface FactoryRegistration {
  id: string
  factory: (require: (specifier: string) => unknown) => unknown
}

/** Same export normalization the client Loader applies before `plugin()`. */
function unwrapExports(exports: unknown): Record<string, unknown> {
  if (exports == null || typeof exports !== 'object') return {}
  let value = exports as Record<string, unknown>
  value = (value.default ?? value) as Record<string, unknown>
  if (value.__esModule !== true) return value
  return (value.default ?? value) as Record<string, unknown>
}

describe('web client bundle', () => {
  it('registers a classic-script factory for dsh-context-track', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
      exports: { './client': { default: string } }
    }
    const clientPath = join(root, pkg.exports['./client'].default)
    const code = readFileSync(clientPath, 'utf8')
    const registrations: FactoryRegistration[] = []
    const required: string[] = []
    vm.runInNewContext(code, {
      window: {
        __ModuleLoader__: {
          load(registration: FactoryRegistration) { registrations.push(registration) },
        },
      },
    }, { filename: clientPath })

    expect(registrations.map(registration => registration.id)).toEqual(['dsh-context-track'])
    const plugin = unwrapExports(registrations[0]?.factory(specifier => {
      required.push(specifier)
      if (specifier === 'react' || specifier === 'react/jsx-runtime') return {}
      throw new Error(`client bundle required ${specifier}, which the web module table does not provide to dsh-context-track`)
    }))
    expect(typeof plugin.apply).toBe('function')
    expect(plugin.inject).toEqual(['slots', 'locale', 'remote'])
    expect(required.filter(specifier => specifier !== 'react' && specifier !== 'react/jsx-runtime')).toEqual([])
    expect(required).toContain('react')
    expect(required).toContain('react/jsx-runtime')
    expect(code.startsWith('window.__ModuleLoader__.load(')).toBe(true)
  })
})
