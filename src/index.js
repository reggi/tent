import path, { join } from 'path'
import Promise from 'bluebird'
import depFinder, { processDeps } from './dep-finder'
import { without, flattenDeep, map, each, slice, uniq } from 'lodash'
import deepAssign from 'deep-assign'
import Gisty from 'gisty'
import url from 'url'
import Download from 'download'
import osTmpDir from 'os-tmpdir'
import fs from 'fs-extra'
import extract from 'extract-comments'
import Debug from 'debug'
import npm from 'enpeem'

let debug = Debug('tent')

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
      ...presetsDeps,
      'mkdirp'
    ]

    devDependencies = await this.processDeps(devDependencies)

    let incomingFile = join('src', this.parsedPath.base)
    let outgoingFile = join('lib', this.parsedPath.base)

    return {
      'main': outgoingFile,
      'jsnext:main': incomingFile,
      "scripts": {
        [buildScript]: `mkdirp lib && mkdirp src && mv ${this.parsedPath.base} ${incomingFile} && babel ${incomingFile} --out-file ${outgoingFile}`,
        'tentpostnpminstall': 'npm run build'
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

// export function tentPostnpminstall (tentpostnpminstall) {
//   return function () {
//     return {
//       scripts: {
//         tentpostnpminstall
//       }
//     }
//   }
// }

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
  debug(`buildPackage file: ${file}`)

  let parsedPath = path.parse(file)
  let {buildDependencies, nameVersion} = await getComment(file)

  debug(`buildPackage nameVersion: ${nameVersion}`)
  debug(`buildPackage buildDependencies: ${JSON.stringify(buildDependencies)}`)

  let info = resolveId(nameVersion)
  let standard = {
    ...info,
    file,
    parsedPath,
    buildDependencies,
    nameVersion,
    processDeps: processDeps,
  }

  let middleware = [
    tentName(),
    tentVersion(),
    tentDeps(),
    tentMain(),
  ]

  standard.package = {}

  let definitionMiddleware = await resolveModules(buildDependencies)
  if (definitionMiddleware) middleware.push(definitionMiddleware)
  middleware = flattenDeep(middleware)
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
  debug(`getGist gistUrl: ${gistUrl}`)
  location = location || './'
  location = (temp) ? osTmpDir() : join(process.cwd(), location)
  debug(`getGist location: ${location}`)
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
  debug(`buildModule file: ${file}`)
  let result = await buildPackage(file)
  location = location || './'
  location = (temp) ? osTmpDir() : join(process.cwd(), location)
  location = join(location, result.standard.name)
  debug(`buildModule file: ${location}`)
  let cleanPkg = JSON.stringify(result.pkg, null, 2)
  let dirPath = join(location)
  await fs.ensureDirAsync(dirPath)
  let pkgPath = join(location, 'package.json')
  debug(`buildModule pkgPath: ${pkgPath}`)
  await fs.writeFileAsync(pkgPath, cleanPkg)
  let mainFile = join(location, path.basename(file))
  debug(`buildModule mainFile: ${mainFile}`)
  await fs.copyAsync(file, mainFile)
  return {location}
  // if (temp) await fs.removeAsync(location)
  // await execAsync(`cd ${location} && npm install`)
}

export async function getComment (file) {
  debug(`getComment file: ${file}`)
  let contents = await fs.readFileAsync(file, 'utf8')
  let comments = extract(contents)
  let id = 'tent:package'
  let declarations = comments.filter(comment => comment.raw.match(id))
  if (declarations.length > 1) throw new Error('There can only be one tent:package declaration.')
  let declaration = declarations[0]
  let {raw} = declaration
  let nameVersion = raw.match(new RegExp(`${id} (\\S+)`))[1]
  debug(`getComment nameVersion: ${nameVersion}`)
  let code = raw.replace(/\n/g,'').match(/from (.*)/)[1]
  debug(`getComment code ${code}`)
  let buildDependencies = JSON.parse(code)
  return {buildDependencies, nameVersion}
}

export function resolveId (id) {
  id = id.split(/[:@]/g)
  let result = {}
  result.name = id[0] || null
  result.version = id[1] || null
  result.method = id[2] || null
  return result
}

export function installDeps (dependencies, dir) {
  return new Promise ((resolve, reject) => {
    return npm.install({
      dir,
      dependencies,
      loglevel: 'info',
      'cache-min': 999999999
    }, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

export async function resolveModules(pkgs) {
  debug(`resolveModules pkgs ${JSON.stringify(pkgs)}`)
  let tempDir = join(osTmpDir(), 'pit-of-despair')
  let detail = map(pkgs, (value, key) => {
    let info = resolveId(key)
    return {
      ...info,
      originalName: key,
      arguments: value,
      path: join(tempDir, 'node_modules', info.name)
    }
  })
  let dependencies = uniq(map(detail, ({name, version}) => `${name}@${version}`))
  debug(`resolveModules dependencies ${JSON.stringify(dependencies)}`)
  await fs.ensureDirAsync(tempDir)
  await installDeps(dependencies, tempDir)

  let components = map(detail, item => {
    if (item.method) {
      return require(item.path)[item.method].apply(null, [item.arguments])
    } else {
      return require(item.path).apply(null, [item.arguments])
    }
  })
  return components
}
