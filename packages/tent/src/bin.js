#!/usr/bin/env node
import yargs from 'yargs'
import Tent from './index'

yargs
  .usage('$0 <cmd> [args]')
  .command('publish', 'Publish to npm', {}, function (argv) {
    return new Tent().runBuildModule('installpublish')
  })
  .help('help')
  .argv
