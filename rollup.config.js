import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
import minimist from 'minimist'
import visualizer from 'rollup-plugin-visualizer'

const argv = minimist(process.argv.slice(2))

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const packageName = process.env.BUILD_PACKAGE_NAME.toLowerCase()

const input = 'src/index.ts'

const umdFilePath = libPath('./dist/unpkg', packageName)
const esmFilePath = libPath('./dist/esm', packageName)

// https://github.com/rollup/rollup/issues/703#issuecomment-314848245
function defaultPlugins(config = {}) {
  return [
    resolve({ extensions }),
    peerDepsExternal(),
    babel(config.babel || { babelHelpers: 'bundled' }),
    commonjs(),
    argv.watch ? undefined : filesize(),
    visualizer({ template: 'treemap' })
  ]
}

const cjsDev = {
  input,
  output: [
    {
      file: libPath('./dist/cjs', packageName)('.development.js'),
      format: 'cjs',
      name: packageName,
      sourcemap: true
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserDev',
      babelHelpers: 'bundled'
    }
  })
}

const cjsProd = {
  input,
  output: [
    {
      file: libPath('./dist/cjs', packageName)('.production.min.js'),
      format: 'cjs',
      name: packageName,
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browser',
      babelHelpers: 'bundled'
    }
  })
}

const umdGlobals = {
  mobx: 'mobx'
}
// umd build for the browser
const umd = {
  input,
  output: [
    {
      file: umdFilePath('.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true,
      globals: umdGlobals
    },
    {
      file: umdFilePath('.min.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true,
      globals: umdGlobals,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browser',
      babelHelpers: 'bundled'
    }
  })
}

const umdWithPolyfill = {
  input,
  output: [
    {
      file: umdFilePath('.polyfill.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true,
      globals: umdGlobals
    },
    {
      file: umdFilePath('.polyfill.min.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true,
      globals: umdGlobals,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserPolyfill',
      babelHelpers: 'bundled'
    }
  })
}

// build for browser as module
const esm = {
  input,
  watch: argv.watch
    ? {
        chokidar: false
      }
    : undefined,
  output: [
    {
      file: esmFilePath('.esm.js'),
      format: 'esm',
      sourcemap: true
    },
    argv.watch
      ? undefined
      : {
          file: esmFilePath('.esm.min.js'),
          format: 'esm',
          sourcemap: true,
          plugins: [terser()]
        }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserModule',
      babelHelpers: 'bundled'
    }
  })
}

const _esmWithPolyfill = {
  input,
  output: [
    {
      file: esmFilePath('.esm.polyfill.js'),
      format: 'esm',
      sourcemap: true
    },
    {
      file: esmFilePath('.esm.polyfill.min.js'),
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: defaultPlugins({
    babel: {
      extensions,
      envName: 'browserModulePolyfill',
      babelHelpers: 'bundled'
    }
  })
}

const envToBuild = {
  cjs: [cjsDev, cjsProd],
  umd: [umd, umdWithPolyfill],
  esm: [esm]
}

function libPath(path, libName) {
  return function (suffix) {
    return path.concat('/', libName, suffix)
  }
}

function chooseBuild(buildMap, builds) {
  const envArr = builds.split(',')
  const result = []

  if (envArr.length > 0) {
    envArr.forEach((element) => {
      if (buildMap[element]) {
        result.push(...buildMap[element])
        console.log(`Will build: ${element}`)
      }
    })

    if (result.length === 0) {
      throw new Error(`Build configuration keys: ${builds} don't exists`)
    }

    return result
  }
}

export default Promise.resolve(
  chooseBuild(envToBuild, process.env.BUILD_TARGET)
)
