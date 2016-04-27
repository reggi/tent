'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = function () {
  var _this = this;

  return function _callee(tent) {
    var code, modules, ogModules, devDependencies, dependencies, localDependencies, script, result;
    return _regenerator2.default.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            code = tent.fileContent;
            modules = (0, _babylonModuleDefinitons2.default)({ code: code });
            ogModules = parseModuleSyntax(modules);
            _context2.next = 5;
            return _regenerator2.default.awrap(getModuleVersions(ogModules));

          case 5:
            modules = _context2.sent;

            modules = modules.filter(function (mod) {
              return !mod.name.match(/^.\.\/|^.\/|^\//);
            });
            devDependencies = [{ 'name': 'tent-module-assign', 'version': '1.0.0' }];
            _context2.next = 10;
            return _regenerator2.default.awrap(getModuleVersions(devDependencies));

          case 10:
            devDependencies = _context2.sent;

            devDependencies = mapModulesToDeps(devDependencies);
            dependencies = mapModulesToDeps(modules);
            localDependencies = mapModulesToLocalDeps(ogModules);
            script = [];

            if ((0, _lodash.get)(tent, 'pkg.script.tentpostinstall')) script.push(tent.pkg.script.tentpostinstall);
            script.push('tent-module-assign install');
            script.tentpostinstall = script.join(' && ');

            result = {};

            result.dependencies = dependencies;
            if ((0, _lodash.size)(localDependencies)) {
              result.localDependencies = localDependencies;
              result.scripts = scripts;
              result.devDependencies = devDependencies;
            }
            return _context2.abrupt('return', result);

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, _this);
  };
};

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _babylonModuleDefinitons = require('babylon-module-definitons');

var _babylonModuleDefinitons2 = _interopRequireDefault(_babylonModuleDefinitons);

var _npmLatest = require('npm-latest');

var _npmLatest2 = _interopRequireDefault(_npmLatest);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var npmLatestAsync = _bluebird2.default.promisify(_npmLatest2.default);

function getNpmVersion(dep) {
  var _ref, name, version;

  return _regenerator2.default.async(function getNpmVersion$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _regenerator2.default.awrap(npmLatestAsync(dep));

        case 3:
          _ref = _context.sent;
          name = _ref.name;
          version = _ref.version;
          return _context.abrupt('return', { name: name, version: version });

        case 9:
          _context.prev = 9;
          _context.t0 = _context['catch'](0);
          return _context.abrupt('return', { name: dep, version: null });

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[0, 9]]);
}

function mapModulesToDeps(modules) {
  var deps = modules.map(function (module) {
    return (0, _defineProperty3.default)({}, module.name, module.version);
  });
  return _lodash.extend.apply(null, deps);
}

function parseModuleSyntax(modules) {
  return modules.map(function (mod) {
    if (mod.match('@')) {
      var parts = mod.split('@');
      var name = parts[0];
      var version = parts[1];
      return { name: name, version: version };
    } else {
      return { name: mod, false: false };
    }
  });
}

function getModuleVersions(modules) {
  return _bluebird2.default.map(modules, function (mod) {
    if (!mod.version) {
      return getNpmVersion(mod.name).then(function (mod) {
        return mod;
      });
    } else {
      return mod;
    }
  });
}

function mapModulesToLocalDeps(modules) {
  var deps = modules.filter(function (mod) {
    return mod.version;
  }).map(function (mod) {
    return (0, _defineProperty3.default)({}, mod.name + '@' + mod.version, mod.name);
  });
  return _lodash.extend.apply(null, deps);
}