/**
 * Script to build API documentation via typedoc package
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn } = require('child_process')
const del = require('del')

;(async () => {
  const deletedDir = await del(['docs'])
  console.log(`Deleted dir: ${deletedDir}`)
})()

spawn(
  'yarn',
  [
    '--cwd',
    process.cwd(),
    'typedoc',
    '--theme',
    'markdown',
    '--readme',
    'none',
    '--excludePrivate',
    '--excludeInternal',
    '--exclude',
    'src/globals.d.ts',
    '--exclude',
    'src/__tests__',
    '--out',
    'docs/api',
    './src'
  ],

  {
    stdio: 'inherit',
    shell: true
  }
)
