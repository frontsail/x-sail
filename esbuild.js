require('esbuild')
  .build({
    entryPoints: ['./src/index.js'],
    platform: 'browser',
    bundle: true,
    minify: true,
    sourcemap: true,
    outfile: 'dist/x-sail.min.js',
  })
  .catch(() => process.exit(1))
