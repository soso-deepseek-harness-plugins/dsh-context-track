/**
 * Web client artifact. Harness loads `exports["./client"]` as a classic script
 * and only accepts a `window.__ModuleLoader__.load` factory. `tsc` stays the
 * host and type build; this bundle is the browser entry.
 */
import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { name: string }
const id = manifest.name

export default defineConfig({
  entry: { index: 'src/client/index.ts' },
  outDir: 'dist/client',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  deps: {
    neverBundle: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  },
  outputOptions: {
    entryFileNames: 'index.js',
    banner(chunk) {
      const chunkName = chunk.isEntry ? '' : `chunk: ${JSON.stringify(chunk.fileName)}, `
      return `window.__ModuleLoader__.load({ id: ${JSON.stringify(id)}, ${chunkName}factory: (require) => {`
    },
    intro: 'var module = { exports: {} }; var exports = module.exports;',
    footer: 'return module.exports; } });',
  },
})
