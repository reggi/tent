import { parse as acornParse } from 'acorn'
import acornUmd from 'acorn-umd'
import fs from 'fs'
import Promise from 'bluebird'
import npmLatest from 'npm-latest'
import { extend } from 'lodash'

Promise.promisifyAll(fs)
const npmLatestAsync = Promise.promisify(npmLatest)

const acornParseOptions = {sourceType: 'module', ecmaVersion: 7, allowHashBang: true}
const acornUmdOptions = {es6: true, amd: true, cjs: true}

async function getDeps (file) {
  let content = await fs.readFileAsync(file, 'utf8')
  console.log(content)
  let ast = acornParse(content, acornParseOptions)
  let deps = acornUmd(ast, acornUmdOptions)
  return deps.map(dep => dep.source.value)
}

async function getNpmVersion (dep) {
  try {
    let { name, version } = await npmLatestAsync(dep)
    return { name, version }
  } catch (e) {
    return { name: dep, version: null }
  }
}

function mapToDeps (deps) {
  deps = deps.map(dep => ({[dep.name]: dep.version}))
  return extend.apply(null, deps)
}

export async function getNpmVersions(deps) {
  return await Promise.map(deps, getNpmVersion)
}

export async function processDeps (deps) {
  deps = deps.map(dep => {
    if (dep.match('@')) {
      let parts = dep.split('@')
      let name = parts[0]
      let version = parts[1]
      return {name, version}
    }
    return dep
  })
  let getVersion = deps.filter(dep => typeof dep === 'string')
  let gotVersion = deps.filter(dep => typeof dep !== 'string')
  let versionedDeps = await getNpmVersions(getVersion)
  deps = [...versionedDeps, ...gotVersion]
  deps = deps.filter(dep => !dep.name.match(/^.\.\/|^.\/|^\//))
  return mapToDeps(deps)
}

export default async function main (file) {
  let deps = await getDeps(file)
  if (!deps) return {}
  return await processDeps(deps)
}
