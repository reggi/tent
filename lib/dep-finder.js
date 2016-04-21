'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNpmVersions = getNpmVersions;
exports.processDeps = processDeps;

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_bluebird2.default.promisifyAll(_fs2.default);
var npmLatestAsync = _bluebird2.default.promisify(_npmLatest2.default);

var acornParseOptions = { sourceType: 'module', ecmaVersion: 6, allowHashBang: true };
var acornUmdOptions = { es6: true, amd: true, cjs: true };

function getDeps(file) {
  var content, ast, deps;
  return regeneratorRuntime.async(function getDeps$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_fs2.default.readFileAsync(file, 'utf8'));

        case 2:
          content = _context.sent;
          ast = (0, _acorn.parse)(content, acornParseOptions);
          deps = (0, _acornUmd2.default)(ast, acornUmdOptions);
          return _context.abrupt('return', deps.map(function (dep) {
            return dep.source.value;
          }));

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function getNpmVersion(dep) {
  var _ref, name, version;

  return regeneratorRuntime.async(function getNpmVersion$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(npmLatestAsync(dep));

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
  }, null, this, [[0, 9]]);
}

function mapToDeps(deps) {
  deps = deps.map(function (dep) {
    return _defineProperty({}, dep.name, dep.version);
  });
  return _lodash.extend.apply(null, deps);
}

function getNpmVersions(deps) {
  return regeneratorRuntime.async(function getNpmVersions$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_bluebird2.default.map(deps, getNpmVersion));

        case 2:
          return _context3.abrupt('return', _context3.sent);

        case 3:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

function processDeps(deps) {
  var getVersion, gotVersion, versionedDeps;
  return regeneratorRuntime.async(function processDeps$(_context4) {
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
          return regeneratorRuntime.awrap(getNpmVersions(getVersion));

        case 5:
          versionedDeps = _context4.sent;

          deps = [].concat(_toConsumableArray(versionedDeps), _toConsumableArray(gotVersion));
          deps = deps.filter(function (dep) {
            return !dep.name.match(/^.\.\/|^.\/|^\//);
          });
          return _context4.abrupt('return', mapToDeps(deps));

        case 9:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

exports.default = function main(file) {
  var deps;
  return regeneratorRuntime.async(function main$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(getDeps(file));

        case 2:
          deps = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(processDeps(deps));

        case 5:
          return _context5.abrupt('return', _context5.sent);

        case 6:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
};