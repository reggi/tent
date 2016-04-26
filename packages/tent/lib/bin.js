#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.usage('$0 <cmd> [args]').command('publish', 'Builds module then publishes to npm.', {}, function (argv) {
  return new _index2.default().runBuildModule(argv._[1], 'installpublish');
}).command('build', 'Build module for file.', {}, function (argv) {
  return new _index2.default().runBuildModule(argv._[1], 'install');
}).command('build-gist', 'Build module for gist.', {}, function (argv) {
  return new _index2.default().runBuildGist(argv._[1], 'install');
}).help('help').argv;