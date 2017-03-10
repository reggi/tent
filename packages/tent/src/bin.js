#!/usr/bin/env node
import yargs from 'yargs'
import Tent from './index'

yargs
  .usage('$0 <cmd> [args]')
  .command('publish', 'Builds module then publishes to npm.', {}, function (argv) {
    return new Tent().runBuildModule(argv._[1], {install: true, publish: true})
      .then(() => console.log('done'))
      .catch(err => {
        console.error(err.message)
        console.error(err.stack)
      })
  })
  .command('build', 'Build module for file.', {}, function (argv) {
    let temp = (argv.temp || argv.tmp) ? argv.temp || argv.tmp : false
    return new Tent({temp}).runBuildModule(argv._[1], {install: true})
      .then(() => console.log('done'))
      .catch(err => {
        console.error(err.message)
        console.error(err.stack)
      })
  })
  .command('build-gist', 'Build module for gist.', {}, function (argv) {
    let temp = (argv.temp || argv.tmp) ? argv.temp || argv.tmp : false
    return new Tent({temp}).runBuildGist(argv._[1], {install: true})
      .then(() => console.log('done'))
      .catch(err => {
        console.error(err.message)
        console.error(err.stack)
      })
  })
  .help('help')
  .argv
