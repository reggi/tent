import { get, map } from 'lodash'
import { join as pathJoin } from 'path'
import { parseModuleSyntax, getModuleVersions, mapModulesToDeps } from 'tent-babel-deps'
import fs from 'fs-extra'
import Promise from "bluebird"

Promise.promisifyAll(fs)

async function getDeps(m) {
  m = parseModuleSyntax(m)
  m = await getModuleVersions(m)
  m = mapModulesToDeps(m)
  return m
}

export default function tentBabel ({presets = [], plugins = [], buildScript = 'build'}) {
  return async function (tent) {
    await fs.ensureDirAsync(tent.modulePath)
    await fs.ensureDirAsync(pathJoin(tent.modulePath, 'src'))
    await fs.ensureDirAsync(pathJoin(tent.modulePath, 'lib'))
    await fs.writeFileAsync(pathJoin(tent.modulePath, '/src/index.js'), tent.file)

    let presetsDeps = (presets) ? map(presets, preset => `babel-preset-${preset}`) : []
    let pluginsDeps = (plugins) ? map(plugins, plugin => `babel-plugin-${plugin}`) : []

    let devDependencies = [
      'babel-cli',
      ...pluginsDeps,
      ...presetsDeps
    ]

    devDependencies = await getDeps(devDependencies)

    let incomingFile = pathJoin('src', this.parsedPath.base)
    let outgoingFile = pathJoin('lib', this.parsedPath.base)

    let script = []
    if (get(tent, 'package.script.tentpostinstall')) script.push(tent.package.script.tentpostinstall)
    script.push(`npm run ${buildScript}`)

    return {
      'main': outgoingFile,
      'jsnext:main': incomingFile,
      "scripts": {
        [buildScript]: `babel ./src/index.js --out-file ./lib/index.js`,
        'tentpostinstall': script.join(' && ')
      },
      devDependencies,
      babel: {
        presets,
        plugins
      }
    }
  }
}
