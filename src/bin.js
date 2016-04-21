#!/usr/bin/env node
import { join } from 'path'
import yargs from 'yargs'
import { buildPackage, buildModule, getGist } from './index'
import fs from 'fs-extra'
import Promise from 'bluebird'
import { exec } from 'child_process'

const execAsync = Promise.promisifyAll(exec)

yargs
  .usage('$0 <cmd> [args]')
  .command('build-package', 'Builds the package.json file', {}, function (argv) {
    let file = argv._[1]
    return buildPackage(file)
    .then(({jsonPkg}) => console.log(jsonPkg))
    .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('build-module', 'Builds the entire module', {}, function (argv) {
    let file = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return buildModule(file, location, temp)
    .then(({location}) => execAsync(`cd ${location} && npm install`))
    .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('publish', 'Publish to npm', {}, function (argv) {
    let file = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return buildModule(file, location, temp)
    .then(({location}) => execAsync(`cd ${location} && npm install && npm publish`))
    .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('publish-gist', 'Publishes npm module from gist', {}, function (argv) {
    let url = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return getGist(url, location, temp)
      .then(({files}) => {
        return Promise.map(files, file => {
          return buildModule(file, location, temp)
            .then(({location}) => execAsync(`cd ${location} && npm install && npm publish`))
        })
      })
      .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('build-gist', 'Builds code from gist', {}, function (argv) {
    let url = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return getGist(url, location, temp)
      .then(({files}) => {
        return Promise.map(files, ({file}) => {
          return buildModule(file, location, temp)
            .then(({location}) => execAsync(`cd ${location} && npm install`))
        })
      })
      .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .help('help')
  .argv
