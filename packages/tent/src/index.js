import { join as pathJoin, basename as pathBasename } from 'path'
import deepAssign from 'deep-assign'
import Promise from 'bluebird'
import { each, get, without, isFunction, isPlainObject, isArray, flattenDeep, mapValues, map, extend, includes, chain, difference } from 'lodash'
import { parse as urlParse } from 'url'
import fs from 'fs-extra'
import npm from 'npm-programatic'
import osTmpDir from 'os-tmpdir'
import { exec } from 'child_process'
import Download from 'download'
import Gisty from 'gisty'
// import Debug from 'debug'
// let debug = Debug('tent:core')

const execAsync = Promise.promisifyAll(exec)
Promise.promisifyAll(fs)

export function parseNpmModuleSytax (str) {
  let pattern = /^(.+?)(?:\@(.+?))?(?:\/(.+?))?(?:\[(.+?)\])?$/
  let matches = str.match(pattern)
  let results = {
    'module': matches[1] || false,
    'version': matches[2] || false,
    'path': matches[3] || false,
    'method': matches[4] || false
  }
  return results
}

export function parseJsbinUrl (jsbinUrl) {
  let parsedUrl = urlParse(jsbinUrl)
  let validHosts = ['jsbin.com', 'output.jsbin.com']
  if (!includes(validHosts, parsedUrl.host)) {
    throw new Error('parsing jsbin url: host is not jsbin')
  }
  let pieces = parsedUrl.path.split('/')
  let id = (pieces[1] === 'api') ? pieces[2] : pieces[1]
  return {id}
}

export function parseGistUrl (gistUrl) {
  let parsedUrl = urlParse(gistUrl)
  let validHosts = ['gist.github.com']
  if (!includes(validHosts, parsedUrl.host)) {
    throw new Error('parsing gist url: host is not github gist')
  }
  let pieces = parsedUrl.path.split('/')
  let username = pieces[1]
  let id = pieces[2]
  let anchor = (parsedUrl.hash) ? parsedUrl.hash.replace(/^#/, '') : false
  return {username, id, anchor}
}

export async function getFileContents(filePath) {
  return await fs.readFileAsync(filePath, 'utf8')
}

export function getComments(fileContent) {
  let pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm
  let comments = fileContent.match(pattern)
  if (comments) comments = comments.map(comment => {
    return comment
      .trim()
      .replace(/^\/\*|\*\/$|^\/\//g, '')
      .trim()
  })
  return comments || []
}

export function parseCommentSyntax (comment) {
  let rootSyntax = ['tent', 'npm']
  let buildSyntax = ['\\sbuild\\s', '\\s']
  let fromSyntax = ['\\sfrom\\s', '\\sfoundation\\s']
  let dualSyntax = ['\\sfrom\\s', '\\s']
  let introSyntax = [...fromSyntax, ...buildSyntax]
  let rootSyntaxPattern = rootSyntax.map(a => `${a}`).join('|')
  let introSyntaxPattern = introSyntax.map(a => `${a}`).join('|')
  let dualSyntaxPattern = dualSyntax.map(a => `${a}`).join('|')
  let firstPattern = new RegExp(`^${rootSyntaxPattern}`)
  let secondPattern = new RegExp(`^(${rootSyntaxPattern})(${introSyntaxPattern})(.+)`)
  let thirdPattern = new RegExp(`(${dualSyntaxPattern}(?=.*[\\[{]|[^\\]}]+$))`)
  let isValid = comment.match(firstPattern)
  if (!isValid) return false
  let matches
  matches = comment.match(secondPattern)
  let key
  let build
  let foundation
  if (matches[2].replace(/\s+/, '') === '') key = 'build'
  if (!key) key = matches[2].trim()
  if (key == 'from') key = 'foundation'
  let value = matches[3]
  matches = difference(value.split(thirdPattern), [undefined, ''])
  if (key == 'build') build = matches[0]
  if (key == 'build' && matches[2]) foundation = matches[2]
  if (key == 'foundation') foundation = matches[0]
  let results = {}
  if (build) results.build = build
  if (foundation) results.foundation = foundation
  return results
}

export function parseCommentsSyntax (comments) {
  let data = comments.map(comment => {
    return parseCommentSyntax(comment)
  }).filter(comment => comment)
  return extend.apply(null, data)
}

export function resolveValues (data) {
  return mapValues(data, item => {
    try{ return JSON.parse(item) }
    catch (e) { return item; };
  })
}

export async function installNpmModules(modules, path) {
  let pkg = {
    "description": "Cache for Tent",
    "repository": {
      "type": "git",
      "url": "git://github.com/username/repository.git"
    },
    "private": true,
    "readme": ""
  }
  await fs.ensureDirAsync(path)
  await fs.writeFileAsync(pathJoin(path, 'package.json'), JSON.stringify(pkg))
  await npm('install', {deps: modules, stdio: 'inherit', cwd: path })
  return true
}

export function buildPackageJson(middleware, access = {}) {
  return Promise.reduce(middleware, (pkg, func) => {
    return Promise.resolve(func(access)).then(newPkgProps => {
      let newState = deepAssign({}, pkg, newPkgProps)
      access.pkg = newState
      return newState
    })
  }, {})
}

export function processFoundation(foundation) {
  if (isPlainObject(foundation)) {
    return chain(foundation)
      .mapValues((value, key) => {
        let parsed = parseNpmModuleSytax(key)
        return {
          'original': key,
          ...parsed,
          'download': without([parsed.module, parsed.version], false).join('@'),
          'arguments': value
        }
      })
      .values()
      .value()
  } else if (isArray(foundation)) {
    return chain(foundation)
      .map(value => {
        let parsed = parseNpmModuleSytax(value)
        return {
          'original': value,
          ...parsed,
          'download': without([parsed.module, parsed.version], false).join('@'),
          'arguments': null
        }
      })
      .values()
      .value()
  } else {
    let parsed = parseNpmModuleSytax(foundation)
    return [{
      'original': foundation,
      ...parsed,
      'download': without([parsed.module, parsed.version], false).join('@'),
      'arguments': null
    }]
  }
}

export function getMiddleware (modules, path) {
  let middleware = map(modules, mod => {
    let modulePath = (mod.path) ? mod.path : ''
    let moduleDownloadPath = pathJoin(path, `node_modules`, mod.module, modulePath)
    let arg = (!isArray(mod.arguments)) ? [mod.arguments] : mod.arguments
    let val
    if (mod.method) {
      val = require(moduleDownloadPath)[mod.method]
    } else {
      val = require(moduleDownloadPath)
      if (val.default) val = val.default
    }
    if (isFunction(val)) return val.apply(null, arg)
    return val
  })
  middleware = flattenDeep(middleware)
  return middleware
}

export async function buildPackage ({fileContent, filePath, outDir, tmpDir}) {
  let results = {}
  results.fileContent = fileContent
  results.filePath = filePath
  results.outDir = outDir
  results.tmpDir = tmpDir
  results.comments = getComments(fileContent)
  results.syntax = parseCommentsSyntax(results.comments)
  results.values = resolveValues(results.syntax)
  results.build = (results.values.build) ? parseNpmModuleSytax(results.values.build) : false
  results.buildPath = (results.build) ? pathJoin(results.outDir, results.build.module) : false
  results.foundation = processFoundation(results.values.foundation)
  results.installModules = results.foundation.map(item => item.download)
  await installNpmModules(results.installModules, tmpDir)
  results.middleware = getMiddleware(results.foundation, tmpDir)
  results.pkg = await buildPackageJson(results.middleware, results)
  return results
}

export async function buildModule(options) {
  let {fileContent, filePath, outDir, tmpDir} = options
  let results = await buildPackage(options)
  let {pkg, build, buildPath} = results
  if (build) {
    await fs.ensureDirAsync(buildPath)
    await fs.writeFileAsync(pathJoin(buildPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
  }
  return results
}

export async function download(dataSet) {
  return new Promise((resolve, reject) => {
    let d = new Download({mode: '777'})
    each(dataSet, data => {
      d.get(data.url, data.file)
    })
    d.run((err, val) => {
      if (err) return reject(err)
      return resolve(val)
    })
  })
}

export async function getGist({username, id}) {
  let gist = new Gisty({ username })
  let gistAsync = Promise.promisify(gist.fetch.bind(gist))
  return await gistAsync(id)
}

export default class Tent {
  constructor({outDir = './', temp = true} = {}){
    this.cwd = process.cwd()
    this.tempOutDir = pathJoin(osTmpDir(), 'npm-tent')
    this.defaultOutDir = pathJoin(this.cwd, outDir)
    this.outDir = (temp) ? this.tempOutDir : this.defaultOutDir
    this.downloadDir = pathJoin(this.tempOutDir, 'downloads')
  }
  async finish () {
    // await fs.removeAsync(this.tempOutDir)
  }
  async buildPackage(filePath) {
    filePath = pathJoin(this.cwd, filePath)
    let fileContent = await getFileContents(filePath)
    return await buildPackage({fileContent, filePath, outDir: this.outDir, tmpDir: this.tempOutDir})
  }
  async buildModule(filePath) {
    filePath = pathJoin(this.cwd, filePath)
    let fileContent = await getFileContents(filePath)
    return await buildModule({fileContent, filePath, outDir: this.outDir, tmpDir: this.tempOutDir})
  }
  async runBuildModule (filePath, action) {
    let { buildPath } = await this.buildModule(filePath)
    if (action) await this.npmActions(buildPath, action)
  }
  async runBuildGist(gistUrl, action) {
    let parsedGistUrl = parseGistUrl(gistUrl)
    let gistData = await getGist(parsedGistUrl)
    // console.log(gistData)
    if (gistData.files.length > 1) throw new Error('gist can only contain one file')
    let exportfiles = map(gistData.files, file => {
      return {url: file.raw_url, file: this.tempOutDir, basename: pathBasename(file.raw_url)}
    })
    await download(exportfiles)
    let filePath = pathJoin(exportfiles[0].file, exportfiles[0].basename)
    let fileContent = await getFileContents(filePath)
    // console.log(fileContent)
    return await buildModule({fileContent, filePath, outDir: this.tempOutDir, tmpDir: this.tempOutDir})
  }
  async npmActions (cwd, {install, publish}) {
    let opts = { cwd, stdio: 'inherit' }
    let pkgPath = pathJoin(cwd, 'package.json')
    let pkg = await fs.readFileAsync(pkgPath, 'utf8').then(JSON.parse)
    if (install) {
      if (get(pkg, 'scripts.tentpreinstall')) await npm('run tentpreinstall', opts)
      await npm('install', opts)
      if (get(pkg, 'scripts.tentpostinstall')) await npm('run tentpostinstall', opts)
    }
    if (publish) {
      if (get(pkg, 'scripts.tentprepublish')) await npm('run tentprepublish', opts)
      await npm('publish', opts)
      if (get(pkg, 'scripts.tentpostpublish')) await npm('run tentpostpublish', opts)
    }
  }
}
