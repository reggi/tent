'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.niftDeps = niftDeps;
exports.niftName = niftName;
exports.niftVersion = niftVersion;
exports.niftBabel = niftBabel;
exports.niftAuthor = niftAuthor;
exports.niftPostinstall = niftPostinstall;
exports.niftPrepublish = niftPrepublish;
exports.niftMain = niftMain;
exports.tryWrap = tryWrap;
exports.buildPackage = buildPackage;
exports.download = download;
exports.getGist = getGist;
exports.buildModule = buildModule;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _depFinder = require('./dep-finder');

var _depFinder2 = _interopRequireDefault(_depFinder);

var _lodash = require('lodash');

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _gisty = require('gisty');

var _gisty2 = _interopRequireDefault(_gisty);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _download = require('download');

var _download2 = _interopRequireDefault(_download);

var _osTmpdir = require('os-tmpdir');

var _osTmpdir2 = _interopRequireDefault(_osTmpdir);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_bluebird2.default.promisifyAll(_fsExtra2.default);

function niftDeps() {
  return function _callee() {
    var dependencies;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap((0, _depFinder2.default)(this.file));

          case 2:
            dependencies = _context.sent;
            return _context.abrupt('return', { dependencies: dependencies });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  };
}

function niftName(name) {
  return function () {
    name = name || this.name;
    if (!name) throw new Error('name is not specified');
    return { name: name };
  };
}

function niftVersion(version) {
  return function () {
    version = version || this.version;
    if (!version) throw new Error('version is not specified');
    return { version: version };
  };
}

function niftBabel(_ref) {
  var _ref$presets = _ref.presets;
  var presets = _ref$presets === undefined ? [] : _ref$presets;
  var _ref$plugins = _ref.plugins;
  var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
  var _ref$buildScript = _ref.buildScript;
  var buildScript = _ref$buildScript === undefined ? 'build' : _ref$buildScript;

  return function _callee2() {
    var presetsDeps, pluginsDeps, devDependencies, incomingFile, outgoingFile;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            presetsDeps = presets ? (0, _lodash.map)(presets, function (preset) {
              return 'babel-preset-' + preset;
            }) : [];
            pluginsDeps = plugins ? (0, _lodash.map)(plugins, function (plugin) {
              return 'babel-plugin-' + plugin;
            }) : [];
            devDependencies = ['babel-cli'].concat(_toConsumableArray(pluginsDeps), _toConsumableArray(presetsDeps));
            _context2.next = 5;
            return regeneratorRuntime.awrap(this.processDeps(devDependencies));

          case 5:
            devDependencies = _context2.sent;
            incomingFile = (0, _path.join)('src', this.parsedPath.base);
            outgoingFile = (0, _path.join)('lib', this.parsedPath.base);
            return _context2.abrupt('return', {
              'main': outgoingFile,
              'jsnext:main': incomingFile,
              "scripts": _defineProperty({}, buildScript, 'mkdir lib && mkdir src && mv ' + this.parsedPath.base + ' ' + incomingFile + ' && babel ' + incomingFile + ' --out-file ' + outgoingFile),
              devDependencies: devDependencies,
              babel: {
                presets: presets,
                plugins: plugins
              }
            });

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this);
  };
}

function niftAuthor(author) {
  return function () {
    return { author: author };
  };
}

function niftPostinstall(postinstall) {
  return function () {
    return {
      scripts: {
        postinstall: postinstall
      }
    };
  };
}

function niftPrepublish(prepublish) {
  return function () {
    return {
      scripts: {
        prepublish: prepublish
      }
    };
  };
}

function niftMain() {
  return function () {
    return {
      main: this.parsedPath.base
    };
  };
}

function tryWrap(tryFunc, catchFunc) {
  try {
    return tryFunc();
  } catch (e) {
    return catchFunc;
  }
}

function buildPackage(file) {
  var parsedPath, _require, def, standard, middleware, pkg, jsonPkg;

  return regeneratorRuntime.async(function buildPackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          parsedPath = _path2.default.parse(file);
          _require = require(file);
          def = _require.def;
          standard = {
            file: file,
            parsedPath: parsedPath,
            name: tryWrap(function () {
              return def[0].split('@')[0];
            }, null),
            version: tryWrap(function () {
              return def[0].split('@')[1];
            }, null),
            processDeps: _depFinder.processDeps
          };
          middleware = [niftName(), niftVersion(), niftDeps(), niftMain()];


          standard.package = {};

          if (def && def[1]) middleware.push(def[1]);
          middleware = (0, _lodash.flatten)(middleware);

          _context3.next = 10;
          return regeneratorRuntime.awrap(_bluebird2.default.reduce(middleware, function (pkg, func) {
            return _bluebird2.default.resolve(func.bind(standard)()).then(function (newPkgProps) {
              var newState = (0, _deepAssign2.default)({}, pkg, newPkgProps);
              standard.package = newState;
              return newState;
            });
          }, {}));

        case 10:
          pkg = _context3.sent;
          jsonPkg = JSON.stringify(pkg, null, 2);
          return _context3.abrupt('return', { pkg: pkg, standard: standard, jsonPkg: jsonPkg });

        case 13:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
}

function download(dataSet) {
  return regeneratorRuntime.async(function download$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt('return', new _bluebird2.default(function (resolve, reject) {
            var d = new _download2.default({ mode: '755' });
            (0, _lodash.each)(dataSet, function (data) {
              d.get(data.url, data.file);
            });
            d.run(function (err, val) {
              if (err) return reject(err);
              return resolve(val);
            });
          }));

        case 1:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
}

function getGist(gistUrl, location, temp) {
  var parsedUrl, pieces, username, id, gist, gistAsync, gistData, files, exportfiles, results;
  return regeneratorRuntime.async(function getGist$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          location = location || './';
          location = temp ? (0, _osTmpdir2.default)() : (0, _path.join)(process.cwd(), location);
          parsedUrl = _url2.default.parse(gistUrl);

          if (!(parsedUrl.host !== 'gist.github.com')) {
            _context5.next = 5;
            break;
          }

          throw new Error('host is not github gist');

        case 5:
          pieces = parsedUrl.path.split('/');
          username = pieces[1];
          id = pieces[2];
          gist = new _gisty2.default({ username: username });
          gistAsync = _bluebird2.default.promisify(gist.fetch.bind(gist));
          _context5.next = 12;
          return regeneratorRuntime.awrap(gistAsync(id));

        case 12:
          gistData = _context5.sent;
          files = (0, _lodash.map)(gistData.files, function (file) {
            return { url: file.raw_url, file: location };
          });
          exportfiles = (0, _lodash.map)(gistData.files, function (file) {
            return { url: file.raw_url, file: (0, _path.join)(location, file.filename) };
          });
          _context5.next = 17;
          return regeneratorRuntime.awrap(download(files));

        case 17:
          results = _context5.sent;
          return _context5.abrupt('return', { files: exportfiles, download: results });

        case 19:
        case 'end':
          return _context5.stop();
      }
    }
  }, null, this);
}

function buildModule(file, location, temp) {
  var result, cleanPkg, dirPath, pkgPath, mainFile;
  return regeneratorRuntime.async(function buildModule$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(buildPackage(file));

        case 2:
          result = _context6.sent;

          location = location || './';
          location = temp ? (0, _osTmpdir2.default)() : (0, _path.join)(process.cwd(), location);
          location = (0, _path.join)(location, result.standard.name);
          cleanPkg = JSON.stringify(result.pkg, null, 2);
          dirPath = (0, _path.join)(location);
          _context6.next = 10;
          return regeneratorRuntime.awrap(_fsExtra2.default.ensureDirAsync(dirPath));

        case 10:
          pkgPath = (0, _path.join)(location, 'package.json');
          _context6.next = 13;
          return regeneratorRuntime.awrap(_fsExtra2.default.writeFileAsync(pkgPath, cleanPkg));

        case 13:
          mainFile = (0, _path.join)(location, _path2.default.basename(file));
          _context6.next = 16;
          return regeneratorRuntime.awrap(_fsExtra2.default.copyAsync(file, mainFile));

        case 16:
          return _context6.abrupt('return', { location: location });

        case 17:
        case 'end':
          return _context6.stop();
      }
    }
  }, null, this);
}