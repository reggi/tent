'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveModules = exports.getComment = exports.buildModule = exports.getGist = exports.download = exports.buildPackage = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var buildPackage = exports.buildPackage = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(file) {
    var parsedPath, _ref2, buildDependencies, nameVersion, info, standard, middleware, definitionMiddleware, pkg, jsonPkg;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            debug('buildPackage file: ' + file);

            parsedPath = _path2.default.parse(file);
            _context3.next = 4;
            return getComment(file);

          case 4:
            _ref2 = _context3.sent;
            buildDependencies = _ref2.buildDependencies;
            nameVersion = _ref2.nameVersion;


            debug('buildPackage nameVersion: ' + nameVersion);
            debug('buildPackage buildDependencies: ' + (0, _stringify2.default)(buildDependencies));

            info = resolveId(nameVersion);
            standard = (0, _extends3.default)({}, info, {
              file: file,
              parsedPath: parsedPath,
              buildDependencies: buildDependencies,
              nameVersion: nameVersion,
              processDeps: _depFinder.processDeps
            });
            middleware = [tentName(), tentVersion(), tentDeps(), tentMain()];


            standard.package = {};

            _context3.next = 15;
            return resolveModules(buildDependencies);

          case 15:
            definitionMiddleware = _context3.sent;

            if (definitionMiddleware) middleware.push(definitionMiddleware);
            middleware = (0, _lodash.flattenDeep)(middleware);
            _context3.next = 20;
            return _bluebird2.default.reduce(middleware, function (pkg, func) {
              return _bluebird2.default.resolve(func.bind(standard)()).then(function (newPkgProps) {
                var newState = (0, _deepAssign2.default)({}, pkg, newPkgProps);
                standard.package = newState;
                return newState;
              });
            }, {});

          case 20:
            pkg = _context3.sent;
            jsonPkg = (0, _stringify2.default)(pkg, null, 2);
            return _context3.abrupt('return', { pkg: pkg, standard: standard, jsonPkg: jsonPkg });

          case 23:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function buildPackage(_x) {
    return ref.apply(this, arguments);
  };
}();

var download = exports.download = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(dataSet) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
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
    }, _callee4, this);
  }));
  return function download(_x2) {
    return ref.apply(this, arguments);
  };
}();

var getGist = exports.getGist = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(gistUrl, location, temp) {
    var parsedUrl, pieces, username, id, gist, gistAsync, gistData, files, exportfiles, results;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            debug('getGist gistUrl: ' + gistUrl);
            location = location || './';
            location = temp ? (0, _osTmpdir2.default)() : (0, _path.join)(process.cwd(), location);
            debug('getGist location: ' + location);
            parsedUrl = _url2.default.parse(gistUrl);

            if (!(parsedUrl.host !== 'gist.github.com')) {
              _context5.next = 7;
              break;
            }

            throw new Error('host is not github gist');

          case 7:
            pieces = parsedUrl.path.split('/');
            username = pieces[1];
            id = pieces[2];
            gist = new _gisty2.default({ username: username });
            gistAsync = _bluebird2.default.promisify(gist.fetch.bind(gist));
            _context5.next = 14;
            return gistAsync(id);

          case 14:
            gistData = _context5.sent;
            files = (0, _lodash.map)(gistData.files, function (file) {
              return { url: file.raw_url, file: location };
            });
            exportfiles = (0, _lodash.map)(gistData.files, function (file) {
              return { url: file.raw_url, file: (0, _path.join)(location, file.filename) };
            });
            _context5.next = 19;
            return download(files);

          case 19:
            results = _context5.sent;
            return _context5.abrupt('return', { files: exportfiles, download: results });

          case 21:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function getGist(_x3, _x4, _x5) {
    return ref.apply(this, arguments);
  };
}();

var buildModule = exports.buildModule = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(file, location, temp) {
    var result, cleanPkg, dirPath, pkgPath, mainFile;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            debug('buildModule file: ' + file);
            _context6.next = 3;
            return buildPackage(file);

          case 3:
            result = _context6.sent;

            location = location || './';
            location = temp ? (0, _osTmpdir2.default)() : (0, _path.join)(process.cwd(), location);
            location = (0, _path.join)(location, result.standard.name);
            debug('buildModule file: ' + location);
            cleanPkg = (0, _stringify2.default)(result.pkg, null, 2);
            dirPath = (0, _path.join)(location);
            _context6.next = 12;
            return _fsExtra2.default.ensureDirAsync(dirPath);

          case 12:
            pkgPath = (0, _path.join)(location, 'package.json');

            debug('buildModule pkgPath: ' + pkgPath);
            _context6.next = 16;
            return _fsExtra2.default.writeFileAsync(pkgPath, cleanPkg);

          case 16:
            mainFile = (0, _path.join)(location, _path2.default.basename(file));

            debug('buildModule mainFile: ' + mainFile);
            _context6.next = 20;
            return _fsExtra2.default.copyAsync(file, mainFile);

          case 20:
            return _context6.abrupt('return', { location: location });

          case 21:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));
  return function buildModule(_x6, _x7, _x8) {
    return ref.apply(this, arguments);
  };
}();

// if (temp) await fs.removeAsync(location)
// await execAsync(`cd ${location} && npm install`)

var getComment = exports.getComment = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(file) {
    var contents, pattern, comments, id, declarations, raw, nameVersion, code, buildDependencies;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            debug('getComment file: ' + file);
            _context7.next = 3;
            return _fsExtra2.default.readFileAsync(file, 'utf8');

          case 3:
            contents = _context7.sent;
            pattern = /(\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$)/gm;
            comments = contents.match(pattern);

            comments = comments.map(function (comment) {
              return comment.replace(/\/\*|\*\//g, '');
            });
            id = 'tent:package';
            declarations = comments.filter(function (comment) {
              return comment.match(id);
            });

            if (!(declarations.length > 1)) {
              _context7.next = 11;
              break;
            }

            throw new Error('There can only be one tent:package declaration.');

          case 11:
            raw = declarations[0];
            nameVersion = raw.match(new RegExp(id + ' (\\S+)'))[1];

            debug('getComment nameVersion: ' + nameVersion);
            code = raw.replace(/\n/g, '').match(/from (.*)/)[1];

            debug('getComment code ' + code);
            buildDependencies = JSON.parse(code);
            return _context7.abrupt('return', { buildDependencies: buildDependencies, nameVersion: nameVersion });

          case 18:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));
  return function getComment(_x9) {
    return ref.apply(this, arguments);
  };
}();

var resolveModules = exports.resolveModules = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(pkgs) {
    var tempDir, detail, dependencies, components;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            debug('resolveModules pkgs ' + (0, _stringify2.default)(pkgs));
            tempDir = (0, _path.join)((0, _osTmpdir2.default)(), 'pit-of-despair');
            detail = (0, _lodash.map)(pkgs, function (value, key) {
              var info = resolveId(key);
              return (0, _extends3.default)({}, info, {
                originalName: key,
                arguments: value,
                path: (0, _path.join)(tempDir, 'node_modules', info.name)
              });
            });
            dependencies = (0, _lodash.uniq)((0, _lodash.map)(detail, function (_ref3) {
              var name = _ref3.name;
              var version = _ref3.version;
              return name + '@' + version;
            }));

            debug('resolveModules dependencies ' + (0, _stringify2.default)(dependencies));
            _context8.next = 7;
            return _fsExtra2.default.ensureDirAsync(tempDir);

          case 7:
            _context8.next = 9;
            return installDeps(dependencies, tempDir);

          case 9:
            components = (0, _lodash.map)(detail, function (item) {
              if (item.method) {
                return require(item.path)[item.method].apply(null, [item.arguments]);
              } else {
                return require(item.path).apply(null, [item.arguments]);
              }
            });
            return _context8.abrupt('return', components);

          case 11:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));
  return function resolveModules(_x10) {
    return ref.apply(this, arguments);
  };
}();

exports.tentDeps = tentDeps;
exports.tentName = tentName;
exports.tentVersion = tentVersion;
exports.tentBabel = tentBabel;
exports.tentAuthor = tentAuthor;
exports.tentPostinstall = tentPostinstall;
exports.tentPrepublish = tentPrepublish;
exports.tentMain = tentMain;
exports.tryWrap = tryWrap;
exports.resolveId = resolveId;
exports.installDeps = installDeps;

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

var _extractComments = require('extract-comments');

var _extractComments2 = _interopRequireDefault(_extractComments);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _enpeem = require('enpeem');

var _enpeem2 = _interopRequireDefault(_enpeem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('tent');

_bluebird2.default.promisifyAll(_fsExtra2.default);

function tentDeps() {
  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var dependencies;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _depFinder2.default)(this.file);

          case 2:
            dependencies = _context.sent;
            return _context.abrupt('return', { dependencies: dependencies });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
}

function tentName(name) {
  return function () {
    name = name || this.name;
    if (!name) throw new Error('name is not specified');
    return { name: name };
  };
}

function tentVersion(version) {
  return function () {
    version = version || this.version;
    if (!version) throw new Error('version is not specified');
    return { version: version };
  };
}

function tentBabel(_ref) {
  var _ref$presets = _ref.presets;
  var presets = _ref$presets === undefined ? [] : _ref$presets;
  var _ref$plugins = _ref.plugins;
  var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
  var _ref$buildScript = _ref.buildScript;
  var buildScript = _ref$buildScript === undefined ? 'build' : _ref$buildScript;

  return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var _scripts;

    var presetsDeps, pluginsDeps, devDependencies, incomingFile, outgoingFile;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            presetsDeps = presets ? (0, _lodash.map)(presets, function (preset) {
              return 'babel-preset-' + preset;
            }) : [];
            pluginsDeps = plugins ? (0, _lodash.map)(plugins, function (plugin) {
              return 'babel-plugin-' + plugin;
            }) : [];
            devDependencies = ['babel-cli'].concat((0, _toConsumableArray3.default)(pluginsDeps), (0, _toConsumableArray3.default)(presetsDeps), ['mkdirp']);
            _context2.next = 5;
            return this.processDeps(devDependencies);

          case 5:
            devDependencies = _context2.sent;
            incomingFile = (0, _path.join)('src', this.parsedPath.base);
            outgoingFile = (0, _path.join)('lib', this.parsedPath.base);
            return _context2.abrupt('return', {
              'main': outgoingFile,
              'jsnext:main': incomingFile,
              "scripts": (_scripts = {}, (0, _defineProperty3.default)(_scripts, buildScript, 'mkdirp lib && mkdirp src && mv ' + this.parsedPath.base + ' ' + incomingFile + ' && babel ' + incomingFile + ' --out-file ' + outgoingFile), (0, _defineProperty3.default)(_scripts, 'tentpostnpminstall', 'npm run build'), _scripts),
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
    }, _callee2, this);
  }));
}

function tentAuthor(author) {
  return function () {
    return { author: author };
  };
}

function tentPostinstall(postinstall) {
  return function () {
    return {
      scripts: {
        postinstall: postinstall
      }
    };
  };
}

function tentPrepublish(prepublish) {
  return function () {
    return {
      scripts: {
        prepublish: prepublish
      }
    };
  };
}

// export function tentPostnpminstall (tentpostnpminstall) {
//   return function () {
//     return {
//       scripts: {
//         tentpostnpminstall
//       }
//     }
//   }
// }

function tentMain() {
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

function resolveId(id) {
  id = id.split(/[:@]/g);
  var result = {};
  result.name = id[0] || null;
  result.version = id[1] || null;
  result.method = id[2] || null;
  return result;
}

function installDeps(dependencies, dir) {
  return new _bluebird2.default(function (resolve, reject) {
    return _enpeem2.default.install({
      dir: dir,
      dependencies: dependencies,
      loglevel: 'info',
      'cache-min': 999999999
    }, function (err) {
      if (err) return reject(err);
      return resolve();
    });
  });
}