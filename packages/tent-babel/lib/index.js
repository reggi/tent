'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = tentBabel;

var _lodash = require('lodash');

var _path = require('path');

var _tentBabelDeps = require('tent-babel-deps');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fsExtra2.default);

function getDeps(m) {
  return _regenerator2.default.async(function getDeps$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          m = (0, _tentBabelDeps.parseModuleSyntax)(m);
          _context.next = 3;
          return _regenerator2.default.awrap((0, _tentBabelDeps.getModuleVersions)(m));

        case 3:
          m = _context.sent;

          m = (0, _tentBabelDeps.mapModulesToDeps)(m);
          return _context.abrupt('return', m);

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function tentBabel() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$presets = _ref.presets;
  var presets = _ref$presets === undefined ? [] : _ref$presets;
  var _ref$plugins = _ref.plugins;
  var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
  var _ref$buildScript = _ref.buildScript;
  var buildScript = _ref$buildScript === undefined ? 'build' : _ref$buildScript;

  return function _callee(tent) {
    var _scripts;

    var presetsDeps, pluginsDeps, devDependencies, incomingFile, outgoingFile, script;
    return _regenerator2.default.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _regenerator2.default.awrap(_fsExtra2.default.ensureDirAsync(tent.buildPath));

          case 2:
            _context2.next = 4;
            return _regenerator2.default.awrap(_bluebird2.default.all([_fsExtra2.default.ensureDirAsync((0, _path.join)(tent.buildPath, 'src')), _fsExtra2.default.ensureDirAsync((0, _path.join)(tent.buildPath, 'lib'))]));

          case 4:
            _context2.next = 6;
            return _regenerator2.default.awrap(_fsExtra2.default.writeFileAsync((0, _path.join)(tent.buildPath, '/src/index.js'), tent.fileContent));

          case 6:
            presetsDeps = presets ? (0, _lodash.map)(presets, function (preset) {
              return 'babel-preset-' + preset;
            }) : [];
            pluginsDeps = plugins ? (0, _lodash.map)(plugins, function (plugin) {
              return 'babel-plugin-' + plugin;
            }) : [];
            devDependencies = ['babel-cli'].concat((0, _toConsumableArray3.default)(pluginsDeps), (0, _toConsumableArray3.default)(presetsDeps));
            _context2.next = 11;
            return _regenerator2.default.awrap(getDeps(devDependencies));

          case 11:
            devDependencies = _context2.sent;
            incomingFile = (0, _path.join)('src', (0, _path.parse)(tent.filePath).base);
            outgoingFile = (0, _path.join)('lib', (0, _path.parse)(tent.filePath).base);
            script = [];

            if ((0, _lodash.get)(tent, 'pkg.script.tentpostinstall')) script.push(tent.pkg.script.tentpostinstall);
            script.push('npm run ' + buildScript);

            return _context2.abrupt('return', {
              'main': outgoingFile,
              'jsnext:main': incomingFile,
              "scripts": (_scripts = {}, (0, _defineProperty3.default)(_scripts, buildScript, 'babel ./src/index.js --out-file ./lib/index.js'), (0, _defineProperty3.default)(_scripts, 'tentpostinstall', script.join(' && ')), _scripts),
              devDependencies: devDependencies,
              babel: {
                presets: presets,
                plugins: plugins
              }
            });

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this);
  };
}