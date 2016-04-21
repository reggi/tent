import path, { join } from 'path'
import Promise from 'bluebird'
import depFinder, { processDeps } from './dep-finder'
import { flatten, map, each } from 'lodash'
import deepAssign from 'deep-assign'
import Gisty from 'gisty'
import url from 'url'
import Download from 'download'
import osTmpDir from 'os-tmpdir'
import fs from 'fs-extra'

Promise.promisifyAll(fs)

export function tentDeps () {
  return async function () {
    let dependencies = await depFinder(this.file)
    return { dependencies }
  }
}

export function tentName (name) {
  return function () {
    name = name || this.name
    if (!name) throw new Error('name is not specified')
    return { name }
  }
}

export function tentVersion (version) {
  return function () {
    version = version || this.version
    if (!version) throw new Error('version is not specified')
    return { version }
  }
}

export function tentBabel ({presets = [], plugins = [], buildScript = 'build'}) {
  return async function () {
    let presetsDeps = (presets) ? map(presets, preset => `babel-preset-${preset}`) : []
    let pluginsDeps = (plugins) ? map(plugins, plugin => `babel-plugin-${plugin}`) : []

    let devDependencies = [
      'babel-cli',
      ...pluginsDeps,
      ...presetsDeps
    ]

    devDependencies = await this.processDeps(devDependencies)

    let incomingFile = join('src', this.parsedPath.base)
    let outgoingFile = join('lib', this.parsedPath.base)

    return {
      'main': outgoingFile,
      'jsnext:main': incomingFile,
      "scripts": {
        [buildScript]: `mkdir lib && mkdir src && mv ${this.parsedPath.base} ${incomingFile} && babel ${incomingFile} --out-file ${outgoingFile}`
      },
      devDependencies,
      babel: {
        presets,
        plugins
      }
    }
  }
}

export function tentAuthor (author) {
  return function () {
    return { author }
  }
}

export function tentPostinstall (postinstall) {
  return function () {
    return {
      scripts: {
        postinstall
      }
    }
  }
}

export function tentPrepublish (prepublish) {
  return function () {
    return {
      scripts: {
        prepublish
      }
    }
  }
}

export function tentMain () {
  return function () {
    return {
      main: this.parsedPath.base
    }
  }
}

export function tryWrap (tryFunc, catchFunc) {
  try {
    return tryFunc()
  } catch (e) {
    return catchFunc
  }
}

export async function buildPackage(file) {
  let parsedPath = path.parse(file)

  let { def } = require(file)
  let standard = {
    file,
    parsedPath,
    name: tryWrap(() => def[0].split('@')[0], null),
    version: tryWrap(() => def[0].split('@')[1], null),
    processDeps: processDeps,
  }

  let middleware = [
    tentName(),
    tentVersion(),
    tentDeps(),
    tentMain(),
  ]

  standard.package = {}

  if (def && def[1]) middleware.push(def[1])
  middleware = flatten(middleware)

  let pkg = await Promise.reduce(middleware, (pkg, func) => {
    return Promise.resolve(func.bind(standard)()).then(newPkgProps => {
      let newState = deepAssign({}, pkg, newPkgProps)
      standard.package = newState
      return newState
    })
  }, {})
  let jsonPkg = JSON.stringify(pkg, null, 2)
  return {pkg, standard, jsonPkg}
}

export async function download(dataSet) {
  return new Promise((resolve, reject) => {
    let d = new Download({mode: '755'})
    each(dataSet, data => {
      d.get(data.url, data.file)
    })
    d.run((err, val) => {
      if (err) return reject(err)
      return resolve(val)
    })
  })
}

export async function getGist(gistUrl, location, temp) {
  location = location || './'
  location = (temp) ? osTmpDir() : join(process.cwd(), location)
  let parsedUrl = url.parse(gistUrl)
  if (parsedUrl.host !== 'gist.github.com') throw new Error('host is not github gist')
  let pieces = parsedUrl.path.split('/')
  let username = pieces[1]
  let id = pieces[2]
  let gist = new Gisty({ username })
  let gistAsync = Promise.promisify(gist.fetch.bind(gist))
  let gistData = await gistAsync(id)
  let files = map(gistData.files, file => ({url: file.raw_url, file: location}))
  let exportfiles = map(gistData.files, file => ({url: file.raw_url, file: join(location, file.filename)}))
  let results = await download(files)
  return {files: exportfiles, download: results}
}

export async function buildModule (file, location, temp) {
  let result = await buildPackage(file)
  location = location || './'
  location = (temp) ? osTmpDir() : join(process.cwd(), location)
  location = join(location, result.standard.name)
  let cleanPkg = JSON.stringify(result.pkg, null, 2)
  let dirPath = join(location)
  await fs.ensureDirAsync(dirPath)
  let pkgPath = join(location, 'package.json')
  await fs.writeFileAsync(pkgPath, cleanPkg)
  let mainFile = join(location, path.basename(file))
  await fs.copyAsync(file, mainFile)
  return {location}
  // if (temp) await fs.removeAsync(location)
  // await execAsync(`cd ${location} && npm install`)
}
