#!/usr/bin/env node
import yargs from 'yargs'
import ModuleAssign from './index'

yargs
  .usage('$0 <cmd> [args]')
  .command('install', 'Connects all aliases in the cwd package.josn `localDependencies`', {}, function (argv) {
    return new ModuleAssign().install()
      .then(() => console.log('done'))
      .catch(console.error.bind(console))
  })
  .help('help')
  .argv
