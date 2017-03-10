import fs from 'fs-extra'
import { join as pathJoin } from 'path'
import Promise from 'bluebird'
import { chain } from 'lodash'

Promise.promisifyAll(fs)

export default class ModuleAssign {
  constructor () {
    this.cwd = process.cwd()
    this.mainPackagePath = pathJoin(this.cwd, './package.json')
    this.mainModulePath = pathJoin(this.cwd, 'node_modules')
    this.localRegex = /^.\.\/|^.\/|^\//
  }
  async aliasModule ({name, path}) {
    let aliasPath = pathJoin(this.mainModulePath, name)
    let aliasPackagePath = pathJoin(this.mainModulePath, name, './package.json')
    await fs.ensureDirAsync(aliasPath)
    let main = (path.match(this.localRegex)) ? pathJoin('../../', path) : pathJoin('../', path)
    await fs.writeFileAsync(aliasPackagePath, JSON.stringify({name, main, assignedModule: true}, null, 2))
  }
  async aliasModules (modules) {
    modules = this.cleanDeps(modules)
    return Promise.map(modules, (mod) => {
      return this.aliasModule(mod)
    })
  }
  cleanDeps (modules) {
    return chain(modules)
      .mapValues((path, name) => ({path, name}))
      .values()
      .value()
  }
  async install() {
    try {
      this.pkg = await fs.readJsonAsync(this.mainPackagePath)
    } catch (e) {
      throw new Error('missing package.json')
    }
    if (!this.pkg.localDependencies) throw new Error('missing localDependencies')
    this.localDependencies = this.pkg.localDependencies
    await this.aliasModules(this.localDependencies)
  }
}
