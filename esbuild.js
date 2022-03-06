import esbuild from 'esbuild'
import fs from 'fs-extra'

// Clean dist
fs.emptyDirSync('dist')

// Browser
esbuild.buildSync({
  entryPoints: ['./builds/browser.js'],
  outfile: 'dist/alpine-sail.js',
  bundle: true,
  platform: 'browser',
  sourcemap: true,
})

// Browser (minified)
esbuild.buildSync({
  entryPoints: ['./builds/browser.js'],
  outfile: 'dist/alpine-sail.min.js',
  bundle: true,
  minify: true,
  platform: 'browser',
  sourcemap: true,
})

// ESM (import)
esbuild.buildSync({
  entryPoints: ['./builds/module.js'],
  outfile: 'dist/alpine-sail.esm.js',
  bundle: true,
  platform: 'neutral',
})

// CJS (require)
esbuild.buildSync({
  entryPoints: ['./builds/module.js'],
  outfile: 'dist/alpine-sail.cjs.js',
  bundle: true,
  platform: 'node',
  target: ['node10.4'],
})

// Show message
console.log('✔', 'Build successfull', '\n')
