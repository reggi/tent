#!/usr/bin/env node
'use strict';

var _path = require('path');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require('./index');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'babel-polyfill'


var execAsync = _bluebird2.default.promisifyAll(_child_process.exec);

var tentprenpminstall = 'npm run tentprenpminstall &> /dev/null || :';
var tentpostnpminstall = 'npm run tentpostnpminstall &> /dev/null || :';
var tentprepublish = 'npm run tentprepublish &> /dev/null || :';
var tentpostpublish = 'npm run tentpostpublish &> /dev/null || :';

var npminstall = 'npm install';
var npmpublish = 'npm publish';
var install = [tentprenpminstall, npminstall, tentpostnpminstall].join(' && ');
var publish = [tentprepublish, npminstall, tentpostpublish].join(' && ');
var installpublish = [install, publish].join(' && ');

_yargs2.default.usage('$0 <cmd> [args]').command('build-package', 'Builds the package.json file', {}, function (argv) {
  var file = argv._[1];
  return (0, _index.buildPackage)(file).then(function (_ref) {
    var jsonPkg = _ref.jsonPkg;
    return console.log(jsonPkg);
  }).catch(function (err) {
    return console.error(err.message + '\n' + err.stack);
  });
}).command('build-module', 'Builds the entire module', {}, function (argv) {
  var file = argv._[1];
  var location = argv.location;
  var temp = argv.temp;
  return (0, _index.buildModule)(file, location, temp).then(function (_ref2) {
    var location = _ref2.location;
    return execAsync('cd ' + location + ' && npm install');
  }).catch(function (err) {
    return console.error(err.message + '\n' + err.stack);
  });
}).command('publish', 'Publish to npm', {}, function (argv) {
  var file = argv._[1];
  var location = argv.location;
  var temp = argv.temp;
  return (0, _index.buildModule)(file, location, temp).then(function (_ref3) {
    var location = _ref3.location;
    return execAsync('cd ' + location + ' && ' + installpublish);
  }).catch(function (err) {
    return console.error(err.message + '\n' + err.stack);
  });
}).command('publish-gist', 'Publishes npm module from gist', {}, function (argv) {
  var url = argv._[1];
  var location = argv.location;
  var temp = argv.temp;
  return (0, _index.getGist)(url, location, temp).then(function (_ref4) {
    var files = _ref4.files;

    return _bluebird2.default.map(files, function (_ref5) {
      var file = _ref5.file;

      return (0, _index.buildModule)(file, location, temp).then(function (_ref6) {
        var location = _ref6.location;
        return execAsync('cd ' + location + ' && ' + installpublish);
      });
    });
  }).catch(function (err) {
    return console.error(err.message + '\n' + err.stack);
  });
}).command('build-gist', 'Builds code from gist', {}, function (argv) {
  var url = argv._[1];
  var location = argv.location;
  var temp = argv.temp;
  return (0, _index.getGist)(url, location, temp).then(function (_ref7) {
    var files = _ref7.files;

    return _bluebird2.default.map(files, function (_ref8) {
      var file = _ref8.file;

      return (0, _index.buildModule)(file, location, temp).then(function (_ref9) {
        var location = _ref9.location;
        return execAsync('cd ' + location + ' && ' + install);
      });
    });
  }).catch(function (err) {
    return console.error(err.message + '\n' + err.stack);
  });
}).help('help').argv;