import Promise from 'bluebird'
import babylonModuleDefinitions from 'babylon-module-definitons'
import npmLatest from 'npm-latest'
import { get, extend, size } from 'lodash'

const npmLatestAsync = Promise.promisify(npmLatest)

export async function getNpmVersion (dep) {
  try {
    let { name, version } = await npmLatestAsync(dep)
    return { name, version }
  } catch (e) {
    return { name: dep, version: null }
  }
}

export function mapModulesToDeps (modules) {
  let deps = modules.map(module => ({[module.name]: module.version}))
  return extend.apply(null, deps)
}

export function parseModuleSyntax (modules) {
  return modules.map(mod => {
    if (mod.match('@')) {
      let parts = mod.split('@')
      let name = parts[0]
      let version = parts[1]
      return {name, version}
    } else {
      return {name: mod, false}
    }
  })
}

export function getModuleVersions (modules) {
  return Promise.map(modules, mod => {
    if (!mod.version) {
      return getNpmVersion(mod.name).then(mod => {
        return mod
      })
    } else {
      return mod
    }
  })
}

export function mapModulesToLocalDeps (modules) {
  let deps = modules.filter(mod => mod.version).map(mod => ({[`${mod.name}@${mod.version}`]: mod.name}))
  return extend.apply(null, deps)
}

export default function () {
  return async (tent) => {
    let code = tent.fileContent
    let modules = babylonModuleDefinitions({code})
    let ogModules = parseModuleSyntax(modules)
    modules = await getModuleVersions(ogModules)
    modules = modules.filter(mod => !mod.name.match(/^.\.\/|^.\/|^\//))
    let devDependencies = [{'name': 'tent-module-assign', 'version': '1.0.0'}]
    devDependencies = await getModuleVersions(devDependencies)
    devDependencies = mapModulesToDeps(devDependencies)
    let dependencies = mapModulesToDeps(modules)
    let localDependencies = mapModulesToLocalDeps(ogModules)

    let scripts = {}
    let script = []
    if (get(tent, 'pkg.script.tentpostinstall')) script.push(tent.pkg.script.tentpostinstall)
    script.push(`tent-module-assign install`)
    scripts.tentpostinstall = script.join(' && ')

    let result = {}
    result.dependencies = dependencies
    if (size(localDependencies)) {
      result.localDependencies = localDependencies
      result.scripts = scripts
      result.devDependencies = devDependencies
    }
    return result
  }
}
