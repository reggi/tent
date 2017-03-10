'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fsExtra2.default);

var ModuleAssign = function () {
  function ModuleAssign() {
    (0, _classCallCheck3.default)(this, ModuleAssign);

    this.cwd = process.cwd();
    this.mainPackagePath = (0, _path.join)(this.cwd, './package.json');
    this.mainModulePath = (0, _path.join)(this.cwd, 'node_modules');
    this.localRegex = /^.\.\/|^.\/|^\//;
  }

  (0, _createClass3.default)(ModuleAssign, [{
    key: 'aliasModule',
    value: function aliasModule(_ref) {
      var name = _ref.name;
      var path = _ref.path;
      var aliasPath, aliasPackagePath, main;
      return _regenerator2.default.async(function aliasModule$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              aliasPath = (0, _path.join)(this.mainModulePath, name);
              aliasPackagePath = (0, _path.join)(this.mainModulePath, name, './package.json');
              _context.next = 4;
              return _regenerator2.default.awrap(_fsExtra2.default.ensureDirAsync(aliasPath));

            case 4:
              main = path.match(this.localRegex) ? (0, _path.join)('../../', path) : (0, _path.join)('../', path);
              _context.next = 7;
              return _regenerator2.default.awrap(_fsExtra2.default.writeFileAsync(aliasPackagePath, (0, _stringify2.default)({ name: name, main: main, assignedModule: true }, null, 2)));

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'aliasModules',
    value: function aliasModules(modules) {
      var _this = this;

      return _regenerator2.default.async(function aliasModules$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              modules = this.cleanDeps(modules);
              return _context2.abrupt('return', _bluebird2.default.map(modules, function (mod) {
                return _this.aliasModule(mod);
              }));

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'cleanDeps',
    value: function cleanDeps(modules) {
      return (0, _lodash.chain)(modules).mapValues(function (path, name) {
        return { path: path, name: name };
      }).values().value();
    }
  }, {
    key: 'install',
    value: function install() {
      return _regenerator2.default.async(function install$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _regenerator2.default.awrap(_fsExtra2.default.readJsonAsync(this.mainPackagePath));

            case 3:
              this.pkg = _context3.sent;
              _context3.next = 9;
              break;

            case 6:
              _context3.prev = 6;
              _context3.t0 = _context3['catch'](0);
              throw new Error('missing package.json');

            case 9:
              if (this.pkg.localDependencies) {
                _context3.next = 11;
                break;
              }

              throw new Error('missing localDependencies');

            case 11:
              this.localDependencies = this.pkg.localDependencies;
              _context3.next = 14;
              return _regenerator2.default.awrap(this.aliasModules(this.localDependencies));

            case 14:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[0, 6]]);
    }
  }]);
  return ModuleAssign;
}();

exports.default = ModuleAssign;