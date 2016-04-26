#!/usr/bin/env node
'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.usage('$0 <cmd> [args]').command('publish', 'Publish to npm', {}, function (argv) {
  return new _index2.default().runBuildModule('installpublish');
}).help('help').argv;