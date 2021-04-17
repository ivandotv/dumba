import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
// import visualizer from 'rollup-plugin-visualizer'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const packageName = process.env.BUILD_PACKAGE_NAME

const input = 'src/index.ts'

const unpkgFilePath = libPath('./dist/unpkg', packageName.toLocaleLowerCase())
const esmFilePath = libPath('./dist/esm', packageName.toLocaleLowerCase())

// https://github.com/rollup/rollup/issues/703#issuecomment-314848245
function defaultPlugins(config = {}) {
  return [
    resolve({ extensions }),
    peerDepsExternal(),
    babel(config.babel || { babelHelpers: 'bundled' }),
    commonjs(),
    filesize()
    // visualizer({ template: 'treemap' })
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

// umd build for the browser
const umd = {
  input,
  output: [
    {
      file: unpkgFilePath('.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true
    },
    {
      file: unpkgFilePath('.min.js'),
      format: 'umd',
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

const umdWithPolyfill = {
  input,
  output: [
    {
      file: unpkgFilePath('.polyfill.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true
    },
    {
      file: unpkgFilePath('.polyfill.min.js'),
      format: 'umd',
      name: packageName,
      sourcemap: true,
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
  output: [
    {
      file: esmFilePath('.esm.js'),
      format: 'esm',
      sourcemap: true
    },
    {
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

const esmWithPolyfill = {
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
  esm: [esm, esmWithPolyfill]
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
