#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.usage('$0 <cmd> [args]').command('publish', 'Builds module then publishes to npm.', {}, function (argv) {
  return new _index2.default().runBuildModule(argv._[1], 'installpublish').then(function () {
    return console.log('done');
  }).catch(function (err) {
    console.error(err.message);
    console.error(err.stack);
  });
}).command('build', 'Build module for file.', {}, function (argv) {
  var temp = argv.temp || argv.tmp ? argv.temp || argv.tmp : false;
  return new _index2.default({ temp: temp }).runBuildModule(argv._[1], 'install').then(function () {
    return console.log('done');
  }).catch(function (err) {
    console.error(err.message);
    console.error(err.stack);
  });
}).command('build-gist', 'Build module for gist.', {}, function (argv) {
  var temp = argv.temp || argv.tmp ? argv.temp || argv.tmp : false;
  return new _index2.default({ temp: temp }).runBuildGist(argv._[1], 'install').then(function () {
    return console.log('done');
  }).catch(function (err) {
    console.error(err.message);
    console.error(err.stack);
  });
}).help('help').argv;