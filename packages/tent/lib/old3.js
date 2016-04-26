'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processDeps = exports.getNpmVersions = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getDeps = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(file) {
    var content, ast, deps;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _fs2.default.readFileAsync(file, 'utf8');

          case 2:
            content = _context.sent;

            console.log(content);
            ast = (0, _acorn.parse)(content, acornParseOptions);
            deps = (0, _acornUmd2.default)(ast, acornUmdOptions);
            return _context.abrupt('return', deps.map(function (dep) {
              return dep.source.value;
            }));

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getDeps(_x) {
    return ref.apply(this, arguments);
  };
}();

var getNpmVersion = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(dep) {
    var _ref, name, version;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return npmLatestAsync(dep);

          case 3:
            _ref = _context2.sent;
            name = _ref.name;
            version = _ref.version;
            return _context2.abrupt('return', { name: name, version: version });

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', { name: dep, version: null });

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 9]]);
  }));
  return function getNpmVersion(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getNpmVersions = exports.getNpmVersions = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(deps) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _bluebird2.default.map(deps, getNpmVersion);

          case 2:
            return _context3.abrupt('return', _context3.sent);

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getNpmVersions(_x3) {
    return ref.apply(this, arguments);
  };
}();

var processDeps = exports.processDeps = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(deps) {
    var getVersion, gotVersion, versionedDeps;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            deps = deps.map(function (dep) {
              if (dep.match('@')) {
                var parts = dep.split('@');
                var name = parts[0];
                var version = parts[1];
                return { name: name, version: version };
              }
              return dep;
            });
            getVersion = deps.filter(function (dep) {
              return typeof dep === 'string';
            });
            gotVersion = deps.filter(function (dep) {
              return typeof dep !== 'string';
            });
            _context4.next = 5;
            return getNpmVersions(getVersion);

          case 5:
            versionedDeps = _context4.sent;

            deps = [].concat((0, _toConsumableArray3.default)(versionedDeps), (0, _toConsumableArray3.default)(gotVersion));
            deps = deps.filter(function (dep) {
              return !dep.name.match(/^.\.\/|^.\/|^\//);
            });
            return _context4.abrupt('return', mapToDeps(deps));

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function processDeps(_x4) {
    return ref.apply(this, arguments);
  };
}();

var _acorn = require('acorn');

var _acornUmd = require('acorn-umd');

var _acornUmd2 = _interopRequireDefault(_acornUmd);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _npmLatest = require('npm-latest');

var _npmLatest2 = _interopRequireDefault(_npmLatest);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);
var npmLatestAsync = _bluebird2.default.promisify(_npmLatest2.default);

var acornParseOptions = { sourceType: 'module', ecmaVersion: 7, allowHashBang: true };
var acornUmdOptions = { es6: true, amd: true, cjs: true };

function mapToDeps(deps) {
  deps = deps.map(function (dep) {
    return (0, _defineProperty3.default)({}, dep.name, dep.version);
  });
  return _lodash.extend.apply(null, deps);
}

exports.default = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(file) {
    var deps;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getDeps(file);

          case 2:
            deps = _context5.sent;

            if (deps) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt('return', {});

          case 5:
            _context5.next = 7;
            return processDeps(deps);

          case 7:
            return _context5.abrupt('return', _context5.sent);

          case 8:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  function main(_x5) {
    return ref.apply(this, arguments);
  }

  return main;
}();