/* eslint-disable @typescript-eslint/no-var-requires */
const pkg = require('./package.json')
const { execSync } = require('child_process')

const pkgVersion = process.env.PKG_VERSION || pkg.version
const nodeEnv = process.env.NODE_ENV || 'production'

const buildDate = execSync('git show -s --format=%ci HEAD')
  .toString()
  .replace(/[\r\n]+$/, '')

const commitSha = execSync('git rev-parse --short HEAD')
  .toString()
  .replace(/[\r\n]+$/, '')

const ignoreForTests = ['node_modules', 'src/**/*.d.ts']
const ignoreForProduction = [
  'node_modules',
  'src/**/__tests__/**/*',
  'src/**/*.spec.ts',
  'src/**/*.test.ts',
  'src/**/*.d.ts',
  'src/scratch/**'
]

const replacements = {
  __VERSION__: pkgVersion,
  __BUILD_DATE__: buildDate,
  __COMMIT_SHA__: commitSha
}

//browser only replacements
const browserReplacements = Object.assign(
  {},
  {
    'process.env.NODE_ENV': nodeEnv
  },
  replacements
)

const plugins = [
  [
    '@babel/plugin-transform-typescript',
    {
      allowDeclareFields: true
    }
  ],
  ['@babel/plugin-proposal-nullish-coalescing-operator'], //node v10
  ['@babel/plugin-proposal-optional-chaining'], // node v10
  ['@babel/proposal-class-properties', { loose: true }], // stage-3 proposal
  ['@babel/proposal-private-methods', { loose: true }], // stage-3 proposal
  ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ['annotate-pure-calls'],
  'dev-expression',
  ['transform-define', replacements]
].concat('production' === nodeEnv ? 'minify-dead-code-elimination' : [])

module.exports = {
  presets: ['@babel/preset-env'],
  plugins,
  exclude: ['transform-async-to-generator', 'transform-regenerator'],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      ignore: ignoreForTests,
      sourceMaps: 'inline'
    },
    browserWatch: {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              browsers: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version'
              ]
            }
          }
        ]
      ],
      plugins: [['transform-define', browserReplacements]],
      ignore: ignoreForProduction
    },
    browser: {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              // browsers: ['>0.2%', 'not dead', 'not op_mini all']
              browsers: [
                'last 2 chrome version',
                'last 2 firefox version',
                'last 2 safari version'
              ]
            }
          }
        ]
      ],
      plugins: [['transform-define', browserReplacements]],
      ignore: ignoreForProduction
    },
    browserDev: {
      presets: [
        [
          '@babel/env',
          {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              // browsers: ['>0.2%', 'not dead', 'not op_mini all']
              // browsers: ['last 2 chrome version']
              browsers: [
                'last 1 chrome version',
                'last 1 firefox version',
                'last 1 safari version'
              ]
            }
          }
        ]
      ],
      ignore: ignoreForProduction,
      plugins: [['transform-define', browserReplacements]]
    },
    browserModule: {
      // target node runtime
      presets: [
        [
          '@babel/env',
          {
            targets: {
              // esmodules: true
              // browsers: ['last 2 chrome version']
              browsers: [
                'last 2 chrome version',
                'last 2 firefox version',
                'last 2 safari version'
              ]
            }
          }
        ]
      ],

      plugins: [['transform-define', browserReplacements]],
      ignore: ignoreForProduction
    },
    cjsWatch: {
      // commonjs for node
      presets: [
        [
          '@babel/env',
          {
            // debug: true,
            modules: 'cjs',
            targets: {
              node: 'current'
            }
          }
        ]
      ],
      // plugins: serverPlugins,
      ignore: ignoreForProduction
    },
    cjs: {
      // commonjs for node
      presets: [
        [
          '@babel/env',
          {
            // debug: true,
            modules: 'cjs',
            targets: {
              node: 14 // es2028
            }
          }
        ]
      ],
      // plugins: serverPlugins,
      ignore: ignoreForProduction
    },
    esm: {
      // esm for node (also "module" field in package.json)
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            targets: {
              node: 14 // es2028
            }
          }
        ]
      ],
      // plugins: serverPlugins,
      ignore: ignoreForProduction
    }
  }
}
