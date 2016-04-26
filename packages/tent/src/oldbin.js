#!/usr/bin/env node
import 'babel-polyfill'
import { join } from 'path'
import yargs from 'yargs'
import { buildPackage, buildModule, getGist } from './index'
import fs from 'fs-extra'
import Promise from 'bluebird'
import { exec } from 'child_process'

const execAsync = Promise.promisifyAll(exec)

const tentprenpminstall = `npm run tentprenpminstall &> /dev/null || :`
const tentpostnpminstall = `npm run tentpostnpminstall &> /dev/null || :`
const tentprepublish = `npm run tentprepublish &> /dev/null || :`
const tentpostpublish = `npm run tentpostpublish &> /dev/null || :`

const npminstall = `npm install`
const npmpublish = `npm publish`
const install = [tentprenpminstall, npminstall, tentpostnpminstall].join(' && ')
const publish = [tentprepublish, npmpublish, tentpostpublish].join(' && ')
const installpublish = [install, publish].join(' && ')

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
    .then(({location}) => execAsync(`cd ${location} && ${npminstall}`))
    .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('publish', 'Publish to npm', {}, function (argv) {
    let file = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return buildModule(file, location, temp)
    .then(({location}) => execAsync(`cd ${location} && ${installpublish}`))
    .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .command('publish-gist', 'Publishes npm module from gist', {}, function (argv) {
    let url = argv._[1]
    let location = argv.location
    let temp = argv.temp
    return getGist(url, location, temp)
      .then(({files}) => {
        return Promise.map(files, ({file}) => {
          return buildModule(file, location, temp)
            .then(({location}) => execAsync(`cd ${location} && ${installpublish}`))
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
            .then(({location}) => execAsync(`cd ${location} && ${install}`))
        })
      })
      .catch(err => console.error(err.message + '\n' + err.stack))
  })
  .help('help')
  .argv
