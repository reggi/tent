#!/usr/bin/env node
import yargs from 'yargs'
import Tent from './index'

yargs
  .usage('$0 <cmd> [args]')
  .command('publish', 'Builds module then publishes to npm.', {}, function (argv) {
    return new Tent().runBuildModule(argv._[1], 'installpublish')
  })
  .command('build', 'Build module for file.', {}, function (argv) {
    let temp = (argv.temp || argv.tmp) ? argv.temp || argv.tmp : true
    return new Tent({temp}).runBuildModule(argv._[1], 'install')
  })
  .command('build-gist', 'Build module for gist.', {}, function (argv) {
    let temp = (argv.temp || argv.tmp) ? argv.temp || argv.tmp : true
    return new Tent({temp}).runBuildGist(argv._[1], 'install')
  })
  .help('help')
  .argv
